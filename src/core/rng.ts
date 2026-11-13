// Seeded random generator (A35). The rule core takes all its randomness from a
// generator like this, so the same seed replays the same game.

/** Returns the next random number, from 0 up to but not including 1. */
export type Rng = () => number;

/** Mulberry32: small, fast and evenly spread enough for a game. */
export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 0x1_0000_0000;
  };
}
