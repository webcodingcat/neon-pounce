#!/usr/bin/env bash
# Stop hook: keeps Claude working until typecheck, lint and unit tests pass.
# Runs in Git Bash. Exit code 2 blocks the stop and feeds stderr back to Claude.
#
# While .claude/.tests-first exists (tests-first phase of a milestone), failing
# unit tests are intended, so they are skipped. Typecheck and lint still run.
#
# The hook input (stdin) is not evaluated: the checks are re-run on every stop,
# also when stop_hook_active is true. Claude Code itself ends the turn after 8
# consecutive blocks, so this cannot loop forever.

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0

export NO_COLOR=1

run_check() {
  local output
  if ! output=$("$@" 2>&1); then
    {
      echo "Stop hook: '$*' failed. Fix this before finishing."
      echo "$output" | tail -n 40
    } >&2
    exit 2
  fi
}

run_check npm run typecheck
run_check npm run lint

if [ -e .claude/.tests-first ]; then
  exit 0
fi

run_check npm test
exit 0
