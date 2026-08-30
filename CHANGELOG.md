# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
### Changed
### Fixed

---

## [0.3.0] — UNDER DEVELOPMENT

### Added
### Changed
### Fixed

---

## [0.2.0] — 30-Aug-2026

### Added

- Static hint above the Active habits list explaining that marking done tomorrow continues a
  streak and a missed day resets it to 1.

### Changed

- Adopted the PeakFlames Design System: dark obsidian canvas, flame/amber accent, and the
  Archivo/IBM Plex Sans/JetBrains Mono type ramp, replacing the prior neutral-palette styling.
- Habit list rows now use fixed-width streak and done-button columns so cards align
  consistently regardless of streak digit count or done/not-done button label.

### Fixed

---

## [0.1.0] — 30-Aug-2026

Initial development.

### Added

- Vite + TypeScript + npm project scaffold, with ESLint/Prettier for `npm run lint` and
  Vitest (jsdom) for `npm test`.
- App shell: single-screen layout with an add-habit input, an Active/Archived filter, and a
  walking-skeleton in-memory habit list with a done-today toggle and archive control.
- Footer version display and an INFO-level startup console log, both sourced from
  `package.json`'s `version` field at build time via a Vite `define` constant.
- Guidance text for the empty active and empty archived views.
- Responsive layout rules for mobile (375px) and desktop (1280px) viewport widths.
- `localStorage` persistence layer: habits, streaks, and archived state survive a page reload
  under the `summit.habits` key, with load-time streak staleness recalculation and no
  network calls.
- Add, archive, and unarchive habits with empty/whitespace-only name rejection, plus an
  Active/Archived filter with a visibly indicated selected state.
- `npm run demo` starts the app pre-seeded with representative habit data for manual testing.
- Mark a habit done for today with real streak arithmetic: increments the day after last
  completion, resets after missed days, and stays a no-op on a repeat same-day click.
- Streak count renders as a visually prominent badge, and done/not-done states are visually
  distinct at a glance on each habit card.
