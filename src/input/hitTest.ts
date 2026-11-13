// Maps a touch point to what it hits on the board (A6).

import { RING_COUNT, ringCenter, type BoardGeometry, type Point } from '../view/geometry';

export type HitTarget =
  { readonly kind: 'ring'; readonly ring: number } | { readonly kind: 'center' } | null;

function isInside(point: Point, origin: Point, radius: number): boolean {
  return Math.hypot(point.x - origin.x, point.y - origin.y) <= radius;
}

/**
 * The target of a ring is its whole disc, the centre its whole disc. Everything
 * else hits nothing.
 */
export function hitTest(geometry: BoardGeometry, point: Point): HitTarget {
  if (isInside(point, geometry.center, geometry.centerRadius)) {
    return { kind: 'center' };
  }
  for (let ring = 0; ring < RING_COUNT; ring += 1) {
    if (isInside(point, ringCenter(geometry, ring), geometry.ringRadius)) {
      return { kind: 'ring', ring };
    }
  }
  return null;
}
