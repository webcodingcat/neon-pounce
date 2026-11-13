// Rules of a game as pure functions: every step takes the state and returns a
// new one together with the events that happened.

import {
  CLEAR_POINTS,
  COLOR_COUNT,
  MAX_COMBO_FACTOR,
  MAX_DISCARDS,
  MONO_FACTOR,
  PLACEMENT_POINTS,
  START_DISCARDS,
  START_LIVES,
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

/** What the generator state of a game consists of. */
type Supply = Pick<GameState, 'bag' | 'nextId'>;

interface Spawn extends Supply {
  readonly segment: Segment;
}

function emptyRing(): Ring {
  return Array.from({ length: SLOT_COUNT }, () => null);
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

/** Puts the next segment into the centre (A14). */
function withNextSegment(state: GameState, events: GameEvent[], rng: Rng): StepResult {
  const next = spawn(state, rng);
  return {
    state: { ...state, current: next.segment, bag: next.bag, nextId: next.nextId },
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

/**
 * Moves the game to time `timeMs` without an input: every timer that ran out
 * by then times out (A21), and the fade after the last life ends (A23).
 */
export function advanceTime(state: GameState, _timeMs: number, _rng: Rng): StepResult {
  return { state, events: [] };
}

/**
 * Share of the timer that is left at `timeMs`, from 1 (full) to 0. The first
 * segment of a game has no timer: its arc stays full (A15).
 */
export function timerFraction(_state: GameState, _timeMs: number): number {
  return 1;
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

/** A tap on a ring: a placement (A12) or a miss (A13). */
function tapRing(state: GameState, ringIndex: number, rng: Rng): StepResult {
  const ring = state.rings[ringIndex];
  const segment = state.current;
  if (ring === undefined) {
    return { state, events: [] };
  }
  if (ring[segment.position] !== null) {
    return { state, events: [{ type: 'missed', ring: ringIndex, position: segment.position }] };
  }
  const filled = ring.map((slot, position) => (position === segment.position ? segment : slot));
  const points = Math.round(PLACEMENT_POINTS * LEVEL_MULTIPLIER);
  const placed: GameState = {
    ...state,
    rings: replaceRing(state.rings, ringIndex, filled),
    score: state.score + points,
    moves: state.moves + 1,
  };
  const events: GameEvent[] = [{ type: 'placed', segment, ring: ringIndex, points }];
  if (filled.includes(null)) {
    // A placement that clears nothing ends the combo (A47).
    return withNextSegment({ ...placed, combo: 0 }, events, rng);
  }
  const cleared = clearRing(placed, ringIndex, filled);
  return withNextSegment(cleared.state, [...events, ...cleared.events], rng);
}

/** A swipe: throws the segment away for one discard (A26). */
function swipe(state: GameState, segmentId: number, rng: Rng): StepResult {
  // The swipe was meant for a segment that is gone (A8).
  if (segmentId !== state.current.id) {
    return { state, events: [] };
  }
  // Until milestone 3 a swipe without a discard in stock does nothing.
  if (state.discards < 1) {
    return { state, events: [] };
  }
  const events: GameEvent[] = [{ type: 'discarded', segment: state.current }];
  return withNextSegment({ ...state, discards: state.discards - 1 }, events, rng);
}

/** Applies a tap on a ring or a swipe. */
export function applyInput(state: GameState, input: GameInput, rng: Rng): StepResult {
  return input.type === 'tap'
    ? tapRing(state, input.ring, rng)
    : swipe(state, input.segmentId, rng);
}

/** Blockade: the position of the current segment is taken in all six rings (A29). */
export function isBlocked(state: GameState): boolean {
  return state.rings.every((ring) => ring[state.current.position] !== null);
}
