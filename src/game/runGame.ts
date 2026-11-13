// Wires a session to the application: the fingers on the canvas, the frames,
// the resize and, where they apply, the test mode and the dev tools.

import type { Application } from 'pixi.js';
import { createExportButton } from '../dev/exportProtocol';
import { Session } from './session';
import { testSeed } from './testMode';

/** Lays the state open for the smoke tests (A110). */
function exposeTestApi(session: Session): void {
  window.__neonPounce = {
    get screen() {
      return session.screen;
    },
    get rings() {
      return session.state.rings;
    },
    get current() {
      return session.state.current;
    },
    get lives() {
      return session.state.lives;
    },
    get discards() {
      return session.state.discards;
    },
    get score() {
      return session.state.score;
    },
    get combo() {
      return session.state.combo;
    },
    get level() {
      return session.state.level;
    },
    advance(ms) {
      session.skip(ms);
    },
  };
}

export function runGame(app: Application): void {
  const seed = testSeed(window.location.search);
  // "Export" and the protocol exist only in the dev server (A107, A109).
  const exportButton = import.meta.env.DEV ? createExportButton(document.body) : null;
  const session = new Session(app, { seed, exportButton });
  if (seed !== null) {
    exposeTestApi(session);
  }
  const canvas = app.canvas;
  canvas.addEventListener('pointerdown', (event) => {
    session.down(event);
  });
  canvas.addEventListener('pointermove', (event) => {
    session.move(event);
  });
  canvas.addEventListener('pointerup', (event) => {
    session.up(event);
  });
  canvas.addEventListener('pointercancel', (event) => {
    session.up(event);
  });
  window.addEventListener('resize', () => {
    session.rebuild();
  });
  app.ticker.add(() => {
    session.tick();
  });
}
