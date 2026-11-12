import { expect, test } from '@playwright/test';

test('the app loads under its base path', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle('Neon Pounce');
});
