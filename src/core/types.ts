// Types of the rule core. The core is plain TypeScript: no dependencies, no
// browser APIs, no clock. Randomness and time come in as arguments.

export const RING_COUNT = 6;
export const SLOT_COUNT = 6;

/** A normal segment (A5). Bonus segments follow in milestone 8. */
export interface Segment {
  /** Serial number within the game. Tells two segments apart (A8). */
  readonly id: number;
  /** Slot the segment belongs to, 0 to 5, clockwise from 1 o'clock. */
  readonly position: number;
  /** Index of the colour, 0 to 5. */
  readonly color: number;
}

/** The six slots of a ring, indexed by position. */
export type Ring = readonly (Segment | null)[];

export interface GameState {
  /** The six outer rings, clockwise from 12 o'clock. */
  readonly rings: readonly Ring[];
  /** The segment in the centre. */
  readonly current: Segment;
  /** Positions that are left in the bag (A32). */
  readonly bag: readonly number[];
  /** Id of the next segment. */
  readonly nextId: number;
  /** Discards in stock (A25). */
  readonly discards: number;
  readonly score: number;
  /** Placements in a row that cleared a ring (A46). */
  readonly combo: number;
  /** Placements so far. Only placements count as moves (A12). */
  readonly moves: number;
}

/** An input of the player. Every input carries its time. */
export type GameInput =
  | { readonly type: 'tap'; readonly ring: number; readonly timeMs: number }
  /** A swipe is meant for the segment that was visible when the finger landed (A8). */
  | { readonly type: 'swipe'; readonly segmentId: number; readonly timeMs: number };

export type GameEvent =
  | {
      readonly type: 'placed';
      readonly segment: Segment;
      readonly ring: number;
      readonly points: number;
    }
  | { readonly type: 'missed'; readonly ring: number; readonly position: number }
  | {
      readonly type: 'cleared';
      readonly ring: number;
      /** All six segments had the same colour (A17). */
      readonly mono: boolean;
      /** Colour of a single-colour ring, otherwise null. */
      readonly color: number | null;
      readonly points: number;
      /** Combo count including this clear. */
      readonly combo: number;
      /** A single-colour ring gave a discard back. False when the stock was full (A18). */
      readonly discardReturned: boolean;
    }
  | { readonly type: 'discarded'; readonly segment: Segment }
  | { readonly type: 'spawned'; readonly segment: Segment };

export interface StepResult {
  readonly state: GameState;
  /** What happened, in order. Empty when the input was ignored. */
  readonly events: readonly GameEvent[];
}
