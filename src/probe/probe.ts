// Performance probe (A108): a full board of 36 glowing segments that pulse all
// the time, plus a steady stream of particles. Everything is built once. A
// frame only changes position, scale, alpha and rotation.

import { Container, Particle, ParticleContainer, Sprite } from 'pixi.js';
import { PROBE_PARTICLE_COUNT, PROBE_PARTICLE_LIFE_MS, PROBE_PULSE_MS } from '../config';
import {
  RING_COUNT,
  SLOT_COUNT,
  ringCenter,
  type BoardGeometry,
  type Point,
} from '../view/geometry';
import type { BoardTextures, GlowTexture } from '../view/textures';

/** Placeholder colours until milestone 9 defines the palette. */
const TINTS = [0xff3b6b, 0xffb300, 0x3dff7c, 0x21d4fd, 0x7a5cff, 0xff4dff] as const;
const ARC_TINT = 0x8fd8ff;

const SLOT_STEP = (2 * Math.PI) / SLOT_COUNT;
const FULL_TURN = 2 * Math.PI;
/** Golden angle: spreads the particles evenly without a random generator. */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
/** How long the centre shows one position before it moves on. */
const CENTER_STEP_MS = 1000;

interface Pulsing {
  readonly sprite: Sprite;
  /** Offset of the pulse, 0 to 1. */
  readonly phase: number;
}

interface Streaming {
  readonly particle: Particle;
  readonly directionX: number;
  readonly directionY: number;
  /** Offset on the way from the centre to the edge, 0 to 1. */
  readonly phase: number;
}

function tintAt(index: number): number {
  return TINTS[index % TINTS.length] ?? 0xffffff;
}

function glowSprite(glow: GlowTexture, origin: Point, resolution: number): Sprite {
  const sprite = new Sprite(glow.texture);
  sprite.anchor.set(glow.anchorX, glow.anchorY);
  sprite.position.set(origin.x, origin.y);
  sprite.scale.set(1 / resolution);
  return sprite;
}

export class Probe {
  readonly container = new Container();

  private readonly baseScale: number;
  private readonly reach: number;
  private readonly center: Point;
  private readonly segments: Pulsing[] = [];
  private readonly stream: Streaming[] = [];
  private readonly centerSegment: Sprite;

  constructor(geometry: BoardGeometry, textures: BoardTextures) {
    this.baseScale = 1 / textures.resolution;
    this.center = geometry.center;
    // Particles fade out a little beyond the outer edge of the rings.
    this.reach = (geometry.ringDistance + geometry.ringRadius) * 1.15;

    this.container.addChild(this.createParticles(textures));
    this.addRings(geometry, textures);
    const arc = glowSprite(textures.timerArc, geometry.center, textures.resolution);
    arc.tint = ARC_TINT;
    this.centerSegment = glowSprite(textures.centerWedge, geometry.center, textures.resolution);
    this.container.addChild(arc, this.centerSegment);
  }

  /** Moves everything to its state at time `nowMs`. */
  update(nowMs: number): void {
    for (const segment of this.segments) {
      const wave = Math.sin(FULL_TURN * (nowMs / PROBE_PULSE_MS + segment.phase));
      const pulse = 0.5 + 0.5 * wave;
      segment.sprite.alpha = 0.55 + 0.45 * pulse;
      segment.sprite.scale.set(this.baseScale * (0.95 + 0.05 * pulse));
    }
    for (const item of this.stream) {
      const progress = (nowMs / PROBE_PARTICLE_LIFE_MS + item.phase) % 1;
      item.particle.x = this.center.x + item.directionX * progress * this.reach;
      item.particle.y = this.center.y + item.directionY * progress * this.reach;
      item.particle.alpha = 1 - progress;
    }
    const slot = Math.floor(nowMs / CENTER_STEP_MS) % SLOT_COUNT;
    this.centerSegment.rotation = slot * SLOT_STEP;
    this.centerSegment.tint = tintAt(slot);
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }

  private addRings(geometry: BoardGeometry, textures: BoardTextures): void {
    for (let ring = 0; ring < RING_COUNT; ring += 1) {
      const origin = ringCenter(geometry, ring);
      for (let slot = 0; slot < SLOT_COUNT; slot += 1) {
        const sprite = glowSprite(textures.ringWedge, origin, textures.resolution);
        sprite.rotation = slot * SLOT_STEP;
        sprite.tint = tintAt(ring + slot);
        this.segments.push({ sprite, phase: (ring * SLOT_COUNT + slot) / 36 });
        this.container.addChild(sprite);
      }
    }
  }

  private createParticles(textures: BoardTextures): ParticleContainer {
    const particles = new ParticleContainer({
      dynamicProperties: { position: true, color: true, vertex: false, rotation: false },
    });
    particles.blendMode = 'add';
    for (let index = 0; index < PROBE_PARTICLE_COUNT; index += 1) {
      const angle = index * GOLDEN_ANGLE;
      const particle = new Particle({
        texture: textures.particle.texture,
        anchorX: textures.particle.anchorX,
        anchorY: textures.particle.anchorY,
        scaleX: this.baseScale,
        scaleY: this.baseScale,
        tint: tintAt(index),
      });
      particles.addParticle(particle);
      this.stream.push({
        particle,
        directionX: Math.sin(angle),
        directionY: -Math.cos(angle),
        phase: index / PROBE_PARTICLE_COUNT,
      });
    }
    return particles;
  }
}
