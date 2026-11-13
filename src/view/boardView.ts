// Draws the board of a game: six rings with their segments and the current
// segment in the centre. All sprites are built once. Afterwards only
// visibility, tint, position and alpha change (A97).

import { Container, type Sprite } from 'pixi.js';
import { BLOCKADE_FLASH_MS, BOUNCE_MS, FLASH_MS, SHAKE_MS } from '../config';
import type { GameEvent, GameState, Segment } from '../core/types';
import {
  RING_COUNT,
  SLOT_COUNT,
  pointAt,
  ringCenter,
  slotMidAngle,
  type BoardGeometry,
  type Point,
} from './geometry';
import { FRAME_TINT, SYMBOL_TINT, segmentTint } from './palette';
import { glowSprite } from './sprites';
import { TIMER_PIECES, type BoardTextures, type GlowTexture } from './textures';

const SLOT_STEP = (2 * Math.PI) / SLOT_COUNT;
const ORIGIN: Point = { x: 0, y: 0 };
/** Where the symbol sits on its wedge, as a fraction of the disc radius. */
const SYMBOL_DISTANCE = 0.62;
const OUTLINE_ALPHA = 0.35;
/** How far a ring moves when it shakes, as a fraction of its radius. */
const SHAKE_REACH = 0.1;
const SHAKE_SWINGS = 3;
const FLASH_ALPHA = 0.9;
const WHITE = 0xffffff;
/** How far the first segment slides on a swipe, as a fraction of the centre radius. */
const BOUNCE_REACH = 0.45;
/** How often the taken slots of a blockade turn white. */
const BLOCKADE_BLINKS = 3;

/** A wedge with its symbol. */
interface SlotView {
  readonly wedge: Sprite;
  readonly symbol: Sprite;
}

/** What the slots of one kind of disc (outer ring or centre) are built from. */
interface DiscKit {
  readonly wedge: GlowTexture;
  readonly radius: number;
  /** Size of the symbols compared to those of an outer ring. */
  readonly symbolScale: number;
}

interface RingView {
  readonly container: Container;
  readonly origin: Point;
  readonly slots: readonly SlotView[];
  readonly flash: Sprite;
  /** Start times of the running effects, or null. */
  shakeStart: number | null;
  flashStart: number | null;
}

/** How far an effect has run, from 0 to 1, or null when it is over. */
function progress(start: number | null, nowMs: number, durationMs: number): number | null {
  if (start === null) {
    return null;
  }
  const value = (nowMs - start) / durationMs;
  return value >= 0 && value < 1 ? value : null;
}

/** A running effect that started at `start`. */
interface Blockade {
  readonly position: number;
  readonly start: number;
}

interface Bounce {
  /** Unit vector of the swipe. */
  readonly direction: Point;
  readonly start: number;
}

export class BoardView {
  readonly container = new Container();

  private readonly textures: BoardTextures;
  private readonly rings: RingView[] = [];
  /** One view per position: the centre shows the one of the current segment. */
  private readonly center: SlotView[] = [];
  /** Holds the wedges of the centre, so they can move without the timer arc. */
  private readonly centerSlots = new Container();
  /** Pieces of the running timer arc, clockwise from 12 o'clock. */
  private readonly timerPieces: Sprite[] = [];
  private readonly shakeReach: number;
  private readonly bounceReach: number;
  /** The state shown last, for effects that need the colours of the segments. */
  private shown: GameState | null = null;
  private blockade: Blockade | null = null;
  private bounceEffect: Bounce | null = null;

  constructor(geometry: BoardGeometry, textures: BoardTextures) {
    this.textures = textures;
    this.shakeReach = SHAKE_REACH * geometry.ringRadius;
    this.bounceReach = BOUNCE_REACH * geometry.centerRadius;
    const disc: DiscKit = {
      wedge: textures.ringWedge,
      radius: geometry.ringRadius,
      symbolScale: 1,
    };
    for (let ring = 0; ring < RING_COUNT; ring += 1) {
      const view = this.createRing(ringCenter(geometry, ring), disc);
      this.rings.push(view);
      this.container.addChild(view.container);
    }
    this.container.addChild(this.createCenter(geometry));
  }

