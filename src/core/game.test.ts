import { describe, expect, it } from 'vitest';
import {
  CLEAR_POINTS,
  MAX_COMBO_FACTOR,
  MAX_DISCARDS,
  MONO_FACTOR,
  PLACEMENT_POINTS,
  START_DISCARDS,
} from '../config';
import { applyInput, createGame, isBlocked } from './game';
import { createRng, type Rng } from './rng';
import {
  RING_COUNT,
  SLOT_COUNT,
  type GameEvent,
  type GameState,
  type Ring,
  type Segment,
} from './types';

const SEED = 20261113;
/** Time between two inputs. Long enough for the rules of later milestones. */
const STEP_MS = 500;
const RINGS = Array.from({ length: RING_COUNT }, (_, ring) => ring);

/** Ids of hand-built segments stay clear of the ids the game hands out. */
let nextTestId = 1000;

function segment(position: number, color: number): Segment {
  nextTestId += 1;
  return { id: nextTestId, position, color };
}

/** A ring from the colours of its slots. `null` leaves a slot free. */
function ringOf(colors: readonly (number | null)[]): Ring {
  return colors.map((color, slot) => (color === null ? null : segment(slot, color)));
}

const EMPTY: readonly null[] = [null, null, null, null, null, null];

/** A board on which only the given rings hold segments. */
function boardWith(filled: Readonly<Record<number, readonly (number | null)[]>>): Ring[] {
  return RINGS.map((ring) => ringOf(filled[ring] ?? EMPTY));
}

/** A board on which only `position` is taken, in the given rings. */
function boardTakenAt(position: number, rings: readonly number[]): Ring[] {
  return RINGS.map((ring) =>
    ringOf(EMPTY.map((_, slot) => (slot === position && rings.includes(ring) ? 0 : null))),
  );
}

function slotAt(state: GameState, ring: number, slot: number): Segment | null | undefined {
  return state.rings[ring]?.[slot];
}

function filledSlots(state: GameState): number {
  return state.rings.flat().filter((slot) => slot !== null).length;
}

/** A game on the table: keeps the state, the time and the generator together. */
class Table {
  state: GameState;
  private timeMs = 0;
  private readonly rng: Rng;

  constructor(seed = SEED) {
    this.rng = createRng(seed);
    this.state = createGame(this.rng);
  }

  tap(ring: number): readonly GameEvent[] {
    this.timeMs += STEP_MS;
    return this.apply({ type: 'tap', ring, timeMs: this.timeMs });
  }

  /** Swipes the current segment, or the segment with the given id. */
  swipe(segmentId = this.state.current.id): readonly GameEvent[] {
    this.timeMs += STEP_MS;
    return this.apply({ type: 'swipe', segmentId, timeMs: this.timeMs });
  }

  /** Replaces parts of the state to set up a situation. */
  set(patch: Partial<GameState>): void {
    this.state = { ...this.state, ...patch };
  }

  private apply(input: Parameters<typeof applyInput>[1]): readonly GameEvent[] {
    const result = applyInput(this.state, input, this.rng);
    this.state = result.state;
    return result.events;
  }
}

/**
 * A game whose first segment is placed. The first segment of a game gets
 * special rules in milestone 3, so most situations start after it.
 */
function startedTable(seed = SEED): Table {
  const table = new Table(seed);
  table.tap(0);
  return table;
}

function eventTypes(events: readonly GameEvent[]): string[] {
  return events.map((event) => event.type);
}

describe('createGame (A5, A25)', () => {
  it('starts with an empty board, a first segment and the starting stock', () => {
    const state = createGame(createRng(SEED));
    expect(state.rings).toHaveLength(RING_COUNT);
    for (const ring of state.rings) {
      expect(ring).toEqual(EMPTY);
    }
    expect(Number.isInteger(state.current.position)).toBe(true);
    expect(state.current.position).toBeGreaterThanOrEqual(0);
    expect(state.current.position).toBeLessThan(SLOT_COUNT);
    expect(Number.isInteger(state.current.color)).toBe(true);
    expect(state.current.color).toBeGreaterThanOrEqual(0);
    expect(state.current.color).toBeLessThan(6);
    expect(state.discards).toBe(START_DISCARDS);
    expect(state.score).toBe(0);
    expect(state.combo).toBe(0);
    expect(state.moves).toBe(0);
  });
});

