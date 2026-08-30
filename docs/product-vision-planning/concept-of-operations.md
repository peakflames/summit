# Summit — Concept of Operations (ConOps)

**Document Version:** 1.0
**Date:** 2026-08-30
**Status:** Draft

---

## 1. Purpose & Scope

This document describes how Summit operates from the perspective of its users and its
internal data flows. It is a companion to [product-vision.md](product-vision.md), which
defines the product's why and what; this document defines the how — current-state pain
points, the proposed system's operational model, user roles, detailed operational scenarios,
data flows, functional summary, constraints, and glossary.

## 2. Current State ("As-Is")

| Current Method | Limitations |
|---|---|
| Pen-and-paper habit tracker / bullet journal | No automatic streak calculation; easy to forget to bring it; no reminder if a day is skipped |
| General-purpose habit tracker apps (app-store) | Require account signup; often paywalled past 1-2 habits; data lives on a vendor's server |
| Spreadsheet (manual grid) | Tedious to update daily; streak counting is a manual formula; not optimized for quick daily interaction |
| Notes app checklist | No streak concept at all — just a static list with no historical memory |

**Core pain points:**
1. Tools that require signup add friction before any value is delivered.
2. Streak calculation is either missing or requires manual upkeep.
3. There's no simple way to "put a habit on hold" without losing its history (most tools force
   delete-or-keep).
4. Users can't verify state was saved without extra taps (sync spinners, confirmation dialogs).

## 3. Proposed System ("To-Be")

Summit is a single-page web application that runs entirely in the user's browser. On load, it
reads any existing habit data from `localStorage` and renders the current list of active
habits, each showing its name, today's completion state, and current streak. Adding a habit,
marking it done, and archiving/unarchiving are all single-interaction actions that write
directly back to `localStorage`, so there is no save button, no loading state, and no network
round-trip.

The system maintains two views over the same underlying habit data: an "active" view (default)
and an "archived" view, toggled via a filter control. Streak calculation happens automatically
whenever a habit's completion state changes — the system checks whether the previous day was
marked done to decide whether to increment or reset the streak counter.

Because there is no backend, "operations" for this system are entirely client-side: the
browser tab is the only runtime, and the user's own device is the only place data exists. This
makes the system trivially available (no downtime beyond the browser itself) but also means
data is not backed up or synced elsewhere — a cleared browser cache is data loss.

## 4. User Roles & Profiles

| Role | Questions They Bring to the App |
|---|---|
| Habit-builder (end user) | "What habits am I tracking?" "Did I already do this today?" "How long is my streak?" "How do I stop tracking something without losing my progress?" |
| Reference-implementation reader (developer) | "How does this feature's requirement trace to its implementation?" "What does a clean TOR-to-epic-to-code lifecycle look like in a real, if small, codebase?" |

## 5. Operational Scenarios

### Scenario 1: First Habit Added
**Actor:** Habit-builder
**Trigger:** User opens the app for the first time (empty habit list)
**Goal:** Start tracking a new habit

**Steps:**
1. User sees an empty state with a text input labeled "Add a habit" and an "Add" button.
2. User types "Drink 8 glasses of water" into the text input.
3. User clicks "Add" (or presses Enter).
4. The app validates the input is non-empty; if empty, shows an inline error: "Habit name
   cannot be empty. Enter a name to add this habit."
5. On valid input, the app creates a new habit record with: name, streak = 0,
   lastCompletedDate = null, archived = false.
6. The new habit record is written to `localStorage`.
7. The habit list re-renders, showing the new habit card with a streak of "0" and an
   unchecked "done today" control.
8. The text input clears, ready for the next habit.

**Outcome:** The user has a new habit visible in their active list, ready to be checked off,
with zero setup steps beyond typing a name.

### Scenario 2: Daily Check-In
**Actor:** Habit-builder
**Trigger:** User wants to mark a habit as completed for the current day
**Goal:** Record today's completion and see the streak update

**Steps:**
1. User views the active habits list and locates "Morning run."
2. User clicks the checkbox/toggle control on the "Morning run" card.
3. The app checks `lastCompletedDate` for this habit: if it equals yesterday's date, increment
   streak by 1; if it equals today's date already (already checked), no-op; otherwise (missed
   one or more days), reset streak to 1.
4. The app sets `lastCompletedDate` to today's date and marks the card as "done today."
5. The updated habit record is written to `localStorage`.
6. The card visually updates (e.g., checked state, streak number updates) immediately.

**Outcome:** The habit shows as completed for today, and the streak count reflects the user's
updated consecutive-day count.

### Scenario 3: Missed Day Breaks the Streak
**Actor:** Habit-builder
**Trigger:** User opens the app on a day after having skipped marking a habit done the
previous day
**Goal:** (Implicit) See accurate, honest streak state

**Steps:**
1. User opens the app; the app loads habit data from `localStorage`.
2. For "Read 20 minutes," the app compares `lastCompletedDate` to today's date.
3. Since more than one day has elapsed since `lastCompletedDate`, the app displays the habit's
   streak as reset to 0 (this recalculation happens on load, not only on check-in).
4. The habit card shows streak "0" and an unchecked "done today" state.

