import { Application } from 'pixi.js';
import { PERFORMANCE_PROBE } from './config';
import { runProbe } from './probe/runProbe';
import { renderResolution } from './view/layout';

/** Placeholder until milestone 9 defines the palette. Keep in sync with index.html. */
const BACKGROUND_COLOR = 0x05060f;

async function start(): Promise<void> {
  const app = new Application();
  await app.init({
    resizeTo: window,
    resolution: renderResolution(window.devicePixelRatio),
    autoDensity: true,
    antialias: false,
    backgroundColor: BACKGROUND_COLOR,
    preference: 'webgl',
  });
  document.body.appendChild(app.canvas);
  // The game itself starts with milestone 2. Until then there is only the probe.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- config switch
  if (PERFORMANCE_PROBE) {
    runProbe(app);
  }
}

void start();
