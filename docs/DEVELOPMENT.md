# Development

Neon Pounce is a web app written in TypeScript. It is built with Vite and drawn
with PixiJS. There is no server and no database. The specification is written
in German: `SPEC.md` gives the overview, the details are in `docs/spec/`.

## Prerequisites

- Node.js 26 with npm (the version is pinned in `.node-version`)
- Git
- The Playwright browsers for the smoke tests, installed once with
  `npm run e2e:install`

Install the dependencies with `npm ci`.

The project is developed with Claude Code. Its files live in `.claude/` and in
`CLAUDE.md` and are not needed to build or run the game. One of them is a stop
hook that runs type check, lint and unit tests whenever Claude finishes a turn.
It needs Git Bash on Windows (part of Git for Windows) and does not run the
build or the smoke tests, so a green hook is not yet a green CI.

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
well: open `http://localhost:5173/neon-pounce/`. Vite picks another port when
5173 is taken and prints the address it uses.

## Playing on a phone

Run `npm run dev` and open the network address it prints on a phone in the same
Wi-Fi, including the path `/neon-pounce/`. If the page does not load, the
firewall of the computer may block the port, or the Wi-Fi may keep its devices
apart (guest networks often do). The dev server reloads the page when a file
changes.

## Game values

All values that are tuned by feel live in `src/config.ts`: the time per
segment, the number of colours, lives, discards, penalties and so on. Change a
value and the dev server reloads. There are no sliders in the app. The time per
segment and the number of colours are single constants for now (`TIMER_MS`,
`COLOR_COUNT`); they will depend on the level once levels exist.

### Performance probe

`PERFORMANCE_PROBE` in the same file replaces the game with a stress test: a
full board with a stream of particles. In the dev server it shows a frame-rate
display with the elapsed time, the current value, the mean and the worst
second. The built app has no such display. A run takes five minutes
(`PROBE_DURATION_MS`); after that the display keeps the result and marks it
with ✓ when the mean is at least 58 frames per second and the worst second has
at least 50 (`PROBE_MIN_MEAN_FPS`, `PROBE_MIN_WORST_FPS`), otherwise with ✗.

## Tests

- **Unit tests** (`npm test`) cover the rules and every other part that works
  without a browser. The rule core never reads a clock and never draws its own
  random numbers: tests pass the time and a seeded generator in, so every game
  can be replayed.
- **Smoke tests** (`npm run e2e`) run the built app in Chromium and WebKit on
  emulated phones. They only check that the parts work together.

The smoke tests use whatever is in `dist/`, so build first, or they test an old
state. Locally they also reuse a server that already listens on port 4173, for
example a forgotten `npm run preview`.

### Test mode

The smoke tests cannot see single elements inside the canvas. With the address
suffix `?test=<seed>` (a whole number from 0) the app uses that seed for every
game and exposes `window.__neonPounce`:

- `screen`, `rings`, `current`, `lives`, `discards`, `score`, `combo`, `level`:
  the state of the game, read live
- `advance(ms)`: moves the time of the game forward, so a test does not have to
  wait for a timer

Without the suffix the object does not exist. The test mode is part of the
built app as well, because the smoke tests run against `dist/`; it therefore
also works on the public page. The object is described by `TestApi` in
`src/game/testMode.ts`, the rings and segments by the types in
`src/core/types.ts`.

### Protocol and export

In the dev server every game records a protocol: one entry per segment
(position, colour, what it met on the board, time to decide, misses, how it
ended) plus the seed, the configuration and the final state. The format is
`GameProtocol` in `src/dev/protocol.ts`. The Game Over screen shows an "Export"
button that hands the protocol over as the file `neon-pounce-<seed>.json`,
through the share sheet of the device where the browser offers one and as a
download otherwise. The share sheet needs HTTPS, so on a phone that reaches the
dev server over the local network the file is downloaded.

The built app records nothing and has no "Export" button, with or without the
test mode.

## Simulation

Bots that play games through the rule core are planned for milestone 6 and not
built yet. They will run with `npm run sim`.

## Structure

| Path                 | Content                                                              |
| -------------------- | -------------------------------------------------------------------- |
| `index.html`         | The page; loads `src/main.ts`                                        |
| `src/main.ts`        | Entry point: starts PixiJS, then the game or the performance probe   |
| `src/config.ts`      | All game values                                                      |
| `src/core/`          | Rule core: plain TypeScript, no dependencies, no browser APIs        |
| `src/input/`         | Turns fingers on the screen into inputs of the game                  |
| `src/view/`          | Drawing with PixiJS: layout, geometry, textures, board, HUD, screens |
| `src/game/`          | Connects rule core, clock, input and views; test mode                |
| `src/dev/`           | Tools of the dev server: frame-rate statistics, protocol, export     |
| `src/probe/`         | Performance probe: the stress test and its wiring                    |
| `e2e/`               | Playwright smoke tests                                               |
| `docs/spec/`         | Requirements, milestones and test strategy (German)                  |
| `.github/workflows/` | CI and deployment                                                    |
| `.claude/`           | Claude Code: settings, stop hook and review agents                   |

Configuration lives in the project root: `vite.config.ts` (build, base path and
unit tests), `playwright.config.ts` (smoke tests), `eslint.config.js`,
`tsconfig.json` and `.node-version`.

## Pitfalls

- **Lint limits:** complexity 10, nesting depth 3, 60 lines per function, 4
  parameters, 3 nested callbacks. Function length and nested callbacks are not
  limited in test files.
- **TypeScript stays on 6.0.x** as long as typescript-eslint requires
  `typescript <6.1`.
- **Time inside a PixiJS ticker listener:** `ticker.lastTime` is still the time
  of the previous frame there. Take the time of the current frame from
  `performance.now()`.
- **Frame rate on phones:** glow is baked into textures (no filters at
  runtime), the render resolution is capped at factor 2, and shapes are built
  once and then only moved.

## Workflow

The game is built in milestones, listed in `docs/spec/meilensteine.md`. For
each milestone:

1. A branch `m<N>-<short-name>` is created from `main`.
2. Stubs and tests are written and committed first. Only the new tests may
   fail.
3. The implementation is planned and approved by the project owner.
4. The implementation follows, in its own commits.
5. Review agents check the code, the documentation and, where a milestone
   touches them, the balance and the graphics. Their findings are decided one
   by one.
6. The project owner accepts the milestone by hand, with the checklist of the
   milestone.
7. The branch is merged into `main` with `--ff-only`. Nothing is pushed without
   being asked for.

`CLAUDE.md` holds the full rules.

## CI and deployment

GitHub Actions runs lint, type check, unit tests, build and smoke tests on
every push. A push to `main` also publishes the build to GitHub Pages at
<https://webcodingcat.github.io/neon-pounce/>. This needs GitHub Pages to be
enabled in the repository settings with "GitHub Actions" as source.

## Assets

The background image and the music will be generated locally with ComfyUI and
added to the repository as files. The asset pipeline is set up in milestone 4
and does not exist yet. A free font (SIL Open Font License) will be added as a
file as well. All other graphics and the sound effects are made by code.
