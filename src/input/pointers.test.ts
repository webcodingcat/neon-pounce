import { describe, expect, it } from 'vitest';
import type { GameInput } from '../core/types';
import { boardGeometry, pointAt, ringCenter, type Point } from '../view/geometry';
import {
  createPointerTracker,
  pointerDown,
  pointerMove,
  pointerUp,
  type PointerTracker,
} from './pointers';

const GEOMETRY = boardGeometry({ x: 180, y: 320 }, 360);
const CENTER = GEOMETRY.center;
/** Inside the centre disc, off its middle. */
const IN_CENTER = pointAt(CENTER, 1, GEOMETRY.centerRadius / 2);
/** Just outside the centre disc, between it and the rings. */
const LEFT_CENTER = pointAt(CENTER, 1, GEOMETRY.centerRadius + 2);
const OUTSIDE: Point = { x: 2, y: 2 };

/** Fingers on a board: keeps the tracker and collects what it reports. */
class Fingers {
  private tracker: PointerTracker = createPointerTracker();

  /** `segmentId` is the segment in the centre at that moment. */
  down(id: number, point: Point, timeMs: number, segmentId = 1): GameInput | null {
    const result = pointerDown(
      this.tracker,
      { id, point, timeMs },
      { geometry: GEOMETRY, segmentId },
    );
    this.tracker = result.tracker;
    return result.input;
  }

  move(id: number, point: Point, timeMs: number): GameInput | null {
    const result = pointerMove(this.tracker, { id, point, timeMs }, GEOMETRY);
    this.tracker = result.tracker;
    return result.input;
  }

  up(id: number): void {
    this.tracker = pointerUp(this.tracker, id);
  }
}

describe('taps (A6, A7)', () => {
  it('turns a finger that lands on a ring into a tap at once, and ignores one beside the discs', () => {
    const fingers = new Fingers();
    expect(fingers.down(1, ringCenter(GEOMETRY, 2), 700)).toEqual({
      type: 'tap',
      ring: 2,
      timeMs: 700,
    });
    expect(fingers.down(2, OUTSIDE, 800)).toBeNull();
  });

  it('counts every finger as a tap of its own, in the order of arrival', () => {
    const fingers = new Fingers();
    // No finger lifts in between.
    expect(fingers.down(1, ringCenter(GEOMETRY, 1), 100)).toMatchObject({ type: 'tap', ring: 1 });
    expect(fingers.down(2, ringCenter(GEOMETRY, 4), 110)).toMatchObject({ type: 'tap', ring: 4 });
    expect(fingers.down(3, ringCenter(GEOMETRY, 1), 120)).toMatchObject({ type: 'tap', ring: 1 });
  });

  it('keeps a finger that landed on a ring a tap, even if it then crosses the centre', () => {
    const fingers = new Fingers();
    expect(fingers.down(1, ringCenter(GEOMETRY, 0), 100)).toMatchObject({ type: 'tap', ring: 0 });
    expect(fingers.move(1, IN_CENTER, 150)).toBeNull();
    expect(fingers.move(1, LEFT_CENTER, 200)).toBeNull();
  });
});

describe('swipes (A8)', () => {
  it('swipes as soon as the finger leaves the centre disc, once, for the segment it saw', () => {
    const fingers = new Fingers();
    expect(fingers.down(1, CENTER, 100, 7)).toBeNull();
    expect(fingers.move(1, IN_CENTER, 150)).toBeNull();
    // The finger is still down. Segment 7 was in the centre when it landed.
    expect(fingers.move(1, LEFT_CENTER, 200)).toEqual({
      type: 'swipe',
      segmentId: 7,
      timeMs: 200,
    });
    expect(fingers.move(1, OUTSIDE, 250)).toBeNull();
    expect(fingers.move(1, IN_CENTER, 300)).toBeNull();
    expect(fingers.move(1, LEFT_CENTER, 350)).toBeNull();
  });

  it('swipes even when the finger leaves the centre straight into a ring', () => {
    const fingers = new Fingers();
    fingers.down(1, CENTER, 100, 7);
    expect(fingers.move(1, ringCenter(GEOMETRY, 3), 200)).toEqual({
      type: 'swipe',
      segmentId: 7,
      timeMs: 200,
    });
  });

  it('tracks two fingers on the centre separately', () => {
    const fingers = new Fingers();
    fingers.down(1, CENTER, 100, 7);
    fingers.down(2, IN_CENTER, 110, 7);
    expect(fingers.move(2, LEFT_CENTER, 200)).toMatchObject({ type: 'swipe', segmentId: 7 });
    expect(fingers.move(1, LEFT_CENTER, 210)).toMatchObject({ type: 'swipe', segmentId: 7 });
  });

  it('does nothing for a tap on the centre that never leaves it', () => {
    const fingers = new Fingers();
    expect(fingers.down(1, CENTER, 100, 7)).toBeNull();
    expect(fingers.move(1, IN_CENTER, 150)).toBeNull();
    fingers.up(1);
    // The finger is gone. A late report about it must not swipe.
    expect(fingers.move(1, LEFT_CENTER, 200)).toBeNull();
  });
});

describe('inputs without a beginning (A10)', () => {
  it('ignores the move of a finger it never saw land', () => {
    const fingers = new Fingers();
    expect(fingers.move(5, IN_CENTER, 100)).toBeNull();
    expect(fingers.move(5, LEFT_CENTER, 150)).toBeNull();
  });
});
