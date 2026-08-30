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

## [0.1.0] — UNDER DEVELOPMENT

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
- `localStorage` persistence layer: habits, streaks, and archived state now survive a page
  reload under the namespaced `summit.habits` key, with load-time streak staleness
  recalculation and no network requests issued for any habit operation.
