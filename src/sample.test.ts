import { describe, expect, it } from 'vitest';
import { appTitle } from './sample';

describe('appTitle', () => {
  it('returns the name of the game', () => {
    expect(appTitle()).toBe('Neon Pounce');
  });
});
