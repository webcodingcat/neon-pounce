// Turns the fingers on the screen into inputs of the game (A6 to A8), without
// any browser API. The caller feeds in what the pointer events report.

import type { GameInput } from '../core/types';
import type { BoardGeometry, Point } from '../view/geometry';

/** One report about a finger. */
export interface PointerSample {
  readonly id: number;
  readonly point: Point;
  readonly timeMs: number;
}

/** What a landing finger meets. */
export interface BoardContext {
  readonly geometry: BoardGeometry;
  /** Id of the segment that is visible in the centre. */
  readonly segmentId: number;
}

export interface PointerTracker {
  /**
   * Fingers that landed on the centre disc and have not left it yet, with the
   * id of the segment they saw.
   */
  readonly pending: ReadonlyMap<number, number>;
}

export interface PointerResult {
  readonly tracker: PointerTracker;
  readonly input: GameInput | null;
}

export function createPointerTracker(): PointerTracker {
  return { pending: new Map() };
}

/** A finger lands. On a ring that is a tap, on the centre the start of a swipe. */
export function pointerDown(
  tracker: PointerTracker,
  _sample: PointerSample,
  _context: BoardContext,
): PointerResult {
  return { tracker, input: null };
}

/** A finger moves. It swipes as soon as it leaves the centre disc it landed on. */
export function pointerMove(
  tracker: PointerTracker,
  _sample: PointerSample,
  _geometry: BoardGeometry,
): PointerResult {
  return { tracker, input: null };
}

/** A finger lifts or the browser cancels it. */
export function pointerUp(tracker: PointerTracker, _pointerId: number): PointerTracker {
  return tracker;
}
