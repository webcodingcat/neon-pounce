import { describe, expect, it } from 'vitest';
import { MAX_DISCARDS } from '../config';
import { discardSymbol } from './hudSymbols';

describe('discard symbol of the HUD (A28)', () => {
  it('turns into the give-up symbol exactly when the stock is empty', () => {
    expect(discardSymbol(0)).toBe('giveUp');
    expect(discardSymbol(1)).toBe('discard');
    expect(discardSymbol(MAX_DISCARDS)).toBe('discard');
  });
});
