# Epic e3mj8uq: Streak Continuation Hint

**Phase:** 3 — Frontend
**Status:** Not Started
**Dependencies:** Epic WKhBuVK (Daily Check-In & Streaks — the streak count and badge this epic annotates were built there)

> **Brand:** Use the project's brand guidelines skill for the hint text styling if one is configured.

---

## Description

This epic adds a small, static, always-visible hint next to each habit's streak count,
explaining that marking done again tomorrow continues the streak and that a missed day resets
it to 1. It exists because users found the existing streak/done-today mechanics non-obvious
from the UI alone — the hint makes the continuation rule legible at a glance without adding a
popup, toast, or new page, keeping the product's minimalist, non-notification design intact.
It depends on Daily Check-In & Streaks because the hint is rendered alongside the streak badge
that epic created.

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
| TOR-03-2OgotAa | `docs/requirements/03-daily-checkin-streaks.feature.md` | The web application shall display a static hint near each habit's streak count explaining that marking done tomorrow continues the streak and a missed day resets it to 1 |
| TOR-03-MvP98PX | `docs/requirements/03-daily-checkin-streaks.feature.md` | The web application shall render the streak hint as always-visible static text rather than a dismissible popup, toast, or hover-triggered overlay |

## Key Components

### Frontend

- `src/components/StreakBadge.ts` — extend to render the static continuation-hint text alongside the existing streak count
- `src/components/HabitCard.ts` — pass through/position the hint within the existing card layout
