import { describe, expect, it, beforeEach } from 'vitest'
import { loadHabits, saveHabits, STORAGE_KEY } from '../src/storage/habitStore'
import type { Habit } from '../src/models/Habit'

describe('habitStore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('round-trips the full dataset through localStorage', () => {
    const habits: Habit[] = [
      {
        name: 'Read',
        streak: 3,
        lastCompletedDate: '2026-08-30',
        archived: false,
      },
      { name: 'Stretch', streak: 0, lastCompletedDate: null, archived: true },
    ]

    saveHabits(habits)

    expect(loadHabits()).toEqual(habits)
  })

  it('returns an empty list when the key is absent', () => {
    expect(() => loadHabits()).not.toThrow()
    expect(loadHabits()).toEqual([])
  })

  it('returns an empty list when the stored value is malformed', () => {
    localStorage.setItem(STORAGE_KEY, 'not json')

    expect(() => loadHabits()).not.toThrow()
    expect(loadHabits()).toEqual([])
  })
})
