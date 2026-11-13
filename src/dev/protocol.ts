// Protocol of a game for the dev server (A109): one record per segment, plus
// seed, configuration and final state once per game. Pure functions, the
// export itself lives in exportProtocol.ts.

import type { GameState, StepResult } from '../core/types';

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

/** Starts the protocol of a game that was just created at `timeMs`. */
export function startProtocol(seed: number, _state: GameState, _timeMs: number): ProtocolRecorder {
  return { seed, segments: [], open: null };
}

/**
 * Adds what one step of the game did. `timeMs` is the time of the step, the
 * same that the rule core received.
 */
export function recordStep(
  recorder: ProtocolRecorder,
  _result: StepResult,
  _timeMs: number,
): ProtocolRecorder {
  return recorder;
}

/** The finished protocol with the final state. A segment still in the centre is left out. */
export function finishProtocol(recorder: ProtocolRecorder, _state: GameState): GameProtocol {
  return {
    seed: 0,
    config: {},
    segments: recorder.segments,
    result: { score: 0, moves: 0, level: 0, lives: 0, discards: 0 },
  };
}
