import { expect, test } from '@playwright/test';

test('the app loads under its base path', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle('Neon Pounce');
});

test('the built app draws on a canvas and shows no frame-rate display', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await expect(page.locator('canvas')).toBeVisible();
  // The frame-rate display exists only in the dev server (A107).
  await expect(page.getByTestId('fps')).toHaveCount(0);
  expect(errors).toEqual([]);
});
