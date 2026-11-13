// Glow textures, drawn once with Canvas 2D. The glow is part of the texture, so
// nothing needs a filter at runtime (A97). Shapes are white and get their
// colour from the tint of the sprite.

import { Texture } from 'pixi.js';
import { slotWedge, type BoardGeometry, type Wedge } from './geometry';
import { SEGMENT_SYMBOLS, type SymbolOutline } from './palette';

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
  /**
   * One of `TIMER_PIECES` equal pieces of the timer arc, the one that starts at
   * 12 o'clock. The others are rotations of it.
   */
  readonly timerPiece: GlowTexture;
  readonly particle: GlowTexture;
  /** Outline of an outer ring. */
  readonly ringOutline: GlowTexture;
  /** Filled disc of an outer ring, for the flash of a cleared ring. */
  readonly ringDisc: GlowTexture;
  /** Symbol of each segment colour, sized for a wedge of an outer ring. */
  readonly symbols: readonly GlowTexture[];
  /** Texture pixels per CSS pixel. Sprites are scaled by 1 / resolution. */
  readonly resolution: number;
}

/** Glow radius and line widths as fractions of the field width. */
const GLOW = 0.012;
const ARC_WIDTH = 0.01;
const PARTICLE_RADIUS = 0.008;
const OUTLINE_WIDTH = 0.004;
/** Half the size of a symbol, as a fraction of the ring radius. */
export const SYMBOL_SIZE = 0.17;
/** Number of pieces the running timer arc is built from. */
export const TIMER_PIECES = 60;

const QUARTER_TURN = Math.PI / 2;

/** A circle line in CSS pixels. */
interface ArcLine {
  readonly radius: number;
  readonly lineWidth: number;
  readonly glow: number;
}

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
  // The canvas size is rounded up to whole pixels, so the anchor has to use the
  // real size. Otherwise the wedges would not turn about the disc centre.
  return {
    texture: Texture.from(canvas),
    anchorX: (origin.x * resolution) / canvas.width,
    anchorY: (origin.y * resolution) / canvas.height,
  };
}

/** Full circle line with a glow around it. */
function arcTexture(
  radius: number,
  lineWidth: number,
  glow: number,
  resolution: number,
): GlowTexture {
  const size = 2 * (radius + lineWidth + 2 * glow);
  const { canvas, context } = createSheet(size, size, resolution);
  context.beginPath();
  context.arc(size / 2, size / 2, radius, 0, 2 * Math.PI);
  context.lineWidth = lineWidth;
  context.strokeStyle = '#ffffff';
  paintWithGlow(context, glow * resolution, () => {
    context.stroke();
  });
  const middle = (size / 2) * resolution;
  return {
    texture: Texture.from(canvas),
    anchorX: middle / canvas.width,
    anchorY: middle / canvas.height,
  };
}

/**
 * Piece of a circle line that starts at 12 o'clock and runs clockwise over
 * `sweep` radians. Its anchor is the centre of the circle, which lies outside
 * the canvas.
 */
function arcPieceTexture(arc: ArcLine, sweep: number, resolution: number): GlowTexture {
  const pad = arc.lineWidth + 2 * arc.glow;
  const width = arc.radius * Math.sin(sweep) + 2 * pad;
  const height = arc.radius * (1 - Math.cos(sweep)) + 2 * pad;
  const origin = { x: pad, y: pad + arc.radius };
  const { canvas, context } = createSheet(width, height, resolution);
  context.beginPath();
  context.arc(origin.x, origin.y, arc.radius, -QUARTER_TURN, sweep - QUARTER_TURN);
  context.lineWidth = arc.lineWidth;
  context.strokeStyle = '#ffffff';
  paintWithGlow(context, arc.glow * resolution, () => {
    context.stroke();
  });
  return {
    texture: Texture.from(canvas),
    anchorX: (origin.x * resolution) / canvas.width,
    anchorY: (origin.y * resolution) / canvas.height,
  };
}

/** Filled disc with a glow around it. */
function discTexture(radius: number, glow: number, resolution: number): GlowTexture {
  const size = 2 * (radius + 2 * glow);
  const { canvas, context } = createSheet(size, size, resolution);
  context.beginPath();
  context.arc(size / 2, size / 2, radius, 0, 2 * Math.PI);
  context.fillStyle = '#ffffff';
  paintWithGlow(context, glow * resolution, () => {
    context.fill();
  });
  const middle = (size / 2) * resolution;
  return {
    texture: Texture.from(canvas),
    anchorX: middle / canvas.width,
    anchorY: middle / canvas.height,
  };
}

/** A symbol without glow: it sits dark on a bright wedge. */
function symbolTexture(outline: SymbolOutline, half: number, resolution: number): GlowTexture {
  // One pixel of room, so the edge is not cut off.
  const middle = half + 1;
  const { canvas, context } = createSheet(2 * middle, 2 * middle, resolution);
  context.beginPath();
  if (outline === null) {
    context.arc(middle, middle, half, 0, 2 * Math.PI);
  } else {
    for (const [x, y] of outline) {
      context.lineTo(middle + x * half, middle + y * half);
    }
    context.closePath();
  }
  context.fillStyle = '#ffffff';
  context.fill();
  return {
    texture: Texture.from(canvas),
    anchorX: (middle * resolution) / canvas.width,
    anchorY: (middle * resolution) / canvas.height,
  };
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
  const timerLine = { radius: geometry.timerArcRadius, lineWidth: ARC_WIDTH * fieldWidth, glow };
  return {
    ringWedge: wedgeTexture(geometry.ringRadius, geometry.gapWidth, glow, resolution),
    centerWedge: wedgeTexture(geometry.centerRadius, geometry.gapWidth, glow, resolution),
    timerArc: arcTexture(geometry.timerArcRadius, ARC_WIDTH * fieldWidth, glow, resolution),
    timerPiece: arcPieceTexture(timerLine, (2 * Math.PI) / TIMER_PIECES, resolution),
    particle: particleTexture(PARTICLE_RADIUS * fieldWidth, resolution),
    ringOutline: arcTexture(geometry.ringRadius, OUTLINE_WIDTH * fieldWidth, glow, resolution),
    ringDisc: discTexture(geometry.ringRadius, glow, resolution),
    symbols: SEGMENT_SYMBOLS.map((outline) =>
      symbolTexture(outline, SYMBOL_SIZE * geometry.ringRadius, resolution),
    ),
    resolution,
  };
}

export function destroyBoardTextures(textures: BoardTextures): void {
  for (const glowTexture of [
    textures.ringWedge,
    textures.centerWedge,
    textures.timerArc,
    textures.timerPiece,
    textures.particle,
    textures.ringOutline,
    textures.ringDisc,
    ...textures.symbols,
  ]) {
    glowTexture.texture.destroy(true);
  }
}
