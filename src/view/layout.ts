// Field layout as pure functions (A4, A97). All values are CSS pixels.

import type { Point } from './geometry';

export interface Size {
  readonly width: number;
  readonly height: number;
}

/** Safe-area insets of the device (notch, home bar). */
export interface Insets {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

/** The centred portrait field inside the viewport. */
export interface FieldLayout {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export function fieldLayout(_viewport: Size, _insets: Insets): FieldLayout {
  return { x: 0, y: 0, width: 0, height: 0 };
}

export function fieldCenter(_field: FieldLayout): Point {
  return { x: 0, y: 0 };
}

export function renderResolution(_devicePixelRatio: number): number {
  return 1;
}
