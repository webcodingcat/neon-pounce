import { describe, expect, it } from 'vitest';
import { PROBE_MIN_MEAN_FPS, PROBE_MIN_WORST_FPS } from '../config';
import {
  createFpsStats,
  fpsSummary,
  meetsProbeLimits,
  recordFrame,
  resumeFps,
  type FpsStats,
  type FpsSummary,
} from './fps';

/** Records frames every `stepMs` from `fromMs` up to and including `toMs`. */
function run(stats: FpsStats, fromMs: number, toMs: number, stepMs: number): FpsStats {
  let result = stats;
  for (let now = fromMs; now <= toMs; now += stepMs) {
    result = recordFrame(result, now);
  }
  return result;
}

describe('frame-rate statistics (A107)', () => {
  it('has no current and no worst value before the first second is complete', () => {
    const summary = fpsSummary(run(createFpsStats(), 0, 980, 20));
    expect(summary.current).toBeNull();
    expect(summary.worst).toBeNull();
    expect(summary.elapsedMs).toBe(980);
    expect(summary.mean).toBeCloseTo(50, 6);
  });

  it('reports the frames of the last completed second as current value', () => {
    const summary = fpsSummary(run(createFpsStats(), 0, 2500, 20));
    expect(summary.current).toBe(50);
    expect(summary.worst).toBe(50);
  });

  it('does not depend on where the clock starts', () => {
    const summary = fpsSummary(run(createFpsStats(), 123_456, 123_456 + 2500, 20));
    expect(summary.current).toBe(50);
    expect(summary.elapsedMs).toBe(2500);
  });

  it('averages over the whole run', () => {
    let stats = run(createFpsStats(), 0, 1000, 20);
    stats = run(stats, 1010, 2000, 10);
    const summary = fpsSummary(stats);
    expect(summary.elapsedMs).toBe(2000);
    expect(summary.mean).toBeCloseTo(75, 6);
  });

  it('remembers the slowest second', () => {
    let stats = run(createFpsStats(), 0, 980, 20);
    stats = run(stats, 1000, 1960, 40);
    stats = run(stats, 2000, 3200, 20);
    const summary = fpsSummary(stats);
    expect(summary.worst).toBe(25);
    expect(summary.current).toBe(50);
  });

  it('counts a stall of more than a second as a second without frames', () => {
    let stats = run(createFpsStats(), 0, 1000, 20);
    stats = run(stats, 3500, 4600, 20);
    expect(fpsSummary(stats).worst).toBe(0);
  });

  it('discards the time before a resume instead of counting a stall', () => {
    let stats = run(createFpsStats(), 0, 1500, 20);
    stats = resumeFps(stats, 61_500);
    stats = run(stats, 61_520, 63_500, 20);
    const summary = fpsSummary(stats);
    expect(summary.elapsedMs).toBe(3500);
    expect(summary.worst).toBe(50);
    expect(summary.mean).toBeCloseTo(50, 6);
  });

  it('never lets the measured time run backwards after a resume', () => {
    // The first frame after a resume can carry a time stamp from before it.
    let stats = run(createFpsStats(), 0, 1500, 20);
    stats = resumeFps(stats, 61_500);
    stats = recordFrame(stats, 61_490);
    expect(fpsSummary(stats).elapsedMs).toBe(1500);
    stats = recordFrame(stats, 61_510);
    expect(fpsSummary(stats).elapsedMs).toBe(1520);
  });
});

describe('meetsProbeLimits', () => {
  const passing: FpsSummary = {
    current: 60,
    mean: PROBE_MIN_MEAN_FPS,
    worst: PROBE_MIN_WORST_FPS,
    elapsedMs: 300_000,
  };

  it('accepts a summary exactly at both limits', () => {
    expect(meetsProbeLimits(passing)).toBe(true);
  });

  it('rejects a summary below one of the limits, but only then', () => {
    expect(meetsProbeLimits({ ...passing, mean: 60, worst: 59 })).toBe(true);
    expect(meetsProbeLimits({ ...passing, mean: PROBE_MIN_MEAN_FPS - 0.1 })).toBe(false);
    expect(meetsProbeLimits({ ...passing, worst: PROBE_MIN_WORST_FPS - 1 })).toBe(false);
  });

  it('rejects a summary without measured values, also when the rest passes', () => {
    expect(meetsProbeLimits(passing)).toBe(true);
    expect(meetsProbeLimits({ ...passing, mean: null })).toBe(false);
    expect(meetsProbeLimits({ ...passing, worst: null })).toBe(false);
  });
});
