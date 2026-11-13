// Rules of the Game Over screen that need no picture.

import { GAME_OVER_LOCK_MS } from '../config';

/** The buttons react only some time after the screen appeared (A82). */
export function buttonsActive(shownAtMs: number, nowMs: number): boolean {
  return nowMs - shownAtMs >= GAME_OVER_LOCK_MS;
}
