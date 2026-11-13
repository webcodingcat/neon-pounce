// A session: one game after another with their picture. It connects the rule
// core with the clock, the fingers and the views, and holds no rules itself.

import type { Application } from 'pixi.js';
import { GAME_OVER_FADE_MS } from '../config';
import { advanceTime, applyInput, createGame, timerFraction } from '../core/game';
import { createRng, type Rng } from '../core/rng';
import type { GameEvent, GameInput, GameState, StepResult } from '../core/types';
import type { ExportButton } from '../dev/exportProtocol';
import { finishProtocol, recordStep, startProtocol, type ProtocolRecorder } from '../dev/protocol';
import {
  createPointerTracker,
  pointerDown,
  pointerMove,
  pointerUp,
  type PointerSample,
} from '../input/pointers';
import { BoardView } from '../view/boardView';
import { againButton, rectContains } from '../view/gameOverLayout';
import { GameOverView } from '../view/gameOverView';
import { boardGeometry, type BoardGeometry, type Point } from '../view/geometry';
import { Hud } from '../view/hud';
import { fieldCenter, fieldLayout, type FieldLayout } from '../view/layout';
import { readSafeArea } from '../view/safeArea';
import { createBoardTextures, destroyBoardTextures, type BoardTextures } from '../view/textures';
import { buttonsActive } from './gameOver';

export type Screen = 'game' | 'gameOver';

export interface SessionOptions {
  /** Fixed seed of the test mode (A110), or null for a new seed per game. */
  readonly seed: number | null;
  /** "Export" button of the dev server, or null. Without it no protocol is recorded. */
  readonly exportButton: ExportButton | null;
}

interface Scene {
  readonly field: FieldLayout;
  readonly geometry: BoardGeometry;
  readonly textures: BoardTextures;
  readonly board: BoardView;
  readonly hud: Hud;
  readonly gameOver: GameOverView;
}

/** One game with its generator. */
interface Round {
  readonly rng: Rng;
  state: GameState;
  /** Protocol of the game (A109), or null outside the dev server. */
  recorder: ProtocolRecorder | null;
}

function buildScene(app: Application): Scene {
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const field = fieldLayout(viewport, readSafeArea());
  const geometry = boardGeometry(fieldCenter(field), field.width);
  const textures = createBoardTextures(geometry, field.width, app.renderer.resolution);
  const board = new BoardView(geometry, textures);
  const hud = new Hud(field);
  const gameOver = new GameOverView(field);
  app.stage.addChild(board.container, hud.container, gameOver.container);
  return { field, geometry, textures, board, hud, gameOver };
}

function destroyScene(scene: Scene): void {
  scene.board.destroy();
  scene.hud.destroy();
  scene.gameOver.destroy();
  destroyBoardTextures(scene.textures);
}

/** A seed that differs from game to game. The core never draws its own. */
function randomSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
}

/** How visible the board is: it fades out after the last life (A23). */
function boardAlpha(state: GameState, nowMs: number): number {
  if (state.phase === 'playing' || state.lostAtMs === null) {
    return 1;
  }
  return Math.max(0, 1 - (nowMs - state.lostAtMs) / GAME_OVER_FADE_MS);
}

/** Unit vector from one point towards another. Points up when they coincide. */
function direction(from: Point, to: Point): Point {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  return length === 0
    ? { x: 0, y: -1 }
    : { x: (to.x - from.x) / length, y: (to.y - from.y) / length };
}

export class Session {
  private readonly app: Application;
  private readonly options: SessionOptions;
  /** What the test mode added to the clock (A110). */
  private offsetMs = 0;
  private round: Round;
  private tracker = createPointerTracker();
  /** Where each finger landed, for the direction of a swipe. */
  private readonly landed = new Map<number, Point>();
  private scene: Scene;
  private currentScreen: Screen = 'game';
  /** Time at which Game Over appeared. */
  private shownAtMs = 0;

  constructor(app: Application, options: SessionOptions) {
    this.app = app;
    this.options = options;
    this.round = this.startRound(this.now());
    this.scene = buildScene(app);
    this.show();
  }

  get screen(): Screen {
    return this.currentScreen;
  }

  get state(): GameState {
    return this.round.state;
  }

  /** Time of the game: the clock of the page plus what the test mode skipped. */
  now(): number {
    return performance.now() + this.offsetMs;
  }

  /** Moves the time of the game forward and lets the game catch up (A110). */
  skip(ms: number): void {
    this.offsetMs += ms;
    this.tick();
  }

