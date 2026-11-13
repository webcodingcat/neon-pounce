// Frame-rate statistics for the dev overlay (A107). Pure: the time of every
// frame is passed in, nothing here reads a clock.

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

/** Records one rendered frame at clock time `nowMs`. */
export function recordFrame(stats: FpsStats, _nowMs: number): FpsStats {
  return stats;
}

/**
 * Continues after a break in which no frames could be drawn (page hidden). The
 * time since the last frame is discarded instead of counting as a stall.
 */
export function resumeFps(stats: FpsStats, _nowMs: number): FpsStats {
  return stats;
}

export function fpsSummary(_stats: FpsStats): FpsSummary {
  return { current: null, mean: null, worst: null, elapsedMs: 0 };
}

/** True when a summary meets both limits of the performance probe. */
export function meetsProbeLimits(_summary: FpsSummary): boolean {
  return false;
}
