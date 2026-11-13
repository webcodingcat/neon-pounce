// Numbers at the top of the field: discards on the left, score in the middle
// with the lives below it, combo on the right. Plain numbers and placeholder
// symbols until the later milestones bring the real HUD (A80). No words:
// during play there are only numbers and symbols.

import { Container, Text } from 'pixi.js';
import { START_LIVES } from '../config';
import type { GameState } from '../core/types';
import { discardSymbol, type DiscardSymbol } from './hudSymbols';
import type { FieldLayout } from './layout';
import { FRAME_TINT } from './palette';

/** Sizes as fractions of the field width. */
const FONT_SIZE = 0.075;
const MARGIN = 0.06;
/** Distance between the two rows, as a multiple of the font size. */
const ROW_STEP = 1.3;

/** Asks for the text form of a character that also exists as an emoji. */
const AS_TEXT = String.fromCharCode(0xfe0e);
/**
 * Placeholder symbols until milestone 9 draws the real ones. The give-up symbol
 * must not look like the cross of the combo.
 */
const DISCARD_SYMBOLS: Readonly<Record<DiscardSymbol, string>> = {
  discard: '»',
  giveUp: '!',
};
const LIFE = `♥${AS_TEXT}`;
const LOST_LIFE = `♡${AS_TEXT}`;

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

/** One symbol per life of a game. Lost lives stay as outlines. */
function livesText(lives: number): string {
  const left = Math.max(0, Math.min(lives, START_LIVES));
  return LIFE.repeat(left) + LOST_LIFE.repeat(START_LIVES - left);
}

export class Hud {
  readonly container = new Container();

  private readonly discards: Text;
  private readonly score: Text;
  private readonly lives: Text;
  private readonly combo: Text;

  constructor(field: FieldLayout) {
    const fontSize = FONT_SIZE * field.width;
    const margin = MARGIN * field.width;
    const top = field.y + margin;
    const middle = field.x + field.width / 2;
    this.discards = createNumber(fontSize);
    this.discards.position.set(field.x + margin, top);
    this.score = createNumber(fontSize);
    this.score.anchor.set(0.5, 0);
    this.score.position.set(middle, top);
    this.lives = createNumber(fontSize);
    this.lives.anchor.set(0.5, 0);
    this.lives.position.set(middle, top + ROW_STEP * fontSize);
    this.combo = createNumber(fontSize);
    this.combo.anchor.set(1, 0);
    this.combo.position.set(field.x + field.width - margin, top);
    this.container.addChild(this.discards, this.score, this.lives, this.combo);
  }

  render(state: GameState): void {
    // With an empty stock the symbol turns into the give-up symbol (A28).
    const symbol = DISCARD_SYMBOLS[discardSymbol(state.discards)];
    show(this.discards, `${symbol}${String(state.discards)}`);
    show(this.score, String(state.score));
    show(this.lives, livesText(state.lives));
    show(this.combo, `×${String(state.combo)}`);
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }
}
