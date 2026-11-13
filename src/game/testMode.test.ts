import { describe, expect, it } from 'vitest';
import { testSeed } from './testMode';

describe('test mode (A110)', () => {
  it('reads the seed from the address suffix', () => {
    expect(testSeed('?test=42')).toBe(42);
    expect(testSeed('?test=0')).toBe(0);
    expect(testSeed('?other=1&test=7')).toBe(7);
  });

  it('stays off without the suffix or with a value that is no seed', () => {
    for (const search of ['', '?', '?other=1', '?test', '?test=', '?test=abc', '?test=-3']) {
      expect(testSeed(search)).toBeNull();
    }
    expect(testSeed('?test=1.5')).toBeNull();
    expect(testSeed('?test=4e2')).toBeNull();
  });
});
