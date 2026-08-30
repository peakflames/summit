# Summit

Summit is a single-page habit tracker: add a habit, mark it done for today, track a streak
count per habit, and filter by active/archived habits. It is built as the public reference
example for the `peak-workflow` plugin, so favor clarity and a clean end-to-end lifecycle
walkthrough over feature breadth.

## Tech Stack

- **Language:** TypeScript
- **Build tool / dev server:** Vite
- **Package manager:** npm
- **Backend:** none — client-only SPA
- **Persistence:** `localStorage` (no database, no API)

## Local Environment

- **Frontend:** `npm run dev` starts the Vite dev server.
- **Backend:** N/A — there is no backend. All state lives in `localStorage` in the browser.
- **Live data vs. mocking:** N/A — there is no external API to mock. Verification should
  exercise the real `localStorage`-backed app in a browser, not a mocked state layer.

## Tool Hygiene & Operability

This section declares the project's conventions for the load-bearing tool-hygiene practices.
Each line is a baseline TOR requirement source — `/peak-workflow:capture-requirements` will
ensure at least one TOR exists per active line, written in the form appropriate to the
declared mechanism. Lines marked `N/A` are skipped.

**Project type:** Web app

**Version exposure:** Version is displayed in the app footer, sourced from `package.json`
at build time.

**Version stamped at log startup:** The first console line emitted on app init includes the
tool name and semantic version (e.g., `console.info("Summit v0.1.0 starting")`), sourced from
the same build-time constant as the footer. In Vite, this is wired via a `define` in
`vite.config.ts` that reads `package.json`'s `version` field into a compile-time constant
(e.g., `__APP_VERSION__`), referenced from both the footer component and the startup log in
`main.ts`.

**Version single source of truth:** `package.json` (`version` field).

**Logging convention:**
- Levels: `debug` / `info` / `warn` / `error`, using the native `console.debug` /
  `console.info` / `console.warn` / `console.error` methods directly.
- Format: human-readable plain text.
- Configured at: no central logger module — console methods are called directly at each
  call site per the levels above.

**Exit code convention:** N/A — not a CLI.

**stdout / stderr discipline:** N/A — not a CLI.

**Error message standard:** User-facing errors (e.g., invalid habit input) name the problem
AND the next user action. Example: `Habit name cannot be empty. Enter a name to add this habit.`

## Security Baseline

These are coding-standard reminders that apply to every epic. They are NOT requirements —
TORs verify positive observable behavior, and "do not X" invariants are hard to express as
Given/When/Then. They MUST be respected during implementation and reviewed during
`/peak-workflow:wrapup-epic`.

**No `shell=True` / `eval` with user input.**
Never pass user-supplied data to a shell interpreter without escaping. In Python, prefer
`subprocess.run([...])` with a list; never `subprocess.run(cmd, shell=True)` on user input.
In Node.js, prefer `child_process.execFile` over `exec`. In any language, never use `eval`
or `Function()` constructors on user input.

**Do not log secrets or PII.**
Tokens, passwords, API keys, session IDs, and personally identifiable information must
never appear in logs. The structured logger should redact known-sensitive keys
(`password`, `token`, `secret`, `api_key`, `authorization`, `cookie`, etc.). Review log
output during `/peak-workflow:wrapup-epic` for accidental leakage.

**No secrets committed to the repo.**
`.env`, credential files, private keys, and any configuration containing real secrets must
be in `.gitignore`. Use environment variables, secret managers, or encrypted files (e.g.,
`sops`, `age`) for sensitive configuration.

`/peak-workflow:wrapup-epic` includes these as default review items unless the project type
makes them inapplicable.

## Peak Workflow

This project uses the `peak-workflow` plugin to manage requirements, planning, and
implementation:

- `/peak-workflow:discover` — establish or update the product vision and ConOps
- `/peak-workflow:capture-requirements` — derive TOR requirements from vision/ConOps
- `/peak-workflow:plan-project` — derive phases/epics from the TOR requirements baseline
- `/peak-workflow:add` — add new epic(s) from a natural language description
- `/peak-workflow:triage` — size an incoming issue/request (HEAVY / EPIC / TRIVIAL)
- `/peak-workflow:start-epic <id>` — implement an epic
- `/peak-workflow:wrapup-epic <id>` — independently verify a completed epic
- `/peak-workflow:pause` — save progress and stop mid-epic
- `/peak-workflow:quick-fix` — lightweight path for trivial items
- `/peak-workflow:refresh-docs` — sync architecture/design docs to the as-built codebase
- `/peak-workflow:status` — project status dashboard
- `/peak-workflow:setup` — audit/repair this file and the doc stubs