  /** Shows the state. Segments jump to their place. */
  render(state: GameState): void {
    this.shown = state;
    this.rings.forEach((ring, ringIndex) => {
      ring.slots.forEach((slot, position) => {
        this.showSlot(slot, state.rings[ringIndex]?.[position] ?? null);
      });
    });
    // After the last life the centre stays empty (A23).
    const current = state.phase === 'playing' ? state.current : null;
    this.center.forEach((slot, position) => {
      this.showSlot(slot, position === current?.position ? current : null);
    });
  }

  /** Starts the feedback for what just happened. */
  play(events: readonly GameEvent[], nowMs: number): void {
    for (const event of events) {
      if (event.type === 'missed') {
        this.startShake(event.ring, nowMs);
      } else if (event.type === 'cleared') {
        this.startFlash(event.ring, event.color, nowMs);
      } else if ((event.type === 'timedOut' || event.type === 'gaveUp') && event.showBlockade) {
        this.blockade = { position: event.segment.position, start: nowMs };
      }
    }
  }

  /** Lets the segment in the centre slide in a direction and spring back (A15). */
  bounce(direction: Point, nowMs: number): void {
    this.bounceEffect = { direction, start: nowMs };
  }

  /** Shows how much of the timer is left, from 1 (full) to 0. */
  setTimer(fraction: number): void {
    const lit = fraction * this.timerPieces.length;
    this.timerPieces.forEach((piece, index) => {
      // The last lit piece fades, so the arc does not shrink in steps.
      const alpha = Math.min(1, Math.max(0, lit - index));
      piece.visible = alpha > 0;
      piece.alpha = alpha;
    });
  }

  /** Dims the whole board: 1 is fully visible, 0 is dark (A23). */
  setFade(alpha: number): void {
    this.container.alpha = alpha;
  }

  /** Moves the running effects to their state at time `nowMs`. */
  update(nowMs: number): void {
    for (const ring of this.rings) {
      const shake = progress(ring.shakeStart, nowMs, SHAKE_MS);
      const swing = shake === null ? 0 : Math.sin(shake * SHAKE_SWINGS * 2 * Math.PI) * (1 - shake);
      ring.container.x = ring.origin.x + swing * this.shakeReach;
      const flash = progress(ring.flashStart, nowMs, FLASH_MS);
      ring.flash.visible = flash !== null;
      ring.flash.alpha = flash === null ? 0 : FLASH_ALPHA * (1 - flash);
    }
    this.updateBounce(nowMs);
    this.updateBlockade(nowMs);
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }

  private startShake(ringIndex: number, nowMs: number): void {
    const ring = this.rings[ringIndex];
    if (ring !== undefined) {
      ring.shakeStart = nowMs;
    }
  }

  private startFlash(ringIndex: number, color: number | null, nowMs: number): void {
    const ring = this.rings[ringIndex];
    if (ring !== undefined) {
      ring.flashStart = nowMs;
      // A single-colour ring flashes in its colour, any other in white.
      ring.flash.tint = color === null ? WHITE : segmentTint(color);
    }
  }

  private updateBounce(nowMs: number): void {
    const bounce = this.bounceEffect;
    const run = progress(bounce?.start ?? null, nowMs, BOUNCE_MS);
    // Out and back along half a sine wave.
    const reach = run === null ? 0 : Math.sin(run * Math.PI) * this.bounceReach;
    this.centerSlots.position.set(
      (bounce?.direction.x ?? 0) * reach,
      (bounce?.direction.y ?? 0) * reach,
    );
  }

