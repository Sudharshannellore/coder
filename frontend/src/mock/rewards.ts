export interface StreakMilestone {
  days: number
  xp: number
}

export const streakMilestones: StreakMilestone[] = [
  { days: 3, xp: 25 },
  { days: 7, xp: 75 },
  { days: 14, xp: 150 },
  { days: 30, xp: 400 },
  { days: 100, xp: 1500 },
]
