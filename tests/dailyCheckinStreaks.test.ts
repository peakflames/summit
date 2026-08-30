import { describe, expect, it, beforeEach } from 'vitest'
import { mountApp } from '../src/App'
import { saveHabits } from '../src/storage/habitStore'
import type { Habit } from '../src/models/Habit'

function newRoot(): HTMLElement {
  document.body.innerHTML = ''
  const root = document.createElement('div')
  document.body.append(root)
  return root
}

function findCard(root: HTMLElement, name: string): HTMLElement | undefined {
  return Array.from(root.querySelectorAll<HTMLElement>('.habit-card')).find(
    (card) => card.querySelector('.habit-card__name')?.textContent === name,
  )
}

function clickButton(card: HTMLElement, selector: string): void {
  card.querySelector<HTMLButtonElement>(selector)?.click()
}

function streakValue(card: HTMLElement): string | null | undefined {
  return card.querySelector('.habit-card__streak-value')?.textContent
}

function todayISO(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function daysAgoISO(n: number): string {
  const date = new Date()
  date.setDate(date.getDate() - n)
  return todayISO(date)
}

describe('daily check-in and streaks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('sets the streak to 1 when marked done for the first time (TOR-03-UZhr9Mh)', () => {
    const seed: Habit[] = [
      { name: 'Read', streak: 0, lastCompletedDate: null, archived: false },
    ]
    saveHabits(seed)

    const root = newRoot()
    mountApp(root)

    const card = findCard(root, 'Read')!
    clickButton(card, '.habit-card__done-btn')

    const updatedCard = findCard(root, 'Read')!
    expect(streakValue(updatedCard)).toBe('1')
    expect(
      updatedCard
        .querySelector('.habit-card__done-btn')
        ?.classList.contains('is-done'),
    ).toBe(true)
  })

  it('increments the streak when marked done the day after its last completion (TOR-03-Gsh2K2S)', () => {
    const seed: Habit[] = [
      {
        name: 'Morning run',
        streak: 5,
        lastCompletedDate: daysAgoISO(1),
        archived: false,
      },
    ]
    saveHabits(seed)

    const root = newRoot()
    mountApp(root)

    const card = findCard(root, 'Morning run')!
    clickButton(card, '.habit-card__done-btn')

    const updatedCard = findCard(root, 'Morning run')!
    expect(streakValue(updatedCard)).toBe('6')
  })

  it('leaves the streak unchanged when already marked done today (TOR-03-OAytR7l)', () => {
    const seed: Habit[] = [
      {
        name: 'Meditate',
        streak: 30,
        lastCompletedDate: daysAgoISO(0),
        archived: false,
      },
    ]
    saveHabits(seed)

    const root = newRoot()
    mountApp(root)

    const card = findCard(root, 'Meditate')!
    clickButton(card, '.habit-card__done-btn')

    const updatedCard = findCard(root, 'Meditate')!
    expect(streakValue(updatedCard)).toBe('30')
  })

  it('resets the streak to 1 after one or more missed days (TOR-03-s6tFG4V)', () => {
    const seed: Habit[] = [
      {
        name: 'Learn Spanish',
        streak: 8,
        lastCompletedDate: daysAgoISO(3),
        archived: false,
      },
    ]
    saveHabits(seed)

    const root = newRoot()
    mountApp(root)

    const card = findCard(root, 'Learn Spanish')!
    clickButton(card, '.habit-card__done-btn')

    const updatedCard = findCard(root, 'Learn Spanish')!
    expect(streakValue(updatedCard)).toBe('1')
  })

  it('recalculates a stale streak to 0 on load (TOR-03-TSlF7BH)', () => {
    const seed: Habit[] = [
      {
        name: 'Stretch daily',
        streak: 3,
        lastCompletedDate: daysAgoISO(10),
        archived: false,
      },
    ]
    saveHabits(seed)

    const root = newRoot()
    mountApp(root)

    const card = findCard(root, 'Stretch daily')!
    expect(streakValue(card)).toBe('0')
    expect(
      card
        .querySelector('.habit-card__done-btn')
        ?.classList.contains('is-done'),
    ).toBe(false)
  })

  it('renders the streak value with greater visual weight than the habit name (TOR-03-sX0EJEU)', () => {
    const seed: Habit[] = [
      {
        name: 'Meditate',
        streak: 5,
        lastCompletedDate: daysAgoISO(0),
        archived: false,
      },
    ]
    saveHabits(seed)

    const root = newRoot()
    mountApp(root)

    const card = findCard(root, 'Meditate')!
    const streakEl = card.querySelector('.habit-card__streak-value')
    const nameEl = card.querySelector('.habit-card__name')

    expect(streakEl).toBeTruthy()
    expect(streakEl?.textContent).toBe('5')
    expect(streakEl).not.toBe(nameEl)
  })

  it('renders distinct done and not-done states across cards (TOR-03-b2dynoV)', () => {
    const seed: Habit[] = [
      {
        name: 'Drink water',
        streak: 12,
        lastCompletedDate: daysAgoISO(0),
        archived: false,
      },
      {
        name: 'Read 20 minutes',
        streak: 0,
        lastCompletedDate: null,
        archived: false,
      },
    ]
    saveHabits(seed)

    const root = newRoot()
    mountApp(root)

    const doneCard = findCard(root, 'Drink water')!
    const notDoneCard = findCard(root, 'Read 20 minutes')!

    const doneBtn = doneCard.querySelector('.habit-card__done-btn')
    const notDoneBtn = notDoneCard.querySelector('.habit-card__done-btn')

    expect(doneBtn?.classList.contains('is-done')).toBe(true)
    expect((doneBtn as HTMLButtonElement).disabled).toBe(true)
    expect(notDoneBtn?.classList.contains('is-done')).toBe(false)
    expect((notDoneBtn as HTMLButtonElement).disabled).toBe(false)
  })
})
