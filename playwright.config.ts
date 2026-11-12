import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const baseURL = `http://localhost:${String(port)}/neon-pounce/`;

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: Boolean(process.env.CI),
  reporter: 'list',
  use: { baseURL },
  projects: [
    { name: 'android-chromium', use: { ...devices['Pixel 7'] } },
    { name: 'ios-webkit', use: { ...devices['iPhone 15'] } },
  ],
  // Serves the built app from dist/, so run the build first.
  webServer: {
    command: `npm run preview -- --port ${String(port)} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
