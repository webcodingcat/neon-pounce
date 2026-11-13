// Rules of a game as pure functions: every step takes the state and returns a
// new one together with the events that happened.

import {
  BLOCKADE_HELP_LAST_LEVEL,
  CLEAR_POINTS,
  COLOR_COUNT,
  DOUBLE_TAP_MS,
  GAME_OVER_FADE_MS,
  MAX_COMBO_FACTOR,
  MAX_DISCARDS,
  MISS_PENALTIES_MS,
  MONO_FACTOR,
  PLACEMENT_POINTS,
  START_DISCARDS,
  START_LIVES,
  TIMER_MS,
} from '../config';
import { drawColor, drawPosition } from './generator';
import type { Rng } from './rng';
import {
  RING_COUNT,
  SLOT_COUNT,
  type GameEvent,
  type GameInput,
  type GameState,
  type Ring,
  type Segment,
  type StepResult,
} from './types';

/**
 * Multiplier of the level. There is only level 1 until milestone 5 brings the
 * levels (A39).
 */
const LEVEL_MULTIPLIER = 1;

type Tap = Extract<GameInput, { type: 'tap' }>;
type Swipe = Extract<GameInput, { type: 'swipe' }>;

/** What the generator state of a game consists of. */
type Supply = Pick<GameState, 'bag' | 'nextId'>;

interface Spawn extends Supply {
  readonly segment: Segment;
}

function emptyRing(): Ring {
  return Array.from({ length: SLOT_COUNT }, () => null);
}

function unchanged(state: GameState): StepResult {
  return { state, events: [] };
}

/** Draws the next segment: position from the bag, colour by chance. */
function spawn(supply: Supply, rng: Rng): Spawn {
  const draw = drawPosition(supply.bag, rng);
  const segment = {
    id: supply.nextId,
    position: draw.position,
    color: drawColor(rng, COLOR_COUNT),
  };
  return { segment, bag: draw.bag, nextId: supply.nextId + 1 };
}

/**
 * Puts the next segment into the centre (A14). It appears at `timeMs`, and its
 * timer starts then with the full time (A19).
 */
function withNextSegment(
  state: GameState,
  events: GameEvent[],
  timeMs: number,
  rng: Rng,
): StepResult {
  const next = spawn(state, rng);
  return {
    state: {
      ...state,
      current: next.segment,
      bag: next.bag,
      nextId: next.nextId,
      spawnedAtMs: timeMs,
      timerMs: TIMER_MS,
      deadlineMs: timeMs + TIMER_MS,
      misses: 0,
    },
    events: [...events, { type: 'spawned', segment: next.segment }],
  };
}

/**
 * Starts a game at time `startMs`: empty board, first segment in the centre.
 * The first segment has no timer (A15).
 */
export function createGame(rng: Rng, startMs = 0): GameState {
  const first = spawn({ bag: [], nextId: 0 }, rng);
  return {
    rings: Array.from({ length: RING_COUNT }, emptyRing),
    current: first.segment,
    bag: first.bag,
    nextId: first.nextId,
    discards: START_DISCARDS,
    score: 0,
    combo: 0,
    moves: 0,
    lives: START_LIVES,
    level: 1,
    spawnedAtMs: startMs,
    timerMs: null,
    deadlineMs: null,
    misses: 0,
    phase: 'playing',
    lostAtMs: null,
  };
}

/** Blockade: the position of the current segment is taken in all six rings (A29). */
export function isBlocked(state: GameState): boolean {
  return state.rings.every((ring) => ring[state.current.position] !== null);
}

/**
 * A timeout or a give-up at `timeMs`: the segment is gone, a life and the combo
 * with it (A21, A27). With the last life the field starts to fade and no
 * further segment appears (A23).
 */
function loseLife(
  state: GameState,
  type: 'timedOut' | 'gaveUp',
  timeMs: number,
  rng: Rng,
): StepResult {
  const showBlockade = isBlocked(state) && state.level <= BLOCKADE_HELP_LAST_LEVEL;
  const events: GameEvent[] = [{ type, segment: state.current, showBlockade }];
  const after: GameState = { ...state, lives: state.lives - 1, combo: 0 };
  if (after.lives > 0) {
    return withNextSegment(after, events, timeMs, rng);
  }
  return { state: { ...after, phase: 'fading', lostAtMs: timeMs }, events };
}

/**
 * Moves the game to time `timeMs` without an input. A timer that ran out by
 * then times out (A21): the next segment appears at `timeMs`, so at most one
 * segment times out per step. After the last life the fade ends (A23).
 */
export function advanceTime(state: GameState, timeMs: number, rng: Rng): StepResult {
  if (state.phase === 'fading') {
    const over = state.lostAtMs !== null && timeMs >= state.lostAtMs + GAME_OVER_FADE_MS;
    return over
      ? { state: { ...state, phase: 'over' }, events: [{ type: 'gameOver' }] }
      : unchanged(state);
  }
  if (state.phase === 'over' || state.deadlineMs === null || timeMs < state.deadlineMs) {
    return unchanged(state);
  }
  return loseLife(state, 'timedOut', timeMs, rng);
}

/**
 * Share of the timer that is left at `timeMs`, from 1 (full) to 0. The first
 * segment of a game has no timer: its arc stays full (A15).
 */
