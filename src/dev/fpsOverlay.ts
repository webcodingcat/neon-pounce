// Frame-rate display of the dev server (A107): elapsed time, current value,
// mean and worst second. After a full probe run a second line keeps the result.

import { PROBE_DURATION_MS } from '../config';
import { meetsProbeLimits, type FpsSummary } from './fps';

export interface FpsOverlay {
  /** Shows a summary. The first one after a full probe run is kept as result. */
  update(summary: FpsSummary): void;
}

function formatTime(elapsedMs: number): string {
  const seconds = Math.floor(elapsedMs / 1000);
  return `${String(Math.floor(seconds / 60))}:${String(seconds % 60).padStart(2, '0')}`;
}

function formatValue(value: number | null, digits: number): string {
  return value === null ? '–' : value.toFixed(digits);
}

/** Mean and worst second, e.g. "⌀ 59.8  ↓ 57". */
function formatMeanAndWorst(summary: FpsSummary): string {
  return `⌀ ${formatValue(summary.mean, 1)}  ↓ ${formatValue(summary.worst, 0)}`;
}

function createLine(parent: HTMLElement): HTMLElement {
  const line = document.createElement('div');
  parent.appendChild(line);
  return line;
}

export function createFpsOverlay(parent: HTMLElement): FpsOverlay {
  const box = document.createElement('div');
  box.dataset.testid = 'fps';
  box.style.cssText = [
    'position: fixed',
    'top: calc(env(safe-area-inset-top, 0px) + 6px)',
    'left: calc(env(safe-area-inset-left, 0px) + 8px)',
    'font: 14px/1.4 ui-monospace, Menlo, Consolas, monospace',
    'color: #bfefff',
    'white-space: pre',
    'pointer-events: none',
  ].join(';');
  const live = createLine(box);
  const result = createLine(box);
  parent.appendChild(box);

  let finished = false;
  return {
    update(summary) {
      const now = `${formatTime(summary.elapsedMs)}  ${formatValue(summary.current, 0)}`;
      live.textContent = `${now}  ${formatMeanAndWorst(summary)}`;
      if (!finished && summary.elapsedMs >= PROBE_DURATION_MS) {
        finished = true;
        const mark = meetsProbeLimits(summary) ? '✓' : '✗';
        result.textContent = `${formatTime(summary.elapsedMs)}  ${formatMeanAndWorst(summary)}  ${mark}`;
      }
    },
  };
}
