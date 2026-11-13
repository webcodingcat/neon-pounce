// Board geometry as pure functions (A1 to A3). Angles are radians, measured
// clockwise from 12 o'clock. Coordinates are screen coordinates (y grows down).

import { CENTER_RADIUS, GAP_WIDTH, RING_DISTANCE, RING_RADIUS, TIMER_ARC_RADIUS } from '../config';

export { RING_COUNT, SLOT_COUNT } from '../core/types';

/** Angle between two neighbouring rings and width of one slot. */
const STEP = (2 * Math.PI) / 6;

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

export function boardGeometry(center: Point, fieldWidth: number): BoardGeometry {
  return {
    center,
    ringDistance: RING_DISTANCE * fieldWidth,
    ringRadius: RING_RADIUS * fieldWidth,
    centerRadius: CENTER_RADIUS * fieldWidth,
    timerArcRadius: TIMER_ARC_RADIUS * fieldWidth,
    gapWidth: GAP_WIDTH * fieldWidth,
  };
}

export function pointAt(origin: Point, angle: number, distance: number): Point {
  return {
    x: origin.x + distance * Math.sin(angle),
    y: origin.y - distance * Math.cos(angle),
  };
}

/** Centre of an outer ring. Ring 0 is at 12 o'clock, the others follow clockwise. */
export function ringCenter(geometry: BoardGeometry, ring: number): Point {
  return pointAt(geometry.center, ring * STEP, geometry.ringDistance);
}

/** Angle of the middle of a slot. Slot 0 is at 1 o'clock. */
export function slotMidAngle(slot: number): number {
  return (slot + 0.5) * STEP;
}

/**
 * Wedge of a slot. Both straight edges are moved inwards by half the gap
 * width, so neighbouring wedges are separated by a gap of constant width.
 */
export function slotWedge(disc: Disc, slot: number): Wedge {
  const halfGap = disc.gapWidth / 2;
  // The edges stay parallel to the slot borders: the apex moves out along the
  // bisector, the ends of the rim move towards the middle of the slot.
  const apexDistance = halfGap / Math.sin(STEP / 2);
  const rimInset = Math.asin(halfGap / disc.radius);
  return {
    origin: disc.origin,
    apex: pointAt(disc.origin, slotMidAngle(slot), apexDistance),
    radius: disc.radius,
    startAngle: slot * STEP + rimInset,
    endAngle: (slot + 1) * STEP - rimInset,
  };
}
