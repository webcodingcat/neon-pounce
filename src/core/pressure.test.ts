// Rules of milestone 3: timer, misses that cost time, lives, giving up and the
// end of a game.

import { describe, expect, it } from 'vitest';
import {
  BLOCKADE_HELP_LAST_LEVEL,
  DOUBLE_TAP_MS,
  GAME_OVER_FADE_MS,
  MISS_PENALTIES_MS,
  START_LIVES,
  TIMER_MS,
} from '../config';
import { advanceTime, applyInput, createGame, timerFraction } from './game';
import { createRng, type Rng } from './rng';
import {
  RING_COUNT,
  type GameEvent,
  type GameState,
  type Ring,
  type Segment,
  type StepResult,
} from './types';

const SEED = 20261113;
/** Time at which the first segment of a started table is placed. */
const FIRST_PLACED_MS = 500;
/** A time far away, for situations that must not be disturbed by the timer. */
const FAR_MS = 1_000_000;
const RINGS = Array.from({ length: RING_COUNT }, (_, ring) => ring);
const EMPTY: readonly null[] = [null, null, null, null, null, null];

/** Ids of hand-built segments stay clear of the ids the game hands out. */
let nextTestId = 1000;

function segment(position: number, color: number): Segment {
  nextTestId += 1;
  return { id: nextTestId, position, color };
}

function ringOf(colors: readonly (number | null)[]): Ring {
  return colors.map((color, slot) => (color === null ? null : segment(slot, color)));
}

/** A board on which only `position` is taken, in the given rings. */
function boardTakenAt(position: number, rings: readonly number[]): Ring[] {
  return RINGS.map((ring) =>
    ringOf(EMPTY.map((_, slot) => (slot === position && rings.includes(ring) ? 0 : null))),
  );
}

function eventTypes(events: readonly GameEvent[]): string[] {
  return events.map((event) => event.type);
}

/** A game on the table. Every step names its time. */
class Table {
  state: GameState;
  private readonly rng: Rng;

  constructor(startMs = 0, seed = SEED) {
    this.rng = createRng(seed);
    this.state = createGame(this.rng, startMs);
  }

  tap(ring: number, timeMs: number): readonly GameEvent[] {
    return this.take(applyInput(this.state, { type: 'tap', ring, timeMs }, this.rng));
  }

  /** Swipes the segment that is in the centre. */
  swipe(timeMs: number): readonly GameEvent[] {
    const input = { type: 'swipe', segmentId: this.state.current.id, timeMs } as const;
    return this.take(applyInput(this.state, input, this.rng));
  }

  advance(timeMs: number): readonly GameEvent[] {
    return this.take(advanceTime(this.state, timeMs, this.rng));
  }

  set(patch: Partial<GameState>): void {
    this.state = { ...this.state, ...patch };
  }

  /** Time at which the timer of the current segment ends. Fails for the first segment. */
  get deadline(): number {
    expect(this.state.deadlineMs).not.toBeNull();
    return this.state.deadlineMs ?? Number.NaN;
  }

  private take(result: StepResult): readonly GameEvent[] {
    this.state = result.state;
    return result.events;
  }
}

/** A game whose first segment was placed at `FIRST_PLACED_MS`. */
function startedTable(): Table {
  const table = new Table();
  table.tap(0, FIRST_PLACED_MS);
  return table;
}

/**
 * A started game in which the current segment meets a taken slot in ring 2 and
 * has `timeLeftMs` on its timer at `FIRST_PLACED_MS`.
 */
function tableWithTakenSlot(timeLeftMs: number): Table {
  const table = startedTable();
  table.set({
    rings: boardTakenAt(4, [2]),
    current: segment(4, 1),
    deadlineMs: FIRST_PLACED_MS + timeLeftMs,
    misses: 0,
  });
  return table;
}

/** A started game in which the position of the current segment is taken everywhere. */
function blockedTable(): Table {
  const table = startedTable();
  table.set({ rings: boardTakenAt(3, RINGS), current: segment(3, 0) });
  return table;
}

