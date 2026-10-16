import type { DailyQuest } from '@/types'

export const dailyQuest: DailyQuest = {
  id: 'q-hash-tables',
  title: 'Master Hash Tables',
  rewardXp: 250,
  progressPercent: 80,
  tasks: [
    { id: 't1', label: 'Learn Hash Tables', done: true },
    { id: 't2', label: 'Complete 2 exercises', done: true },
    { id: 't3', label: 'Debug Challenge', done: false },
    { id: 't4', label: 'Boss Battle', done: false },
  ],
}
