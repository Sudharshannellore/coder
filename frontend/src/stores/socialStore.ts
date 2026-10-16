import { useEffect } from 'react'
import { create } from 'zustand'
import { findPlayer, players, UUID_PATTERN } from '@/mock/players'
import { getProblemBySlug } from '@/mock/problems'
import { useWalletStore } from './walletStore'

/**
 * Friends and friend duels. Client-side stand-in for a social API: the friend's side (accepting
 * requests and duels, and their solve time) is simulated here — on a backend it comes from the
 * other player's real actions.
 */

const STORAGE_KEY = 'codequest-social-v1'
/** Bonus for winning a duel, on top of the stakes. Earned XP — counts toward levels. */
export const DUEL_WIN_BONUS = 40
export const DUEL_STAKES = [0, 25, 50, 100] as const
export const DUEL_TIME_LIMITS = [10, 20, 30] as const

const FRIEND_ACCEPT_MS = 2500
const DUEL_ACCEPT_MS = 3500

export type DuelStatus = 'pending' | 'active' | 'won' | 'lost' | 'draw' | 'declined' | 'cancelled'

export interface Duel {
  id: string
  friendId: string
  problemSlug: string
  timeLimitMinutes: number
  /** XP each player puts in; the winner takes both. */
  stake: number
  /** Who sent the challenge. */
  direction: 'sent' | 'received'
  createdAt: number
  /** When I opened the board for this duel — my clock starts here. */
  startedAt?: number
  finishedAt?: number
  /** My solve time; null = didn't solve within the time limit. */
  mySeconds?: number | null
  /** The friend's result, decided when the duel is created (hidden until mine is in). */
  friendSeconds: number | null
  status: DuelStatus
}

interface SocialData {
  /** This player's permanent Player ID — assigned at sign-up. */
  myId: string
  friends: string[]
  incomingRequests: { playerId: string; at: number }[]
  outgoingRequests: { playerId: string; at: number }[]
  duels: Duel[]
}

export type AddFriendResult = 'sent' | 'invalid' | 'self' | 'not-found' | 'already-friends' | 'already-sent' | 'accepted-incoming'

interface SocialState extends SocialData {
  sendFriendRequest: (playerId: string) => AddFriendResult
  acceptRequest: (playerId: string) => void
  declineRequest: (playerId: string) => void
  removeFriend: (playerId: string) => void
  sendDuel: (input: { friendId: string; problemSlug: string; timeLimitMinutes: number; stake: number }) => boolean
  acceptDuel: (id: string) => boolean
  declineDuel: (id: string) => void
  cancelDuel: (id: string) => void
  startDuel: (id: string) => void
  /** Records my result (null = out of time) and settles the stakes. */
  finishDuel: (id: string, mySeconds: number | null) => Duel | undefined
  /** Advances the simulated friend side: accepts requests and duels after a short delay. */
  sync: () => void
}

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

const BASE_SECONDS = { easy: 300, medium: 600, hard: 1200 }

/** The simulated friend's result for a duel: their pace, the problem's difficulty and some luck. */
function friendResult(friendId: string, problemSlug: string, timeLimitMinutes: number): number | null {
  const pace = findPlayer(friendId)?.pace ?? 1
  const base = BASE_SECONDS[getProblemBySlug(problemSlug)?.difficulty ?? 'medium']
  if (Math.random() < 0.15) return null
  const seconds = Math.round(base * pace * (0.6 + Math.random() * 0.8))
  return seconds <= timeLimitMinutes * 60 ? seconds : null
}

function defaults(): SocialData {
  const now = Date.now()
  const [, maya, , elena, jin] = players
  return {
    myId: makeId(),
    friends: [maya.id, jin.id],
    incomingRequests: [{ playerId: elena.id, at: now - 3_600_000 }],
    outgoingRequests: [],
    duels: [
      {
        id: 'duel-seed-incoming',
        friendId: jin.id,
        problemSlug: 'two-sum',
        timeLimitMinutes: 20,
        stake: 25,
        direction: 'received',
        createdAt: now - 1_800_000,
        friendSeconds: 410,
        status: 'pending',
      },
      {
        id: 'duel-seed-history',
        friendId: maya.id,
        problemSlug: 'binary-search',
        timeLimitMinutes: 20,
        stake: 50,
        direction: 'sent',
        createdAt: now - 86_400_000,
        startedAt: now - 86_400_000,
        finishedAt: now - 86_200_000,
        mySeconds: 198,
        friendSeconds: 254,
        status: 'won',
      },
    ],
  }
}

function load(): SocialData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaults(), ...(JSON.parse(raw) as Partial<SocialData>) }
  } catch {
    // Unavailable or corrupt storage — start fresh.
  }
  return defaults()
}

