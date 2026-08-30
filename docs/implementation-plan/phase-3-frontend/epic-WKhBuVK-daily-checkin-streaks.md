# Epic WKhBuVK: Daily Check-In & Streaks

**Phase:** 3 — Frontend
**Status:** Complete — 2026-08-30
**Dependencies:** Epic Yz4JE9Z (Habit Management — the done-today control this epic adds lives on the habit cards built there)

> **Brand:** Use the project's brand guidelines skill for the done-today control and streak
> display styling if one is configured.

---

## Description

This epic implements the core motivational loop of Summit: marking a habit done for today,
calculating whether that continues or resets a streak, recalculating streak staleness on load,
and displaying the streak and done/not-done state prominently and unambiguously on each habit
card. It depends on Habit Management because the done-today control is added to the habit
cards that epic creates, and it is the last epic in the plan because it completes the full
add → check off → see progress loop described in the product vision.

## Requirements Anchors

> The TOR requirement IDs listed below are the acceptance criteria and verification baseline for
> this epic. Each ID maps to a Gherkin scenario in the referenced feature file.
> `/peak-workflow:start-epic` reads each TOR's Given/When/Then to drive implementation and tests.
> `/peak-workflow:wrapup-epic` independently verifies each TOR's Given/When/Then is satisfied.
> If a feature file has been updated since this spec was written and a scenario no longer matches
> its cited TOR ID, stop and surface the discrepancy to the user before proceeding — do not
> silently implement against stale requirements.

| TOR ID | Feature File | Scenario Title |
|--------|--------------|----------------|
| TOR-03-UZhr9Mh | `docs/requirements/03-daily-checkin-streaks.feature.md` | The web application shall set a habit's streak to 1 when it is marked done for the first time |
| TOR-03-Gsh2K2S | `docs/requirements/03-daily-checkin-streaks.feature.md` | The web application shall increment a habit's streak by 1 when it is marked done on the day immediately following its last completion |
| TOR-03-OAytR7l | `docs/requirements/03-daily-checkin-streaks.feature.md` | The web application shall not change a habit's streak if it is already marked done for today |
| TOR-03-s6tFG4V | `docs/requirements/03-daily-checkin-streaks.feature.md` | The web application shall reset a habit's streak to 1, not increment it, when it is marked done after one or more missed days |
| TOR-03-TSlF7BH | `docs/requirements/03-daily-checkin-streaks.feature.md` | The web application shall recalculate a habit's streak to 0 on load if a day was missed since its last completion |
| TOR-03-sX0EJEU | `docs/requirements/03-daily-checkin-streaks.feature.md` | The web application shall display each habit's streak count as a visually prominent element on its card |
| TOR-03-b2dynoV | `docs/requirements/03-daily-checkin-streaks.feature.md` | The web application shall render a visually distinct state for a habit marked done today versus one not yet marked done |

## Key Components

### Frontend

- `src/state/streakLogic.ts` — pure functions implementing the increment/no-op/reset streak rules based on `lastCompletedDate` vs. today (shared with the load-time recalculation in Epic 1WIBPa0's `streakRecalculation.ts`)
- `src/state/habitActions.ts` — add `markDone` action, writing the updated streak and `lastCompletedDate` through the persistence layer
- `src/components/HabitCard.ts` — extend with the done-today control and its visually distinct done/not-done styling
- `src/components/StreakBadge.ts` — visually prominent streak-count display on each habit card