/** Lets the timer run out until the last life is gone. Returns the time of the loss. */
function loseAllLives(table: Table): number {
  let lostAt = 0;
  for (let life = 0; life < START_LIVES; life += 1) {
    lostAt = table.deadline;
    table.advance(lostAt);
  }
  expect(table.state.lives).toBe(0);
  return lostAt;
}

describe('first segment (A15)', () => {
  it('has no timer and waits without limit', () => {
    const table = new Table();
    const first = table.state.current;
    expect(table.state.deadlineMs).toBeNull();
    expect(table.advance(FAR_MS)).toEqual([]);
    expect(table.state.current).toEqual(first);
    expect(table.state.lives).toBe(START_LIVES);
  });

  it('cannot be discarded: a swipe makes it bounce and leaves the stock alone', () => {
    const table = new Table();
    const before = table.state;
    const events = table.swipe(FIRST_PLACED_MS);
    expect(events).toEqual([{ type: 'bounced', segment: before.current }]);
    expect(table.state).toEqual(before);
  });

  it('bounces even with an empty stock, without costing a life', () => {
    const table = new Table();
    table.set({ discards: 0 });
    expect(eventTypes(table.swipe(FIRST_PLACED_MS))).toEqual(['bounced']);
    expect(table.state.lives).toBe(START_LIVES);
  });
});

describe('timer (A19, A21, A24)', () => {
  it('gives every segment after the first the full time, from the moment it appears', () => {
    const table = startedTable();
    expect(table.state.spawnedAtMs).toBe(FIRST_PLACED_MS);
    expect(table.state.timerMs).toBe(TIMER_MS);
    expect(table.state.deadlineMs).toBe(FIRST_PLACED_MS + TIMER_MS);
    table.tap(1, FIRST_PLACED_MS + 700);
    expect(table.state.deadlineMs).toBe(FIRST_PLACED_MS + 700 + TIMER_MS);
  });

  it('reports the share of the timer that is left, and a full arc for the first segment', () => {
    const fresh = new Table();
    expect(timerFraction(fresh.state, FAR_MS)).toBe(1);
    const table = startedTable();
    expect(timerFraction(table.state, FIRST_PLACED_MS)).toBe(1);
    expect(timerFraction(table.state, FIRST_PLACED_MS + TIMER_MS / 4)).toBeCloseTo(0.75);
    expect(timerFraction(table.state, FIRST_PLACED_MS + TIMER_MS)).toBe(0);
    expect(timerFraction(table.state, FAR_MS)).toBe(0);
  });

  it('times out exactly when the timer reaches 0', () => {
    const table = startedTable();
    table.set({ combo: 3 });
    const before = table.state;
    expect(table.advance(table.deadline - 1)).toEqual([]);
    expect(table.state).toEqual(before);
    const events = table.advance(before.deadlineMs ?? 0);
    expect(events).toEqual([
      { type: 'timedOut', segment: before.current, showBlockade: false },
      { type: 'spawned', segment: table.state.current },
    ]);
    // The segment is gone, a life and the combo with it. Points stay (A24).
    expect(table.state.current.id).not.toBe(before.current.id);
    expect(table.state.lives).toBe(before.lives - 1);
    expect(table.state.combo).toBe(0);
    expect(table.state.score).toBe(before.score);
    expect(table.state.moves).toBe(before.moves);
    expect(table.state.rings).toEqual(before.rings);
    expect(table.state.discards).toBe(before.discards);
  });

  it('starts the timer of the next segment at the moment it appears', () => {
    const table = startedTable();
    // The step that notices the timeout comes late.
    const noticedAt = table.deadline + 250;
    table.advance(noticedAt);
    expect(table.state.spawnedAtMs).toBe(noticedAt);
    expect(table.state.deadlineMs).toBe(noticedAt + TIMER_MS);
  });

  it('drops a tap that comes after the timer ran out', () => {
    const table = startedTable();
    const lapsed = table.state.current;
    const before = table.state;
    // The next segment appears with this tap, so the tap cannot be meant for it (A9).
    const events = table.tap(1, table.deadline + 500);
    expect(eventTypes(events)).toEqual(['timedOut', 'spawned']);
    expect(events[0]).toMatchObject({ segment: lapsed });
    expect(table.state.rings).toEqual(before.rings);
    expect(table.state.lives).toBe(START_LIVES - 1);
  });

  it('times out only one segment per step, however much time passed', () => {
    const table = startedTable();
    const events = table.advance(FAR_MS);
    expect(eventTypes(events)).toEqual(['timedOut', 'spawned']);
    expect(table.state.lives).toBe(START_LIVES - 1);
    expect(table.state.deadlineMs).toBe(FAR_MS + TIMER_MS);
  });
});

