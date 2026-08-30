import type { Habit } from '../models/Habit'
import { saveHabits } from '../storage/habitStore'
import { markDoneStreak } from './streakLogic'

export const EMPTY_HABIT_NAME_ERROR =
  'Habit name cannot be empty. Enter a name to add this habit.'

export function addHabit(habits: Habit[], name: string): Habit[] {
  habits.push({ name, streak: 0, lastCompletedDate: null, archived: false })
  saveHabits(habits)
  return habits
}

export function archiveHabit(habits: Habit[], target: Habit): void {
  target.archived = true
  saveHabits(habits)
}

export function unarchiveHabit(habits: Habit[], target: Habit): void {
  target.archived = false
  saveHabits(habits)
}

export function markDone(habits: Habit[], target: Habit, today: string): void {
  const updated = markDoneStreak(target, today)
  target.streak = updated.streak
  target.lastCompletedDate = updated.lastCompletedDate
  saveHabits(habits)
}
