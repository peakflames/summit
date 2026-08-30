# Epic e3mj8uq: Streak Continuation Hint

**Phase:** 3 — Frontend
**Status:** Implemented — 2026-08-30
**Dependencies:** Epic WKhBuVK (Daily Check-In & Streaks — the streak count and badge this epic annotates were built there)

> **Brand:** Use the project's brand guidelines skill for the hint text styling if one is configured.

---

## Description

This epic adds a small, static, always-visible hint explaining that marking done again
tomorrow continues a streak and that a missed day resets it to 1. It exists because users
found the existing streak/done-today mechanics non-obvious from the UI alone — the hint makes
the continuation rule legible at a glance without adding a popup, toast, or new page, keeping
the product's minimalist, non-notification design intact. It depends on Daily Check-In &
Streaks because the hint sits alongside the streak-bearing habit list that epic created.

**Revision (2026-08-30):** the hint was originally implemented as identical text repeated on
every habit card. Post-implementation review found this redundant for any list with more than
one habit. The product vision, ConOps, and both TORs below were revised to specify a single
shared hint location for the whole Active habits list instead — same TOR IDs, updated
Given/When/Then (see `docs/design-notes.md` §13).

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
| TOR-03-2OgotAa | `docs/requirements/03-daily-checkin-streaks.feature.md` | The web application shall display a single static hint in a shared location for the habit list explaining that marking done tomorrow continues a streak and a missed day resets it to 1 |
| TOR-03-MvP98PX | `docs/requirements/03-daily-checkin-streaks.feature.md` | The web application shall render the streak hint as always-visible static text rather than a dismissible popup, toast, or hover-triggered overlay |

## Key Components

### Frontend

- `src/components/StreakHint.ts` — renders the static continuation-hint text, once, with no props and no event listeners
- `src/App.ts` — places the hint once between the filter toggle and the habit list, shown only for the Active view