export function timerFraction(state: GameState, timeMs: number): number {
  if (state.deadlineMs === null || state.timerMs === null) {
    return 1;
  }
  return Math.min(1, Math.max(0, (state.deadlineMs - timeMs) / state.timerMs));
}

/** The colour that all segments of a full ring share, or null (A17). */
function sharedColor(ring: Ring): number | null {
  const colors = new Set(ring.map((slot) => slot?.color));
  const [only] = colors;
  return colors.size === 1 && only !== undefined ? only : null;
}

function replaceRing(rings: readonly Ring[], index: number, ring: Ring): Ring[] {
  return rings.map((other, otherIndex) => (otherIndex === index ? ring : other));
}

/** Empties a ring that just got its sixth segment (A16, A17, A45, A46). */
function clearRing(state: GameState, ringIndex: number, ring: Ring): StepResult {
  const color = sharedColor(ring);
  const mono = color !== null;
  const combo = state.combo + 1;
  const points = Math.round(
    CLEAR_POINTS * LEVEL_MULTIPLIER * (mono ? MONO_FACTOR : 1) * Math.min(combo, MAX_COMBO_FACTOR),
  );
  const discardReturned = mono && state.discards < MAX_DISCARDS;
  return {
    state: {
      ...state,
      rings: replaceRing(state.rings, ringIndex, emptyRing()),
      score: state.score + points,
      combo,
      discards: state.discards + (discardReturned ? 1 : 0),
    },
    events: [{ type: 'cleared', ring: ringIndex, mono, color, points, combo, discardReturned }],
  };
}

/**
 * A tap on a ring whose slot is taken (A13). It costs time, more with every
 * miss on the same segment (A20), and never points (A24). When the penalty uses
 * up the rest of the timer, the timeout follows at once (A21).
 */
function miss(state: GameState, tap: Tap, rng: Rng): StepResult {
  const missed: GameEvent = {
    type: 'missed',
    ring: tap.ring,
    position: state.current.position,
  };
  if (state.deadlineMs === null) {
    return { state, events: [missed] };
  }
  const step = Math.min(state.misses, MISS_PENALTIES_MS.length - 1);
  const penalised: GameState = {
    ...state,
    misses: state.misses + 1,
    deadlineMs: state.deadlineMs - (MISS_PENALTIES_MS[step] ?? 0),
  };
  const timeout = advanceTime(penalised, tap.timeMs, rng);
  return { state: timeout.state, events: [missed, ...timeout.events] };
}

/** A tap on a ring: a placement (A12) or a miss (A13). */
function tapRing(state: GameState, tap: Tap, rng: Rng): StepResult {
  const ring = state.rings[tap.ring];
  // A tap that began before the segment appeared or right after it is not
  // meant for it (A9).
  if (ring === undefined || tap.timeMs < state.spawnedAtMs + DOUBLE_TAP_MS) {
    return unchanged(state);
  }
  const segment = state.current;
  if (ring[segment.position] !== null) {
    return miss(state, tap, rng);
  }
  const filled = ring.map((slot, position) => (position === segment.position ? segment : slot));
  const points = Math.round(PLACEMENT_POINTS * LEVEL_MULTIPLIER);
  const placed: GameState = {
    ...state,
    rings: replaceRing(state.rings, tap.ring, filled),
    score: state.score + points,
    moves: state.moves + 1,
  };
  const events: GameEvent[] = [{ type: 'placed', segment, ring: tap.ring, points }];
  if (filled.includes(null)) {
    // A placement that clears nothing ends the combo (A47).
    return withNextSegment({ ...placed, combo: 0 }, events, tap.timeMs, rng);
  }
  const cleared = clearRing(placed, tap.ring, filled);
  return withNextSegment(cleared.state, [...events, ...cleared.events], tap.timeMs, rng);
}

/**
 * A swipe: throws the segment away for one discard (A26). Without a discard in
 * stock it gives the segment up (A27). The first segment of a game stays (A15).
 */
function swipeSegment(state: GameState, swipe: Swipe, rng: Rng): StepResult {
  // The swipe was meant for a segment that is gone (A8).
  if (swipe.segmentId !== state.current.id) {
    return unchanged(state);
  }
  if (state.timerMs === null) {
    return { state, events: [{ type: 'bounced', segment: state.current }] };
  }
  if (state.discards < 1) {
    return loseLife(state, 'gaveUp', swipe.timeMs, rng);
  }
  const events: GameEvent[] = [{ type: 'discarded', segment: state.current }];
  return withNextSegment({ ...state, discards: state.discards - 1 }, events, swipe.timeMs, rng);
}

/**
 * Applies a tap on a ring or a swipe. Time passes first: a timer that ran out
 * before the input times out. The board only reacts during play (A10).
 */
export function applyInput(state: GameState, input: GameInput, rng: Rng): StepResult {
  const due = advanceTime(state, input.timeMs, rng);
  if (due.state.phase !== 'playing') {
    return due;
  }
  const step =
    input.type === 'tap' ? tapRing(due.state, input, rng) : swipeSegment(due.state, input, rng);
  return { state: step.state, events: [...due.events, ...step.events] };
}
