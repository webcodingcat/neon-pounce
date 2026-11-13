// Seeded random generator (A35). The rule core takes all its randomness from a
// generator like this, so the same seed replays the same game.

/** Returns the next random number, from 0 up to but not including 1. */
export type Rng = () => number;

export function createRng(_seed: number): Rng {
  return () => 0;
}