describe('placing (A12, A14, A44)', () => {
  it('puts the segment on its position in the tapped ring, whichever ring that is', () => {
    for (const ring of RINGS) {
      const table = new Table();
      const first = table.state.current;
      const events = table.tap(ring);
      expect(slotAt(table.state, ring, first.position)).toEqual(first);
      expect(filledSlots(table.state)).toBe(1);
      expect(events).toContainEqual(
        expect.objectContaining({ type: 'placed', ring, segment: first }),
      );
    }
  });

  it('counts a placement as a move and scores the placement points', () => {
    const table = startedTable();
    const before = table.state;
    const events = table.tap(1);
    expect(table.state.moves).toBe(before.moves + 1);
    expect(table.state.score).toBe(before.score + PLACEMENT_POINTS);
    expect(events).toContainEqual(
      expect.objectContaining({ type: 'placed', points: PLACEMENT_POINTS }),
    );
  });

  it('shows the next segment at once (A14)', () => {
    const table = startedTable();
    const placed = table.state.current;
    const events = table.tap(1);
    expect(table.state.current.id).not.toBe(placed.id);
    expect(table.state.current.position).toBeGreaterThanOrEqual(0);
    expect(table.state.current.position).toBeLessThan(SLOT_COUNT);
    expect(events).toContainEqual({ type: 'spawned', segment: table.state.current });
  });
});

describe('missing (A13)', () => {
  it('keeps the segment in the centre when its slot in the ring is taken', () => {
    const table = startedTable();
    const current = segment(4, 1);
    table.set({ rings: boardTakenAt(4, [2]), current });
    const before = table.state;
    const events = table.tap(2);
    expect(events).toContainEqual(expect.objectContaining({ type: 'missed', ring: 2 }));
    expect(eventTypes(events)).not.toContain('placed');
    expect(table.state.current).toEqual(current);
    expect(table.state.rings).toEqual(before.rings);
    expect(table.state.moves).toBe(before.moves);
  });

  it('accepts any other ring with a free slot after a miss (A12)', () => {
    const table = startedTable();
    const current = segment(4, 1);
    table.set({ rings: boardTakenAt(4, [2]), current });
    table.tap(2);
    const events = table.tap(3);
    expect(slotAt(table.state, 3, 4)).toEqual(current);
    expect(eventTypes(events)).toContain('placed');
  });
});

describe('clearing a ring (A16, A45)', () => {
  it('empties the ring with its sixth segment and scores placement plus clear points', () => {
    const table = startedTable();
    table.set({ rings: boardWith({ 3: [0, 1, 0, 1, 0, null] }), current: segment(5, 1) });
    const before = table.state;
    const events = table.tap(3);
    expect(table.state.rings[3]).toEqual(EMPTY);
    expect(table.state.score).toBe(before.score + PLACEMENT_POINTS + CLEAR_POINTS);
    expect(table.state.discards).toBe(before.discards);
    expect(events).toContainEqual(
      expect.objectContaining({ type: 'cleared', ring: 3, mono: false, points: CLEAR_POINTS }),
    );
  });

  it('leaves a ring with five segments alone', () => {
    const table = startedTable();
    table.set({ rings: boardWith({ 3: [0, 1, 0, 1, null, null] }), current: segment(4, 1) });
    const before = table.state;
    const events = table.tap(3);
    expect(filledSlots(table.state)).toBe(5);
    expect(table.state.score).toBe(before.score + PLACEMENT_POINTS);
    expect(eventTypes(events)).toContain('placed');
    expect(eventTypes(events)).not.toContain('cleared');
  });

  it('leaves the other rings as they are', () => {
    const table = startedTable();
    table.set({
      rings: boardWith({ 1: [2, null, null, 2, null, null], 3: [0, 1, 0, 1, 0, null] }),
      current: segment(5, 1),
    });
    const other = table.state.rings[1];
    table.tap(3);
    expect(table.state.rings[3]).toEqual(EMPTY);
    expect(table.state.rings[1]).toEqual(other);
  });
});

