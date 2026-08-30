# Summit — Product Vision & Brief

**Document Version:** 1.1
**Date:** 2026-08-30
**Status:** Draft

---

## 1. Product Name

**Summit** — *"Climb your habits, one day at a time."*

## 2. Problem Statement

Most habit trackers either overwhelm users with features they don't need (social feeds,
gamified badges, subscription paywalls) or require creating an account and trusting a
third-party service with personal behavioral data before the user has even decided the habit
is worth tracking. For someone who just wants a simple daily checklist with a visible streak,
the barrier to entry — signup, onboarding, sync setup — often exceeds the value of the
five-second task they're trying to track.

Separately, many people abandon habit tracking not because the habit itself failed, but
because the tool added friction: too many taps to log a habit, unclear whether "today" was
actually marked, or no easy way to see whether a streak is still alive without digging through
a calendar view.

**Current pain points:**
- Signup/account creation required before any value is delivered
- Overloaded feature sets (social, gamification, coaching) obscure the core loop: add → check
  off → see progress
- Streak visibility is often buried behind extra taps or screens
- No easy way to declutter — habits that are no longer relevant clutter the main view instead
  of being archived

## 3. Target Users

| User Group | Primary Need |
|---|---|
| Individual habit-builder | A frictionless way to track a small number of daily habits and see streaks, without signing up for anything |
| Developer studying peak-workflow | A clear, minimal, real codebase to read end-to-end as a reference for the plugin's discovery → requirements → epics → implementation lifecycle |

## 4. Vision Statement

Summit is a single-page habit tracker that lets anyone start building better habits in
seconds — no signup, no server, no clutter — by giving them a simple way to add a habit, mark
it done, and watch their streak grow, all stored privately in their own browser.

## 5. Goals & Success Criteria (MVP)

| Goal | Success Criteria |
|---|---|
| Zero-friction habit creation | User can add a new habit in a single interaction (one text input + submit) |
| Fast daily check-in | Marking a habit done for today takes exactly one click/tap from the main view |
| Visible momentum | Every habit card shows its current streak count without any extra navigation |
| Reduce clutter | Users can archive habits they're no longer tracking, and archived habits are hidden from the default view by default |
| No data loss on reload | Habit list, completion history, and streaks persist across browser refreshes and restarts via `localStorage` |
| No backend dependency | App is fully functional offline / with no network requests |
| Reference-quality clarity | Codebase is small and clear enough to serve as an end-to-end teaching example for the peak-workflow lifecycle |

## 6. MVP Scope Summary

**Habit List View**
- Add a new habit (name only, no extra metadata required)
- Display all active habits with: name, current streak count, done/not-done state for today
- Streak continuation hint: a short static line near the streak count explains how to keep the
  streak going (e.g., "Mark done tomorrow to continue — a missed day resets to 1")
- Mark a habit done for today (toggle)
- Archive a habit (removes it from the active list)

**Archived Habits View**
- Filter/toggle to view archived habits separately from active ones
- Unarchive a habit (restore to active list)

**Cross-cutting Concerns**
- All state persists to `localStorage` — no backend, no network calls
- App works entirely client-side, loads instantly, no auth
- Streak calculation: consecutive days marked done, resets to 0 if a day is missed
- Version number visible in the footer, sourced from `package.json`

## 7. Out of Scope for MVP

- User accounts / authentication
- Cloud sync or multi-device support
- Social features (sharing, friends, leaderboards)
- Reminders / notifications
- Habit categories, tags, or custom scheduling (e.g., "3x per week")
- Editing a habit's name after creation
- Deleting a habit permanently (only archive/unarchive)
- Analytics, charts, or historical calendar views beyond the current streak count
- Data export/import
- Mobile app / PWA installability

## 8. Key Business Scenarios

**Scenario 1 — First Habit Added.** A new user opens Summit for the first time and sees an
empty state prompting them to add their first habit. They type "Drink 8 glasses of water" and
submit. The habit immediately appears in the list with a streak of 0 and a "not done today"
state, giving the user instant confirmation that the app works with zero setup.

**Scenario 2 — Daily Check-In.** A returning user opens the app in the morning, sees their
existing habits, and taps the checkbox next to "Morning run" to mark it done for today. The
streak count increments immediately, and the habit's visual state changes to reflect
completion — giving the user a quick dopamine hit and confirmation their action was saved.

**Scenario 3 — Missed Day Breaks the Streak.** A user who had a 12-day streak on "Read 20
minutes" forgets to log it one day. When they open the app the next day, the streak has reset
to 0, making clear that consistency — not one-off effort — is what the app rewards and tracks.

**Scenario 4 — Archiving a Stale Habit.** A user decides "Learn Spanish" is no longer a
priority. Rather than deleting it (losing their streak history), they archive it from the
active list. It disappears from their daily view, reducing clutter, but remains recoverable.

**Scenario 5 — Reviewing Archived Habits.** Weeks later, the same user wants to resume "Learn
Spanish." They switch to the archived filter, find the habit, and unarchive it — it reappears
in the active list with its prior streak state intact.

**Scenario 6 — Returning After Closing the Browser.** A user closes their laptop mid-session,
having just marked two habits done. The next day they reopen the browser to the same URL and
see their habit list, completion states, and streaks exactly as they left them — with no login
and no loading spinner, because everything was persisted locally.

## 9. Design Direction

- Minimalist, single-screen layout — no navigation menu beyond the active/archived toggle;
  everything fits above the fold for a typical viewport.
- Clear visual distinction between "done today" and "not done today" states (e.g., checkbox
  fill, subtle color/opacity change) — must be understandable at a glance.
- Streak count is visually prominent on each habit card (larger/bolder than other card text)
  since it's the primary motivational signal.
- Empty states (no habits yet, no archived habits) show helpful guidance text rather than a
  blank screen.
- Neutral, calm color palette — this is a personal productivity tool, not a gamified/social
  app; avoid aggressive notification-style UI patterns.
- The streak-continuation hint is static, secondary-styled text always rendered on the card —
  not a toast/popup/notification — consistent with avoiding aggressive notification-style UI.
- Fully responsive — usable on both desktop and mobile browser widths, since a habit check-in
  often happens on a phone.

## 10. Data Strategy

All application data (habits, completion history, streak state) is stored exclusively in the
browser's `localStorage` under a single namespaced key, serialized as JSON. There is no remote
data source, no background sync, and no server-side persistence — the browser tab is the
entire runtime, and the user's local device is the only system of record. Data freshness is
always "current" because there is no replication lag; the only staleness concern is streak
recalculation, which happens synchronously on load and on each check-in action (comparing
`lastCompletedDate` to the current date). There are no background processes, scheduled jobs,
or polling — all state transitions are triggered directly by user interaction.

## 11. Backlog / Future Vision

- Cloud sync / multi-device support (would require introducing a backend and auth —
  explicitly deferred to keep this a client-only reference example)
- Habit reminders / browser notifications
- Historical calendar view showing full completion history, not just current streak
- Habit categories or custom scheduling (e.g., "3x per week" instead of daily)
- Data export/import (e.g., JSON download, CSV)
- Editable habit names post-creation
- Permanent delete option (distinct from archive)
- Dark mode / theme toggle
- Best-streak (all-time record) tracking, separate from current streak
- PWA installability for an app-like mobile experience
