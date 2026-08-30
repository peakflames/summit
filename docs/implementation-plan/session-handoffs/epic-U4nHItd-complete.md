# Epic U4nHItd: App Shell & Diagnostics — Complete

**Completed:** 2026-08-30
**Verified by:** Independent review via `/peak-workflow:wrapup-epic U4nHItd`

## What Was Built

Scaffolded the Summit Vite + TypeScript + npm project and built the app shell every later
epic renders inside: a footer version display and an INFO-level startup console log both
sourced from `package.json` at build time, guidance text for empty active/archived views,
and a single-screen, responsive layout with an in-memory walking-skeleton habit list (add,
done-today toggle, archive) at mobile and desktop widths.

## Key Files

| File | Purpose |
|------|---------|
| `package.json` | Project manifest; scripts (`dev`/`build`/`lint`/`format`/`test`/`preview`); version `0.1.0` |
| `vite.config.ts` | Vite + Vitest config; defines `__APP_VERSION__` from `package.json` |
| `src/main.ts` | Bootstrap; emits the startup `console.info` line, then mounts the app |
| `src/App.ts` | `mountApp(root)`; owns shell state (in-memory habits + filter), renders the single-screen layout |
| `src/components/Footer.ts` | `renderFooter()` — `Summit v<version>` |
| `src/components/EmptyState.ts` | `renderEmptyState(view)` — active/archived guidance text |
| `src/components/HabitCard.ts` | `renderHabitCard(habit, handlers)` — name, done-today toggle, archive toggle |
| `src/styles/main.css` | Mobile-first layout; `@media (min-width: 768px)` desktop rules; `.is-done` hook |
| `tests/version.test.ts` | Unit test for TOR-01-iavJayH |
| `tests/emptyState.test.ts` | Unit tests for TOR-01-Ykw9Mz4 / TOR-01-sSCWJrZ |

## Key Decisions

- `src/App.ts`'s habit list, `HabitCard`, and filter are backed by a module-scoped, in-memory
  `ShellHabit[]` array — no `localStorage`, no streak math, no name validation. This is an
  intentional walking skeleton for later epics to replace: Epic 1WIBPa0 swaps the array for
  `src/storage/habitStore.ts`; Epic Yz4JE9Z adds name validation and real archive/unarchive;
  Epic WKhBuVK adds streak math behind the existing `.habit-card__done-btn` in `HabitCard`.
- No `<link rel="icon">` was added, so browsers request `/favicon.ico` and get a 404 on every
  page load. This is cosmetic, unrelated to any TOR, and left as a follow-up (see Known Issues).

## Requirements Implemented

| TOR ID | Feature File | Verdict | Test Reference |
|--------|--------------|---------|----------------|
| TOR-01-iavJayH | `docs/requirements/01-app-shell.feature.md` | PASS | tests/version.test.ts:6-17 |
| TOR-01-GgOc6Zf | `docs/requirements/01-app-shell.feature.md` | PASS | live browser (dev + preview) console capture |
| TOR-01-Ykw9Mz4 | `docs/requirements/01-app-shell.feature.md` | PASS | tests/emptyState.test.ts |
| TOR-01-sSCWJrZ | `docs/requirements/01-app-shell.feature.md` | PASS | tests/emptyState.test.ts |
| TOR-01-8FCo9h7 | `docs/requirements/01-app-shell.feature.md` | PASS | live browser @ 375×667 |
| TOR-01-7ED8QkP | `docs/requirements/01-app-shell.feature.md` | PASS | live browser @ 1280×800 |
| TOR-01-WZ9rUhS | `docs/requirements/01-app-shell.feature.md` | PASS | live browser URL/nav-element checks |

## Verification Summary

### Counts
- TOR Requirements: 7/7 PASS
- Quality Gates: 4/4 PASS
- Tests: 3 passed, 0 skipped, 0 failed

### Highlights
- ✅ TOR-01-iavJayH — footer renders `"Summit v0.1.0"`, matches `/^Summit v\d+\.\d+\.\d+$/`, equals `package.json`'s version field (tests/version.test.ts:6-17, src/components/Footer.ts:1-6)
- ✅ TOR-01-GgOc6Zf — first console message on both `npm run dev` and `npm run preview` is `[INFO] Summit v0.1.0 starting`, plain text (src/main.ts:1-4)
- ✅ TOR-01-Ykw9Mz4 / TOR-01-sSCWJrZ — empty-state guidance text and add-habit input verified by tests/emptyState.test.ts and live browser snapshots for active and archived views
- ✅ TOR-01-8FCo9h7 / TOR-01-7ED8QkP — add-habit input and done-today control visible and clickable at 375×667 and 1280×800; habit added, marked done, zero new console errors
- ✅ TOR-01-WZ9rUhS — `window.location.href` byte-identical across add/mark-done/archive/switch-filter; `<nav>` and `a[href]` counts both 0 throughout
- ⚠️ Minor hygiene gap (non-blocking): no favicon — a browser-initiated `/favicon.ico` 404 appears on every page load, in both dev and preview. Not app-emitted, not tied to any TOR.

### Conclusion
All 7 TOR requirements are independently verified against their Given/When/Then via both
automated tests and live playwright-cli browser sessions (dev and production preview
builds). Implementation code was read line-by-line and matches the tests' claims. This is
sufficient for the epic's TOR requirements; the favicon gap is cosmetic and does not affect
any TOR.

### Manual verification performed: No

## Known Issues / Follow-ups

- No favicon is configured — every page load triggers a benign browser-initiated
  `/favicon.ico` 404. Recommend adding a favicon in a future epic.
