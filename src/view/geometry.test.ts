import { describe, expect, it } from 'vitest';
import {
  CENTER_RADIUS,
  GAP_WIDTH,
  MIN_FIELD_ASPECT,
  RING_DISTANCE,
  RING_RADIUS,
  TIMER_ARC_RADIUS,
} from '../config';
import {
  RING_COUNT,
  SLOT_COUNT,
  boardGeometry,
  pointAt,
  ringCenter,
  slotMidAngle,
  slotWedge,
  type Disc,
  type Point,
} from './geometry';

const DEG = Math.PI / 180;
const SIN_60 = Math.sqrt(3) / 2;
const WIDTH = 360;
const CENTER: Point = { x: 180, y: 320 };
const RINGS = Array.from({ length: RING_COUNT }, (_, ring) => ring);
const SLOTS = Array.from({ length: SLOT_COUNT }, (_, slot) => slot);

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Independent reference: point at a clock angle (degrees) and a distance. */
function clock(origin: Point, degrees: number, dist: number): Point {
  return {
    x: origin.x + dist * Math.sin(degrees * DEG),
    y: origin.y - dist * Math.cos(degrees * DEG),
  };
}

function expectPoint(actual: Point, expected: Point): void {
  expect(actual.x).toBeCloseTo(expected.x, 6);
  expect(actual.y).toBeCloseTo(expected.y, 6);
}

describe('pointAt', () => {
  it('measures angles clockwise from 12 o’clock', () => {
    const origin: Point = { x: 100, y: 200 };
    expectPoint(pointAt(origin, 0, 10), { x: 100, y: 190 });
    expectPoint(pointAt(origin, 90 * DEG, 10), { x: 110, y: 200 });
    expectPoint(pointAt(origin, 180 * DEG, 10), { x: 100, y: 210 });
    expectPoint(pointAt(origin, 270 * DEG, 10), { x: 90, y: 200 });
  });
});

describe('boardGeometry (A1, A3)', () => {
  it('scales all sizes with the field width', () => {
    for (const width of [360, 520]) {
      const geometry = boardGeometry(CENTER, width);
      expect(geometry.center).toEqual(CENTER);
      expect(geometry.ringDistance).toBeCloseTo(RING_DISTANCE * width, 6);
      expect(geometry.ringRadius).toBeCloseTo(RING_RADIUS * width, 6);
      expect(geometry.centerRadius).toBeCloseTo(CENTER_RADIUS * width, 6);
      expect(geometry.timerArcRadius).toBeCloseTo(TIMER_ARC_RADIUS * width, 6);
      expect(geometry.gapWidth).toBeCloseTo(GAP_WIDTH * width, 6);
    }
  });

  it('puts ring 0 straight above the centre', () => {
    const geometry = boardGeometry(CENTER, WIDTH);
    const d = RING_DISTANCE * WIDTH;
    expectPoint(ringCenter(geometry, 0), { x: CENTER.x, y: CENTER.y - d });
  });

  it('puts rings 1 to 5 at 2, 4, 6, 8 and 10 o’clock, clockwise', () => {
    const geometry = boardGeometry(CENTER, WIDTH);
    const d = RING_DISTANCE * WIDTH;
    expectPoint(ringCenter(geometry, 1), { x: CENTER.x + SIN_60 * d, y: CENTER.y - d / 2 });
    expectPoint(ringCenter(geometry, 2), { x: CENTER.x + SIN_60 * d, y: CENTER.y + d / 2 });
    expectPoint(ringCenter(geometry, 3), { x: CENTER.x, y: CENTER.y + d });
    expectPoint(ringCenter(geometry, 4), { x: CENTER.x - SIN_60 * d, y: CENTER.y + d / 2 });
    expectPoint(ringCenter(geometry, 5), { x: CENTER.x - SIN_60 * d, y: CENTER.y - d / 2 });
  });

  it('keeps neighbouring rings apart', () => {
    const geometry = boardGeometry(CENTER, WIDTH);
    for (const ring of RINGS) {
      const next = (ring + 1) % RING_COUNT;
      const between = distance(ringCenter(geometry, ring), ringCenter(geometry, next));
      expect(between - 2 * geometry.ringRadius).toBeGreaterThan(0);
    }
  });

  it('keeps the timer arc between the centre disc and the rings', () => {
    const geometry = boardGeometry(CENTER, WIDTH);
    expect(geometry.centerRadius).toBeGreaterThan(0);
    expect(geometry.timerArcRadius).toBeGreaterThan(geometry.centerRadius);
    expect(geometry.ringDistance - geometry.ringRadius).toBeGreaterThan(geometry.timerArcRadius);
  });

  it('fits all rings into the field', () => {
    for (const width of [360, 520]) {
      const geometry = boardGeometry(CENTER, width);
      const reachX = RINGS.map(
        (ring) => Math.abs(ringCenter(geometry, ring).x - CENTER.x) + geometry.ringRadius,
      );
      const reachY = RINGS.map(
        (ring) => Math.abs(ringCenter(geometry, ring).y - CENTER.y) + geometry.ringRadius,
      );
      expect(Math.max(...reachX)).toBeLessThanOrEqual(width / 2);
      expect(Math.max(...reachY)).toBeLessThanOrEqual((MIN_FIELD_ASPECT * width) / 2);
    }
  });
});

