import { create } from 'zustand'
import { currentUser } from '@/mock/user'

/**
 * XP is CodeQuest's single currency: earned by learning, practice and challenges, spent on
 * Quest AI (and future features). `lifetimeXp` only ever grows and drives levels, so spending
 * never costs a level. Client-side stand-in for a server wallet — swap actions for API calls later.
 */

export const AI_ANSWER_COST = 10
const STORAGE_KEY = 'codequest-xp-wallet-v1'

interface WalletData {
  /** Spendable balance. */
  xp: number
  /** Total ever earned — drives level progress. */
  lifetimeXp: number
  /** Reward keys already paid out, e.g. "code:two-sum", "lesson:lesson-hash-tables" — first completion only. */
  rewarded: string[]
  claimedMilestones: number[]
}

interface WalletState extends WalletData {
  /** Pays `amount` once per key; returns what was actually awarded (0 if already earned). */
  rewardOnce: (key: string, amount: number) => number
  spendXp: (amount: number) => boolean
  /** Spendable XP that wasn't newly earned — purchases, refunds, duel stakes. Never counts toward levels. */
  creditXp: (amount: number) => void
  claimMilestone: (days: number, amount: number) => boolean
}

const defaults: WalletData = {
  xp: currentUser.xp,
  lifetimeXp: currentUser.xp,
  rewarded: [],
  claimedMilestones: [],
}

function load(): WalletData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaults, ...(JSON.parse(raw) as Partial<WalletData>) }
  } catch {
    // Unavailable or corrupt storage — start from defaults.
  }
  return defaults
}

export const useWalletStore = create<WalletState>((set, get) => ({
  ...(typeof window === 'undefined' ? defaults : load()),

  rewardOnce: (key, amount) => {
    const state = get()
    if (state.rewarded.includes(key)) return 0
    set({ xp: state.xp + amount, lifetimeXp: state.lifetimeXp + amount, rewarded: [...state.rewarded, key] })
    return amount
  },

  spendXp: (amount) => {
    const state = get()
    if (state.xp < amount) return false
    set({ xp: state.xp - amount })
    return true
  },

  creditXp: (amount) => set((s) => ({ xp: s.xp + amount })),

  claimMilestone: (days, amount) => {
    const state = get()
    if (state.claimedMilestones.includes(days)) return false
    set({ xp: state.xp + amount, lifetimeXp: state.lifetimeXp + amount, claimedMilestones: [...state.claimedMilestones, days] })
    return true
  },
}))

useWalletStore.subscribe((state) => {
  const { xp, lifetimeXp, rewarded, claimedMilestones } = state
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ xp, lifetimeXp, rewarded, claimedMilestones }))
  } catch {
    // Storage unavailable — the balance still works for this session.
  }
})
