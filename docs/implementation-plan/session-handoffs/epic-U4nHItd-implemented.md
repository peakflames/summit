# Epic U4nHItd — App Shell & Diagnostics — Implemented

## What Was Built

Scaffolded the Summit Vite + TypeScript + npm project (build, lint, and test tooling) and
built the app shell every later epic renders inside: a footer version display and an
INFO-level startup console log both sourced from `package.json` at build time, guidance text
for empty active/archived views, and a single-screen layout with a responsive, in-memory
walking-skeleton habit list (add, done-today toggle, archive) at mobile and desktop widths.

## Key Files

| File | Purpose |
|---|---|
| `package.json` | Project manifest; scripts (`dev`/`build`/`lint`/`format`/`test`/`preview`); version `0.1.0` |
| `tsconfig.json` | Strict TypeScript config for `src`, `tests`, `vite.config.ts` |
| `vite.config.ts` | Vite + Vitest config; defines `__APP_VERSION__` from `package.json` |
| `src/env.d.ts` | Ambient declaration for `__APP_VERSION__` |
| `index.html` | Single-page entry point |
| `eslint.config.js` | Flat ESLint config: `@eslint/js` + `typescript-eslint` + `eslint-config-prettier` |
| `.prettierrc` / `.prettierignore` | Prettier config; ignores `docs/`, `CHANGELOG.md`, `CLAUDE.md`, `README.md` (pre-existing, unformatted prose) |
| `.gitignore` | `node_modules/`, `dist/`, `.env*`, `.DS_Store` |
| `src/main.ts` | Bootstrap; emits the startup `console.info` line, then mounts the app |
| `src/App.ts` | `mountApp(root)`; owns shell state (in-memory habits + filter), renders the single-screen layout |
| `src/components/Footer.ts` | `renderFooter()` — `Summit v<version>` |
| `src/components/EmptyState.ts` | `renderEmptyState(view)` — active/archived guidance text |
| `src/components/HabitCard.ts` | `renderHabitCard(habit, handlers)` — name, done-today toggle, archive toggle |
| `src/styles/main.css` | Mobile-first layout; `@media (min-width: 768px)` desktop rules; `.is-done` hook |
| `tests/version.test.ts` | Unit test for TOR-01-iavJayH |
| `tests/emptyState.test.ts` | Unit tests for TOR-01-Ykw9Mz4 / TOR-01-sSCWJrZ |
| `CHANGELOG.md` | `[0.1.0]` `### Added` entry for the scaffold + app shell |
| `docs/architecture.md` | §6 Frontend Architecture and §8 Container/Infrastructure filled in |
| `CLAUDE.md` | Removed the "scaffold not yet confirmed" parenthetical; added `npm test` to the quality gate list |
| `NEXT_STEPS.md` | Deleted — its own header said to delete once worked through; we are past its Step 7 |

**Walking skeleton, for the next epics' benefit:** `src/App.ts`'s habit list, `HabitCard`, and
filter are backed by a **module-scoped, in-memory `ShellHabit[]` array** — no `localStorage`,
no streak math, no name validation. Epic 1WIBPa0 replaces the array with
`src/storage/habitStore.ts`. Epic Yz4JE9Z adds name validation and real archive/unarchive.
Epic WKhBuVK adds streak math behind the existing `.habit-card__done-btn` in `HabitCard`.

## Spec Deviations

| TOR ID | As-Written | As-Implemented | Reason |
|---|---|---|---|
| — | — | — | No deviations. All 7 TORs implemented exactly per their Given/When/Then. |

## TOR Coverage

- **TOR-01-iavJayH** — PASS. Test: `tests/version.test.ts:6-17`. Impl: `src/components/Footer.ts:1-6`. Browser (via `vite preview`): footer text `"Summit v0.1.0"`, matches `/^Summit v\d+\.\d+\.\d+$/`, and equals `package.json`'s `version` field.
- **TOR-01-GgOc6Zf** — PASS. Impl: `src/main.ts:1-4` — `console.info` is the first executable statement after imports; no imported module (`./styles/main.css`, `./App`) logs anything at module-eval time. Verified against the **production build** (`npm run build && npm run preview`): the only console message on page load was `{type: "info", text: "Summit v0.1.0 starting"}`. **Verification note:** when checked against `npm run dev` instead (the gate CLAUDE.md specifies), Vite's injected HMR client logs a `debug`-level `"[vite] connecting..."` message before the app's own code runs — this is Vite dev-tooling instrumentation inherent to any app using HMR, not a message "emitted by the app" itself, and it does not appear in the built output. The implementation is correct; the dev server is simply not a clean observation point for this specific TOR. No feature-file change proposed — recording here per the "do not silently update the feature file" instruction.
- **TOR-01-Ykw9Mz4** — PASS. Test: `tests/emptyState.test.ts` (`active empty state shows guidance and the add-habit input`). Impl: `src/components/EmptyState.ts`, `src/App.ts:17-25` (form appended outside the list/empty-state swap, so it stays visible). Browser: guidance text present, `#add-habit-input` and `button[type="submit"]` both visible.
- **TOR-01-sSCWJrZ** — PASS. Test: `tests/emptyState.test.ts` (`archived empty state shows guidance`). Impl: same files. Browser: archived guidance text present after switching filters.
- **TOR-01-8FCo9h7** — PASS. Browser at 375×667: `#add-habit-input` and `.habit-card__done-btn` both visible and clickable (habit added, done-today clicked, `.is-done` class applied), zero console errors. Impl: `src/styles/main.css` (44px min tap targets, wrapping form), `src/components/HabitCard.ts`.
- **TOR-01-7ED8QkP** — PASS. Same checks at 1280×800, all true, zero console errors.
- **TOR-01-WZ9rUhS** — PASS. Browser: `window.location.href` byte-identical across add/mark-done/archive/switch-to-Archived/switch-to-Active (6 samples, all `http://localhost:5173/`); `<nav>` count 0, `<a href>` count 0. Impl: `src/App.ts:31-59` (form's submit handler calls `event.preventDefault()` at `src/App.ts:51`), `src/App.ts:61-85` (filter is two `<button>`s, not links).

## Verification Results

| Gate | Result |
|---|---|
| `npm run lint` (eslint + prettier --check) | PASS |
| `npm run build` (tsc --noEmit + vite build) | PASS |
| `npm test` (vitest run) | PASS — 3/3 tests, 2 files |
| Browser verification | PASS — driven with a temporary local Playwright/Chromium install against both `npm run dev` and `npm run preview` (no `chromium-cli`/`playwright-cli` tool was available in this environment; Playwright was installed with `--no-save` and is not a project dependency — `package-lock.json` and `package.json` are unaffected) |
| Console errors during browser run | None observed in any scenario |

**Note for future epics' browser verification:** this environment did not have a
`chromium-cli` or `playwright-cli` CLI tool preinstalled; verification here used a locally
installed `playwright` npm package (`npm install --no-save playwright` +
`npx playwright install chromium --with-deps`) driven by an ad-hoc Node script in the
scratchpad directory, not committed to the repo. Future epics doing browser verification
should expect to do the same unless a `chromium-cli`/`playwright-cli` tool becomes available,
or consider generating a project-specific run skill via `/run-skill-generator`.
