# Epic Yz4JE9Z: Habit Management

**Phase:** 3 — Frontend
**Status:** Implemented — 2026-08-30
**Dependencies:** Epic 1WIBPa0 (Local Persistence — habit mutations in this epic read/write through that layer)

> **Brand:** Use the project's brand guidelines skill for habit-card layout, filter controls,
> and inline error styling if one is configured.

---

## Description

This epic implements the habit lifecycle: adding a habit, validating and normalizing its name,
archiving it to declutter the active view, unarchiving it to resume tracking, and filtering
between the Active and Archived views. It exists after Local Persistence because every
mutation here (add/archive/unarchive) must read and write through that storage layer, and it
exists before Daily Check-In & Streaks because a habit must be creatable before it can be
checked off.

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
| TOR-02-AZYrPMQ | `docs/requirements/02-habit-management.feature.md` | The web application shall create a new active habit when the user submits a non-empty habit name |
| TOR-02-JpqY5bM | `docs/requirements/02-habit-management.feature.md` | The web application shall reject an empty habit name with an inline error naming the problem and the next action, and shall log the rejection at WARN level |
| TOR-02-ndFJ4Ap | `docs/requirements/02-habit-management.feature.md` | The web application shall treat a whitespace-only habit name the same as an empty habit name |
| TOR-02-K6frDEV | `docs/requirements/02-habit-management.feature.md` | The web application shall trim leading and trailing whitespace from a submitted habit name before displaying it |
| TOR-02-KlyaxwN | `docs/requirements/02-habit-management.feature.md` | The web application shall move a habit out of the active list when the user archives it |
| TOR-02-Mg4RM5f | `docs/requirements/02-habit-management.feature.md` | The web application shall restore a habit to the active list when the user unarchives it |
| TOR-02-0pLwEQO | `docs/requirements/02-habit-management.feature.md` | The web application shall show the Active habits view by default on load |
| TOR-02-HJLw37V | `docs/requirements/02-habit-management.feature.md` | The web application shall visibly indicate which filter view is currently selected |
| TOR-02-oIU87Ri | `docs/requirements/02-habit-management.feature.md` | The web application shall exclude active habits from the Archived view |

## Key Components

### Frontend

- `src/components/AddHabitForm.ts` — add-habit text input, submit handling, empty/whitespace-only validation, inline error message, WARN-level console log on rejection, whitespace trimming
- `src/components/HabitCard.ts` — renders a single habit's name and archive/unarchive control
- `src/components/HabitList.ts` — renders the filtered set of habit cards for the current view
- `src/components/FilterToggle.ts` — Active/Archived filter control with visible selected-state indication
- `src/state/habitActions.ts` — `addHabit`, `archiveHabit`, `unarchiveHabit` functions operating against `src/storage/habitStore.ts`
- `src/state/viewState.ts` — current filter view state (Active/Archived), defaulting to Active
