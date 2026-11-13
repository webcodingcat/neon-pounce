// Where the parts of the Game Over screen sit, as pure functions. All values
// are CSS pixels.

import type { Point } from './geometry';
import type { FieldLayout } from './layout';

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** Sizes as fractions of the field width. */
const BUTTON_WIDTH = 0.5;
const BUTTON_HEIGHT = 0.16;
/** Where the middle of a part sits, as a fraction of the field height. */
const SCORE_Y = 0.38;
const AGAIN_Y = 0.6;

/** Middle of the score. */
export function scoreSpot(field: FieldLayout): Point {
  return { x: field.x + field.width / 2, y: field.y + SCORE_Y * field.height };
}

/** Touch area of "Again". */
export function againButton(field: FieldLayout): Rect {
  const width = BUTTON_WIDTH * field.width;
  const height = BUTTON_HEIGHT * field.width;
  return {
    x: field.x + (field.width - width) / 2,
    y: field.y + AGAIN_Y * field.height - height / 2,
    width,
    height,
  };
}

export function rectContains(rect: Rect, point: Point): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}
