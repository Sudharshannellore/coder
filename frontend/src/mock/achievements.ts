import type { Achievement } from '@/types'

export const achievements: Achievement[] = [
  { id: 'a1', icon: 'flame', title: '7 Day Streak', description: 'Practiced for 7 days in a row.', unlocked: true, unlockedAt: '2026-09-02', rarity: 'common' },
  { id: 'a2', icon: 'trophy', title: 'First Boss Defeated', description: 'Defeated your first Boss Battle.', unlocked: true, unlockedAt: '2026-09-15', rarity: 'rare' },
  { id: 'a3', icon: 'lightning', title: 'Speed Coder', description: 'Solved a Speed Challenge in under 2 minutes.', unlocked: true, unlockedAt: '2026-09-20', rarity: 'rare' },
  { id: 'a4', icon: 'star', title: 'Algorithm Master', description: 'Solved 50 algorithm problems.', unlocked: false, rarity: 'epic' },
  { id: 'a5', icon: 'bug', title: 'Bug Hunter', description: 'Completed 20 Debug Challenges.', unlocked: true, unlockedAt: '2026-10-01', rarity: 'common' },
  { id: 'a6', icon: 'floppy', title: 'SQL Wizard', description: 'Mastered advanced joins and subqueries.', unlocked: false, rarity: 'epic' },
  { id: 'a7', icon: 'medal', title: '100 Problems Solved', description: 'Solved 100 coding problems.', unlocked: true, unlockedAt: '2026-10-08', rarity: 'rare' },
  { id: 'a8', icon: 'crown', title: 'League Champion', description: 'Finished #1 in your league this week.', unlocked: false, rarity: 'legendary' },
]