  /** Lets the taken slots of a blockade blink white (A30). */
  private updateBlockade(nowMs: number): void {
    const blockade = this.blockade;
    if (blockade === null) {
      return;
    }
    const run = progress(blockade.start, nowMs, BLOCKADE_FLASH_MS);
    const white = run !== null && Math.floor(run * 2 * BLOCKADE_BLINKS) % 2 === 0;
    this.rings.forEach((ring, ringIndex) => {
      const segment = this.shown?.rings[ringIndex]?.[blockade.position] ?? null;
      const wedge = ring.slots[blockade.position]?.wedge;
      if (segment !== null && wedge !== undefined) {
        wedge.tint = white ? WHITE : segmentTint(segment.color);
      }
    });
    if (run === null) {
      this.blockade = null;
    }
  }

  /** A wedge at `position` of a disc around the origin of `parent`, with its symbol. */
  private createSlot(parent: Container, position: number, disc: DiscKit): SlotView {
    const resolution = this.textures.resolution;
    const wedge = glowSprite(disc.wedge, ORIGIN, resolution);
    wedge.rotation = position * SLOT_STEP;
    wedge.visible = false;
    const spot = pointAt(ORIGIN, slotMidAngle(position), SYMBOL_DISTANCE * disc.radius);
    const symbol = glowSprite(this.symbolTexture(0), spot, resolution);
    symbol.scale.set(disc.symbolScale / resolution);
    symbol.tint = SYMBOL_TINT;
    symbol.visible = false;
    parent.addChild(wedge, symbol);
    return { wedge, symbol };
  }

  private symbolTexture(color: number): GlowTexture {
    const symbols = this.textures.symbols;
    return symbols[color % symbols.length] ?? this.textures.particle;
  }

  private showSlot(slot: SlotView, segment: Segment | null): void {
    slot.wedge.visible = segment !== null;
    slot.symbol.visible = segment !== null;
    if (segment !== null) {
      slot.wedge.tint = segmentTint(segment.color);
      slot.symbol.texture = this.symbolTexture(segment.color).texture;
    }
  }

  private createRing(origin: Point, disc: DiscKit): RingView {
    const container = new Container();
    container.position.set(origin.x, origin.y);
    const outline = glowSprite(this.textures.ringOutline, ORIGIN, this.textures.resolution);
    outline.tint = FRAME_TINT;
    outline.alpha = OUTLINE_ALPHA;
    // The flash lies under the wedges, so it never washes out a segment that is
    // placed into the ring while it still flashes.
    const flash = glowSprite(this.textures.ringDisc, ORIGIN, this.textures.resolution);
    flash.blendMode = 'add';
    flash.visible = false;
    container.addChild(outline, flash);
    const slots = Array.from({ length: SLOT_COUNT }, (_, position) =>
      this.createSlot(container, position, disc),
    );
    return { container, origin, slots, flash, shakeStart: null, flashStart: null };
  }

  private createCenter(geometry: BoardGeometry): Container {
    const container = new Container();
    container.position.set(geometry.center.x, geometry.center.y);
    const arc = glowSprite(this.textures.timerArc, ORIGIN, this.textures.resolution);
    arc.tint = FRAME_TINT;
    arc.alpha = OUTLINE_ALPHA;
    container.addChild(arc);
    for (let index = 0; index < TIMER_PIECES; index += 1) {
      const piece = glowSprite(this.textures.timerPiece, ORIGIN, this.textures.resolution);
      piece.rotation = (index * 2 * Math.PI) / TIMER_PIECES;
      piece.tint = FRAME_TINT;
      this.timerPieces.push(piece);
      container.addChild(piece);
    }
    const disc: DiscKit = {
      wedge: this.textures.centerWedge,
      radius: geometry.centerRadius,
      // The symbols are sized for an outer ring. The centre disc is smaller.
      symbolScale: geometry.centerRadius / geometry.ringRadius,
    };
    for (let position = 0; position < SLOT_COUNT; position += 1) {
      this.center.push(this.createSlot(this.centerSlots, position, disc));
    }
    container.addChild(this.centerSlots);
    return container;
  }
}
