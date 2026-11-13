# Development

Neon Pounce is a web app written in TypeScript. It is built with Vite and drawn
with PixiJS. The specification is written in German: `SPEC.md` gives the
overview, the details are in `docs/spec/`.

## Prerequisites

- Node.js 26 with npm (the version is pinned in `.node-version`)
- Git. On Windows use Git for Windows: its Git Bash runs the stop hook of
  Claude Code.
- The Playwright browsers for the smoke tests, installed once with
  `npm run e2e:install`

Install the dependencies with `npm ci`.

## Commands

| Command             | Purpose                                                      |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Dev server, reachable from a phone in the local network      |
| `npm test`          | Unit tests (Vitest, `src/**/*.test.ts`)                      |
| `npm run lint`      | ESLint and Prettier check                                    |
| `npm run typecheck` | `tsc --noEmit`                                               |
| `npm run build`     | Production build to `dist/`                                  |
| `npm run e2e`       | Playwright smoke tests against `dist/` (run the build first) |
| `npm run preview`   | Serve the built app                                          |
| `npm run format`    | Format all files with Prettier                               |

The app is served under the base path `/neon-pounce/`, in the dev server as
well: open `http://localhost:5173/neon-pounce/`.

## Playing on a phone

Run `npm run dev` and open the network address it prints on a phone in the same
Wi-Fi. The dev server reloads the page when a file changes.

## Game values

All values that are tuned by feel live in `src/config.ts`: the time per
segment, the number of colours, lives, discards, penalties and so on. Change a
value and the dev server reloads. There are no sliders in the app.

`PERFORMANCE_PROBE` in the same file replaces the game with a stress test: a
full board with a stream of particles and a frame-rate display.

## Tests

- **Unit tests** (`npm test`) cover the rules and every other part that works
  without a browser. The rule core never reads a clock and never draws its own
  random numbers: tests pass the time and a seeded generator in, so every game
  can be replayed.
- **Smoke tests** (`npm run e2e`) run the built app in Chromium and WebKit on
  emulated phones. They only check that the parts work together.

### Test mode

The smoke tests cannot see single elements inside the canvas. With the address
suffix `?test=<seed>` (a whole number) the app uses that seed for every game
and exposes `window.__neonPounce`:

- `screen`, `rings`, `current`, `lives`, `discards`, `score`, `combo`, `level`:
  the state of the game, read live
- `advance(ms)`: moves the time of the game forward, so a test does not have to
  wait for a timer

Without the suffix the object does not exist.

### Protocol and export

In the dev server every game records a protocol: one entry per segment
(position, colour, time to decide, misses, how it ended) plus the seed, the
configuration and the final state. The Game Over screen shows an "Export"
button that hands the protocol over as a JSON file, through the share sheet of
the device where the browser offers one and as a download otherwise. The share
sheet needs HTTPS, so on a phone that reaches the dev server over the local
network the file is downloaded.

The built app records nothing and has no "Export" button.

## Simulation

Bots that play games through the rule core are planned and not built yet.

## Structure

| Path                 | Content                                                              |
| -------------------- | -------------------------------------------------------------------- |
| `src/config.ts`      | All game values                                                      |
| `src/core/`          | Rule core: plain TypeScript, no dependencies, no browser APIs        |
| `src/input/`         | Turns fingers on the screen into inputs of the game                  |
| `src/view/`          | Drawing with PixiJS: layout, geometry, textures, board, HUD, screens |
| `src/game/`          | Connects rule core, clock, input and views; test mode                |
| `src/dev/`           | Tools of the dev server: frame-rate display, protocol, export        |
| `src/probe/`         | Performance probe                                                    |
| `e2e/`               | Playwright smoke tests                                               |
| `docs/spec/`         | Requirements, milestones and test strategy (German)                  |
| `.github/workflows/` | CI and deployment                                                    |

Three rules keep the frame rate up on phones: glow is baked into textures (no
filters at runtime), the render resolution is capped at factor 2, and shapes
are built once and then only moved.

## Workflow

The game is built in milestones, listed in `docs/spec/meilensteine.md`. Each
milestone lives on its own branch `m<N>-<short-name>`, with tests written before
the implementation, and is merged into `main` with `--ff-only` once it is
accepted. The steps are described in `CLAUDE.md`.

## CI and deployment

GitHub Actions runs lint, type check, unit tests, build and smoke tests on
every push. A push to `main` also publishes the build to GitHub Pages at
<https://webcodingcat.github.io/neon-pounce/>. This needs GitHub Pages to be
enabled in the repository settings with "GitHub Actions" as source.

## Assets

The background image and the music will be generated locally with ComfyUI and
added to the repository as files. The asset pipeline is not set up yet. All
other graphics and the sound effects are made by code.
