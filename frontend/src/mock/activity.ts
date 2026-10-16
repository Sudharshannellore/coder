import type { SpriteName } from '@/components/pixel/sprites'

export interface ActivityEvent {
  id: string
  sprite: SpriteName
  player: string
  action: string
  xp: number
}

export const liveActivity: ActivityEvent[] = [
  { id: 'e1', sprite: 'trophy', player: 'Maya Singh', action: 'defeated The Recursion Boss', xp: 500 },
  { id: 'e2', sprite: 'flame', player: 'Jin Park', action: 'hit a 30-day streak', xp: 150 },
  { id: 'e3', sprite: 'bug', player: 'Omar Hassan', action: 'squashed 12 bugs in Debug Challenge', xp: 130 },
  { id: 'e4', sprite: 'database', player: 'Elena Petrova', action: 'solved Department Averages', xp: 110 },
  { id: 'e5', sprite: 'lightning', player: 'Alex Carter', action: 'cleared Speed Round in 1:42', xp: 60 },
  { id: 'e6', sprite: 'crown', player: 'Rahul Verma', action: 'was promoted to Diamond I', xp: 250 },
  { id: 'e7', sprite: 'star', player: 'Lucia Fernandez', action: 'completed Python World', xp: 300 },
]
