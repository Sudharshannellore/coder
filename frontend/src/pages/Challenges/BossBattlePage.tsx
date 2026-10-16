import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Check, Lock, Flame } from 'lucide-react'
import { api } from '@/services/api'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { PageLoader } from '@/components/layout/PageLoader'
import { BossArena } from '@/components/gamification/BossArena'
import type { BossStage } from '@/types'
import { cn } from '@/utils/cn'

function StageRow({ stage, index, isCurrent }: { stage: BossStage; index: number; isCurrent: boolean }) {
  const state = stage.completed ? 'completed' : isCurrent ? 'current' : 'locked'
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center border-2 font-pixel text-lg shadow-[3px_3px_0_var(--pixel-ink)]',
            state === 'completed' && 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
            state === 'current' && 'border-[var(--color-violet)] bg-[var(--color-violet-soft)] text-[var(--color-violet)] shadow-[var(--shadow-glow-violet)]',
            state === 'locked' && 'border-[var(--color-border-strong)] text-[var(--color-text-muted)]',
          )}
        >
          {state === 'completed' ? <Check className="h-5 w-5" strokeWidth={3} /> : state === 'locked' ? <Lock className="h-4 w-4" /> : index + 1}
        </div>
        <div className={cn('mt-1 w-0.5 flex-1', state === 'completed' ? 'bg-[var(--color-accent)]/40' : 'bg-[var(--color-border)]')} />
      </div>
      <div className={cn('pb-8', state === 'locked' && 'opacity-50')}>
        <p className={cn('font-semibold', state === 'current' && 'text-[var(--color-violet)]')}>{stage.title}</p>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{stage.description}</p>
        {state === 'current' && (
          <Badge variant="violet" className="mt-2">
            In Progress
          </Badge>
        )}
      </div>
    </div>
  )
}

export default function BossBattlePage() {
  const { data: bossBattle } = useQuery({ queryKey: ['boss-battle'], queryFn: api.getBossBattle })
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)

  useEffect(() => {
    if (!bossBattle) return
    setSecondsLeft(bossBattle.timeRemainingSeconds)
  }, [bossBattle])

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev === null ? null : Math.max(0, prev - 1)))
    }, 1000)
    return () => clearInterval(id)
  }, [secondsLeft])

  if (!bossBattle || secondsLeft === null) return <PageLoader />

  const currentStageIndex = bossBattle.stages.findIndex((s) => !s.completed)
  const activeStageIndex = currentStageIndex === -1 ? bossBattle.stages.length - 1 : currentStageIndex
  const currentStage = bossBattle.stages[activeStageIndex]
  const isDefeated = bossBattle.stages.every((s) => s.completed)

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <BossArena
        name={bossBattle.name}
        secondsLeft={secondsLeft}
        rewardXp={bossBattle.rewardXp}
        hpPercent={(bossBattle.stages.filter((s) => !s.completed).length / bossBattle.stages.length) * 100}
      />

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
            <Flame className="h-4 w-4 text-[var(--color-warning)]" />
            Battle Stages
          </h2>
          <div>
            {bossBattle.stages.map((stage, i) => (
              <StageRow key={stage.id} stage={stage} index={i} isCurrent={i === activeStageIndex && !isDefeated} />
            ))}
          </div>

          <Link to="/code" className={cn(buttonVariants({ variant: 'pixelViolet', size: 'lg' }), 'mt-2 w-full text-lg')}>
            {isDefeated ? 'Boss Defeated — Review Solution' : `Continue Battle: ${currentStage.title}`}
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
