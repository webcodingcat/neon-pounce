// Segment generator (A31, A32). Until milestone 7 the position comes from the
// bag alone.

import { BAG_COPIES } from '../config';
import type { Rng } from './rng';
import { SLOT_COUNT } from './types';

export interface PositionDraw {
  readonly position: number;
  /** The bag without the drawn position. */
  readonly bag: readonly number[];
}

/** A random whole number from 0 up to, but not including, `count`. */
function randomIndex(rng: Rng, count: number): number {
  return Math.min(count - 1, Math.floor(rng() * count));
}

/** A full bag: every position `BAG_COPIES` times. */
function fullBag(): number[] {
  return Array.from({ length: BAG_COPIES * SLOT_COUNT }, (_, index) => index % SLOT_COUNT);
}

/**
 * Takes a random position out of the bag. An empty bag is refilled first: it
 * then holds every position equally often.
 */
export function drawPosition(bag: readonly number[], rng: Rng): PositionDraw {
  const source = bag.length > 0 ? bag : fullBag();
  const index = randomIndex(rng, source.length);
  return {
    position: source[index] ?? 0,
    bag: source.filter((_, other) => other !== index),
  };
}

/** Draws one of `colorCount` colours, each with the same chance. */
export function drawColor(rng: Rng, colorCount: number): number {
  return randomIndex(rng, colorCount);
}
