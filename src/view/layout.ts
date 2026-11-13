// Field layout as pure functions (A4, A97). All values are CSS pixels.

import { MAX_FIELD_WIDTH, MAX_RENDER_RESOLUTION, MIN_FIELD_ASPECT } from '../config';
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

/**
 * The field uses the full height between the safe areas. Its width is limited
 * by the available width, by the maximum width and by the height, so the field
 * always stays a portrait rectangle.
 */
export function fieldLayout(viewport: Size, insets: Insets): FieldLayout {
  const availableWidth = Math.max(0, viewport.width - insets.left - insets.right);
  const height = Math.max(0, viewport.height - insets.top - insets.bottom);
  const width = Math.min(availableWidth, MAX_FIELD_WIDTH, height / MIN_FIELD_ASPECT);
  return {
    x: insets.left + (availableWidth - width) / 2,
    y: insets.top,
    width,
    height,
  };
}

export function fieldCenter(field: FieldLayout): Point {
  return { x: field.x + field.width / 2, y: field.y + field.height / 2 };
}

/** Render resolution for a device pixel ratio, capped to protect the frame rate. */
export function renderResolution(devicePixelRatio: number): number {
  return Math.min(devicePixelRatio, MAX_RENDER_RESOLUTION);
}
