// Board geometry as pure functions (A1 to A3). Angles are radians, measured
// clockwise from 12 o'clock. Coordinates are screen coordinates (y grows down).

export const RING_COUNT = 6;
export const SLOT_COUNT = 6;

export interface Point {
  readonly x: number;
  readonly y: number;
}

/** Sizes of the board in CSS pixels for one field width. */
export interface BoardGeometry {
  readonly center: Point;
  readonly ringDistance: number;
  readonly ringRadius: number;
  readonly centerRadius: number;
  readonly timerArcRadius: number;
  readonly gapWidth: number;
}

/**
 * Outline of one wedge: from the apex along a straight edge to the rim, along
 * the rim (an arc around `origin`) and back to the apex.
 */
export interface Wedge {
  readonly origin: Point;
  readonly apex: Point;
  readonly radius: number;
  readonly startAngle: number;
  readonly endAngle: number;
}

/** Disc that holds wedges: an outer ring or the centre. */
export interface Disc {
  readonly origin: Point;
  readonly radius: number;
  readonly gapWidth: number;
}

export function boardGeometry(center: Point, _fieldWidth: number): BoardGeometry {
  return {
    center,
    ringDistance: 0,
    ringRadius: 0,
    centerRadius: 0,
    timerArcRadius: 0,
    gapWidth: 0,
  };
}

export function pointAt(origin: Point, _angle: number, _distance: number): Point {
  return origin;
}

export function ringCenter(geometry: BoardGeometry, _ring: number): Point {
  return geometry.center;
}

export function slotMidAngle(_slot: number): number {
  return 0;
}

export function slotWedge(disc: Disc, _slot: number): Wedge {
  return {
    origin: disc.origin,
    apex: disc.origin,
    radius: disc.radius,
    startAngle: 0,
    endAngle: 0,
  };
}
