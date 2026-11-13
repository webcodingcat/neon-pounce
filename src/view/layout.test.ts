import { describe, expect, it } from 'vitest';
import { MAX_FIELD_WIDTH, MAX_RENDER_RESOLUTION, MIN_FIELD_ASPECT } from '../config';
import { fieldCenter, fieldLayout, renderResolution, type Insets } from './layout';

const NO_INSETS: Insets = { top: 0, right: 0, bottom: 0, left: 0 };

describe('fieldLayout (A4)', () => {
  it('fills a phone viewport', () => {
    const field = fieldLayout({ width: 390, height: 844 }, NO_INSETS);
    expect(field).toEqual({ x: 0, y: 0, width: 390, height: 844 });
  });

  it('caps the width and centres the field on a wide viewport', () => {
    const field = fieldLayout({ width: 820, height: 1180 }, NO_INSETS);
    expect(field).toEqual({
      x: (820 - MAX_FIELD_WIDTH) / 2,
      y: 0,
      width: MAX_FIELD_WIDTH,
      height: 1180,
    });
  });

  it('keeps the safe areas at top and bottom free', () => {
    const field = fieldLayout(
      { width: 390, height: 844 },
      { top: 59, right: 0, bottom: 34, left: 0 },
    );
    expect(field).toEqual({ x: 0, y: 59, width: 390, height: 844 - 59 - 34 });
  });

  it('keeps the safe areas at the sides free and centres between them', () => {
    const field = fieldLayout(
      { width: 390, height: 844 },
      { top: 0, right: 20, bottom: 0, left: 10 },
    );
    expect(field).toEqual({ x: 10, y: 0, width: 360, height: 844 });
  });

  it('narrows the field when the viewport is too short for the full width', () => {
    const field = fieldLayout({ width: 400, height: 480 }, NO_INSETS);
    const width = 480 / MIN_FIELD_ASPECT;
    expect(field.width).toBeCloseTo(width, 6);
    expect(field.x).toBeCloseTo((400 - width) / 2, 6);
    expect(field.y).toBe(0);
    expect(field.height).toBe(480);
  });
});

describe('fieldCenter', () => {
  it('returns the middle of the field', () => {
    expect(fieldCenter({ x: 150, y: 59, width: 520, height: 1000 })).toEqual({ x: 410, y: 559 });
  });
});

describe('renderResolution (A97)', () => {
  it('caps the device pixel ratio', () => {
    expect(renderResolution(3)).toBe(MAX_RENDER_RESOLUTION);
    expect(renderResolution(2.625)).toBe(MAX_RENDER_RESOLUTION);
  });

  it('keeps ratios up to the cap', () => {
    expect(renderResolution(1)).toBe(1);
    expect(renderResolution(1.5)).toBe(1.5);
    expect(renderResolution(MAX_RENDER_RESOLUTION)).toBe(MAX_RENDER_RESOLUTION);
  });
});