export const useSocialStore = create<SocialState>((set, get) => ({
  ...(typeof window === 'undefined' ? defaults() : load()),

  sendFriendRequest: (rawId) => {
    const id = rawId.trim().toLowerCase()
    const s = get()
    if (!UUID_PATTERN.test(id)) return 'invalid'
    if (id === s.myId.toLowerCase()) return 'self'
    if (!findPlayer(id)) return 'not-found'
    if (s.friends.includes(id)) return 'already-friends'
    if (s.outgoingRequests.some((r) => r.playerId === id)) return 'already-sent'
    if (s.incomingRequests.some((r) => r.playerId === id)) {
      get().acceptRequest(id)
      return 'accepted-incoming'
    }
    set({ outgoingRequests: [...s.outgoingRequests, { playerId: id, at: Date.now() }] })
    return 'sent'
  },

  acceptRequest: (playerId) =>
    set((s) => ({
      incomingRequests: s.incomingRequests.filter((r) => r.playerId !== playerId),
      friends: s.friends.includes(playerId) ? s.friends : [...s.friends, playerId],
    })),

  declineRequest: (playerId) => set((s) => ({ incomingRequests: s.incomingRequests.filter((r) => r.playerId !== playerId) })),

  removeFriend: (playerId) => set((s) => ({ friends: s.friends.filter((f) => f !== playerId) })),

  sendDuel: ({ friendId, problemSlug, timeLimitMinutes, stake }) => {
    if (!get().friends.includes(friendId)) return false
    if (stake > 0 && !useWalletStore.getState().spendXp(stake)) return false
    const duel: Duel = {
      id: `duel-${Date.now()}`,
      friendId,
      problemSlug,
      timeLimitMinutes,
      stake,
      direction: 'sent',
      createdAt: Date.now(),
      friendSeconds: friendResult(friendId, problemSlug, timeLimitMinutes),
      status: 'pending',
    }
    set((s) => ({ duels: [duel, ...s.duels] }))
    return true
  },

  acceptDuel: (id) => {
    const duel = get().duels.find((d) => d.id === id)
    if (!duel || duel.status !== 'pending' || duel.direction !== 'received') return false
    if (duel.stake > 0 && !useWalletStore.getState().spendXp(duel.stake)) return false
    set((s) => ({ duels: s.duels.map((d) => (d.id === id ? { ...d, status: 'active' } : d)) }))
    return true
  },

  declineDuel: (id) => set((s) => ({ duels: s.duels.map((d) => (d.id === id && d.status === 'pending' ? { ...d, status: 'declined' } : d)) })),

  cancelDuel: (id) => {
    const duel = get().duels.find((d) => d.id === id)
    if (!duel || duel.direction !== 'sent' || (duel.status !== 'pending' && !(duel.status === 'active' && !duel.startedAt))) return
    if (duel.stake > 0) useWalletStore.getState().creditXp(duel.stake)
    set((s) => ({ duels: s.duels.map((d) => (d.id === id ? { ...d, status: 'cancelled' } : d)) }))
  },

  startDuel: (id) => set((s) => ({ duels: s.duels.map((d) => (d.id === id && d.status === 'active' && !d.startedAt ? { ...d, startedAt: Date.now() } : d)) })),

  finishDuel: (id, mySeconds) => {
    const duel = get().duels.find((d) => d.id === id)
    if (!duel || duel.status !== 'active') return duel
    const limit = duel.timeLimitMinutes * 60
    const mine = mySeconds !== null && mySeconds <= limit ? mySeconds : null
    const theirs = duel.friendSeconds
    const status: DuelStatus =
      mine === null && theirs === null ? 'draw' : mine === null ? 'lost' : theirs === null || mine < theirs ? 'won' : mine === theirs ? 'draw' : 'lost'

    const wallet = useWalletStore.getState()
    if (status === 'won') {
      if (duel.stake > 0) wallet.creditXp(duel.stake * 2)
      wallet.rewardOnce(`duel:${duel.id}`, DUEL_WIN_BONUS)
    } else if (status === 'draw' && duel.stake > 0) {
      wallet.creditXp(duel.stake)
    }

    const finished: Duel = { ...duel, mySeconds: mine, finishedAt: Date.now(), status }
    set((s) => ({ duels: s.duels.map((d) => (d.id === id ? finished : d)) }))
    return finished
  },

  sync: () => {
    const s = get()
    const now = Date.now()
    const accepted = s.outgoingRequests.filter((r) => now - r.at >= FRIEND_ACCEPT_MS).map((r) => r.playerId)
    const duelsReady = s.duels.some((d) => d.direction === 'sent' && d.status === 'pending' && now - d.createdAt >= DUEL_ACCEPT_MS)
    if (!accepted.length && !duelsReady) return
    set({
      outgoingRequests: s.outgoingRequests.filter((r) => !accepted.includes(r.playerId)),
      friends: [...s.friends, ...accepted.filter((id) => !s.friends.includes(id))],
      duels: s.duels.map((d) => (d.direction === 'sent' && d.status === 'pending' && now - d.createdAt >= DUEL_ACCEPT_MS ? { ...d, status: 'active' } : d)),
    })
  },
}))

function persist(state: SocialData) {
  const { myId, friends, incomingRequests, outgoingRequests, duels } = state
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ myId, friends, incomingRequests, outgoingRequests, duels: duels.slice(0, 40) }))
  } catch {
    // Storage unavailable — social state still works for this session.
  }
}

// Save right away so the freshly assigned Player ID stays the same across reloads.
if (typeof window !== 'undefined') persist(useSocialStore.getState())
useSocialStore.subscribe(persist)

export const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

/** Keeps the simulated friend side moving while a social page is open. */
export function useSocialSync() {
  const sync = useSocialStore((s) => s.sync)
  useEffect(() => {
    sync()
    const id = window.setInterval(sync, 1000)
    return () => window.clearInterval(id)
  }, [sync])
}
