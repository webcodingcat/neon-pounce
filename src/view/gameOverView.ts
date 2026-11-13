// Game Over screen of milestone 3: the score and "Again" (A81). Highscore,
// statistics and "Menu" follow in later milestones.

import { Container, Graphics, Text } from 'pixi.js';
import { againButton, scoreSpot } from './gameOverLayout';
import type { FieldLayout } from './layout';
import { FRAME_TINT } from './palette';

/** Sizes as fractions of the field width. */
const SCORE_FONT_SIZE = 0.16;
const BUTTON_FONT_SIZE = 0.075;
const FRAME_WIDTH = 0.006;
const CORNER_RADIUS = 0.03;
/** How visible the button is while it does not react yet (A82). */
const LOCKED_ALPHA = 0.35;

function createText(text: string, fontSize: number): Text {
  const label = new Text({
    text,
    style: {
      fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
      fontSize,
      fontWeight: '700',
      fill: FRAME_TINT,
    },
  });
  label.anchor.set(0.5);
  return label;
}

export class GameOverView {
  readonly container = new Container();

  private readonly score: Text;
  private readonly button = new Container();

  constructor(field: FieldLayout) {
    const spot = scoreSpot(field);
    this.score = createText('', SCORE_FONT_SIZE * field.width);
    this.score.position.set(spot.x, spot.y);
    const rect = againButton(field);
    const frame = new Graphics()
      .roundRect(rect.x, rect.y, rect.width, rect.height, CORNER_RADIUS * field.width)
      .stroke({ color: FRAME_TINT, width: FRAME_WIDTH * field.width });
    const label = createText('Again', BUTTON_FONT_SIZE * field.width);
    label.position.set(rect.x + rect.width / 2, rect.y + rect.height / 2);
    this.button.addChild(frame, label);
    this.container.addChild(this.score, this.button);
    this.container.visible = false;
  }

  /** Shows the screen with the score of the game that just ended. */
  show(score: number): void {
    this.score.text = String(score);
    this.container.visible = true;
  }

  hide(): void {
    this.container.visible = false;
  }

  /** Dims "Again" while it does not react yet. */
  setActive(active: boolean): void {
    this.button.alpha = active ? 1 : LOCKED_ALPHA;
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }
}
