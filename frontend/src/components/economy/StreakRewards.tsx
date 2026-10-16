import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { streakMilestones } from '@/mock/rewards'
import { useWalletStore } from '@/stores/walletStore'
import { cn } from '@/utils/cn'

const BURST = [
  { x: -36, y: -46 },
  { x: -12, y: -62 },
  { x: 14, y: -58 },
  { x: 36, y: -40 },
]

export function StreakRewards({ streakDays, className }: { streakDays: number; className?: string }) {
  const claimed = useWalletStore((s) => s.claimedMilestones)
  const claimMilestone = useWalletStore((s) => s.claimMilestone)
  const reduceMotion = useReducedMotion()
  const [justClaimed, setJustClaimed] = useState<number | null>(null)

  const claim = (days: number, xp: number) => {
    if (claimMilestone(days, xp)) {
      setJustClaimed(days)
      window.setTimeout(() => setJustClaimed((d) => (d === days ? null : d)), 900)
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex-wrap">
        <CardTitle className="flex items-center gap-2">
          <PixelSprite sprite="flame" scale={2} fps={6} /> Streak Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
          You're on a <span className="font-pixel text-[var(--color-warning)]">{streakDays}-day</span> streak. Hit milestones to earn bonus XP.
        </p>
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {streakMilestones.map((m) => {
            const isClaimed = claimed.includes(m.days)
            const reached = streakDays >= m.days
            const claimable = reached && !isClaimed
            return (
              <li
                key={m.days}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 border-2 p-3 text-center',
                  claimable && 'border-[var(--color-violet)] bg-[var(--color-violet-soft)] shadow-[3px_3px_0_var(--pixel-ink)]',
                  isClaimed && 'border-[var(--color-success)]/40 bg-[var(--color-success)]/5',
                  !reached && 'border-[var(--color-border-strong)] opacity-60',
                )}
              >
                <AnimatePresence>
                  {justClaimed === m.days &&
                    !reduceMotion &&
                    BURST.map((b, i) => (
                      <motion.span
                        key={i}
                        className="pointer-events-none absolute left-1/2 top-6"
                        initial={{ x: 0, y: 0, opacity: 1 }}
                        animate={{ x: b.x, y: b.y, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      >
                        <PixelSprite sprite="star" scale={2} />
                      </motion.span>
                    ))}
                </AnimatePresence>
                <span className="font-pixel text-lg leading-none text-[var(--color-warning)]">{m.days}d</span>
                <span className="flex items-center gap-1 font-pixel text-sm text-[var(--color-accent)]">
                  <PixelSprite sprite="star" scale={1.25} />+{m.xp} XP
                </span>
                {isClaimed ? (
                  <span className="flex items-center gap-1 font-pixel text-xs text-[var(--color-success)]">
                    <Check className="h-3 w-3" strokeWidth={3} /> Claimed
                  </span>
                ) : claimable ? (
                  <button
                    type="button"
                    onClick={() => claim(m.days, m.xp)}
                    className="pixel-btn w-full bg-[var(--color-violet)] px-2 py-1 font-pixel text-xs text-[#140b2e]"
                  >
                    Claim
                  </button>
                ) : (
                  <span className="font-pixel text-[11px] text-[var(--color-text-muted)]">{m.days - streakDays} days to go</span>
                )}
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
