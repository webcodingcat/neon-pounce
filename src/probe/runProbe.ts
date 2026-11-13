// Wires the performance probe to the application: layout, resize, animation
// and, in the dev server, the frame-rate display.

import type { Application } from 'pixi.js';
import { createFpsStats, fpsSummary, recordFrame, resumeFps } from '../dev/fps';
import { createFpsOverlay } from '../dev/fpsOverlay';
import { boardGeometry } from '../view/geometry';
import { fieldCenter, fieldLayout } from '../view/layout';
import { readSafeArea } from '../view/safeArea';
import { createBoardTextures, destroyBoardTextures, type BoardTextures } from '../view/textures';
import { Probe } from './probe';

interface Scene {
  readonly probe: Probe;
  readonly textures: BoardTextures;
}

function buildScene(app: Application): Scene {
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const field = fieldLayout(viewport, readSafeArea());
  const geometry = boardGeometry(fieldCenter(field), field.width);
  const textures = createBoardTextures(geometry, field.width, app.renderer.resolution);
  const probe = new Probe(geometry, textures);
  app.stage.addChild(probe.container);
  return { probe, textures };
}

function destroyScene(scene: Scene): void {
  scene.probe.destroy();
  destroyBoardTextures(scene.textures);
}

/** Counts frames and refreshes the display once per second. */
function startFpsDisplay(app: Application): void {
  const overlay = createFpsOverlay(document.body);
  let stats = createFpsStats();
  let shownSecond = -1;
  app.ticker.add((ticker) => {
    stats = recordFrame(stats, ticker.lastTime);
    const second = Math.floor(stats.elapsedMs / 1000);
    if (second !== shownSecond) {
      shownSecond = second;
      overlay.update(fpsSummary(stats));
    }
  });
  // A hidden page draws no frames. That time is not a stall of the renderer.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      stats = resumeFps(stats, performance.now());
    }
  });
}

export function runProbe(app: Application): void {
  let scene = buildScene(app);
  window.addEventListener('resize', () => {
    destroyScene(scene);
    scene = buildScene(app);
  });
  app.ticker.add((ticker) => {
    scene.probe.update(ticker.lastTime);
  });
  if (import.meta.env.DEV) {
    startFpsDisplay(app);
  }
}
