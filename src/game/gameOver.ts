// Rules of the Game Over screen that need no picture.

/** The buttons react only some time after the screen appeared (A82). */
export function buttonsActive(_shownAtMs: number, _nowMs: number): boolean {
  return false;
}
