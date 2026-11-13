// Smoke tests of a game through the test mode (A110). They check that the
// parts work together, not the rules.

import { expect, test, type Page } from '@playwright/test';
import {
  DOUBLE_TAP_MS,
  GAME_OVER_FADE_MS,
  GAME_OVER_LOCK_MS,
  START_LIVES,
  TIMER_MS,
} from '../src/config';
import { againButton } from '../src/view/gameOverLayout';
import { boardGeometry, ringCenter, type Point } from '../src/view/geometry';
import { fieldCenter, fieldLayout, type FieldLayout } from '../src/view/layout';

/** The emulated phones have no notch. */
const NO_INSETS = { top: 0, right: 0, bottom: 0, left: 0 };

function fieldOf(page: Page): FieldLayout {
  const viewport = page.viewportSize();
  if (viewport === null) {
    throw new Error('The test needs a fixed viewport');
  }
  return fieldLayout(viewport, NO_INSETS);
}

function ringSpot(page: Page, ring: number): Point {
  const field = fieldOf(page);
  return ringCenter(boardGeometry(fieldCenter(field), field.width), ring);
}

async function startGame(page: Page): Promise<void> {
  await page.goto('./?test=5');
  await page.waitForFunction(() => window.__neonPounce !== undefined);
}

async function advance(page: Page, ms: number): Promise<void> {
  await page.evaluate((step) => {
    window.__neonPounce?.advance(step);
  }, ms);
}

/** Places the current segment into a ring. The mouse acts like one finger. */
async function tapRing(page: Page, ring: number): Promise<void> {
  // Past the protection against double taps.
  await advance(page, DOUBLE_TAP_MS);
  const spot = ringSpot(page, ring);
  await page.mouse.click(spot.x, spot.y);
}

function filledSlots(page: Page, ring: number): Promise<number | undefined> {
  return page.evaluate(
    (index) => window.__neonPounce?.rings[index]?.filter((slot) => slot !== null).length,
    ring,
  );
}

test('there is no test object without the address suffix', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('canvas')).toBeVisible();
  expect(await page.evaluate(() => window.__neonPounce)).toBeUndefined();
});

test('a tap puts the segment into the ring', async ({ page }) => {
  await startGame(page);
  expect(await page.evaluate(() => window.__neonPounce?.screen)).toBe('game');
  expect(await page.evaluate(() => window.__neonPounce?.lives)).toBe(START_LIVES);
  const first = await page.evaluate(() => window.__neonPounce?.current.id);
  await tapRing(page, 2);
  expect(await filledSlots(page, 2)).toBe(1);
  expect(await page.evaluate(() => window.__neonPounce?.score)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.__neonPounce?.current.id)).not.toBe(first);
});

test('Game Over appears after the last life, and "Again" starts a new game', async ({ page }) => {
  await startGame(page);
  await tapRing(page, 0);
  for (let life = 0; life < START_LIVES; life += 1) {
    await advance(page, TIMER_MS);
  }
  expect(await page.evaluate(() => window.__neonPounce?.lives)).toBe(0);
  expect(await page.evaluate(() => window.__neonPounce?.screen)).toBe('game');
  await advance(page, GAME_OVER_FADE_MS);
  expect(await page.evaluate(() => window.__neonPounce?.screen)).toBe('gameOver');
  // "Export" exists only in the dev server (A107).
  await expect(page.getByTestId('export')).toHaveCount(0);

  // "Again" does not react right after Game Over appeared (A82).
  const again = againButton(fieldOf(page));
  await page.mouse.click(again.x + again.width / 2, again.y + again.height / 2);
  expect(await page.evaluate(() => window.__neonPounce?.screen)).toBe('gameOver');

  await advance(page, GAME_OVER_LOCK_MS);
  await page.mouse.click(again.x + again.width / 2, again.y + again.height / 2);
  expect(await page.evaluate(() => window.__neonPounce?.screen)).toBe('game');
  expect(await page.evaluate(() => window.__neonPounce?.lives)).toBe(START_LIVES);
  expect(await page.evaluate(() => window.__neonPounce?.score)).toBe(0);
  expect(await filledSlots(page, 0)).toBe(0);
});