**Outcome:** The user immediately sees that their streak was broken, with no ambiguity or
stale data.

### Scenario 4: Archiving a Stale Habit
**Actor:** Habit-builder
**Trigger:** User decides to stop actively tracking a habit
**Goal:** Remove the habit from the daily view without losing its data

**Steps:**
1. User locates "Learn Spanish" in the active habits list.
2. User clicks an "Archive" control on the habit card.
3. The app sets the habit's `archived` field to `true`.
4. The updated record is written to `localStorage`.
5. The habit list re-renders without "Learn Spanish" (active view now excludes archived
   habits).

**Outcome:** The active list is decluttered; the habit's full history (streak, name) is
preserved, not deleted.

### Scenario 5: Reviewing Archived Habits
**Actor:** Habit-builder
**Trigger:** User wants to resume a previously archived habit
**Goal:** Restore an archived habit to the active list

**Steps:**
1. User clicks the "Archived" filter/tab control.
2. The view switches to show only habits where `archived === true`, including "Learn
   Spanish."
3. User clicks "Unarchive" on the "Learn Spanish" card.
4. The app sets `archived` back to `false` and writes the update to `localStorage`.
5. User switches back to the "Active" filter/tab.
6. "Learn Spanish" appears in the active list again, with its streak state as it was when
   archived (subject to Scenario 3's staleness recalculation if time has passed).

**Outcome:** The user resumes tracking without having lost the habit's identity or historical
streak baseline.

### Scenario 6: Returning After Closing the Browser
**Actor:** Habit-builder
**Trigger:** User reopens the app in a new browser session (tab closed/reopened, laptop
restarted, etc.)
**Goal:** Continue exactly where they left off

**Steps:**
1. User navigates to the app's URL.
2. On mount, the app reads the full habit dataset from `localStorage`.
3. The app recalculates each habit's effective streak based on `lastCompletedDate` vs. today
   (per Scenario 3's rule) in case time has passed since last use.
4. The app renders the active habits list (default view) reflecting the persisted and
   recalculated state.

**Outcome:** The user sees their habits, completion states, and streaks exactly as expected,
with no login step and no data loss.

## 6. System Interfaces & Data Flows

| Data Source | Type | Purpose |
|---|---|---|
| Browser `localStorage` | Client-side key-value store | Sole persistence layer — stores the full habit list (name, streak, lastCompletedDate, archived flag) as a serialized JSON structure |
| `package.json` (build-time) | Static build input | Source of truth for the app version, injected as a compile-time constant for the footer display and startup console log |

**Data flow:**
```
[User Action: add/check/archive/unarchive]
        │
        ▼
[In-memory app state updated]
        │
        ▼
[Serialize habit list to JSON] ──▶ [localStorage.setItem]
        │
        ▼
[UI re-renders from updated in-memory state]

[On App Load]
[localStorage.getItem] ──▶ [Deserialize JSON] ──▶ [Recalculate streak staleness] ──▶ [Render UI]
```

There is no network layer — every arrow above is a synchronous, local operation within the
browser tab.

## 7. Functional Summary

**Active Habits View**

| Feature | Description |
|---|---|
| Add habit | Text input + submit creates a new habit with streak 0 |
| Mark done today | Single-click toggle increments/maintains streak |
| Streak display | Shows current consecutive-day count per habit |
| Archive habit | Removes habit from active view, preserves data |

**Archived Habits View**

| Feature | Description |
|---|---|
| Filter to archived | Toggle/tab shows only archived habits |
| Unarchive habit | Restores habit to active view |

**Cross-Cutting**

| Feature | Description |
|---|---|
| Persistence | All state read/written to `localStorage` on every mutation |
| Streak recalculation | Runs on load and on check-in to detect missed days |
| Version display | Footer shows app version from `package.json`; also logged to console on startup |

## 8. Operational Constraints & Assumptions

| Constraint / Assumption | Detail |
|---|---|
| Deployment | Static site — no server required; deployable to any static host (e.g., GitHub Pages, Netlify, Vercel) |
| Users | Single user per browser profile — no multi-user concept, no auth |
| Data freshness | Always current; no sync lag since there is no remote store |
| Data durability | Bound to the browser's `localStorage` for that origin/device — clearing browser data or using a different browser/device loses access to the data |
| Offline support | Fully functional offline after initial page load (no network calls at all) |
| Browser support | Assumes a modern evergreen browser with `localStorage` support enabled (not in private/incognito-only long-term use, since some browsers clear storage after such sessions) |
| Time zone | Streak day boundaries use the user's local device date/time |

## 9. Glossary

| Term | Definition |
|---|---|
| Habit | A user-defined recurring action being tracked (e.g., "Morning run") |
| Streak | The number of consecutive days a habit has been marked done, ending at (and including) the most recent completion |
| Active habit | A habit currently shown in the default list, not archived |
| Archived habit | A habit hidden from the default view but retained with its data, restorable via unarchive |
| Done today | The state indicating a habit has been marked complete for the current calendar day |
| `lastCompletedDate` | Internal data field recording the most recent date a habit was marked done, used to calculate streak continuity |
| localStorage | Browser-provided persistent key-value storage scoped to the page's origin, used as this app's sole data store |