  /** Builds the picture again for a new window size. Running effects end. */
  rebuild(): void {
    destroyScene(this.scene);
    this.scene = buildScene(this.app);
    this.show();
  }

  /** One frame: lets the time pass in the game and moves the picture along. */
  tick(): void {
    const nowMs = this.now();
    if (this.currentScreen === 'game') {
      this.take(advanceTime(this.round.state, nowMs, this.round.rng), nowMs);
    }
    const { board, gameOver } = this.scene;
    const state = this.round.state;
    board.setTimer(state.phase === 'playing' ? timerFraction(state, nowMs) : 0);
    board.setFade(boardAlpha(state, nowMs));
    board.update(nowMs);
    const active = buttonsActive(this.shownAtMs, nowMs);
    gameOver.setActive(active);
    this.options.exportButton?.setActive(active);
  }

  down(event: PointerEvent): void {
    const sample = this.sampleOf(event);
    if (this.currentScreen === 'gameOver') {
      this.tapGameOver(sample);
      return;
    }
    this.landed.set(sample.id, sample.point);
    const context = { geometry: this.scene.geometry, segmentId: this.round.state.current.id };
    const result = pointerDown(this.tracker, sample, context);
    this.tracker = result.tracker;
    this.apply(result.input, sample);
  }

  move(event: PointerEvent): void {
    const sample = this.sampleOf(event);
    const result = pointerMove(this.tracker, sample, this.scene.geometry);
    this.tracker = result.tracker;
    this.apply(result.input, sample);
  }

  up(event: PointerEvent): void {
    this.tracker = pointerUp(this.tracker, event.pointerId);
    this.landed.delete(event.pointerId);
  }

  /** The canvas fills the window, so client coordinates are canvas coordinates. */
  private sampleOf(event: PointerEvent): PointerSample {
    return {
      id: event.pointerId,
      point: { x: event.clientX, y: event.clientY },
      timeMs: this.now(),
    };
  }

  private startRound(nowMs: number): Round {
    const seed = this.options.seed ?? randomSeed();
    const rng = createRng(seed);
    const state = createGame(rng, nowMs);
    const record = this.options.exportButton !== null;
    return { rng, state, recorder: record ? startProtocol(seed, state, nowMs) : null };
  }

  private apply(input: GameInput | null, sample: PointerSample): void {
    if (input === null || this.currentScreen !== 'game') {
      return;
    }
    const events = this.take(applyInput(this.round.state, input, this.round.rng), input.timeMs);
    if (events.some((event) => event.type === 'bounced')) {
      const from = this.landed.get(sample.id) ?? this.scene.geometry.center;
      this.scene.board.bounce(direction(from, sample.point), input.timeMs);
    }
  }

  /** Takes over what a step of the rule core did at `timeMs`. */
  private take(result: StepResult, timeMs: number): readonly GameEvent[] {
    const round = this.round;
    round.state = result.state;
    if (result.events.length === 0) {
      return result.events;
    }
    if (round.recorder !== null) {
      round.recorder = recordStep(round.recorder, result, timeMs);
    }
    this.show();
    this.scene.board.play(result.events, timeMs);
    if (result.events.some((event) => event.type === 'gameOver')) {
      this.enterGameOver(timeMs);
    }
    return result.events;
  }

  private enterGameOver(timeMs: number): void {
    this.currentScreen = 'gameOver';
    this.shownAtMs = timeMs;
    this.forgetFingers();
    this.show();
    const recorder = this.round.recorder;
    if (recorder !== null) {
      this.options.exportButton?.show(finishProtocol(recorder, this.round.state));
    }
  }

  /** A tap on the Game Over screen. "Again" starts a new game at once (A81, A82). */
  private tapGameOver(sample: PointerSample): void {
    const onAgain = rectContains(againButton(this.scene.field), sample.point);
    if (!onAgain || !buttonsActive(this.shownAtMs, sample.timeMs)) {
      return;
    }
    this.round = this.startRound(sample.timeMs);
    this.currentScreen = 'game';
    this.forgetFingers();
    this.options.exportButton?.hide();
    this.show();
  }

  /** An input only counts in the state in which it began (A10). */
  private forgetFingers(): void {
    this.tracker = createPointerTracker();
    this.landed.clear();
  }

  private show(): void {
    const { board, hud, gameOver } = this.scene;
    const state = this.round.state;
    board.render(state);
    hud.render(state);
    const over = this.currentScreen === 'gameOver';
    hud.container.visible = !over;
    if (over) {
      gameOver.show(state.score);
    } else {
      gameOver.hide();
    }
  }
}
