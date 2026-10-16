import type { LeaderboardEntry } from '@/types'

export const globalLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'Alex Carter', avatarColor: '#4da3ff', avatarInitials: 'AC', level: 34, xp: 42850, winRate: 78, badges: ['👑', '🏆'] },
  { rank: 2, username: 'Maya Singh', avatarColor: '#a78bfa', avatarInitials: 'MS', level: 31, xp: 39120, winRate: 74, badges: ['🏆'] },
  { rank: 3, username: 'Rahul Verma', avatarColor: '#f5a623', avatarInitials: 'RV', level: 29, xp: 35980, winRate: 71, badges: ['🥉'] },
  { rank: 4, username: 'Sudharshan', avatarColor: '#7bf542', avatarInitials: 'SD', level: 18, xp: 8420, winRate: 64, badges: [], isCurrentUser: true },
  { rank: 5, username: 'Elena Petrova', avatarColor: '#ff5c5c', avatarInitials: 'EP', level: 17, xp: 8105, winRate: 58, badges: [] },
  { rank: 6, username: 'Jin Park', avatarColor: '#3dd68c', avatarInitials: 'JP', level: 16, xp: 7890, winRate: 55, badges: [] },
  { rank: 7, username: 'Omar Hassan', avatarColor: '#4da3ff', avatarInitials: 'OH', level: 15, xp: 7420, winRate: 52, badges: [] },
  { rank: 8, username: 'Lucia Fernandez', avatarColor: '#a78bfa', avatarInitials: 'LF', level: 14, xp: 6980, winRate: 49, badges: [] },
]
