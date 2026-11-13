// Colours and symbols of the segments (A5). Both are placeholders until
// milestone 9 defines the palette and the symbols.

/** Tint of each segment colour, by colour index. */
export const SEGMENT_TINTS = [0xff3b6b, 0xffb300, 0x3dff7c, 0x21d4fd, 0x7a5cff, 0xff4dff] as const;

/** Tint of things that are no segment: outlines, the arc around the centre. */
export const FRAME_TINT = 0x8fd8ff;

/** Colour of a symbol on its segment. Same as the background. */
export const SYMBOL_TINT = 0x05060f;

export function segmentTint(color: number): number {
  return SEGMENT_TINTS[color % SEGMENT_TINTS.length] ?? 0xffffff;
}

/**
 * Outline of a symbol in a square from -1 to 1 (y grows down). `null` stands
 * for a circle of radius 1.
 */
export type SymbolOutline = readonly (readonly [number, number])[] | null;

const ARM = 0.33;

/** Symbol of each segment colour, by colour index. */
export const SEGMENT_SYMBOLS: readonly SymbolOutline[] = [
  // Circle
  null,
  // Triangle
  [
    [0, -1],
    [0.95, 0.75],
    [-0.95, 0.75],
  ],
  // Square
  [
    [-0.8, -0.8],
    [0.8, -0.8],
    [0.8, 0.8],
    [-0.8, 0.8],
  ],
  // Diamond
  [
    [0, -1],
    [0.7, 0],
    [0, 1],
    [-0.7, 0],
  ],
  // Plus
  [
    [-ARM, -1],
    [ARM, -1],
    [ARM, -ARM],
    [1, -ARM],
    [1, ARM],
    [ARM, ARM],
    [ARM, 1],
    [-ARM, 1],
    [-ARM, ARM],
    [-1, ARM],
    [-1, -ARM],
    [-ARM, -ARM],
  ],
  // Bar
  [
    [-1, -0.35],
    [1, -0.35],
    [1, 0.35],
    [-1, 0.35],
  ],
];
