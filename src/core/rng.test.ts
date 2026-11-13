import { describe, expect, it } from 'vitest';
import { createRng } from './rng';

function sequence(seed: number, length: number): number[] {
  const rng = createRng(seed);
  return Array.from({ length }, () => rng());
}

describe('createRng (A35)', () => {
  it('returns evenly spread numbers from 0 up to, but not including, 1', () => {
    const draws = 10_000;
    const buckets = Array.from({ length: 10 }, () => 0);
    for (const value of sequence(7, draws)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
      const bucket = Math.floor(value * 10);
      buckets[bucket] = (buckets[bucket] ?? 0) + 1;
    }
    for (const count of buckets) {
      expect(count).toBeGreaterThan(draws / 10 - 150);
      expect(count).toBeLessThan(draws / 10 + 150);
    }
  });

  it('repeats the sequence for the same seed and changes it for another seed', () => {
    expect(sequence(42, 50)).toEqual(sequence(42, 50));
    expect(sequence(42, 50)).not.toEqual(sequence(43, 50));
  });
});