describe('single-colour ring (A17, A18, A25)', () => {
  it('scores three times the clear points and gives one discard back', () => {
    const table = startedTable();
    table.set({
      rings: boardWith({ 4: [2, 2, null, 2, 2, 2] }),
      current: segment(2, 2),
      discards: 2,
    });
    const before = table.state;
    const events = table.tap(4);
    expect(table.state.score).toBe(before.score + PLACEMENT_POINTS + CLEAR_POINTS * MONO_FACTOR);
    expect(table.state.discards).toBe(3);
    expect(events).toContainEqual(
      expect.objectContaining({
        type: 'cleared',
        ring: 4,
        mono: true,
        color: 2,
        discardReturned: true,
      }),
    );
  });

  it('does not count five of one colour and one of another', () => {
    const table = startedTable();
    table.set({
      rings: boardWith({ 4: [2, 2, null, 2, 2, 2] }),
      current: segment(2, 0),
      discards: 2,
    });
    const before = table.state;
    const events = table.tap(4);
    expect(table.state.rings[4]).toEqual(EMPTY);
    expect(table.state.score).toBe(before.score + PLACEMENT_POINTS + CLEAR_POINTS);
    expect(table.state.discards).toBe(2);
    expect(events).toContainEqual(
      expect.objectContaining({ type: 'cleared', mono: false, color: null }),
    );
  });

  it('lets the discard lapse when the stock is full', () => {
    const table = startedTable();
    table.set({
      rings: boardWith({ 4: [2, 2, null, 2, 2, 2] }),
      current: segment(2, 2),
      discards: MAX_DISCARDS,
    });
    const before = table.state;
    const events = table.tap(4);
    expect(table.state.discards).toBe(MAX_DISCARDS);
    expect(table.state.score).toBe(before.score + PLACEMENT_POINTS + CLEAR_POINTS * MONO_FACTOR);
    expect(events).toContainEqual(
      expect.objectContaining({ type: 'cleared', mono: true, discardReturned: false }),
    );
  });
});

describe('combo (A46, A47)', () => {
  /** Two rings that each lack their slot 5. */
  const twoAlmostFull = () => boardWith({ 0: [0, 1, 0, 1, 0, null], 1: [1, 0, 1, 0, 1, null] });

  it('multiplies the clear points by the number of clears in a row', () => {
    const table = startedTable();
    table.set({ rings: twoAlmostFull(), current: segment(5, 1), combo: 0 });
    const start = table.state.score;
    table.tap(0);
    expect(table.state.combo).toBe(1);
    expect(table.state.score).toBe(start + PLACEMENT_POINTS + CLEAR_POINTS);
    table.set({ current: segment(5, 0) });
    const afterFirst = table.state.score;
    const events = table.tap(1);
    expect(table.state.combo).toBe(2);
    expect(table.state.score).toBe(afterFirst + PLACEMENT_POINTS + CLEAR_POINTS * 2);
    expect(events).toContainEqual(expect.objectContaining({ type: 'cleared', combo: 2 }));
  });

  it('caps the factor but keeps counting', () => {
    const table = startedTable();
    table.set({ rings: twoAlmostFull(), current: segment(5, 1), combo: MAX_COMBO_FACTOR });
    const before = table.state.score;
    table.tap(0);
    expect(table.state.combo).toBe(MAX_COMBO_FACTOR + 1);
    expect(table.state.score).toBe(before + PLACEMENT_POINTS + CLEAR_POINTS * MAX_COMBO_FACTOR);
  });

  it('drops to 0 with a placement that clears nothing', () => {
    const table = startedTable();
    table.set({ rings: twoAlmostFull(), current: segment(2, 1), combo: 3 });
    const events = table.tap(4);
    expect(eventTypes(events)).toContain('placed');
    expect(table.state.combo).toBe(0);
  });

  it('survives a miss and a discard', () => {
    const table = startedTable();
    table.set({ rings: twoAlmostFull(), current: segment(2, 1), combo: 3, discards: 2 });
    expect(eventTypes(table.tap(0))).toContain('missed');
    expect(table.state.combo).toBe(3);
    expect(eventTypes(table.swipe())).toContain('discarded');
    expect(table.state.combo).toBe(3);
  });
});

