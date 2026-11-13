// Turns the fingers on the screen into inputs of the game (A6 to A8), without
// any browser API. The caller feeds in what the pointer events report.

import type { GameInput } from '../core/types';
import type { BoardGeometry, Point } from '../view/geometry';
import { hitTest } from './hitTest';

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

function without(tracker: PointerTracker, pointerId: number): PointerTracker {
  if (!tracker.pending.has(pointerId)) {
    return tracker;
  }
  const pending = new Map(tracker.pending);
  pending.delete(pointerId);
  return { pending };
}

/** A finger lands. On a ring that is a tap, on the centre the start of a swipe. */
export function pointerDown(
  tracker: PointerTracker,
  sample: PointerSample,
  context: BoardContext,
): PointerResult {
  const target = hitTest(context.geometry, sample.point);
  if (target?.kind === 'ring') {
    // The tap counts when the finger lands, not when it lifts (A6).
    return { tracker, input: { type: 'tap', ring: target.ring, timeMs: sample.timeMs } };
  }
  if (target?.kind === 'center') {
    const pending = new Map(tracker.pending).set(sample.id, context.segmentId);
    return { tracker: { pending }, input: null };
  }
  return { tracker, input: null };
}

/** A finger moves. It swipes as soon as it leaves the centre disc it landed on. */
export function pointerMove(
  tracker: PointerTracker,
  sample: PointerSample,
  geometry: BoardGeometry,
): PointerResult {
  const segmentId = tracker.pending.get(sample.id);
  // Only a finger that landed on the centre can swipe (A8, A10).
  if (segmentId === undefined || hitTest(geometry, sample.point)?.kind === 'center') {
    return { tracker, input: null };
  }
  return {
    tracker: without(tracker, sample.id),
    input: { type: 'swipe', segmentId, timeMs: sample.timeMs },
  };
}

/** A finger lifts or the browser cancels it. */
export function pointerUp(tracker: PointerTracker, pointerId: number): PointerTracker {
  return without(tracker, pointerId);
}
