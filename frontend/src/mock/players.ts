/**
 * Mock player directory — stands in for the users API. Every player gets a permanent UUID
 * "Player ID" when they sign up; friends add each other by that ID.
 */

export interface Player {
  id: string
  username: string
  avatarColor: string
  avatarInitials: string
  level: number
  league: string
  online: boolean
  /** Mock duel skill: < 1 solves faster than average, > 1 slower. */
  pace: number
}

export const players: Player[] = [
  { id: 'e2c4a6f8-1d3b-4a5c-9e7f-2b4d6f8a1c39', username: 'Alex Carter', avatarColor: '#4da3ff', avatarInitials: 'AC', level: 34, league: 'Master I', online: false, pace: 0.7 },
  { id: 'b6f1c2e4-3a7d-4c19-9e5b-2f8a1d0c7e31', username: 'Maya Singh', avatarColor: '#a78bfa', avatarInitials: 'MS', level: 31, league: 'Master II', online: true, pace: 0.8 },
  { id: '4e9a7b2c-8d1f-4a6e-b3c5-7f2e9d1a0b84', username: 'Rahul Verma', avatarColor: '#f5a623', avatarInitials: 'RV', level: 29, league: 'Diamond I', online: true, pace: 0.85 },
  { id: '9c3d5e7f-1b2a-4c8d-a6e9-3f5b7d9e1c26', username: 'Elena Petrova', avatarColor: '#ff5c5c', avatarInitials: 'EP', level: 17, league: 'Diamond III', online: true, pace: 1.05 },
  { id: '2a8f6c4e-7d3b-4e1a-9c5f-8b2d6e4a1f97', username: 'Jin Park', avatarColor: '#3dd68c', avatarInitials: 'JP', level: 16, league: 'Platinum I', online: false, pace: 1.1 },
  { id: '7d1e3f5a-9b4c-4d2e-8a6f-1c3e5b7d9a48', username: 'Omar Hassan', avatarColor: '#4da3ff', avatarInitials: 'OH', level: 15, league: 'Platinum II', online: true, pace: 1.15 },
  { id: '5f7a9c1e-3d5b-4f8a-b2c4-6e8a1c3e5f72', username: 'Lucia Fernandez', avatarColor: '#a78bfa', avatarInitials: 'LF', level: 14, league: 'Platinum III', online: false, pace: 1.2 },
]

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function findPlayer(id: string): Player | undefined {
  const key = id.trim().toLowerCase()
  return players.find((p) => p.id === key)
}
