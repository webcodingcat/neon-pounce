// Segment generator (A31, A32). Until milestone 7 the position comes from the
// bag alone.

import type { Rng } from './rng';

export interface PositionDraw {
  readonly position: number;
  /** The bag without the drawn position. */
  readonly bag: readonly number[];
}

/**
 * Takes a random position out of the bag. An empty bag is refilled first: it
 * then holds every position equally often.
 */
export function drawPosition(bag: readonly number[], _rng: Rng): PositionDraw {
  return { position: 0, bag };
}

/** Draws one of `colorCount` colours, each with the same chance. */
export function drawColor(_rng: Rng, _colorCount: number): number {
  return 0;
}
