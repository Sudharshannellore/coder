import { PixelSprite } from '@/components/pixel/PixelSprite'
import { liveActivity } from '@/mock/activity'

export function ActivityTicker() {
  const items = [...liveActivity, ...liveActivity]

  return (
    <div className="relative overflow-hidden border-y-2 border-[var(--pixel-ink)] bg-[var(--color-surface)] py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-surface)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-surface)] to-transparent" />
      <p className="sr-only">Recent activity from CodeQuest players</p>
      <ul className="animate-ticker flex w-max items-center gap-10" aria-hidden="true">
        {items.map((e, i) => (
          <li key={`${e.id}-${i}`} className="flex items-center gap-2.5 whitespace-nowrap font-pixel text-sm">
            <PixelSprite sprite={e.sprite} scale={2} />
            <span className="text-[var(--color-text-primary)]">{e.player}</span>
            <span className="text-[var(--color-text-secondary)]">{e.action}</span>
            <span className="text-[var(--color-accent)]">+{e.xp} XP</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
