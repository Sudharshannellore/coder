import type { UserProfile } from '@/types'

export const currentUser: UserProfile = {
  id: 'u-1',
  username: 'Sudharshan',
  handle: '@sudharshan_dev',
  avatarColor: '#7bf542',
  avatarInitials: 'SD',
  level: 18,
  xp: 8420,
  xpToNextLevel: 10000,
  streakDays: 12,
  league: { tier: 'diamond', division: 3, label: 'Diamond III' },
  rank: 4,
  joinedAt: '2025-02-11',
  stats: {
    problemsSolved: 214,
    challengesWon: 37,
    longestStreak: 41,
    accuracy: 86,
    avgSolveTimeSeconds: 312,
    languages: ['Python', 'JavaScript', 'SQL'],
  },
  skills: [
    { name: 'Python', percent: 92 },
    { name: 'JavaScript', percent: 78 },
    { name: 'SQL', percent: 67 },
    { name: 'Algorithms', percent: 58 },
  ],
}
