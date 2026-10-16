import { create } from 'zustand'
import { xpPlans, type Billing, type XpPlan } from '@/mock/subscription'
import { useWalletStore } from './walletStore'

/**
 * XP subscriptions and one-time packs. Demo only: no payment is taken — swap `subscribe`/`buyPack`
 * for a real checkout (and server-side crediting) when payments are connected.
 */

const STORAGE_KEY = 'codequest-subscription-v1'

export interface Purchase {
  id: string
  label: string
  xp: number
  price: number
  at: number
}

interface Subscription {
  planId: XpPlan['id']
  billing: Billing
  /** When the next monthly XP drop is due. */
  nextDropAt: number
  /** When the paid period ends (a month or a year from the start). */
  periodEndsAt: number
  cancelAtPeriodEnd: boolean
}

interface SubscriptionData {
  subscription: Subscription | null
  purchases: Purchase[]
}

interface SubscriptionState extends SubscriptionData {
  subscribe: (planId: XpPlan['id'], billing: Billing) => void
  cancel: () => void
  resume: () => void
  buyPack: (label: string, xp: number, price: number) => void
}

const addMonths = (t: number, n: number) => {
  const d = new Date(t)
  d.setMonth(d.getMonth() + n)
  return d.getTime()
}

const planById = (id: XpPlan['id']) => xpPlans.find((p) => p.id === id) ?? xpPlans[0]

function record(purchases: Purchase[], label: string, xp: number, price: number, at = Date.now()): Purchase[] {
  return [{ id: `buy-${at}-${purchases.length}`, label, xp, price, at }, ...purchases]
}

/** Pays out any monthly drops that came due while the app was closed, and ends cancelled plans. */
function catchUp(data: SubscriptionData): SubscriptionData {
  const sub = data.subscription
  if (!sub) return data
  const now = Date.now()
  let { nextDropAt, periodEndsAt } = sub
  let purchases = data.purchases
  const plan = planById(sub.planId)

  while (nextDropAt <= now) {
    if (nextDropAt >= periodEndsAt) {
      if (sub.cancelAtPeriodEnd) return { subscription: null, purchases }
      periodEndsAt = addMonths(periodEndsAt, sub.billing === 'yearly' ? 12 : 1)
    }
    useWalletStore.getState().creditXp(plan.monthlyXp)
    purchases = record(purchases, `${plan.name} monthly XP drop`, plan.monthlyXp, 0, nextDropAt)
    nextDropAt = addMonths(nextDropAt, 1)
  }
  return { subscription: { ...sub, nextDropAt, periodEndsAt }, purchases }
}

function load(): SubscriptionData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return catchUp(JSON.parse(raw) as SubscriptionData)
  } catch {
    // Unavailable or corrupt storage — no subscription.
  }
  return { subscription: null, purchases: [] }
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  ...(typeof window === 'undefined' ? { subscription: null, purchases: [] } : load()),

  subscribe: (planId, billing) => {
    const plan = planById(planId)
    const now = Date.now()
    const current = get().subscription
    // Switching plans starts a fresh period on the new plan; its first month of XP is credited right away.
    useWalletStore.getState().creditXp(plan.monthlyXp)
    set((s) => ({
      subscription: {
        planId,
        billing,
        nextDropAt: addMonths(now, 1),
        periodEndsAt: addMonths(now, billing === 'yearly' ? 12 : 1),
        cancelAtPeriodEnd: false,
      },
      purchases: record(s.purchases, `${current ? 'Switched to' : 'Subscribed to'} ${plan.name} (${billing})`, plan.monthlyXp, plan.price[billing]),
    }))
  },

  cancel: () => set((s) => (s.subscription ? { subscription: { ...s.subscription, cancelAtPeriodEnd: true } } : {})),
  resume: () => set((s) => (s.subscription ? { subscription: { ...s.subscription, cancelAtPeriodEnd: false } } : {})),

  buyPack: (label, xp, price) => {
    useWalletStore.getState().creditXp(xp)
    set((s) => ({ purchases: record(s.purchases, label, xp, price) }))
  },
}))

useSubscriptionStore.subscribe((state) => {
  const { subscription, purchases } = state
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ subscription, purchases: purchases.slice(0, 50) }))
  } catch {
    // Storage unavailable — the subscription still works for this session.
  }
})

export { planById }
