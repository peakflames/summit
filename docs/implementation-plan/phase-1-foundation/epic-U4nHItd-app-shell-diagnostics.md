# Epic U4nHItd: App Shell & Diagnostics

**Phase:** 1 — Foundation
**Status:** Not Started
**Dependencies:** None

> **Brand:** Use the project's brand guidelines skill for the app shell layout, empty-state
> guidance text, and footer if one is configured.

---

## Description

This epic scaffolds the Summit Vite + TypeScript SPA and builds the app shell every other
epic sits inside: the footer version display, the startup console log, guidance text for
empty active/archived views, a single-screen layout with no separate navigation pages, and
responsive rendering at mobile and desktop widths. It exists first because every later epic's
UI (habit cards, filters, check-in controls) renders inside this shell, and the version/logging
conventions established here are the baseline tool-hygiene mechanisms declared in CLAUDE.md.

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
| TOR-01-iavJayH | `docs/requirements/01-app-shell.feature.md` | The web application shall display its name and semantic version in the application footer, matching the version field in package.json |
| TOR-01-GgOc6Zf | `docs/requirements/01-app-shell.feature.md` | The web application shall emit a log line on application startup containing its name and semantic version at INFO level, in human-readable plain text |
| TOR-01-Ykw9Mz4 | `docs/requirements/01-app-shell.feature.md` | The web application shall display guidance text and an add-habit input when the active habits list is empty |
| TOR-01-sSCWJrZ | `docs/requirements/01-app-shell.feature.md` | The web application shall display guidance text when the archived habits list is empty |
| TOR-01-8FCo9h7 | `docs/requirements/01-app-shell.feature.md` | The web application shall render a functional habit-list UI at a mobile viewport width |
| TOR-01-7ED8QkP | `docs/requirements/01-app-shell.feature.md` | The web application shall render a functional habit-list UI at a desktop viewport width |
| TOR-01-WZ9rUhS | `docs/requirements/01-app-shell.feature.md` | The web application shall present the add-habit input, the active/archived filter, and the habit list on a single page with no separate navigation pages |

## Key Components

### Frontend

- `package.json` — project manifest; `version` field is the single source of truth consumed by both the footer and the startup log
- `vite.config.ts` — Vite config; defines a build-time constant (e.g. `__APP_VERSION__`) read from `package.json`
- `index.html` — single-page entry point
- `src/main.ts` — app bootstrap; emits the `console.info("Summit v<version> starting")` startup log line
- `src/App.ts` (or equivalent root component) — renders the single-screen layout: add-habit input, active/archived filter control, habit list, footer
- `src/components/Footer.ts` — displays `Summit v<version>`
- `src/components/EmptyState.ts` — guidance text for empty active and empty archived views
- `src/styles/*.css` — responsive layout rules for mobile and desktop viewport widths
