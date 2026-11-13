// Numbers at the top of the field: discards on the left, score in the middle,
// combo on the right. Plain numbers until the later milestones bring the real
// HUD (A80). No words: during play there are only numbers and symbols.

import { Container, Text } from 'pixi.js';
import type { GameState } from '../core/types';
import type { FieldLayout } from './layout';
import { FRAME_TINT } from './palette';

/** Sizes as fractions of the field width. */
const FONT_SIZE = 0.075;
const MARGIN = 0.06;

function createNumber(fontSize: number): Text {
  return new Text({
    text: '',
    style: {
      fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
      fontSize,
      fontWeight: '700',
      fill: FRAME_TINT,
    },
  });
}

/** Changes a text only when it differs, because a change redraws its texture. */
function show(target: Text, value: string): void {
  if (target.text !== value) {
    target.text = value;
  }
}

export class Hud {
  readonly container = new Container();

  private readonly discards: Text;
  private readonly score: Text;
  private readonly combo: Text;

  constructor(field: FieldLayout) {
    const fontSize = FONT_SIZE * field.width;
    const margin = MARGIN * field.width;
    const top = field.y + margin;
    this.discards = createNumber(fontSize);
    this.discards.position.set(field.x + margin, top);
    this.score = createNumber(fontSize);
    this.score.anchor.set(0.5, 0);
    this.score.position.set(field.x + field.width / 2, top);
    this.combo = createNumber(fontSize);
    this.combo.anchor.set(1, 0);
    this.combo.position.set(field.x + field.width - margin, top);
    this.container.addChild(this.discards, this.score, this.combo);
  }

  render(state: GameState): void {
    show(this.discards, String(state.discards));
    show(this.score, String(state.score));
    show(this.combo, `×${String(state.combo)}`);
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }
}
