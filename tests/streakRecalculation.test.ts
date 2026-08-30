import { describe, expect, it } from 'vitest'
import {
  isDoneToday,
  recalculateStreak,
  todayISO,
} from '../src/storage/streakRecalculation'
import type { Habit } from '../src/models/Habit'

const TODAY = '2026-08-30'
const YESTERDAY = '2026-08-29'
const TWO_DAYS_AGO = '2026-08-28'

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    name: 'Read',
    streak: 5,
    lastCompletedDate: null,
    archived: false,
    ...overrides,
  }
}

describe('streakRecalculation', () => {
  it('keeps the streak when last completed today', () => {
    const habit = makeHabit({ lastCompletedDate: TODAY, streak: 5 })

    expect(recalculateStreak(habit, TODAY)).toEqual(habit)
  })

  it('keeps the streak when last completed yesterday', () => {
    const habit = makeHabit({ lastCompletedDate: YESTERDAY, streak: 5 })

    expect(recalculateStreak(habit, TODAY)).toEqual(habit)
  })

  it('resets the streak to 0 when a day was missed', () => {
    const habit = makeHabit({ lastCompletedDate: TWO_DAYS_AGO, streak: 5 })

    expect(recalculateStreak(habit, TODAY)).toEqual({ ...habit, streak: 0 })
  })

  it('resets the streak to 0 when never completed', () => {
    const habit = makeHabit({ lastCompletedDate: null, streak: 5 })

    expect(recalculateStreak(habit, TODAY)).toEqual({ ...habit, streak: 0 })
  })

  it('todayISO returns the local date, not the UTC date', () => {
    // 11:30 PM local time, which is the next day in UTC for negative offsets
    // and the previous day in UTC for positive offsets — either way, todayISO
    // must reflect the local calendar date, not the UTC one.
    const localMidnightEve = new Date(2026, 7, 30, 23, 30, 0)

    expect(todayISO(localMidnightEve)).toBe('2026-08-30')
  })

  it('isDoneToday reflects whether lastCompletedDate matches today', () => {
    expect(isDoneToday(makeHabit({ lastCompletedDate: TODAY }), TODAY)).toBe(
      true,
    )
    expect(
      isDoneToday(makeHabit({ lastCompletedDate: YESTERDAY }), TODAY),
    ).toBe(false)
  })
})
