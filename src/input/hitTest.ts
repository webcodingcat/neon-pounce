// Maps a touch point to what it hits on the board (A6).

import type { BoardGeometry, Point } from '../view/geometry';

export type HitTarget =
  { readonly kind: 'ring'; readonly ring: number } | { readonly kind: 'center' } | null;

/**
 * The target of a ring is its whole disc, the centre its whole disc. Everything
 * else hits nothing.
 */
export function hitTest(_geometry: BoardGeometry, _point: Point): HitTarget {
  return null;
}
