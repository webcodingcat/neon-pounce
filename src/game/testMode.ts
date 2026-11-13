// Test mode (A110): the address suffix `?test=<seed>` fixes the seed and makes
// the app expose its state under `window.__neonPounce`.

import type { Ring, Segment } from '../core/types';

/** What the smoke tests can read and do. All values are read live. */
export interface TestApi {
  readonly screen: 'game' | 'gameOver';
  readonly rings: readonly Ring[];
  readonly current: Segment;
  readonly lives: number;
  readonly discards: number;
  readonly score: number;
  readonly combo: number;
  readonly level: number;
  /** Moves the time of the game forward. */
  advance(ms: number): void;
}

declare global {
  interface Window {
    __neonPounce?: TestApi;
  }
}

/**
 * The seed from the query string of the address, or null without test mode.
 * A seed is a whole number from 0.
 */
export function testSeed(_search: string): number | null {
  return null;
}
