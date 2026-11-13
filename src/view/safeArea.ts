// Reads the safe-area insets of the device (notch, home bar) from CSS.

import type { Insets } from './layout';

function pixels(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Measures `env(safe-area-inset-*)` with a hidden element. */
export function readSafeArea(): Insets {
  const probe = document.createElement('div');
  probe.style.cssText = [
    'position: fixed',
    'visibility: hidden',
    'pointer-events: none',
    'padding-top: env(safe-area-inset-top, 0px)',
    'padding-right: env(safe-area-inset-right, 0px)',
    'padding-bottom: env(safe-area-inset-bottom, 0px)',
    'padding-left: env(safe-area-inset-left, 0px)',
  ].join(';');
  document.body.appendChild(probe);
  const style = getComputedStyle(probe);
  const insets: Insets = {
    top: pixels(style.paddingTop),
    right: pixels(style.paddingRight),
    bottom: pixels(style.paddingBottom),
    left: pixels(style.paddingLeft),
  };
  probe.remove();
  return insets;
}
