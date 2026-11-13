// All values that are tuned by feel or by simulation live here and nowhere else
// (A106). Change a value and the dev server reloads.

// --- Development ---

/** Replaces the game with the performance probe (A108). */
export const PERFORMANCE_PROBE = true;

/** Length of one probe run in milliseconds. */
export const PROBE_DURATION_MS = 300_000;

/** The probe passes with at least this mean frame rate. */
export const PROBE_MIN_MEAN_FPS = 58;

/** The probe passes when the worst second still has this many frames. */
export const PROBE_MIN_WORST_FPS = 50;

// --- Rendering ---

/** Upper limit for the render resolution, also on devices with factor 3 (A97). */
export const MAX_RENDER_RESOLUTION = 2;

// --- Layout (A4) ---

/** Largest width of the field in CSS pixels. */
export const MAX_FIELD_WIDTH = 520;

/** The field is at least this many times as high as it is wide. */
export const MIN_FIELD_ASPECT = 1.6;

// --- Board proportions, as fractions of the field width (placeholders until
// milestone 9 fixes them) ---

/** Distance from the board centre to the centre of an outer ring. */
export const RING_DISTANCE = 0.36;

/** Radius of an outer ring. */
export const RING_RADIUS = 0.165;

/** Radius of the centre disc that shows the current segment. */
export const CENTER_RADIUS = 0.13;

/** Radius of the timer arc around the centre disc. */
export const TIMER_ARC_RADIUS = 0.16;

/** Width of the gap between two neighbouring wedges. */
export const GAP_WIDTH = 0.008;
