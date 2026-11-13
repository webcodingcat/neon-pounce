// Wires a game to the application: layout, resize, the fingers on the canvas
// and the feedback. The rules live in src/core, this file only connects them.

import type { Application } from 'pixi.js';
import { applyInput, createGame } from '../core/game';
import { createRng } from '../core/rng';
import type { GameInput, GameState } from '../core/types';
import {
  createPointerTracker,
  pointerDown,
  pointerMove,
  pointerUp,
  type PointerSample,
} from '../input/pointers';
import { BoardView } from '../view/boardView';
import { boardGeometry, type BoardGeometry } from '../view/geometry';
import { Hud } from '../view/hud';
import { fieldCenter, fieldLayout } from '../view/layout';
import { readSafeArea } from '../view/safeArea';
import { createBoardTextures, destroyBoardTextures, type BoardTextures } from '../view/textures';

interface Scene {
  readonly geometry: BoardGeometry;
  readonly textures: BoardTextures;
  readonly board: BoardView;
  readonly hud: Hud;
}

function buildScene(app: Application): Scene {
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const field = fieldLayout(viewport, readSafeArea());
  const geometry = boardGeometry(fieldCenter(field), field.width);
  const textures = createBoardTextures(geometry, field.width, app.renderer.resolution);
  const board = new BoardView(geometry, textures);
  const hud = new Hud(field);
  app.stage.addChild(board.container, hud.container);
  return { geometry, textures, board, hud };
}

function destroyScene(scene: Scene): void {
  scene.board.destroy();
  scene.hud.destroy();
  destroyBoardTextures(scene.textures);
}

/** A seed that differs from game to game. The core never draws its own. */
function randomSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
}

/** The canvas fills the window, so client coordinates are canvas coordinates. */
function sampleOf(event: PointerEvent): PointerSample {
  return {
    id: event.pointerId,
    point: { x: event.clientX, y: event.clientY },
    timeMs: performance.now(),
  };
}

/** A running game with its picture. */
class Session {
  private readonly app: Application;
  private readonly rng = createRng(randomSeed());
  private state: GameState = createGame(this.rng);
  private tracker = createPointerTracker();
  private scene: Scene;

  constructor(app: Application) {
    this.app = app;
    this.scene = buildScene(app);
    this.show();
  }

  /** Builds the picture again for a new window size. Running effects end. */
  rebuild(): void {
    destroyScene(this.scene);
    this.scene = buildScene(this.app);
    this.show();
  }

  update(nowMs: number): void {
    this.scene.board.update(nowMs);
  }

  down(event: PointerEvent): void {
    const context = { geometry: this.scene.geometry, segmentId: this.state.current.id };
    const result = pointerDown(this.tracker, sampleOf(event), context);
    this.tracker = result.tracker;
    this.apply(result.input);
  }

  move(event: PointerEvent): void {
    const result = pointerMove(this.tracker, sampleOf(event), this.scene.geometry);
    this.tracker = result.tracker;
    this.apply(result.input);
  }

  up(event: PointerEvent): void {
    this.tracker = pointerUp(this.tracker, event.pointerId);
  }

  private apply(input: GameInput | null): void {
    if (input === null) {
      return;
    }
    const result = applyInput(this.state, input, this.rng);
    this.state = result.state;
    this.show();
    this.scene.board.play(result.events, input.timeMs);
  }

  private show(): void {
    this.scene.board.render(this.state);
    this.scene.hud.render(this.state);
  }
}

export function runGame(app: Application): void {
  const session = new Session(app);
  const canvas = app.canvas;
  canvas.addEventListener('pointerdown', (event) => {
    session.down(event);
  });
  canvas.addEventListener('pointermove', (event) => {
    session.move(event);
  });
  canvas.addEventListener('pointerup', (event) => {
    session.up(event);
  });
  canvas.addEventListener('pointercancel', (event) => {
    session.up(event);
  });
  window.addEventListener('resize', () => {
    session.rebuild();
  });
  app.ticker.add(() => {
    session.update(performance.now());
  });
}
