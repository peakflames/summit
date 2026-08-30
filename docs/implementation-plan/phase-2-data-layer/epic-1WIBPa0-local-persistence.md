# Epic 1WIBPa0: Local Persistence

**Phase:** 2 — Data Layer
**Status:** Complete — 2026-08-30
**Dependencies:** Epic U4nHItd (App Shell & Diagnostics — provides the app bootstrap this layer plugs into)

---

## Description

This epic builds Summit's sole persistence layer: reading and writing the full habit dataset
to the browser's `localStorage`, recalculating streak staleness on load, and guaranteeing the
app issues zero network requests. It exists as its own epic, ahead of the habit-management and
check-in UI, because every later mutation (add, check-in, archive, unarchive) depends on this
read/write contract already being in place — this is the data model and storage boundary the
rest of the app builds on.

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
| TOR-04-NuPmtfe | `docs/requirements/04-persistence.feature.md` | The web application shall write the full habit dataset to localStorage immediately after any habit mutation |
| TOR-04-8EEMGia | `docs/requirements/04-persistence.feature.md` | The web application shall restore the full habit list from localStorage on reload with no data loss |
| TOR-04-LJb5Y0a | `docs/requirements/04-persistence.feature.md` | The web application shall initialize an empty habit list without error when no prior data exists |
| TOR-04-tBD0NqR | `docs/requirements/04-persistence.feature.md` | The web application shall perform all habit operations without issuing any network requests |

## Key Components

### Frontend

- `src/storage/habitStore.ts` — namespaced `localStorage` read/write functions (`loadHabits`, `saveHabits`) and the JSON serialization contract for the habit dataset
- `src/models/Habit.ts` — the `Habit` type/interface (`name`, `streak`, `lastCompletedDate`, `archived`)
- `src/storage/streakRecalculation.ts` — pure function comparing `lastCompletedDate` to today and recalculating streak staleness, invoked on load
- `src/main.ts` — wire habit-store initialization into app bootstrap (load-on-mount, handle first-visit empty state)
