import { describe, expect, it } from 'vitest';
import { BAG_COPIES } from '../config';
import { drawColor, drawPosition } from './generator';
import { createRng, type Rng } from './rng';
import { SLOT_COUNT } from './types';

const BAG_SIZE = BAG_COPIES * SLOT_COUNT;
const SLOTS = Array.from({ length: SLOT_COUNT }, (_, slot) => slot);

interface Round {
  readonly positions: number[];
  readonly bag: readonly number[];
}

/** Draws `count` positions in a row, starting with the given bag. */
function drawRound(start: readonly number[], rng: Rng, count: number): Round {
  let bag = start;
  const positions: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const draw = drawPosition(bag, rng);
    positions.push(draw.position);
    bag = draw.bag;
  }
  return { positions, bag };
}

function countOf(values: readonly number[], wanted: number): number {
  return values.filter((value) => value === wanted).length;
}

describe('drawPosition (A32)', () => {
  it('hands out every position equally often before the bag is refilled', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const rng = createRng(seed);
      const first = drawRound([], rng, BAG_SIZE);
      expect(SLOTS.map((slot) => countOf(first.positions, slot))).toEqual(
        SLOTS.map(() => BAG_COPIES),
      );
      expect(first.bag).toEqual([]);
      // The empty bag is refilled: the next round is complete again.
      const second = drawRound(first.bag, rng, BAG_SIZE);
      expect(SLOTS.map((slot) => countOf(second.positions, slot))).toEqual(
        SLOTS.map(() => BAG_COPIES),
      );
    }
  });

  it('shuffles: the order changes with the seed', () => {
    const orders = new Set<string>();
    for (let seed = 1; seed <= 20; seed += 1) {
      orders.add(drawRound([], createRng(seed), BAG_SIZE).positions.join(','));
    }
    expect(orders.size).toBeGreaterThan(15);
  });

  it('draws only what is left in the bag', () => {
    expect(drawPosition([4], createRng(1))).toEqual({ position: 4, bag: [] });
    const rest = drawRound([2, 2, 5], createRng(9), 3);
    expect(rest.positions.toSorted()).toEqual([2, 2, 5]);
    expect(rest.bag).toEqual([]);
  });
});

describe('drawColor (A31)', () => {
  it('draws only colours of the given number, each about equally often', () => {
    const draws = 6000;
    for (const colorCount of [2, 3, 4, 5, 6]) {
      const rng = createRng(colorCount);
      const colors = Array.from({ length: draws }, () => drawColor(rng, colorCount));
      const expected = draws / colorCount;
      for (const color of colors) {
        expect(Number.isInteger(color)).toBe(true);
        expect(color).toBeGreaterThanOrEqual(0);
        expect(color).toBeLessThan(colorCount);
      }
      for (let color = 0; color < colorCount; color += 1) {
        expect(countOf(colors, color)).toBeGreaterThan(expected * 0.85);
        expect(countOf(colors, color)).toBeLessThan(expected * 1.15);
      }
    }
  });
});
