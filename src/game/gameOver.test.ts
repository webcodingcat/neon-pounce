import { describe, expect, it } from 'vitest';
import { GAME_OVER_LOCK_MS } from '../config';
import { buttonsActive } from './gameOver';

describe('buttons of Game Over (A82)', () => {
  it('react only after the lock time since the screen appeared', () => {
    const shownAt = 12_000;
    expect(buttonsActive(shownAt, shownAt)).toBe(false);
    expect(buttonsActive(shownAt, shownAt + GAME_OVER_LOCK_MS - 1)).toBe(false);
    expect(buttonsActive(shownAt, shownAt + GAME_OVER_LOCK_MS)).toBe(true);
    expect(buttonsActive(shownAt, shownAt + 10 * GAME_OVER_LOCK_MS)).toBe(true);
  });
});