describe('penalties of the configuration (A20)', () => {
  it('rise from miss to miss', () => {
    expect(MISS_PENALTIES_MS.length).toBeGreaterThan(1);
    MISS_PENALTIES_MS.slice(1).forEach((penalty, index) => {
      expect(penalty).toBeGreaterThan(MISS_PENALTIES_MS[index] ?? Infinity);
    });
  });

  it('add up to more than the longest timer, so trying every ring never pays', () => {
    const sum = MISS_PENALTIES_MS.reduce((total, penalty) => total + penalty, 0);
    expect(sum).toBeGreaterThan(TIMER_MS);
  });
});

describe('penalty for a miss (A13, A20, A21, A24)', () => {
  it('takes more time with every miss on the same segment, the last value from then on', () => {
    const table = tableWithTakenSlot(FAR_MS);
    const score = table.state.score;
    const penalties = [...MISS_PENALTIES_MS, MISS_PENALTIES_MS.at(-1) ?? 0];
    expect(penalties).toHaveLength(5);
    penalties.forEach((penalty, index) => {
      const before = table.deadline;
      const events = table.tap(2, FIRST_PLACED_MS + (index + 1) * 200);
      expect(eventTypes(events)).toEqual(['missed']);
      expect(before - table.deadline).toBe(penalty);
    });
    // Misses never cost points, the timer is the only penalty (A24).
    expect(table.state.score).toBe(score);
    expect(table.state.lives).toBe(START_LIVES);
  });

  it('starts again with the first value for the next segment', () => {
    const table = tableWithTakenSlot(FAR_MS);
    table.tap(2, FIRST_PLACED_MS + 200);
    table.tap(2, FIRST_PLACED_MS + 400);
    expect(eventTypes(table.tap(3, FIRST_PLACED_MS + 600))).toContain('placed');
    table.set({ rings: boardTakenAt(1, [5]), current: segment(1, 0) });
    const before = table.deadline;
    expect(eventTypes(table.tap(5, FIRST_PLACED_MS + 800))).toEqual(['missed']);
    expect(before - table.deadline).toBe(MISS_PENALTIES_MS[0]);
  });

  it('times out at once when the penalty uses up the rest of the timer (A21)', () => {
    const firstPenalty = MISS_PENALTIES_MS[0] ?? 0;
    const table = tableWithTakenSlot(firstPenalty + 200);
    const missed = table.state.current;
    // 200 ms are gone, so exactly the penalty is left.
    const tapAt = FIRST_PLACED_MS + 200;
    const events = table.tap(2, tapAt);
    expect(eventTypes(events)).toEqual(['missed', 'timedOut', 'spawned']);
    expect(events[1]).toMatchObject({ segment: missed });
    expect(table.state.lives).toBe(START_LIVES - 1);
    expect(table.state.spawnedAtMs).toBe(tapAt);
    expect(table.state.deadlineMs).toBe(tapAt + TIMER_MS);
  });

  it('leaves time on the timer when the penalty is smaller than the rest', () => {
    const firstPenalty = MISS_PENALTIES_MS[0] ?? 0;
    const table = tableWithTakenSlot(firstPenalty + 201);
    expect(eventTypes(table.tap(2, FIRST_PLACED_MS + 200))).toEqual(['missed']);
    expect(table.state.lives).toBe(START_LIVES);
  });
});

