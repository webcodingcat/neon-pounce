// Glow textures, drawn once with Canvas 2D. The glow is part of the texture, so
// nothing needs a filter at runtime (A97). Shapes are white and get their
// colour from the tint of the sprite.

import { Texture } from 'pixi.js';
import { slotWedge, type BoardGeometry, type Wedge } from './geometry';

/** A texture with the point (0 to 1) that belongs on the origin of its shape. */
export interface GlowTexture {
  readonly texture: Texture;
  readonly anchorX: number;
  readonly anchorY: number;
}

export interface BoardTextures {
  /** Wedge of slot 0 of an outer ring. Other slots are rotations of it. */
  readonly ringWedge: GlowTexture;
  /** Wedge of slot 0 of the centre disc. */
  readonly centerWedge: GlowTexture;
  /** Full circle of the timer arc. */
  readonly timerArc: GlowTexture;
  readonly particle: GlowTexture;
  /** Texture pixels per CSS pixel. Sprites are scaled by 1 / resolution. */
  readonly resolution: number;
}

/** Glow radius and line widths as fractions of the field width. */
const GLOW = 0.012;
const ARC_WIDTH = 0.01;
const PARTICLE_RADIUS = 0.008;

const QUARTER_TURN = Math.PI / 2;

interface Sheet {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
}

/** Creates a canvas of a size in CSS pixels, scaled to the texture resolution. */
function createSheet(width: number, height: number, resolution: number): Sheet {
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(width * resolution);
  canvas.height = Math.ceil(height * resolution);
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Canvas 2D is not available');
  }
  context.scale(resolution, resolution);
  return { canvas, context };
}

/** Fills or strokes the current path with a glow around it, then once more crisp. */
function paintWithGlow(context: CanvasRenderingContext2D, glow: number, paint: () => void): void {
  context.shadowColor = '#ffffff';
  context.shadowBlur = glow;
  paint();
  context.shadowBlur = 0;
  paint();
}

function traceWedge(context: CanvasRenderingContext2D, wedge: Wedge): void {
  // Canvas angles start at 3 o'clock, ours at 12 o'clock.
  context.beginPath();
  context.moveTo(wedge.apex.x, wedge.apex.y);
  context.arc(
    wedge.origin.x,
    wedge.origin.y,
    wedge.radius,
    wedge.startAngle - QUARTER_TURN,
    wedge.endAngle - QUARTER_TURN,
  );
  context.closePath();
}

/** Wedge of slot 0. The canvas is its bounding box plus room for the glow. */
function wedgeTexture(
  radius: number,
  gapWidth: number,
  glow: number,
  resolution: number,
): GlowTexture {
  const pad = glow * 2;
  // Slot 0 lies between 12 and 2 o'clock: right of and above the origin.
  const width = radius * Math.sin(Math.PI / 3) + 2 * pad;
  const height = radius + 2 * pad;
  const origin = { x: pad, y: pad + radius };
  const { canvas, context } = createSheet(width, height, resolution);
  traceWedge(context, slotWedge({ origin, radius, gapWidth }, 0));
  context.fillStyle = '#ffffff';
  paintWithGlow(context, glow * resolution, () => {
    context.fill();
  });
  return { texture: Texture.from(canvas), anchorX: origin.x / width, anchorY: origin.y / height };
}

function arcTexture(radius: number, lineWidth: number, glow: number, resolution: number) {
  const size = 2 * (radius + lineWidth + 2 * glow);
  const { canvas, context } = createSheet(size, size, resolution);
  context.beginPath();
  context.arc(size / 2, size / 2, radius, 0, 2 * Math.PI);
  context.lineWidth = lineWidth;
  context.strokeStyle = '#ffffff';
  paintWithGlow(context, glow * resolution, () => {
    context.stroke();
  });
  return { texture: Texture.from(canvas), anchorX: 0.5, anchorY: 0.5 };
}

/** Soft dot: bright core that fades out to the edge. */
function particleTexture(radius: number, resolution: number): GlowTexture {
  const size = 2 * radius;
  const { canvas, context } = createSheet(size, size, resolution);
  const gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.6)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  return { texture: Texture.from(canvas), anchorX: 0.5, anchorY: 0.5 };
}

/** Builds all textures for one board size. Call again only when the size changes. */
export function createBoardTextures(
  geometry: BoardGeometry,
  fieldWidth: number,
  resolution: number,
): BoardTextures {
  const glow = GLOW * fieldWidth;
  return {
    ringWedge: wedgeTexture(geometry.ringRadius, geometry.gapWidth, glow, resolution),
    centerWedge: wedgeTexture(geometry.centerRadius, geometry.gapWidth, glow, resolution),
    timerArc: arcTexture(geometry.timerArcRadius, ARC_WIDTH * fieldWidth, glow, resolution),
    particle: particleTexture(PARTICLE_RADIUS * fieldWidth, resolution),
    resolution,
  };
}

export function destroyBoardTextures(textures: BoardTextures): void {
  for (const glowTexture of [
    textures.ringWedge,
    textures.centerWedge,
    textures.timerArc,
    textures.particle,
  ]) {
    glowTexture.texture.destroy(true);
  }
}
