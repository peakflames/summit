export type Habit = {
  name: string
  streak: number
  lastCompletedDate: string | null // local 'YYYY-MM-DD', or null if never completed
  archived: boolean
}
