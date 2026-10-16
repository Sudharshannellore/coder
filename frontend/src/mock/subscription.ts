/** XP store catalog. Prices are in INR; keep them here so they're easy to change. */

export type Billing = 'monthly' | 'yearly'

export interface XpPlan {
  id: 'starter' | 'pro' | 'elite'
  name: string
  /** XP credited at the start of every month. */
  monthlyXp: number
  price: Record<Billing, number>
  perks: string[]
  sprite: 'potion' | 'gem' | 'crown'
  popular?: boolean
}

export const xpPlans: XpPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyXp: 1000,
    price: { monthly: 99, yearly: 990 },
    perks: ['1,000 XP every month', '≈ 100 Quest AI answers', 'Unused XP never expires'],
    sprite: 'potion',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyXp: 3000,
    price: { monthly: 249, yearly: 2490 },
    perks: ['3,000 XP every month', 'Enough to unlock every premium resume template', 'Tailor resumes for ~60 job applications', 'Unused XP never expires'],
    sprite: 'gem',
    popular: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    monthlyXp: 7500,
    price: { monthly: 499, yearly: 4990 },
    perks: ['7,500 XP every month', 'Best value of the three plans', '≈ 750 Quest AI answers', 'Unused XP never expires'],
    sprite: 'crown',
  },
]

export interface XpPack {
  id: string
  xp: number
  /** Extra XP on top of the base rate, shown as a badge. */
  bonusPercent: number
  price: number
}

export const xpPacks: XpPack[] = [
  { id: 'pack-500', xp: 500, bonusPercent: 0, price: 49 },
  { id: 'pack-1200', xp: 1200, bonusPercent: 20, price: 99 },
  { id: 'pack-3000', xp: 3000, bonusPercent: 50, price: 199 },
  { id: 'pack-8000', xp: 8000, bonusPercent: 75, price: 449 },
]

export const formatInr = (amount: number) => `₹${amount.toLocaleString('en-IN')}`
