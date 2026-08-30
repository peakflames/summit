# Epic WKhBuVK — Daily Check-In & Streaks — Implemented

## What Was Built

Wired the "Done today" control on each habit card to real streak arithmetic: a new
`markDoneStreak` pure function implements the increment/no-op/reset rules, the done control is
now idempotent (a second click on an already-done habit is a genuine UI-level no-op — the
button disables), and the streak count is rendered as a visually prominent badge distinct from
the habit name. Load-time recalculation to 0 on staleness was already correct from Epic
1WIBPa0; this epic adds the missing test coverage for it.

## Key Files

| File | Purpose |
|---|---|
| `src/state/streakLogic.ts` | **New.** `markDoneStreak(habit, today)` — pure function implementing the increment/no-op/reset rules |
| `src/state/habitActions.ts` | Added `markDone(habits, target, today)` — applies `markDoneStreak`, mutates `target` in place, persists |
| `src/components/StreakBadge.ts` | **New.** `renderStreakBadge(habit)` — `.habit-card__streak` wrapper with `.habit-card__streak-value` / `.habit-card__streak-label` split and an `aria-label` sentence |
| `src/components/HabitCard.ts` | `onToggleDone` → `onMarkDone`; streak markup replaced with `renderStreakBadge`; done button now `disabled` + `'Done ✓'` + distinct `aria-label` when done, `'Done today'` otherwise |
| `src/storage/streakRecalculation.ts` | Exported `yesterdayOf` so `streakLogic.ts` reuses the existing local-date arithmetic instead of duplicating it |
| `src/App.ts` | Inline toggle at the done-today call site replaced with `markDone(habits, target, today)`; handler key renamed `onMarkDone` |
| `src/styles/main.css` | `.habit-card__streak-value` (1.5rem/700, accent color) vs. `.habit-card__name` (body/500) for visual prominence; `.habit-card__done-btn.is-done` gets `cursor: default` and a non-dimmed `:disabled` appearance |
| `tests/dailyCheckinStreaks.test.ts` | **New.** One test per TOR (7 tests), using a `daysAgoISO(n)` helper so seeds stay relative to the real clock |
| `tests/habitManagement.test.ts` | Streak assertion updated for the new `.habit-card__streak-value` markup |
| `tests/persistence.test.ts` | Two streak assertions (done + archived habit) updated for the new markup — not anticipated by the plan's file list, found during `npm test` |

## Spec Deviations

| TOR ID | As-Written | As-Implemented | Reason |
|---|---|---|---|
| — | — | — | No deviations against any TOR's Given/When/Then. One anticipated file-layout note: the epic spec's Key Components lists `src/state/streakLogic.ts` as shared with the load-time recalculation; this implementation keeps `streakLogic.ts` (mark-done rules) and `storage/streakRecalculation.ts` (load-time recalculation) as separate modules, sharing only the `yesterdayOf` date helper. This is a file-organization note, not a requirements change — no feature file edit was made. |

## TOR Coverage

- **TOR-03-UZhr9Mh** (streak → 1 on first-ever mark-done) — **PASS**. Test:
  `tests/dailyCheckinStreaks.test.ts:45-64`. Impl: `src/state/streakLogic.ts:11` (the
  `lastCompletedDate === null` case falls through both guards into the reset-to-1 branch).
  Browser verification: "Read 20 minutes" (seeded `streak: 0`, `lastCompletedDate: null`)
  went from streak `0` to `1` and its card switched to the done state after one click.
- **TOR-03-Gsh2K2S** (increment by 1 the day after last completion) — **PASS**. Test:
  `tests/dailyCheckinStreaks.test.ts:66-85`. Impl: `src/state/streakLogic.ts:8-9`.
  Browser verification: "Morning run" (seeded `streak: 5`, completed yesterday) went to `6`
  after one click.
- **TOR-03-OAytR7l** (no change / no duplicate on a second same-day click) — **PASS**. Test:
  `tests/dailyCheckinStreaks.test.ts:87-106`. Impl: `src/state/streakLogic.ts:5-6` (logic-level
  no-op guard) plus `src/components/HabitCard.ts:29-32` (UI-level: the button is `disabled`
  once done, so a second click cannot even fire). Browser verification: attempting to click
  the already-done "Morning run" button after marking it timed out with "element is not
  enabled" — the click never registers, confirming idempotency belt-and-braces at both layers.
- **TOR-03-s6tFG4V** (reset to 1, not increment, after missed days) — **PASS**. Test:
  `tests/dailyCheckinStreaks.test.ts:108-127`. Impl: `src/state/streakLogic.ts:11` (same
  reset branch as the never-done case — 2+ days stale falls through both guards).
- **TOR-03-TSlF7BH** (recalculate stale streak to 0 on load) — **PASS**. Test (new):
  `tests/dailyCheckinStreaks.test.ts:129-150`. Impl (pre-existing, unchanged):
  `src/storage/streakRecalculation.ts:21-29` (`recalculateStreak`), wired at
  `src/App.ts:24` (`recalculateAll(loadHabits(), todayISO())` on every `mountApp`). Browser
  verification: the archived "Learn Spanish" habit, seeded at `streak: 3` with a
  10-days-stale `lastCompletedDate`, rendered as streak `0` with a not-done button state on
  load with no user interaction.
- **TOR-03-sX0EJEU** (streak rendered with greater visual weight than the name) — **PASS**.
  Test: `tests/dailyCheckinStreaks.test.ts:152-173` (DOM contract: `.habit-card__streak-value`
  exists, is `'5'`, and is a distinct element from `.habit-card__name`). Impl:
  `src/components/StreakBadge.ts` (whole file) + `src/styles/main.css:131-135`
  (`.habit-card__streak-value { font-size: 1.5rem; font-weight: 700 }`) versus
  `src/styles/main.css:119-122` (`.habit-card__name { font-weight: 500 }` at body size — no
  explicit font-size override). Browser verification (screenshot): streak numbers (`12`, `6`,
  `30`, `1`, `0`) render visibly larger, bolder, and in the accent color compared to habit
  names on every card.
- **TOR-03-b2dynoV** (visually distinct done vs. not-done state) — **PASS**. Test:
  `tests/dailyCheckinStreaks.test.ts:175-205`. Impl: `src/components/HabitCard.ts:28-36`
  (`is-done` class toggle, `disabled`, text/`aria-label` swap) + `src/styles/main.css:155-164`
  (`.habit-card__done-btn.is-done` — green-tinted fill, bold text, `cursor: default`). Browser
  verification (screenshot): done cards show a green "Done ✓" pill button; a newly-added
  not-yet-done "Journal" habit shows a plain white "Done today" button — the two states are
  distinguishable at a glance.

## Verification Results

| Gate | Result |
|---|---|
| `npm run lint` (eslint + prettier --check) | PASS |
| `npm run build` (tsc --noEmit + vite build) | PASS |
| `npm test` (vitest run) | PASS — 32/32 tests, 7 files |
| Browser verification | PASS — driven with `playwright-cli` against `npm run demo` |
| Console errors during browser run | None from app code; one pre-existing/documented `/favicon.ico` 404 (carried forward from Epic 1WIBPa0, see `docs/design-notes.md` §5) |

## Known Follow-Up (carried forward from Epic 1WIBPa0)

The `/favicon.ico` 404 console error is a known, documented, deferred issue
(`docs/design-notes.md` §5) — not introduced or resolved by this epic.
