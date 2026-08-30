# Epic Yz4JE9Z: Habit Management — Implemented

**Implemented:** 2026-08-30

## What Was Built

Completed the habit lifecycle from the walking skeleton: adding a habit now validates and
rejects an empty or whitespace-only name with an inline error and a WARN-level console log,
trims the submitted name before storing/displaying it, and archiving/unarchiving moves a habit
between the Active and Archived filter views. The previously monolithic `src/App.ts` render
function was decomposed into the components and state modules named in the epic spec's Key
Components.

## Key Files

| File | Purpose |
|------|---------|
| `src/components/AddHabitForm.ts` | NEW — add-habit input, submit handling, empty/whitespace-only validation, inline error, WARN console log, whitespace trimming |
| `src/components/HabitList.ts` | NEW — renders the filtered set of habit cards for the current view |
| `src/components/FilterToggle.ts` | NEW — Active/Archived filter control with visible + `aria-pressed` selected-state indication |
| `src/state/habitActions.ts` | NEW — `addHabit`, `archiveHabit`, `unarchiveHabit` operating against `src/storage/habitStore.ts` |
| `src/state/viewState.ts` | NEW — `createViewState()` (current filter view, defaults to Active) and `filterHabits()` |
| `src/components/HabitCard.ts` | MODIFIED — split `onToggleArchived` into explicit `onArchive` / `onUnarchive` handlers, added `aria-label` |
| `src/App.ts` | MODIFIED — reduced to a composition root wiring the new components/state modules |
| `src/styles/main.css` | MODIFIED — added `--color-error` token and `.add-habit-form__error` rule |
| `tests/habitManagement.test.ts` | NEW — one test per TOR, mirroring each Gherkin scenario |

## Spec Deviations

| TOR ID | As-Written | As-Implemented | Reason |
|--------|------------|-----------------|--------|
| — | — | — | No deviations. All 9 TOR IDs implemented exactly as their Given/When/Then specify. |

## TOR Coverage

| TOR ID | Verdict | Test Reference | Impl Reference |
|--------|---------|-----------------|-----------------|
| TOR-02-AZYrPMQ | PASS | tests/habitManagement.test.ts:62 | src/components/AddHabitForm.ts:40, src/state/habitActions.ts:8 |
| TOR-02-JpqY5bM | PASS | tests/habitManagement.test.ts:83 | src/components/AddHabitForm.ts:32-38 |
| TOR-02-ndFJ4Ap | PASS | tests/habitManagement.test.ts:100 | src/components/AddHabitForm.ts:34 (`input.value.trim()` treats whitespace-only as empty) |
| TOR-02-K6frDEV | PASS | tests/habitManagement.test.ts:112 | src/components/AddHabitForm.ts:34, src/state/habitActions.ts:8 |
| TOR-02-KlyaxwN | PASS | tests/habitManagement.test.ts:125 | src/state/habitActions.ts:14, src/state/viewState.ts:19-22 |
| TOR-02-Mg4RM5f | PASS | tests/habitManagement.test.ts:148 | src/state/habitActions.ts:19, src/state/viewState.ts:19-22 |
| TOR-02-0pLwEQO | PASS | tests/habitManagement.test.ts:172 | src/state/viewState.ts:9 (`let view: FilterView = 'active'`) |
| TOR-02-HJLw37V | PASS | tests/habitManagement.test.ts:191 | src/components/FilterToggle.ts |
| TOR-02-oIU87Ri | PASS | tests/habitManagement.test.ts:206 | src/state/viewState.ts:19-22 |

## Verification Results

### Counts
- TOR Requirements: 9/9 PASS, 0 CANNOT VERIFY
- Quality Gates: 4/4 PASS (lint, build, unit tests, browser verification)
- Tests: 25 passed, 0 skipped, 0 failed (9 new + 16 pre-existing, all unmodified)

### Quality Gates
- `npm run lint` — PASS (eslint + prettier, 0 issues after auto-format)
- `npm run build` — PASS (`tsc --noEmit && vite build`, 15 modules, no type errors)
- `npm test` — PASS (25/25, 6 test files)
- Browser verification (playwright-cli against `npm run dev`) — PASS:
  - Empty submission → inline error "Habit name cannot be empty. Enter a name to add this
    habit." + `[WARNING] Rejected empty habit name submission` in console
  - Whitespace-only submission → same inline error, no card added
  - `"  Morning run  "` → card reads "Morning run", streak 0, unchecked done, input cleared
  - Archive → habit leaves Active view (empty state shown)
  - Switch to Archived → habit appears, "Archived" button `[pressed]`, "Active" not
  - Unarchive + switch to Active → habit reappears in Active
  - Console: 0 errors throughout the full walkthrough

### Conclusion

Every TOR's Given/When/Then was verified via both a DOM-integration unit test mirroring the
Gherkin structure and live browser verification against the real dev server (no mocked state).
Pre-existing tests (`persistence.test.ts`, `emptyState.test.ts`, `version.test.ts`,
`habitStore.test.ts`, `streakRecalculation.test.ts`) pass unmodified — the refactor preserved
every DOM selector and button label they depend on.

### Manual verification performed: No

## Known Issues / Follow-ups

- Carried over from Epic 1WIBPa0: no favicon configured (benign `/favicon.ico` 404 on first
  load, tracked in `docs/design-notes.md` §5).
- The "Done today" toggle still only sets/clears `lastCompletedDate`; streak increment logic
  remains deferred to Epic WKhBuVK by design.