describe('protection against double taps (A9)', () => {
  it('drops a tap in the first 100 ms after the segment appeared, without feedback', () => {
    const table = startedTable();
    const before = table.state;
    expect(table.tap(1, FIRST_PLACED_MS + DOUBLE_TAP_MS - 1)).toEqual([]);
    expect(table.state).toEqual(before);
    expect(eventTypes(table.tap(1, FIRST_PLACED_MS + DOUBLE_TAP_MS))).toContain('placed');
  });

  it('drops a tap that began before the segment appeared', () => {
    const table = startedTable();
    const before = table.state;
    expect(table.tap(1, FIRST_PLACED_MS - 1)).toEqual([]);
    expect(table.state).toEqual(before);
  });

  it('does not count a dropped tap on a taken slot as a miss', () => {
    const table = tableWithTakenSlot(TIMER_MS);
    const before = table.state;
    expect(table.tap(2, FIRST_PLACED_MS + DOUBLE_TAP_MS - 1)).toEqual([]);
    expect(table.state).toEqual(before);
  });

  it('protects the first segment of a game as well', () => {
    const table = new Table(1000);
    expect(table.tap(0, 1000 + DOUBLE_TAP_MS - 1)).toEqual([]);
    expect(eventTypes(table.tap(0, 1000 + DOUBLE_TAP_MS))).toContain('placed');
  });

  it('does not hold back a swipe', () => {
    const table = startedTable();
    expect(eventTypes(table.swipe(FIRST_PLACED_MS + 1))).toContain('discarded');
  });
});

describe('giving up (A27)', () => {
  it('gives the segment up on a swipe with an empty stock, like a timeout', () => {
    const table = startedTable();
    table.set({ discards: 0, combo: 2 });
    const before = table.state;
    const swipeAt = FIRST_PLACED_MS + 300;
    const events = table.swipe(swipeAt);
    expect(events).toEqual([
      { type: 'gaveUp', segment: before.current, showBlockade: false },
      { type: 'spawned', segment: table.state.current },
    ]);
    expect(table.state.current.id).not.toBe(before.current.id);
    expect(table.state.lives).toBe(before.lives - 1);
    expect(table.state.combo).toBe(0);
    expect(table.state.discards).toBe(0);
    expect(table.state.score).toBe(before.score);
    expect(table.state.moves).toBe(before.moves);
    expect(table.state.deadlineMs).toBe(swipeAt + TIMER_MS);
  });
});

describe('showing a blockade (A30)', () => {
  it('lights up the taken slots after a timeout in a blockade', () => {
    const table = blockedTable();
    expect(table.advance(table.deadline)[0]).toMatchObject({
      type: 'timedOut',
      showBlockade: true,
    });
  });

  it('lights up the taken slots after giving up in a blockade', () => {
    const table = blockedTable();
    table.set({ discards: 0 });
    expect(table.swipe(FIRST_PLACED_MS + 300)[0]).toMatchObject({
      type: 'gaveUp',
      showBlockade: true,
    });
  });

  it('shows nothing when one ring still has the slot free', () => {
    const table = blockedTable();
    table.set({ rings: boardTakenAt(3, [0, 1, 2, 3, 4]) });
    expect(table.advance(table.deadline)[0]).toMatchObject({
      type: 'timedOut',
      showBlockade: false,
    });
  });

  it('shows a blockade up to the last level with help and not beyond', () => {
    const helped = blockedTable();
    helped.set({ level: BLOCKADE_HELP_LAST_LEVEL });
    expect(helped.advance(helped.deadline)[0]).toMatchObject({ showBlockade: true });
    const alone = blockedTable();
    alone.set({ level: BLOCKADE_HELP_LAST_LEVEL + 1 });
    expect(alone.advance(alone.deadline)[0]).toMatchObject({
      type: 'timedOut',
      showBlockade: false,
    });
  });
});

