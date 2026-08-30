import type { Habit } from '../models/Habit'

export function todayISO(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isDoneToday(habit: Habit, today: string): boolean {
  return habit.lastCompletedDate === today
}

export function yesterdayOf(today: string): string {
  const [year, month, day] = today.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() - 1)
  return todayISO(date)
}

export function recalculateStreak(habit: Habit, today: string): Habit {
  if (
    habit.lastCompletedDate === today ||
    habit.lastCompletedDate === yesterdayOf(today)
  ) {
    return habit
  }
  return { ...habit, streak: 0 }
}

export function recalculateAll(habits: Habit[], today: string): Habit[] {
  return habits.map((habit) => recalculateStreak(habit, today))
}
