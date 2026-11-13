// All values that are tuned by feel or by simulation live here and nowhere else
// (A106). Change a value and the dev server reloads.

// --- Development ---

/** Replaces the game with the performance probe (A108). */
export const PERFORMANCE_PROBE = false;

/** Length of one probe run in milliseconds. */
export const PROBE_DURATION_MS = 300_000;

/** Number of particles that stream across the probe. */
export const PROBE_PARTICLE_COUNT = 300;

/** Time a probe particle needs from the centre to the edge, in milliseconds. */
export const PROBE_PARTICLE_LIFE_MS = 2400;

/** Length of one pulse of a probe segment in milliseconds. */
export const PROBE_PULSE_MS = 1600;

/** The probe passes with at least this mean frame rate. */
export const PROBE_MIN_MEAN_FPS = 58;

/** The probe passes when the worst second still has this many frames. */
export const PROBE_MIN_WORST_FPS = 50;

// --- Game ---

/** Discards in stock at the start of a game (A25). */
export const START_DISCARDS = 3;

/** The stock never holds more discards than this (A25). */
export const MAX_DISCARDS = 5;

/**
 * Number of segment colours. Fixed until milestone 5 introduces the levels,
 * which then set the number per level (A38).
 */
export const COLOR_COUNT = 3;

// --- Scoring ---

/** Points for a placement, before the level multiplier (A44). */
export const PLACEMENT_POINTS = 10;

/** Points for clearing a ring, before all factors (A45). */
export const CLEAR_POINTS = 100;

/** Factor for a ring of a single colour (A17). */
export const MONO_FACTOR = 3;

/** The combo factor never exceeds this (A46). */
export const MAX_COMBO_FACTOR = 6;

// --- Generator ---

/** How often the bag holds each position (A32). */
export const BAG_COPIES = 2;

// --- Feedback ---

/** How long a ring shakes after a miss, in milliseconds. */
export const SHAKE_MS = 300;

/** How long a cleared ring flashes, in milliseconds. */
export const FLASH_MS = 400;

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
