import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mountApp } from '../src/App'
import { saveHabits } from '../src/storage/habitStore'
import type { Habit } from '../src/models/Habit'

const EMPTY_HABIT_NAME_ERROR =
  'Habit name cannot be empty. Enter a name to add this habit.'

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

function cardNames(root: HTMLElement): string[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>('.habit-card__name'),
  ).map((el) => el.textContent ?? '')
}

function clickButton(card: HTMLElement, selector: string): void {
  card.querySelector<HTMLButtonElement>(selector)?.click()
}

function findFilterButton(
  root: HTMLElement,
  label: 'Active' | 'Archived',
): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent === label,
  ) as HTMLButtonElement
}

function clickFilter(root: HTMLElement, label: 'Active' | 'Archived'): void {
  findFilterButton(root, label).click()
}

function submitAddHabit(root: HTMLElement, value: string): void {
  const input = root.querySelector<HTMLInputElement>('input[type="text"]')!
  input.value = value
  root
    .querySelector('form')!
    .dispatchEvent(new Event('submit', { cancelable: true }))
}

function getError(root: HTMLElement): HTMLElement {
  return root.querySelector<HTMLElement>('.add-habit-form__error')!
}

describe('habit management', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates a new active habit when a non-empty name is submitted (TOR-02-AZYrPMQ)', () => {
    const root = newRoot()
    mountApp(root)

    submitAddHabit(root, 'Drink 8 glasses of water')

    const card = findCard(root, 'Drink 8 glasses of water')!
    expect(card).toBeDefined()
    expect(card.querySelector('.habit-card__streak-value')?.textContent).toBe(
      '0',
    )
    expect(
      card
        .querySelector('.habit-card__done-btn')
        ?.classList.contains('is-done'),
    ).toBe(false)

    const input = root.querySelector<HTMLInputElement>('input[type="text"]')!
    expect(input.value).toBe('')
  })

  it('rejects an empty habit name with an inline error and a WARN log (TOR-02-JpqY5bM)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const root = newRoot()
    mountApp(root)

    submitAddHabit(root, '')

    const error = getError(root)
    expect(error.hidden).toBe(false)
    expect(error.textContent).toBe(EMPTY_HABIT_NAME_ERROR)
    expect(root.querySelectorAll('.habit-card')).toHaveLength(0)
    expect(warnSpy).toHaveBeenCalled()

    warnSpy.mockRestore()
  })

  it('treats a whitespace-only habit name the same as empty (TOR-02-ndFJ4Ap)', () => {
    const root = newRoot()
    mountApp(root)

    submitAddHabit(root, '   ')

    const error = getError(root)
    expect(error.hidden).toBe(false)
    expect(error.textContent).toBe(EMPTY_HABIT_NAME_ERROR)
    expect(root.querySelectorAll('.habit-card')).toHaveLength(0)
  })

  it('trims leading and trailing whitespace before displaying the name (TOR-02-K6frDEV)', () => {
    const root = newRoot()
    mountApp(root)

    submitAddHabit(root, '  Morning run  ')

    const card = findCard(root, 'Morning run')!
    expect(card).toBeDefined()
    expect(card.querySelector('.habit-card__name')?.textContent).toBe(
      'Morning run',
    )
  })

  it('moves a habit out of the active list when archived (TOR-02-KlyaxwN)', () => {
    const seed: Habit[] = [
      {
        name: 'Learn Spanish',
        streak: 0,
        lastCompletedDate: null,
        archived: false,
      },
    ]
    saveHabits(seed)

    const root = newRoot()
    mountApp(root)

    const card = findCard(root, 'Learn Spanish')!
    clickButton(card, '.habit-card__archive-btn')

    expect(findCard(root, 'Learn Spanish')).toBeUndefined()

    clickFilter(root, 'Archived')
    expect(findCard(root, 'Learn Spanish')).toBeDefined()
  })

  it('restores a habit to the active list when unarchived (TOR-02-Mg4RM5f)', () => {
    const seed: Habit[] = [
      {
        name: 'Learn Spanish',
        streak: 0,
        lastCompletedDate: null,
        archived: true,
      },
    ]
    saveHabits(seed)

    const root = newRoot()
    mountApp(root)

    clickFilter(root, 'Archived')
    const card = findCard(root, 'Learn Spanish')!
    clickButton(card, '.habit-card__archive-btn')

    expect(findCard(root, 'Learn Spanish')).toBeUndefined()

    clickFilter(root, 'Active')
    expect(findCard(root, 'Learn Spanish')).toBeDefined()
  })

  it('shows the Active habits view by default on load (TOR-02-0pLwEQO)', () => {
    const seed: Habit[] = [
      { name: 'Read', streak: 1, lastCompletedDate: null, archived: false },
      { name: 'Stretch', streak: 0, lastCompletedDate: null, archived: true },
    ]
    saveHabits(seed)

    const root = newRoot()
    mountApp(root)

    const activeButton = findFilterButton(root, 'Active')
    const archivedButton = findFilterButton(root, 'Archived')

    expect(activeButton.classList.contains('is-selected')).toBe(true)
    expect(activeButton.getAttribute('aria-pressed')).toBe('true')
    expect(archivedButton.classList.contains('is-selected')).toBe(false)
    expect(archivedButton.getAttribute('aria-pressed')).toBe('false')
  })

  it('visibly indicates the currently selected filter view (TOR-02-HJLw37V)', () => {
    const root = newRoot()
    mountApp(root)

    clickFilter(root, 'Archived')

    const activeButton = findFilterButton(root, 'Active')
    const archivedButton = findFilterButton(root, 'Archived')

    expect(archivedButton.classList.contains('is-selected')).toBe(true)
    expect(archivedButton.getAttribute('aria-pressed')).toBe('true')
    expect(activeButton.classList.contains('is-selected')).toBe(false)
    expect(activeButton.getAttribute('aria-pressed')).toBe('false')
  })

  it('excludes active habits from the Archived view (TOR-02-oIU87Ri)', () => {
    const seed: Habit[] = [
      { name: 'Read', streak: 1, lastCompletedDate: null, archived: false },
      { name: 'Stretch', streak: 0, lastCompletedDate: null, archived: true },
    ]
    saveHabits(seed)

    const root = newRoot()
    mountApp(root)

    clickFilter(root, 'Archived')

    expect(cardNames(root)).toEqual(['Stretch'])
  })
})
