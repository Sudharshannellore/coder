import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { buttonVariants } from '@/components/ui/Button'
import { PixelBar } from '@/components/pixel/PixelBar'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import type { DailyQuest } from '@/types'
import { cn } from '@/utils/cn'

export function QuestCard({ quest }: { quest: DailyQuest }) {
  const complete = quest.tasks.every((t) => t.done)

  return (
    <Card className="pixel-scanlines relative overflow-hidden border-2 border-[var(--color-accent)]/30">
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-pixel text-sm uppercase tracking-wider text-[var(--color-accent)]">Today's Coding Quest</p>
            <h3 className="mt-1 text-xl font-semibold">{quest.title}</h3>
          </div>
          <div className="flex flex-col items-center gap-1">
            <PixelSprite sprite={complete ? 'chestOpened' : 'chest'} scale={3} className={cn(!complete && 'animate-pixel-bob')} />
            <span className="font-pixel text-sm text-[var(--color-warning)]">+{quest.rewardXp} XP</span>
          </div>
        </div>

        <PixelBar percent={quest.progressPercent} segments={10} size="lg" className="mt-4" label="Quest progress" />

        <ol className="mt-5 grid gap-2 sm:grid-cols-2">
          {quest.tasks.map((task, i) => (
            <li
              key={task.id}
              className={cn(
                'flex items-center gap-2.5 border-2 px-3 py-2 text-sm',
                task.done
                  ? 'border-[var(--color-accent)]/25 bg-[var(--color-accent-soft)] text-[var(--color-text-muted)]'
                  : 'border-[var(--color-border-strong)] text-[var(--color-text-primary)]',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center font-pixel text-xs',
                  task.done ? 'bg-[var(--color-accent)] text-[#06120a]' : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]',
                )}
              >
                {task.done ? <Check className="h-3.5 w-3.5" strokeWidth={4} /> : i + 1}
              </span>
              <span className={cn(task.done && 'line-through')}>{task.label}</span>
            </li>
          ))}
        </ol>

        <Link to="/practice" className={cn(buttonVariants({ variant: 'pixel', size: 'lg' }), 'mt-6 w-full text-lg')}>
          {complete ? 'Claim Reward' : 'Continue Quest'}
        </Link>
      </CardContent>
    </Card>
  )
}
