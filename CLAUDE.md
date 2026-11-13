# Neon Pounce

Requirements and decisions live in `SPEC.md` and `docs/spec/` (German).

Prerequisites: Node.js 26 with npm, Git for Windows (Git Bash runs the stop
hook), Playwright browsers (`npm run e2e:install`, once).

## Commands

| Command             | Purpose                                                      |
| ------------------- | ------------------------------------------------------------ |
| `npm test`          | Unit tests (Vitest, `src/**/*.test.ts`)                      |
| `npm run lint`      | ESLint and Prettier check                                    |
| `npm run typecheck` | `tsc --noEmit`                                               |
| `npm run build`     | Production build to `dist/`                                  |
| `npm run format`    | Format all files with Prettier                               |
| `npm run e2e`       | Playwright smoke tests against `dist/` (run the build first) |
| `npm run dev`       | Dev server, reachable from a phone in the local network      |
| `npm run preview`   | Serve the built app                                          |

## Conventions and version decisions

- TypeScript stays on 6.0.x while typescript-eslint requires `typescript <6.1`.
- PixiJS 8.23 is installed. vite-plugin-pwa 2.0 is added in milestone 15.
  Sound uses the Web Audio API without a library.
- The rule core is plain TypeScript without dependencies and without browser
  APIs. It receives its random generator (seeded) and the time as arguments and
  never reads a clock.
- The app is served under the base path `/neon-pounce/`.
- Rendering: glow is baked into textures (no per-object filters at runtime),
  render resolution is capped at factor 2, shapes are built once and then only
  moved.
- The user interface is English. No text during play, only numbers and symbols.

## Pitfalls

- The stop hook runs typecheck, lint and unit tests. It does not run the build
  or the smoke tests.
- Lint limits: complexity 10, nesting depth 3, 60 lines per function, 4
  parameters, 3 nested callbacks. Function length and nested callbacks are not
  limited in test files.
- Inside a PixiJS ticker listener, `ticker.lastTime` is still the time of the
  previous frame. Take the time of the current frame from `performance.now()`.

## Rules

- Never change or refactor a test from an earlier milestone to make something
  pass. If you think such a test is wrong, or the spec changed its behaviour,
  report it and propose the change. Apply it only after my approval, in its own
  commit. For tests of the current milestone see steps 2 and 4 of the workflow.
- No new dependency without asking me first.
- Run project commands exactly as listed above, via the project scripts from the
  project root, never via npx and without cd, pipes or redirects. Run each
  command as its own tool call. Write commit messages with several -m flags,
  never with a heredoc.
- While writing tests before the implementation, create `.claude/.tests-first`
  (an empty, git-ignored file, never committed). With the file present the stop
  hook still runs typecheck and lint and blocks on their errors, but skips the
  unit tests. If it is left behind, the unit tests no longer run, so delete it
  before implementing. Add stubs first: types, constants (with their spec
  values) and function signatures without behaviour. A stub returns a neutral
  value (e.g. the unchanged state) where that is natural. It throws a fixed,
  recognisable error (`throw new Error('Not implemented')`) only where no
  neutral value exists. Stubs must pass the linter (unused parameters are
  allowed only with a leading underscore, e.g. `_state`). Tests must fail on
  their assertions, not on missing names or type errors. The only accepted
  exception is the deliberate throw of a stub. Never implement behaviour just to
  silence the hook.
- Changes to SPEC.md, docs/spec/ and CLAUDE.md that reviewers suggest are my
  decision: propose them, do not apply them on your own.
- Git: one branch per milestone, merged into `main` with `--ff-only` after my
  acceptance. Push only when I ask.

## Workflow per milestone

1. Create the branch `m<N>-<short-name>` from `main`, e.g. `m1-playable-core`.
2. Create `.claude/.tests-first`. Add stubs first (types, constants, function
   signatures without behaviour), then write the tests. Typecheck and lint must
   be green; only the tests may fail, and on their assertions, not on missing
   names or type errors. Explain every new test that already passes to me in
   chat, one by one: why it passes without the implementation and whether it
   still checks something real. Commit stubs and tests together without waiting
   for my approval. Tests of the current milestone may be adjusted before the
   implementation when I ask for it. The rule "never change an existing test"
   applies to tests of earlier milestones.
3. Plan in plan mode. Present together with the plan: a short mapping table
   (requirement, number and names of the tests, one row per requirement),
   special cases (new tests that already pass, required changes to existing
   tests with diff, requirements without a test and the reason) and assumptions
   where the spec was ambiguous. Without special cases and assumptions these
   parts are omitted. When I approve an assumption, propose afterwards to make
   the requirement in the spec precise (only after my approval, in its own
   commit). Show the tests themselves only when I ask.
4. Delete `.claude/.tests-first`, implement, commit. If a test of the current
   milestone fails, say whether the test or the code is wrong, and fix a wrong
   test in its own commit with one sentence of justification.
5. Start `code-reviewer` with the list of changed files (also `docs-reviewer`
   if documentation changed, and the `<system>-reviewer` from `.claude/agents/`
   if the milestone touches a system that has one). Apply MUSS findings on
   code. Present all other findings one by one and wait for my decision.
   Findings that concern SPEC.md, `docs/spec/` or CLAUDE.md are always my
   decision, MUSS findings included. If a review decides behaviour beyond the
   spec, propose to add it to the spec (only after my approval). Tests that a
   review suggests after the implementation go into their own commit, and the
   message says that they were never red.
6. Acceptance by me, according to the Definition of Done in SPEC.md. Before
   asking for acceptance, show me what I have to check myself: the start
   command, the checklist of the milestone with action and expected result for
   each item, and the transition behaviour. If nothing is manual, say so
   explicitly. Do not tick anything yourself. Also show a short overview of
   open points, one line each, split into "needs my decision" and "for
   information only": open or postponed findings, proposed but unapplied
   changes to spec, docs or CLAUDE.md, approved assumptions without an entry in
   the spec, unchecked checklist items. If nothing is open, one sentence is
   enough.
7. Only then merge into `main` (`--ff-only`). Afterwards update status and
   checklist in a separate commit on `main`: `**Status:** erledigt am <date>
(Commit <hash>)`, where the hash is the state of the branch at the merge
   (`git rev-parse --short HEAD` right before the status commit).