describe('discarding (A26, A14, A8)', () => {
  it('throws the segment away for one discard, without a move', () => {
    const table = startedTable();
    const before = table.state;
    const events = table.swipe();
    expect(table.state.discards).toBe(before.discards - 1);
    expect(before.discards).toBe(START_DISCARDS);
    expect(table.state.moves).toBe(before.moves);
    expect(table.state.score).toBe(before.score);
    expect(table.state.rings).toEqual(before.rings);
    expect(table.state.current.id).not.toBe(before.current.id);
    expect(events).toContainEqual({ type: 'discarded', segment: before.current });
    expect(events).toContainEqual({ type: 'spawned', segment: table.state.current });
  });

  it('ignores a swipe that was meant for a segment that is gone', () => {
    const table = startedTable();
    const seen = table.state.current.id;
    table.tap(1);
    // The finger landed while `seen` was in the centre. It is placed by now.
    expect(table.state.current.id).not.toBe(seen);
    const before = table.state;
    const events = table.swipe(seen);
    expect(events).toEqual([]);
    expect(table.state).toEqual(before);
  });
});

describe('blockade (A29)', () => {
  it('is a blockade exactly when the position is taken in all six rings', () => {
    const table = startedTable();
    table.set({ rings: boardTakenAt(3, RINGS), current: segment(3, 0) });
    expect(isBlocked(table.state)).toBe(true);
    table.set({ rings: boardTakenAt(3, [0, 1, 2, 3, 4]) });
    expect(isBlocked(table.state)).toBe(false);
    table.set({ rings: boardTakenAt(3, RINGS), current: segment(2, 0) });
    expect(isBlocked(table.state)).toBe(false);
  });

  it('rejects a tap in a blockade until a discard brings the next segment', () => {
    const table = startedTable();
    const blocked = segment(3, 0);
    table.set({ rings: boardTakenAt(3, RINGS), current: blocked });
    // Two taps only: from milestone 3 on every miss costs time.
    for (const ring of [0, 3]) {
      expect(eventTypes(table.tap(ring))).toEqual(['missed']);
    }
    expect(table.state.current).toEqual(blocked);
    table.swipe();
    expect(table.state.current.id).not.toBe(blocked.id);
    expect(filledSlots(table.state)).toBe(RING_COUNT);
  });
});

describe('determinism (A35)', () => {
  interface Replay {
    readonly state: GameState;
    readonly events: readonly GameEvent[];
  }

  /** Plays a fixed script of taps and swipes. */
  function play(seed: number): Replay {
    const table = new Table(seed);
    const events: GameEvent[] = [];
    for (let step = 0; step < 60; step += 1) {
      events.push(...(step % 7 === 6 ? table.swipe() : table.tap(step % RING_COUNT)));
    }
    return { state: table.state, events };
  }

  it('replays the same game for the same seed and the same inputs', () => {
    const first = play(11);
    expect(first.events.length).toBeGreaterThan(0);
    expect(play(11)).toEqual(first);
    expect(play(12).events).not.toEqual(first.events);
  });

  it('draws every segment from the generator it was given', () => {
    let calls = 0;
    const source = createRng(SEED);
    const counting: Rng = () => {
      calls += 1;
      return source();
    };
    const state = createGame(counting);
    const afterStart = calls;
    expect(afterStart).toBeGreaterThan(0);
    applyInput(state, { type: 'tap', ring: 0, timeMs: STEP_MS }, counting);
    expect(calls).toBeGreaterThan(afterStart);
  });
});
