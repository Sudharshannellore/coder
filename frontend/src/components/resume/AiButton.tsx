import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useWalletStore } from '@/stores/walletStore'
import { cn } from '@/utils/cn'

interface AiButtonProps {
  label: string
  cost: number
  /** Applies the AI result; runs only after the XP has been charged. */
  onRun: () => void
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
}

const THINKING_MS = 900

/** An AI action that charges XP: shows its price, spends on click, "thinks", then applies the result. */
export function AiButton({ label, cost, onRun, disabled, size = 'md', className }: AiButtonProps) {
  const xp = useWalletStore((s) => s.xp)
  const spendXp = useWalletStore((s) => s.spendXp)
  const [thinking, setThinking] = useState(false)
  const [charged, setCharged] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const short = cost - xp
  const cantAfford = short > 0

  const run = () => {
    if (thinking || disabled || !spendXp(cost)) return
    setThinking(true)
    timers.current.push(
      window.setTimeout(() => {
        onRun()
        setThinking(false)
        setCharged(true)
        timers.current.push(window.setTimeout(() => setCharged(false), 1400))
      }, THINKING_MS),
    )
  }

  return (
    <span className={cn('relative inline-flex', className)}>
      <button
        type="button"
        onClick={run}
        disabled={disabled || cantAfford || thinking}
        title={cantAfford ? `Needs ${cost} XP — you're ${short} XP short. Earn more by learning and solving problems.` : `Costs ${cost} XP`}
        className={cn(
          'inline-flex items-center gap-1.5 border-2 border-[var(--color-violet)] bg-[var(--color-violet-soft)] font-pixel text-[var(--color-violet)] transition-[background-color,transform] duration-100 hover:-translate-y-0.5 hover:bg-[var(--color-violet)] hover:text-[#140b2e] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-[var(--color-violet-soft)] disabled:hover:text-[var(--color-violet)]',
          size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1.5 text-xs',
        )}
      >
        <Sparkles className={cn(size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5', thinking && 'animate-spin')} />
        {thinking ? 'Thinking…' : label}
        {!thinking && <span className="opacity-80">· {cost} XP</span>}
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
