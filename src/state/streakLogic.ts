import type { Habit } from '../models/Habit'
import { yesterdayOf } from '../storage/streakRecalculation'

export function markDoneStreak(habit: Habit, today: string): Habit {
  if (habit.lastCompletedDate === today) {
    return habit
  }
  if (habit.lastCompletedDate === yesterdayOf(today)) {
    return { ...habit, streak: habit.streak + 1, lastCompletedDate: today }
  }
  return { ...habit, streak: 1, lastCompletedDate: today }
}
