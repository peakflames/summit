# Epic 1WIBPa0 — Local Persistence — Implemented

## What Was Built

Replaced `src/App.ts`'s module-scoped, in-memory `ShellHabit[]` array with a
`localStorage`-backed store: a real `Habit` model, a namespaced read/write boundary
(`summit.habits`), and load-time streak staleness recalculation. Every habit mutation (add,
mark done, archive, unarchive) now persists synchronously before re-render, and the app issues
zero network requests.

## Key Files

| File | Purpose |
|---|---|
| `src/models/Habit.ts` | **New.** `Habit` type: `{ name, streak, lastCompletedDate, archived }` |
| `src/storage/habitStore.ts` | **New.** `STORAGE_KEY = 'summit.habits'`, `loadHabits()` (shape-validates, falls back to `[]`, never throws), `saveHabits()` |
| `src/storage/streakRecalculation.ts` | **New.** `todayISO()` (local date, not UTC), `isDoneToday()`, `recalculateStreak()`, `recalculateAll()` |
| `src/App.ts` | In-memory array → store-backed state; `mountApp` loads + recalculates + persists + resets `filter` to `'active'` on every mount; every mutation calls `saveHabits()` before `render()` |
| `src/components/HabitCard.ts` | `ShellHabit` → `Habit` + a computed `doneToday: boolean` argument; added a `.habit-card__streak` element so streak is observable in the DOM (needed to verify TOR-04-8EEMGia's "streak renders identically after reload") |
| `tests/habitStore.test.ts` | **New.** Round-trip, absent key, malformed value |
| `tests/streakRecalculation.test.ts` | **New.** Staleness rules (today/yesterday/older/never), local-date correctness |
| `tests/persistence.test.ts` | **New.** The four TOR integration tests |
| `tests/setup.ts` | **New.** Vitest setup file — see Spec Deviations |
| `tests/emptyState.test.ts` | Added `localStorage.clear()` to `beforeEach` |
| `vite.config.ts` | Added `test.setupFiles: ['./tests/setup.ts']` |
| `.gitignore` | Added `.playwright-cli/` (browser-verification scratch snapshots) |
| `docs/design-notes.md` | New §4 decision: storage schema, local-date convention, 1WIBPa0/WKhBuVK streak-ownership split; §3 Staged Replacement Plan entry updated to past tense |
| `docs/architecture.md` | §6 rewritten to describe the store modules in place of the in-memory array |
| `CHANGELOG.md` | `[0.1.0]` `### Added` line for local persistence |

## Spec Deviations

| TOR ID | As-Written | As-Implemented | Reason |
|---|---|---|---|
| — | — | — | No deviations against the TOR Given/When/Then. One environment-level addition beyond the plan's file list: `tests/setup.ts` + `vite.config.ts`'s `setupFiles`. This project's Node runtime (v26.8.1) ships an experimental native `localStorage` global that vitest 2.1.9's bundled jsdom environment does not know to override (its key-allowlist predates Node's native global), leaving `globalThis.localStorage` non-functional under jsdom. `tests/setup.ts` installs a minimal `Storage`-compatible in-memory polyfill via `Object.defineProperty` so `localStorage` works in the test environment. This is a test-infrastructure fix, not a change to app behavior — the app itself only ever touches the real browser's `localStorage`, confirmed working correctly in the browser verification below. |

## TOR Coverage

- **TOR-04-NuPmtfe** (write full dataset after every mutation) — **PASS**. Test:
  `tests/persistence.test.ts` (`writes the full dataset after every mutation`). Impl:
  `src/App.ts` — add (`saveHabits` after push), done-today toggle (`saveHabits` after setting
  `lastCompletedDate`), archive/unarchive (`saveHabits` after flipping `archived`), each call
  synchronous and before `render()`. Browser verification: added "Read daily" + "Stretch",
  marked "Read daily" done, archived "Stretch" — `localStorage['summit.habits']` inspected via
  `playwright-cli localstorage-get` after each action and reflected the change immediately
  (`lastCompletedDate: "2026-08-30"` after mark-done; `archived: true` after archive; `archived:
  false` after a subsequent unarchive).
- **TOR-04-8EEMGia** (restore full list on reload, no data loss) — **PASS**. Test:
  `tests/persistence.test.ts` (`restores names, archived states, and streaks across a reload`).
  Impl: `src/App.ts`'s `mountApp` — `recalculateAll(loadHabits(), todayISO())` on every mount.
  Browser verification: after the mutation sequence above, reloaded the page — "Read daily"
  (Active, Streak: 0) and "Stretch" (Archived, Streak: 0, Unarchive button) rendered identically
  to their pre-reload state, with a clean console (0 errors).
- **TOR-04-LJb5Y0a** (empty list, no error, on first visit) — **PASS**. Test:
  `tests/persistence.test.ts` (`initializes an empty list with no console error on first
  visit`) and `tests/habitStore.test.ts` (`returns an empty list when the key is absent`).
  Impl: `src/storage/habitStore.ts`'s `loadHabits()` returns `[]` on a missing key without
  throwing or logging. Browser verification: cleared `localStorage`, reloaded — "No habits yet."
  guidance rendered; `playwright-cli console error` reported 0 error-level messages (the one
  error-level message seen earlier in the session, a `/favicon.ico` 404, is the pre-existing
  documented deferred issue at `docs/design-notes.md`, not an app-issued request, and did not
  recur on this reload since the browser had already cached the 404).
- **TOR-04-tBD0NqR** (zero network requests for any habit operation) — **PASS**. Test:
  `tests/persistence.test.ts` (`issues no network requests during any mutation`) — spies on
  `globalThis.fetch`/`globalThis.XMLHttpRequest`, neither called across add/mark-done/
  archive/unarchive. Browser verification: captured the full request log
  (`playwright-cli requests --static`) across the mutation sequence — all 33 recorded requests
  are Vite dev-server page/module loads from navigations; the click-driven mutations (done,
  archive, unarchive) added zero new entries to the log.

## Verification Results

| Gate | Result |
|---|---|
| `npm run lint` (eslint + prettier --check) | PASS |
| `npm run build` (tsc --noEmit + vite build) | PASS |
| `npm test` (vitest run) | PASS — 16/16 tests, 5 files |
| Browser verification | PASS — driven with `playwright-cli` (available in this environment; no fallback to the ad-hoc Playwright script from the U4nHItd handoff was needed) against `npm run dev` |
| Console errors during browser run | None from app code; one pre-existing/documented `/favicon.ico` 404 (browser-initiated, not app-issued) |

## Note for Epic WKhBuVK

`src/storage/streakRecalculation.ts` owns the load-time staleness rule (`recalculateStreak`,
`recalculateAll`) and the canonical `todayISO()` local-date helper — reuse it rather than
reimplementing date math. The done-today toggle in `src/App.ts` currently only writes
`lastCompletedDate` (`todayISO()` when marking done, `null` when unmarking) and does **not**
touch `streak` — that increment logic is what WKhBuVK plugs in at that same call site.
