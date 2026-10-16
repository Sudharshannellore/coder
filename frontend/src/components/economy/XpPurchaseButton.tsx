import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWalletStore } from '@/stores/walletStore'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { cn } from '@/utils/cn'

interface XpPurchaseButtonProps {
  children: ReactNode
  cost: number
  /** Performs the purchase (the store spends the XP); return false if it didn't go through. */
  onPurchase: () => boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
}

/** A one-off XP purchase (not AI): shows the price, is disabled when unaffordable, flashes the charge. */
export function XpPurchaseButton({ children, cost, onPurchase, disabled, size = 'md', className }: XpPurchaseButtonProps) {
  const xp = useWalletStore((s) => s.xp)
  const [charged, setCharged] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const short = cost - xp
  const cantAfford = short > 0

  return (
    <span className={cn('relative inline-flex', className)}>
      <button
        type="button"
        disabled={disabled || cantAfford}
        title={cantAfford ? `Costs ${cost} XP — you're ${short} XP short. Earn more by learning and solving problems.` : `Costs ${cost} XP`}
        onClick={() => {
          if (!onPurchase()) return
          setCharged(true)
          window.clearTimeout(timer.current)
          timer.current = window.setTimeout(() => setCharged(false), 1400)
        }}
        className={cn(
          'inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap border-2 border-[var(--color-accent)] bg-[var(--color-accent-soft)] font-pixel text-[var(--color-accent)] transition-[background-color,transform] duration-100 hover:-translate-y-0.5 hover:bg-[var(--color-accent)] hover:text-[#06120a] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-[var(--color-accent-soft)] disabled:hover:text-[var(--color-accent)]',
          size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
        )}
      >
        {children}
        <span className="inline-flex items-center gap-1 opacity-90">
          · <PixelSprite sprite="star" scale={1} /> {cost} XP
        </span>
      </button>
      <AnimatePresence>
        {charged && (
          <motion.span
            className="pointer-events-none absolute -top-5 right-0 font-pixel text-xs text-[var(--color-warning)]"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: -6 }}
            exit={{ opacity: 0 }}
          >
            −{cost} XP
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
