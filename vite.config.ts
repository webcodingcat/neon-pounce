import { defineConfig } from 'vitest/config';

export default defineConfig({
  // The app is served from a sub-path on GitHub Pages.
  base: '/neon-pounce/',
  test: {
    include: ['src/**/*.test.ts'],
  },
});