**Requirements baseline:** `docs/requirements/` (TOR feature files + tracing sidecars)
**Implementation plan:** `docs/implementation-plan/` — run `/peak-workflow:status` for the dashboard

## Verification & Quality Gates

Before marking an epic complete, run:

- **Build:** `npm run build`
- **Lint/format:** `npm run lint`
- **Browser verification:** automated check via the `playwright-cli` skill against
  `npm run dev` — exercise the golden path (add habit, mark done, streak updates, filter
  active/archived) and relevant edge cases.

*(Commands assume the standard Vite + TypeScript scaffold's `package.json` scripts —
confirm they match once the project is scaffolded.)*

## Important Reminders

*(None yet — this is a greenfield project with no code. Revisit after the first epic is
implemented and project-specific constraints or gotchas emerge.)*

## Reference Materials

*(None yet — no external docs or design references exist for this project yet.)*

## Git Workflow

- **Branch strategy:** `develop` for active work, `main` for releases.
- **Epic branches:** `feature/epic-<id>-<short-name>`, where `<id>` is either a legacy
  integer (pre-v2.0.0 epics, e.g. `7` or `6.5`) or a 7-character alphanumeric ID (v2.0.0+
  epics, e.g. `a3f2K7p`), and `<short-name>` is derived from the epic spec filename
  (e.g., `epic-a3f2K7p-user-auth.md` → `feature/epic-a3f2K7p-user-auth`).
- **Quick-fix branches:** `hotfix/issue-<N>-<slug>` when tied to a GitHub issue, or
  `hotfix/<slug>` otherwise.
- **Merges:** use `--no-ff` to preserve a merge commit per epic/feature.
- **Pushing:** always ask the user before pushing to `origin`.
- **Never commit:** `.env`, `.env.local`, `.env.*.local`, or any file containing real
  secrets or credentials.

## CRITICAL: Verification Before Commit Rule

**NEVER commit code changes before verification!**

A successful build (compile) does NOT equal working code. The workflow MUST be:

1. **Implement** — Make the code changes
2. **Lint** — Run `npm run lint` to verify formatting and static analysis
3. **Build** — Run `npm run build` to build
4. **Verify** — Use the `playwright-cli` skill against `npm run dev` to confirm functionality
5. **Commit** — ONLY after verification passed

**Why this matters:**
- Compiled code ≠ correct behavior
- UI changes need visual/interaction verification
- State logic (streaks, filters, persistence) needs functional testing in a real browser
- Committing untested code pollutes git history with potential bugs

**Verification Workflow Example:**
```bash
npm run lint                                      # Check formatting + static analysis
npm run build                                     # Build
npm run dev                                       # Start dev server
# playwright-cli: exercise the golden path and edge cases in the browser
git add <files> && git commit -m "feat: ..."      # Commit after verification
```

## Release Protocol

**Prerequisites:** Must be on `develop` branch with a clean working tree.

**Steps:**

1. **Finalize CHANGELOG** — Change `[X.Y.Z] - UNDER DEVELOPMENT` → `[X.Y.Z] - DD-MMM-YYYY` in `CHANGELOG.md`
   - Commit: `chore: release vX.Y.Z`

2. **Merge to main**
   ```bash
   git checkout main && git pull origin main
   git merge develop --no-ff -m "Merge branch 'develop' into main for release vX.Y.Z"
   ```

3. **Tag the release** (on `main`)
   ```bash
   git tag -a vX.Y.Z -m "Release vX.Y.Z - Brief description"
   git push origin vX.Y.Z
   ```

4. **Merge back to develop**
   ```bash
   git checkout develop && git merge main --no-ff
   ```

5. **Post-release version bump** (on `develop`)
   - Bump `package.json`: `"version": "X.Y.Z"` → next version
   - Add `## [X.Y+1.0] - UNDER DEVELOPMENT` to `CHANGELOG.md`
   - Commit: `chore: bump version for next development cycle`

6. **Push** (ASK USER FIRST)
   ```bash
   git push origin main && git push origin develop
   ```

**Note:** No CI/CD pipeline exists yet for this project. If one is added later, describe
here how it responds to branch pushes vs. tags (e.g., tests on every PR, deploy on tag push).
