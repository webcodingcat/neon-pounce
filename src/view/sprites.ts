import { Sprite } from 'pixi.js';
import type { Point } from './geometry';
import type { GlowTexture } from './textures';

/** A sprite of a glow texture whose shape origin sits on `origin`. */
export function glowSprite(glow: GlowTexture, origin: Point, resolution: number): Sprite {
  const sprite = new Sprite(glow.texture);
  sprite.anchor.set(glow.anchorX, glow.anchorY);
  sprite.position.set(origin.x, origin.y);
  sprite.scale.set(1 / resolution);
  return sprite;
}
