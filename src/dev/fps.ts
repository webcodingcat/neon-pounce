// Frame-rate statistics for the dev overlay (A107). Pure: the time of every
// frame is passed in, nothing here reads a clock.

import { PROBE_MIN_MEAN_FPS, PROBE_MIN_WORST_FPS } from '../config';

export interface FpsStats {
  /** Number of recorded frames. */
  readonly frames: number;
  /** Measured time since the first frame, without discarded gaps. */
  readonly elapsedMs: number;
  /** Clock time of the last frame, null before the first one. */
  readonly lastMs: number | null;
  /** Start of the running second on the `elapsedMs` scale. */
  readonly secondStartMs: number;
  /** Frames in the running second. */
  readonly secondFrames: number;
  /** Frames in the last completed second. */
  readonly current: number | null;
  /** Fewest frames in any completed second. */
  readonly worst: number | null;
}

export interface FpsSummary {
  /** Frames in the last completed second, null during the first second. */
  readonly current: number | null;
  /** Mean frames per second over the whole run, null before the second frame. */
  readonly mean: number | null;
  /** Fewest frames in any completed second, null during the first second. */
  readonly worst: number | null;
  readonly elapsedMs: number;
}

export function createFpsStats(): FpsStats {
  return {
    frames: 0,
    elapsedMs: 0,
    lastMs: null,
    secondStartMs: 0,
    secondFrames: 0,
    current: null,
    worst: null,
  };
}

const SECOND_MS = 1000;

/** Closes every second that ended at or before `elapsedMs`. */
function closeSeconds(stats: FpsStats, elapsedMs: number): FpsStats {
  let { secondStartMs, secondFrames, current, worst } = stats;
  while (elapsedMs >= secondStartMs + SECOND_MS) {
    current = secondFrames;
    worst = worst === null ? secondFrames : Math.min(worst, secondFrames);
    secondStartMs += SECOND_MS;
    secondFrames = 0;
  }
  return { ...stats, secondStartMs, secondFrames, current, worst };
}

/** Records one rendered frame at clock time `nowMs`. */
export function recordFrame(stats: FpsStats, nowMs: number): FpsStats {
  if (stats.lastMs === null) {
    return { ...stats, frames: 1, lastMs: nowMs, secondFrames: 1 };
  }
  const elapsedMs = stats.elapsedMs + Math.max(0, nowMs - stats.lastMs);
  const closed = closeSeconds(stats, elapsedMs);
  return {
    ...closed,
    frames: stats.frames + 1,
    elapsedMs,
    lastMs: nowMs,
    secondFrames: closed.secondFrames + 1,
  };
}

/**
 * Continues after a break in which no frames could be drawn (page hidden). The
 * time since the last frame is discarded instead of counting as a stall.
 */
export function resumeFps(stats: FpsStats, nowMs: number): FpsStats {
  if (stats.lastMs === null) {
    return stats;
  }
  return { ...stats, lastMs: nowMs };
}

export function fpsSummary(stats: FpsStats): FpsSummary {
  // The first frame starts the clock, so n frames span n - 1 intervals.
  const mean = stats.elapsedMs > 0 ? ((stats.frames - 1) * SECOND_MS) / stats.elapsedMs : null;
  return { current: stats.current, mean, worst: stats.worst, elapsedMs: stats.elapsedMs };
}

/** True when a summary meets both limits of the performance probe. */
export function meetsProbeLimits(summary: FpsSummary): boolean {
  if (summary.mean === null || summary.worst === null) {
    return false;
  }
  return summary.mean >= PROBE_MIN_MEAN_FPS && summary.worst >= PROBE_MIN_WORST_FPS;
}
