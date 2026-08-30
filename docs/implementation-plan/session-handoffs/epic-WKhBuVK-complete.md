# Epic WKhBuVK: Daily Check-In & Streaks — Complete

**Completed:** 2026-08-30
**Verified by:** Independent review via `/peak-workflow:wrapup-epic WKhBuVK`

## What Was Built

Wired the "Done today" control on each habit card to real streak arithmetic: a new
`markDoneStreak` pure function implements the increment/no-op/reset rules, the done control is
idempotent (a second click on an already-done habit cannot fire — the button disables), and the
streak count renders as a visually prominent badge distinct from the habit name.

## Key Files

| File | Purpose |
|------|---------|
| `src/state/streakLogic.ts` | **New.** `markDoneStreak(habit, today)` — pure function implementing the increment/no-op/reset rules |
| `src/state/habitActions.ts` | Added `markDone(habits, target, today)` — applies `markDoneStreak`, mutates `target` in place, persists |
| `src/components/StreakBadge.ts` | **New.** `renderStreakBadge(habit)` — `.habit-card__streak` wrapper with value/label split and an `aria-label` sentence |
| `src/components/HabitCard.ts` | `onToggleDone` → `onMarkDone`; streak markup replaced with `renderStreakBadge`; done button now `disabled` + `'Done ✓'` + distinct `aria-label` when done, `'Done today'` otherwise |
| `src/storage/streakRecalculation.ts` | Exported `yesterdayOf` so `streakLogic.ts` reuses the existing local-date arithmetic instead of duplicating it |
| `src/App.ts` | Inline toggle at the done-today call site replaced with `markDone(habits, target, today)`; handler key renamed `onMarkDone` |
| `src/styles/main.css` | `.habit-card__streak-value` (1.5rem/700, accent color) vs. `.habit-card__name` (body/500) for visual prominence; `.habit-card__done-btn.is-done` gets `cursor: default` and a non-dimmed `:disabled` appearance |
| `tests/dailyCheckinStreaks.test.ts` | **New.** One test per TOR (7 tests) |

## Key Decisions

- `streakLogic.ts` (mark-done rules) and `storage/streakRecalculation.ts` (load-time
  recalculation) are kept as separate modules per epic ownership, sharing only the
  `yesterdayOf` date helper — matches the split already documented in `docs/design-notes.md` §4.
- The done control's idempotency is enforced belt-and-braces at two layers: a logic-level
  no-op guard in `markDoneStreak` and a UI-level `disabled` attribute once a habit is done, so
  a second click cannot even register.

## Requirements Implemented

| TOR ID | Feature File | Verdict | Test Reference |
|--------|--------------|---------|----------------|
| TOR-03-UZhr9Mh | `docs/requirements/03-daily-checkin-streaks.feature.md` | PASS | tests/dailyCheckinStreaks.test.ts:45-64 |
| TOR-03-Gsh2K2S | `docs/requirements/03-daily-checkin-streaks.feature.md` | PASS | tests/dailyCheckinStreaks.test.ts:66-85 |
| TOR-03-OAytR7l | `docs/requirements/03-daily-checkin-streaks.feature.md` | PASS | tests/dailyCheckinStreaks.test.ts:87-106 |
| TOR-03-s6tFG4V | `docs/requirements/03-daily-checkin-streaks.feature.md` | PASS | tests/dailyCheckinStreaks.test.ts:108-127 |
| TOR-03-TSlF7BH | `docs/requirements/03-daily-checkin-streaks.feature.md` | PASS | tests/dailyCheckinStreaks.test.ts:129-150 |
| TOR-03-sX0EJEU | `docs/requirements/03-daily-checkin-streaks.feature.md` | PASS | tests/dailyCheckinStreaks.test.ts:152-173 |
| TOR-03-b2dynoV | `docs/requirements/03-daily-checkin-streaks.feature.md` | PASS | tests/dailyCheckinStreaks.test.ts:175-205 |

## Verification Summary

### Counts
- TOR Requirements: 7/7 PASS, 0 CANNOT VERIFY
- Quality Gates: 4/4 PASS (lint, build, unit tests, browser verification)
- Tests: 32 passed, 0 skipped, 0 failed

### Highlights
- ✅ TOR-03-UZhr9Mh — browser-verified: "Read 20 minutes" (streak 0, never done) → click → streak `1`, button switched to disabled "Done ✓"
- ✅ TOR-03-Gsh2K2S — browser-verified: "Morning run" (streak 5, completed yesterday) → click → streak `6`
- ✅ TOR-03-OAytR7l — logic-level no-op (`streakLogic.ts:5-6`) plus UI-level: button `disabled` once done, so a repeat click is structurally impossible
- ✅ TOR-03-s6tFG4V — unit test confirms reset-to-1 after a 3-day gap; same code branch as never-done case
- ✅ TOR-03-TSlF7BH — browser-verified: "Learn Spanish" (streak 3, 10 days stale) rendered streak `0` and not-done state on load with zero interaction
- ✅ TOR-03-sX0EJEU — computed styles confirm streak value at 24px/700/accent color vs. habit name at 16px/500/body color; screenshot corroborates
- ✅ TOR-03-b2dynoV — screenshot shows unambiguous visual split: green "Done ✓" pill vs. plain white "Done today" button

### Conclusion
Every TOR's Given/When/Then was independently re-verified — not just by reading the
implementer's tests, but by re-running the unit suite, inspecting the source logic
branch-by-branch, and driving the real app in a browser against seeded demo data for every
scenario. All behavior matched the spec exactly.

### Manual verification performed: No

## Known Issues / Follow-ups

- The `/favicon.ico` 404 console error is a known, pre-existing, documented issue
  (`docs/design-notes.md` §5) — not introduced or resolved by this epic.
