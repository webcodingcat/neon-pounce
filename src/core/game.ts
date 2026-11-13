// Rules of a game as pure functions: every step takes the state and returns a
// new one together with the events that happened.

import type { Rng } from './rng';
import {
  RING_COUNT,
  SLOT_COUNT,
  type GameInput,
  type GameState,
  type Ring,
  type StepResult,
} from './types';

function emptyRing(): Ring {
  return Array.from({ length: SLOT_COUNT }, () => null);
}

/** Starts a game: empty board, first segment in the centre. */
export function createGame(_rng: Rng): GameState {
  return {
    rings: Array.from({ length: RING_COUNT }, emptyRing),
    current: { id: 0, position: 0, color: 0 },
    bag: [],
    nextId: 1,
    discards: 0,
    score: 0,
    combo: 0,
    moves: 0,
  };
}

/** Applies a tap on a ring or a swipe. */
export function applyInput(state: GameState, _input: GameInput, _rng: Rng): StepResult {
  return { state, events: [] };
}

/** Blockade: the position of the current segment is taken in all six rings (A29). */
export function isBlocked(_state: GameState): boolean {
  return false;
}
