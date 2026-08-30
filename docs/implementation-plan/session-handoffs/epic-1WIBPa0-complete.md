# Epic 1WIBPa0: Local Persistence — Complete

**Completed:** 2026-08-30
**Verified by:** Independent review via `/peak-workflow:wrapup-epic 1WIBPa0`

## What Was Built

Replaced the in-memory, module-scoped habit array from Epic U4nHItd's walking skeleton with a
real `localStorage`-backed persistence layer: a namespaced read/write boundary
(`summit.habits`), a `Habit` data model, and load-time streak staleness recalculation. Every
habit mutation (add, mark done, archive, unarchive) now persists synchronously before
re-render, and the app confirmed zero network requests across the full mutation lifecycle.

## Key Files

| File | Purpose |
|------|---------|
| `src/models/Habit.ts` | `Habit` type: `{ name, streak, lastCompletedDate, archived }` |
| `src/storage/habitStore.ts` | `STORAGE_KEY = 'summit.habits'`; `loadHabits()` (shape-validates, falls back to `[]`, never throws); `saveHabits()` |
| `src/storage/streakRecalculation.ts` | `todayISO()` (local date, not UTC), `isDoneToday()`, `recalculateStreak()`, `recalculateAll()` |
| `src/App.ts` | In-memory array → store-backed state; `mountApp` loads + recalculates + persists on every mount; every mutation calls `saveHabits()` before `render()` |
| `src/components/HabitCard.ts` | `ShellHabit` → `Habit` plus a computed `doneToday` argument; added `.habit-card__streak` element |
| `tests/habitStore.test.ts` | Round-trip, absent key, malformed value |
| `tests/streakRecalculation.test.ts` | Staleness rules, local-date correctness |
| `tests/persistence.test.ts` | The four TOR integration tests |
| `tests/setup.ts` | Vitest setup — polyfills `localStorage` under jsdom (see Key Decisions) |

## Key Decisions

- Streak logic is split by lifecycle stage: this epic owns **load-time staleness
  recalculation** (`streakRecalculation.ts`); Epic WKhBuVK owns the **mark-done increment
  rule**. The done-today toggle in `App.ts` currently only sets/clears `lastCompletedDate`.
- `localStorage` is treated as an untrusted system boundary — `loadHabits()` validates shape
  and falls back to `[]` on any absent key, parse failure, or malformed value, without
  throwing or logging.
- Local-date strings (`todayISO()`, `getFullYear`/`getMonth`/`getDate`) are used instead of
  `toISOString()` to avoid UTC calendar-date drift.
- Node's experimental native `localStorage` global doesn't interoperate with vitest 2.1.9's
  bundled jsdom environment, so `tests/setup.ts` installs a minimal in-memory polyfill for
  the test environment only — the app itself only ever touches the real browser API.

## Requirements Implemented

| TOR ID | Feature File | Verdict | Test Reference |
|--------|--------------|---------|----------------|
| TOR-04-NuPmtfe | `docs/requirements/04-persistence.feature.md` | PASS | tests/persistence.test.ts:39 |
| TOR-04-8EEMGia | `docs/requirements/04-persistence.feature.md` | PASS | tests/persistence.test.ts:89 |
| TOR-04-LJb5Y0a | `docs/requirements/04-persistence.feature.md` | PASS | tests/persistence.test.ts:123 |
| TOR-04-tBD0NqR | `docs/requirements/04-persistence.feature.md` | PASS | tests/persistence.test.ts:135 |

## Verification Summary

### Counts
- TOR Requirements: 4/4 PASS, 0 CANNOT VERIFY
- Quality Gates: 4/4 PASS (lint, build, unit tests, browser verification)
- Tests: 16 passed, 0 skipped, 0 failed

### Highlights
- ✅ TOR-04-NuPmtfe — full dataset written to `localStorage` synchronously after every mutation type (add, done, archive, unarchive), confirmed both in unit test (tests/persistence.test.ts:39) and live browser inspection via `playwright-cli localstorage-get` after each click
- ✅ TOR-04-8EEMGia — name, archived state, and streak all rendered identically after a real browser reload; confirmed with `playwright-cli reload` + snapshot, not just the jsdom-simulated test
- ✅ TOR-04-LJb5Y0a — first-visit empty state renders with zero console errors after `localstorage-clear` + reload
- ✅ TOR-04-tBD0NqR — captured the full network log across add/done/archive/unarchive; all 22 recorded requests are Vite dev-server module loads from the two page navigations, zero requests added by the four mutating clicks

### Conclusion
Every TOR's Given/When/Then was independently confirmed via both automated tests (which faithfully mirror the Gherkin structure) and live browser verification against the real dev server — not mocked state. Implementation matches the documented architecture and design-notes decisions with no gaps found.

### Manual verification performed: No

## Known Issues / Follow-ups

- Pre-existing, documented, non-blocking: no favicon configured, causing a benign browser-initiated `/favicon.ico` 404 on first load (tracked in `docs/design-notes.md` §5).
- The done-today toggle only writes `lastCompletedDate`; streak increment logic is deferred to Epic WKhBuVK by design.
