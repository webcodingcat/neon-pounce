// "Export" button of the dev server (A107, A109): hands the protocol of the
// game that just ended to the share sheet of the device, or downloads it where
// there is none.

import type { GameProtocol } from './protocol';

export interface ExportButton {
  /** Shows the button for the protocol of the game that just ended. */
  show(protocol: GameProtocol): void;
  hide(): void;
  /** The button reacts only when active, like the others of Game Over (A82). */
  setActive(active: boolean): void;
}

function download(file: File): void {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  // The download has started by then.
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

/** The share sheet needs a secure context. The dev server in the local network has none. */
function canShare(file: File): boolean {
  return 'canShare' in navigator && navigator.canShare({ files: [file] });
}

async function exportProtocol(protocol: GameProtocol): Promise<void> {
  const name = `neon-pounce-${String(protocol.seed)}.json`;
  const file = new File([JSON.stringify(protocol, null, 2)], name, { type: 'application/json' });
  if (!canShare(file)) {
    download(file);
    return;
  }
  try {
    await navigator.share({ files: [file] });
  } catch (error) {
    // Closing the share sheet is no reason to download the file as well.
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      download(file);
    }
  }
}

export function createExportButton(parent: HTMLElement): ExportButton {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Export';
  button.dataset.testid = 'export';
  button.hidden = true;
  button.style.cssText = [
    'position: fixed',
    'left: 50%',
    'bottom: calc(env(safe-area-inset-bottom, 0px) + 24px)',
    'transform: translateX(-50%)',
    'min-height: 48px',
    'padding: 10px 24px',
    'font: 700 16px/1.2 ui-monospace, Menlo, Consolas, monospace',
    'color: #bfefff',
    'background: transparent',
    'border: 2px solid #bfefff',
    'border-radius: 10px',
  ].join(';');
  let protocol: GameProtocol | null = null;
  button.addEventListener('click', () => {
    if (protocol !== null) {
      void exportProtocol(protocol);
    }
  });
  parent.appendChild(button);
  return {
    show(next) {
      protocol = next;
      button.hidden = false;
    },
    hide() {
      protocol = null;
      button.hidden = true;
    },
    setActive(active) {
      button.disabled = !active;
      button.style.opacity = active ? '1' : '0.35';
    },
  };
}
