import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mountApp } from '../src/App'
import { saveHabits, STORAGE_KEY } from '../src/storage/habitStore'
import { todayISO } from '../src/storage/streakRecalculation'
import type { Habit } from '../src/models/Habit'

function newRoot(): HTMLElement {
  document.body.innerHTML = ''
  const root = document.createElement('div')
  document.body.append(root)
  return root
}

function readStorage(): Habit[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
}

function findCard(root: HTMLElement, name: string): HTMLElement | undefined {
  return Array.from(root.querySelectorAll<HTMLElement>('.habit-card')).find(
    (card) => card.querySelector('.habit-card__name')?.textContent === name,
  )
}

function clickButton(card: HTMLElement, selector: string): void {
  card.querySelector<HTMLButtonElement>(selector)?.click()
}

function clickFilter(root: HTMLElement, label: 'Active' | 'Archived'): void {
  Array.from(root.querySelectorAll('button'))
    .find((button) => button.textContent === label)
    ?.click()
}

describe('persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('writes the full dataset after every mutation (TOR-04-NuPmtfe)', () => {
    const today = todayISO()
    const seed: Habit[] = [
      { name: 'Read', streak: 2, lastCompletedDate: today, archived: false },
    ]
    saveHabits(seed)

    const root = newRoot()
    mountApp(root)

    // Add
    const input = root.querySelector<HTMLInputElement>('input[type="text"]')!
    input.value = 'Meditate'
    root
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { cancelable: true }))

    let stored = readStorage()
    expect(stored).toHaveLength(2)
    expect(stored.find((h) => h.name === 'Meditate')).toMatchObject({
      streak: 0,
      lastCompletedDate: null,
      archived: false,
    })

    // Mark done
    const card = findCard(root, 'Meditate')!
    clickButton(card, '.habit-card__done-btn')

    stored = readStorage()
    expect(stored.find((h) => h.name === 'Meditate')?.lastCompletedDate).toBe(
      today,
    )

    // Archive
    const cardAfterDone = findCard(root, 'Meditate')!
    clickButton(cardAfterDone, '.habit-card__archive-btn')

    stored = readStorage()
    expect(stored.find((h) => h.name === 'Meditate')?.archived).toBe(true)

    // Unarchive
    clickFilter(root, 'Archived')
    const archivedCard = findCard(root, 'Meditate')!
    clickButton(archivedCard, '.habit-card__archive-btn')

    stored = readStorage()
    expect(stored.find((h) => h.name === 'Meditate')?.archived).toBe(false)
  })

  it('restores names, archived states, and streaks across a reload (TOR-04-8EEMGia)', () => {
    const today = todayISO()
    const seed: Habit[] = [
      { name: 'Read', streak: 5, lastCompletedDate: today, archived: false },
      { name: 'Stretch', streak: 0, lastCompletedDate: today, archived: true },
    ]
    saveHabits(seed)

    const firstRoot = newRoot()
    mountApp(firstRoot)

    // Simulate a refresh: fresh root, fresh mount.
    const secondRoot = newRoot()
    mountApp(secondRoot)

    clickFilter(secondRoot, 'Active')
    const readCard = findCard(secondRoot, 'Read')!
    expect(
      readCard.querySelector('.habit-card__streak-value')?.textContent,
    ).toBe('5')
    expect(
      readCard.querySelector('.habit-card__archive-btn')?.textContent,
    ).toBe('Archive')

    clickFilter(secondRoot, 'Archived')
    const stretchCard = findCard(secondRoot, 'Stretch')!
    expect(
      stretchCard.querySelector('.habit-card__streak-value')?.textContent,
    ).toBe('0')
    expect(
      stretchCard.querySelector('.habit-card__archive-btn')?.textContent,
    ).toBe('Unarchive')
  })

  it('initializes an empty list with no console error on first visit (TOR-04-LJb5Y0a)', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const root = newRoot()
    mountApp(root)

    expect(root.textContent).toContain('No habits yet.')
    expect(errorSpy).not.toHaveBeenCalled()

    errorSpy.mockRestore()
  })

  it('issues no network requests during any mutation (TOR-04-tBD0NqR)', () => {
    const fetchSpy = vi.fn()
    const xhrSpy = vi.fn()
    const originalFetch = globalThis.fetch
    const originalXHR = globalThis.XMLHttpRequest
    globalThis.fetch = fetchSpy as unknown as typeof fetch
    globalThis.XMLHttpRequest = xhrSpy as unknown as typeof XMLHttpRequest

    const root = newRoot()
    mountApp(root)

    const input = root.querySelector<HTMLInputElement>('input[type="text"]')!
    input.value = 'Journal'
    root
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { cancelable: true }))

    const card = findCard(root, 'Journal')!
    clickButton(card, '.habit-card__done-btn')

    const cardAfterDone = findCard(root, 'Journal')!
    clickButton(cardAfterDone, '.habit-card__archive-btn')

    clickFilter(root, 'Archived')
    const archivedCard = findCard(root, 'Journal')!
    clickButton(archivedCard, '.habit-card__archive-btn')

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(xhrSpy).not.toHaveBeenCalled()

    globalThis.fetch = originalFetch
    globalThis.XMLHttpRequest = originalXHR
  })
})
