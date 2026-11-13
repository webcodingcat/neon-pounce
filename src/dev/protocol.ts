// Protocol of a game for the dev server (A109): one record per segment, plus
// seed, configuration and final state once per game. Pure functions, the
// export itself lives in exportProtocol.ts.

import {
  BAG_COPIES,
  COLOR_COUNT,
  DOUBLE_TAP_MS,
  MAX_DISCARDS,
  MISS_PENALTIES_MS,
  START_DISCARDS,
  START_LIVES,
  TIMER_MS,
} from '../config';
import type { GameEvent, GameState, StepResult } from '../core/types';

/** How a segment ended. */
export type SegmentOutcome = 'placed' | 'discarded' | 'timeout' | 'givenUp';

export interface SegmentRecord {
  /** Serial number within the game, from 1. */
  readonly number: number;
  /** Kind of segment. Bonus kinds follow in milestone 8. */
  readonly kind: 'normal';
  readonly position: number;
  readonly color: number;
  /** Level in which the segment appeared. */
  readonly level: number;
  /** Full time of its timer, or null for the first segment. */
  readonly timerMs: number | null;
  /** Time from its appearance to its end. */
  readonly decisionMs: number;
  readonly misses: number;
  readonly outcome: SegmentOutcome;
  /** Ring it was placed into, otherwise null. */
  readonly ring: number | null;
}

/** The values of src/config.ts that shape a game. */
export type ProtocolConfig = Readonly<Record<string, number | readonly number[]>>;

export interface ProtocolResult {
  readonly score: number;
  readonly moves: number;
  readonly level: number;
  readonly lives: number;
  readonly discards: number;
}

export interface GameProtocol {
  readonly seed: number;
  readonly config: ProtocolConfig;
  readonly segments: readonly SegmentRecord[];
  readonly result: ProtocolResult;
}

/** The segment in the centre, as far as its record is known. */
interface OpenSegment {
  readonly position: number;
  readonly color: number;
  readonly level: number;
  readonly timerMs: number | null;
  readonly sinceMs: number;
  readonly misses: number;
}

export interface ProtocolRecorder {
  readonly seed: number;
  readonly segments: readonly SegmentRecord[];
  readonly open: OpenSegment | null;
}

/** The segment in the centre of `state`, which appeared at `sinceMs`. */
function openSegment(state: GameState, sinceMs: number): OpenSegment {
  return {
    position: state.current.position,
    color: state.current.color,
    level: state.level,
    timerMs: state.timerMs,
    sinceMs,
    misses: 0,
  };
}

/** Starts the protocol of a game that was just created at `timeMs`. */
export function startProtocol(seed: number, state: GameState, timeMs: number): ProtocolRecorder {
  return { seed, segments: [], open: openSegment(state, timeMs) };
}

const OUTCOMES: Partial<Record<GameEvent['type'], SegmentOutcome>> = {
  placed: 'placed',
  discarded: 'discarded',
  timedOut: 'timeout',
  gaveUp: 'givenUp',
};

/** Closes the record of the segment in the centre. */
function close(recorder: ProtocolRecorder, event: GameEvent, timeMs: number): ProtocolRecorder {
  const outcome = OUTCOMES[event.type];
  const open = recorder.open;
  if (outcome === undefined || open === null) {
    return recorder;
  }
  const record: SegmentRecord = {
    number: recorder.segments.length + 1,
    kind: 'normal',
    position: open.position,
    color: open.color,
    level: open.level,
    timerMs: open.timerMs,
    decisionMs: timeMs - open.sinceMs,
    misses: open.misses,
    outcome,
    ring: event.type === 'placed' ? event.ring : null,
  };
  return { ...recorder, segments: [...recorder.segments, record], open: null };
}

/**
 * Adds what one step of the game did. `timeMs` is the time of the step, the
 * same that the rule core received: every event of the step happened then.
 */
export function recordStep(
  recorder: ProtocolRecorder,
  result: StepResult,
  timeMs: number,
): ProtocolRecorder {
  let next = recorder;
  for (const event of result.events) {
    if (event.type === 'missed' && next.open !== null) {
      next = { ...next, open: { ...next.open, misses: next.open.misses + 1 } };
    } else if (event.type === 'spawned') {
      // A step spawns at most one segment, the one that is in the centre now.
      next = { ...next, open: openSegment(result.state, timeMs) };
    } else {
      next = close(next, event, timeMs);
    }
  }
  return next;
}

/** The values of the configuration that shape a game. */
function protocolConfig(): ProtocolConfig {
  return {
    timerMs: TIMER_MS,
    colorCount: COLOR_COUNT,
    bagCopies: BAG_COPIES,
    startLives: START_LIVES,
    startDiscards: START_DISCARDS,
    maxDiscards: MAX_DISCARDS,
    missPenaltiesMs: MISS_PENALTIES_MS,
    doubleTapMs: DOUBLE_TAP_MS,
  };
}

/** The finished protocol with the final state. A segment still in the centre is left out. */
export function finishProtocol(recorder: ProtocolRecorder, state: GameState): GameProtocol {
  return {
    seed: recorder.seed,
    config: protocolConfig(),
    segments: recorder.segments,
    result: {
      score: state.score,
      moves: state.moves,
      level: state.level,
      lives: state.lives,
      discards: state.discards,
    },
  };
}
