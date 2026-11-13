import { describe, expect, it } from 'vitest';
import { COLOR_COUNT, MISS_PENALTIES_MS, START_DISCARDS, START_LIVES, TIMER_MS } from '../config';
import { advanceTime, applyInput, createGame } from '../core/game';
import { createRng, type Rng } from '../core/rng';
import type { GameInput, GameState, StepResult } from '../core/types';
import { finishProtocol, recordStep, startProtocol, type ProtocolRecorder } from './protocol';

const SEED = 77;
const START_MS = 1000;

/** A game that is recorded from its first moment. */
class Recorded {
  state: GameState;
  private recorder: ProtocolRecorder;
  private readonly rng: Rng;

  constructor() {
    this.rng = createRng(SEED);
    this.state = createGame(this.rng, START_MS);
    this.recorder = startProtocol(SEED, this.state, START_MS);
  }

  tap(ring: number, timeMs: number): void {
    this.input({ type: 'tap', ring, timeMs });
  }

  swipe(timeMs: number): void {
    this.input({ type: 'swipe', segmentId: this.state.current.id, timeMs });
  }

  advance(timeMs: number): void {
    this.take(advanceTime(this.state, timeMs, this.rng), timeMs);
  }

  /** Replaces parts of the state between two steps to set up a situation. */
  set(patch: Partial<GameState>): void {
    this.state = { ...this.state, ...patch };
  }

  finish(): ReturnType<typeof finishProtocol> {
    return finishProtocol(this.recorder, this.state);
  }

  private input(input: GameInput): void {
    this.take(applyInput(this.state, input, this.rng), input.timeMs);
  }

  private take(result: StepResult, timeMs: number): void {
    this.state = result.state;
    this.recorder = recordStep(this.recorder, result, timeMs);
  }
}

describe('protocol of a game (A109)', () => {
  it('records the first segment without a timer and the placement that ended it', () => {
    const game = new Recorded();
    const first = game.state.current;
    game.tap(3, START_MS + 900);
    expect(game.finish().segments).toEqual([
      {
        number: 1,
        kind: 'normal',
        position: first.position,
        color: first.color,
        level: 1,
        timerMs: null,
        takenRings: 0,
        discards: START_DISCARDS,
        decisionMs: 900,
        firstTapMs: 900,
        misses: 0,
        outcome: 'placed',
        ring: 3,
      },
    ]);
  });

  it('records a discard, a timeout and a give-up with their decision times', () => {
    const game = new Recorded();
    const first = game.state.current;
    game.tap(0, START_MS + 500);
    const discarded = game.state.current;
    game.swipe(START_MS + 800);
    const lapsed = game.state.current;
    // The timer of the third segment started with the discard. The step that
    // notices the timeout comes 40 ms late, and the fourth segment appears then.
    game.advance(START_MS + 800 + TIMER_MS + 40);
    const givenUp = game.state.current;
    game.set({ discards: 0 });
    game.swipe(START_MS + 800 + TIMER_MS + 40 + 650);
    const [, second, third, fourth, ...rest] = game.finish().segments;
    expect(rest).toEqual([]);
    expect(second).toEqual({
      number: 2,
      kind: 'normal',
      position: discarded.position,
      color: discarded.color,
      level: 1,
      timerMs: TIMER_MS,
      // Only the first segment lies on the board, in ring 0.
      takenRings: discarded.position === first.position ? 1 : 0,
      discards: START_DISCARDS,
      decisionMs: 300,
      firstTapMs: null,
      misses: 0,
      outcome: 'discarded',
      ring: null,
    });
    expect(third).toMatchObject({
      number: 3,
      position: lapsed.position,
      decisionMs: TIMER_MS + 40,
      outcome: 'timeout',
      ring: null,
    });
    expect(fourth).toMatchObject({
      number: 4,
      position: givenUp.position,
      decisionMs: 650,
      outcome: 'givenUp',
      ring: null,
    });
  });

  it('counts the misses of each segment on its own', () => {
    const game = new Recorded();
    game.tap(0, START_MS + 500);
    const position = game.state.current.position;
    // The position of the second segment is taken in rings 1 and 2 only.
    game.set({
      rings: game.state.rings.map((ring, ringIndex) =>
        ring.map((_, slot) =>
          slot === position && (ringIndex === 1 || ringIndex === 2)
            ? { id: 900 + ringIndex, position, color: 0 }
            : null,
        ),
      ),
    });
    game.tap(1, START_MS + 800);
    game.tap(2, START_MS + 1000);
    game.tap(5, START_MS + 1200);
    game.tap(4, START_MS + 1600);
    const [, second, third] = game.finish().segments;
    expect(second).toMatchObject({ number: 2, misses: 2, outcome: 'placed', ring: 5 });
    expect(second?.decisionMs).toBe(700);
    // The first tap was the first miss, 300 ms after the segment appeared.
    expect(second?.firstTapMs).toBe(300);
    expect(third).toMatchObject({ number: 3, misses: 0, firstTapMs: 400 });
  });

  it('records the state a segment met when it appeared', () => {
    const game = new Recorded();
    const first = game.state.current;
    // Rings 1 to 3 are full, and one discard is gone.
    game.set({
      rings: game.state.rings.map((ring, ringIndex) =>
        ring.map((_, slot) =>
          ringIndex >= 1 && ringIndex <= 3 ? { id: 900 + slot, position: slot, color: 0 } : null,
        ),
      ),
      discards: START_DISCARDS - 1,
    });
    game.tap(0, START_MS + 500);
    const second = game.state.current;
    game.swipe(START_MS + 900);
    const records = game.finish().segments;
    // The first segment appeared on an empty board with the full stock.
    expect(records[0]).toMatchObject({ takenRings: 0, discards: START_DISCARDS });
    expect(records[1]).toMatchObject({
      takenRings: second.position === first.position ? 4 : 3,
      discards: START_DISCARDS - 1,
    });
  });

  it('writes whole milliseconds even when the clock has fractions', () => {
    const game = new Recorded();
    game.tap(0, START_MS + 500.4);
    game.tap(1, START_MS + 500.4 + 300.3);
    const [first, second] = game.finish().segments;
    expect(first).toMatchObject({ decisionMs: 500, firstTapMs: 500 });
    expect(second).toMatchObject({ decisionMs: 300, firstTapMs: 300 });
  });

  it('leaves out the segment that is still in the centre', () => {
    const game = new Recorded();
    game.tap(0, START_MS + 500);
    game.tap(1, START_MS + 900);
    expect(game.finish().segments).toHaveLength(2);
  });

  it('names seed, configuration and final state once per game', () => {
    const game = new Recorded();
    game.tap(0, START_MS + 500);
    game.advance(START_MS + 500 + TIMER_MS);
    const protocol = game.finish();
    expect(protocol.seed).toBe(SEED);
    expect(protocol.config).toMatchObject({
      timerMs: TIMER_MS,
      colorCount: COLOR_COUNT,
      startLives: START_LIVES,
      missPenaltiesMs: MISS_PENALTIES_MS,
    });
    expect(protocol.result).toEqual({
      score: game.state.score,
      moves: 1,
      level: 1,
      lives: START_LIVES - 1,
      discards: game.state.discards,
    });
  });

  it('survives the trip through JSON unchanged', () => {
    const game = new Recorded();
    game.tap(0, START_MS + 500);
    game.swipe(START_MS + 900);
    const protocol = game.finish();
    expect(protocol.segments).toHaveLength(2);
    expect(JSON.parse(JSON.stringify(protocol))).toEqual(protocol);
  });
});