describe('slots (A2, A3)', () => {
  it('puts the slot centres at 1, 3, 5, 7, 9 and 11 o’clock', () => {
    expect(SLOTS.map((slot) => slotMidAngle(slot) / DEG)).toEqual([
      expect.closeTo(30, 6),
      expect.closeTo(90, 6),
      expect.closeTo(150, 6),
      expect.closeTo(210, 6),
      expect.closeTo(270, 6),
      expect.closeTo(330, 6),
    ]);
  });

  it('spans 60° from the disc centre to the rim when there is no gap', () => {
    // Same orientation for an outer ring and for the centre disc (A3).
    const discs: Disc[] = [
      { origin: { x: 50, y: 60 }, radius: 40, gapWidth: 0 },
      { origin: CENTER, radius: 25, gapWidth: 0 },
    ];
    for (const disc of discs) {
      for (const slot of SLOTS) {
        const wedge = slotWedge(disc, slot);
        expectPoint(wedge.origin, disc.origin);
        expectPoint(wedge.apex, disc.origin);
        expect(wedge.radius).toBe(disc.radius);
        expect(wedge.startAngle / DEG).toBeCloseTo(60 * slot, 6);
        expect(wedge.endAngle / DEG).toBeCloseTo(60 * (slot + 1), 6);
      }
    }
  });

  it('stays symmetric about the slot centre when there is a gap', () => {
    const disc: Disc = { origin: CENTER, radius: 60, gapWidth: 4 };
    for (const slot of SLOTS) {
      const wedge = slotWedge(disc, slot);
      expect((wedge.startAngle + wedge.endAngle) / 2 / DEG).toBeCloseTo(30 + 60 * slot, 6);
      expect(wedge.endAngle).toBeGreaterThan(wedge.startAngle);
      expectPoint(
        wedge.apex,
        clock(disc.origin, 30 + 60 * slot, distance(wedge.apex, disc.origin)),
      );
    }
  });

  it('leaves a gap of constant width between neighbouring wedges', () => {
    const disc: Disc = { origin: CENTER, radius: 60, gapWidth: 4 };
    for (const slot of SLOTS) {
      const wedge = slotWedge(disc, slot);
      const next = slotWedge(disc, (slot + 1) % SLOT_COUNT);
      // At the rim: end of this wedge to start of the next one.
      const rimEnd = clock(disc.origin, wedge.endAngle / DEG, disc.radius);
      const rimStart = clock(disc.origin, next.startAngle / DEG, disc.radius);
      expect(distance(rimEnd, rimStart)).toBeCloseTo(disc.gapWidth, 6);
      // At the centre: apex to apex.
      expect(distance(wedge.apex, next.apex)).toBeCloseTo(disc.gapWidth, 6);
    }
  });
});
