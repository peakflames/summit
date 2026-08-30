// Seeds the browser's localStorage with representative habit data for demos and manual
// testing. Summit is a client-only SPA — there is no Node-side access to a browser's
// localStorage, so this script runs *in the browser*, not via `node scripts/...`.
//
// Usage:
//   - `npm run demo` — starts the dev server with this script auto-injected before the app
//     mounts (see vite.config.ts's demoSeedPlugin), so the app loads pre-seeded.
//   - Manual: run `npm run dev`, open DevTools > Console, paste this file's contents, press
//     Enter, then reload the page.
//
// Overwrites any existing habit data under the `summit.habits` key.

;(function seedDemoData() {
  const STORAGE_KEY = 'summit.habits'

  function todayISO(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function daysAgoISO(n) {
    const date = new Date()
    date.setDate(date.getDate() - n)
    return todayISO(date)
  }

  const today = daysAgoISO(0)
  const yesterday = daysAgoISO(1)

  const habits = [
    {
      name: 'Drink 8 glasses of water',
      streak: 12,
      lastCompletedDate: today,
      archived: false,
    },
    {
      name: 'Morning run',
      streak: 5,
      lastCompletedDate: yesterday,
      archived: false,
    },
    {
      name: 'Meditate',
      streak: 30,
      lastCompletedDate: today,
      archived: false,
    },
    {
      name: 'Read 20 minutes',
      streak: 0,
      lastCompletedDate: null,
      archived: false,
    },
    {
      name: 'Learn Spanish',
      streak: 3,
      lastCompletedDate: daysAgoISO(10),
      archived: true,
    },
    {
      name: 'Stretch daily',
      streak: 0,
      lastCompletedDate: null,
      archived: true,
    },
  ]

  globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  globalThis.console.info(
    `Seeded ${habits.length} demo habits into localStorage. Reload the page.`,
  )
})()