describe('lives and the end of a game (A22, A23, A10)', () => {
  it('starts with the lives of the configuration and never gives one back', () => {
    const table = startedTable();
    expect(table.state.lives).toBe(START_LIVES);
    table.advance(table.deadline);
    expect(table.state.lives).toBe(START_LIVES - 1);
    // A single-colour ring gives a discard back, but no life.
    const at = table.state.spawnedAtMs + 500;
    table.set({
      rings: RINGS.map((ring) => ringOf(ring === 4 ? [2, 2, null, 2, 2, 2] : EMPTY)),
      current: segment(2, 2),
    });
    expect(eventTypes(table.tap(4, at))).toContain('cleared');
    expect(table.state.lives).toBe(START_LIVES - 1);
  });

  it('stops with the last life: no next segment, the field fades', () => {
    const table = startedTable();
    table.set({ lives: 1 });
    const last = table.state.current;
    const deadline = table.deadline;
    const events = table.advance(deadline);
    expect(eventTypes(events)).toEqual(['timedOut']);
    expect(table.state.lives).toBe(0);
    expect(table.state.phase).toBe('fading');
    expect(table.state.lostAtMs).toBe(deadline);
    expect(table.state.current).toEqual(last);
  });

  it('ends by giving up the last life as well', () => {
    const table = startedTable();
    table.set({ lives: 1, discards: 0 });
    const swipeAt = FIRST_PLACED_MS + 300;
    expect(eventTypes(table.swipe(swipeAt))).toEqual(['gaveUp']);
    expect(table.state.phase).toBe('fading');
    expect(table.state.lostAtMs).toBe(swipeAt);
  });

  it('shows Game Over when the fade is over, once', () => {
    const table = startedTable();
    const lostAt = loseAllLives(table);
    expect(table.state.phase).toBe('fading');
    expect(table.advance(lostAt + GAME_OVER_FADE_MS - 1)).toEqual([]);
    expect(table.state.phase).toBe('fading');
    expect(table.advance(lostAt + GAME_OVER_FADE_MS)).toEqual([{ type: 'gameOver' }]);
    expect(table.state.phase).toBe('over');
    expect(table.advance(FAR_MS)).toEqual([]);
    expect(table.state.phase).toBe('over');
  });

  it('ignores the board while it fades and when the game is over (A10)', () => {
    const table = startedTable();
    const lostAt = loseAllLives(table);
    const fading = table.state;
    expect(table.tap(1, lostAt + 300)).toEqual([]);
    expect(table.swipe(lostAt + 400)).toEqual([]);
    expect(table.state).toEqual(fading);
    table.advance(lostAt + GAME_OVER_FADE_MS);
    const over = table.state;
    expect(table.tap(1, lostAt + GAME_OVER_FADE_MS + 600)).toEqual([]);
    expect(table.swipe(lostAt + GAME_OVER_FADE_MS + 700)).toEqual([]);
    expect(table.state).toEqual(over);
  });
});

describe('determinism with time (A35)', () => {
  interface Replay {
    readonly state: GameState;
    readonly events: readonly GameEvent[];
  }

  /** Plays a fixed script. Every seventh step waits for the timer instead of tapping. */
  function play(seed: number): Replay {
    const table = new Table(0, seed);
    const events: GameEvent[] = [...table.tap(0, FIRST_PLACED_MS)];
    let timeMs = FIRST_PLACED_MS;
    for (let step = 0; step < 12; step += 1) {
      if (step % 7 === 3) {
        timeMs = table.state.deadlineMs ?? timeMs;
        events.push(...table.advance(timeMs));
      } else {
        timeMs += 300;
        events.push(...table.tap(step % RING_COUNT, timeMs));
      }
    }
    return { state: table.state, events };
  }

  it('replays the same game for the same seed and the same inputs at the same times', () => {
    const first = play(11);
    expect(eventTypes(first.events)).toContain('timedOut');
    expect(play(11)).toEqual(first);
  });
});
