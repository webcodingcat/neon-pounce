import { describe, expect, it } from 'vitest';
import { RING_COUNT, boardGeometry, pointAt, ringCenter } from '../view/geometry';
import { hitTest } from './hitTest';

const GEOMETRY = boardGeometry({ x: 180, y: 320 }, 360);
const RINGS = Array.from({ length: RING_COUNT }, (_, ring) => ring);
/** Twelve directions, 30° apart. */
const DIRECTIONS = Array.from({ length: 12 }, (_, index) => (index * Math.PI) / 6);

describe('hitTest (A6)', () => {
  it('hits a ring on its whole disc and nothing beyond its rim', () => {
    for (const ring of RINGS) {
      const origin = ringCenter(GEOMETRY, ring);
      expect(hitTest(GEOMETRY, origin)).toEqual({ kind: 'ring', ring });
      for (const direction of DIRECTIONS) {
        const inside = pointAt(origin, direction, GEOMETRY.ringRadius - 0.5);
        expect(hitTest(GEOMETRY, inside)).toEqual({ kind: 'ring', ring });
      }
      // Straight away from the board, where no other disc is near.
      const outward = (ring * Math.PI) / 3;
      const beyond = pointAt(origin, outward, GEOMETRY.ringRadius + 0.5);
      expect(hitTest(GEOMETRY, beyond)).toBeNull();
    }
  });

  it('hits the centre on its whole disc and nothing between it and the rings', () => {
    expect(hitTest(GEOMETRY, GEOMETRY.center)).toEqual({ kind: 'center' });
    for (const direction of DIRECTIONS) {
      const inside = pointAt(GEOMETRY.center, direction, GEOMETRY.centerRadius - 0.5);
      expect(hitTest(GEOMETRY, inside)).toEqual({ kind: 'center' });
      const beyond = pointAt(GEOMETRY.center, direction, GEOMETRY.centerRadius + 0.5);
      expect(hitTest(GEOMETRY, beyond)).toBeNull();
    }
  });

  it('hits nothing in the corners of the field', () => {
    expect(hitTest(GEOMETRY, { x: 0, y: 0 })).toBeNull();
    expect(hitTest(GEOMETRY, { x: 360, y: 640 })).toBeNull();
  });
});
