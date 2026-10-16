import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { api } from '@/services/api'
import { Badge, difficultyVariant } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/layout/PageLoader'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { PixelBackdrop } from '@/components/pixel/PixelBackdrop'
import type { Difficulty } from '@/types'
import { cn } from '@/utils/cn'
import { monsters } from './monsters'

type Kind = 'code' | 'sql'
type KindFilter = 'all' | Kind
type DifficultyFilter = 'all' | Difficulty

interface PracticeItem {
  key: string
  kind: Kind
  title: string
  difficulty: Difficulty
  xp: number
  acceptanceRate: number
  tags: string[]
  to: string
}

const kindFilters: { id: KindFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'code', label: 'Coding' },
  { id: 'sql', label: 'SQL' },
]

const difficultyFilters: { id: DifficultyFilter; label: string }[] = [
  { id: 'all', label: 'Any' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

const kindMeta: Record<Kind, { label: string; sprite: 'terminal' | 'database'; variant: 'accent' | 'info' }> = {
  code: { label: 'CODE', sprite: 'terminal', variant: 'accent' },
  sql: { label: 'SQL', sprite: 'database', variant: 'info' },
}

function FilterTabs<T extends string>({ label, options, value, onChange }: { label: string; options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label={label}>
      {options.map((f) => {
        const isActive = value === f.id
        return (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(f.id)}
            className={cn(
              'border-2 px-3.5 py-1.5 font-pixel text-sm uppercase tracking-wider transition-transform duration-75',
              isActive
                ? '-translate-y-0.5 border-[var(--color-accent)] bg-[var(--color-accent)] text-[#06120a] shadow-[3px_3px_0_var(--pixel-ink)]'
                : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:-translate-y-0.5 hover:text-[var(--color-text-primary)] hover:shadow-[3px_3px_0_var(--pixel-ink)]',
            )}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}

export default function Practice() {
  const { data: problems } = useQuery({ queryKey: ['problems'], queryFn: api.getProblems })
  const { data: sqlProblems } = useQuery({ queryKey: ['sql-problems'], queryFn: api.getSqlProblems })
  const [kind, setKind] = useState<KindFilter>('all')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')

  const items = useMemo<PracticeItem[]>(() => {
    const code = (problems ?? []).map((p) => ({
      key: `code-${p.id}`,
      kind: 'code' as const,
      title: p.title,
      difficulty: p.difficulty,
      xp: p.xp,
      acceptanceRate: p.acceptanceRate,
      tags: p.tags,
      to: `/practice/${p.slug}`,
    }))
    const sql = (sqlProblems ?? []).map((p) => ({
      key: `sql-${p.id}`,
      kind: 'sql' as const,
      title: p.title,
      difficulty: p.difficulty,
      xp: p.xp,
      acceptanceRate: p.acceptanceRate,
      tags: p.tags,
      to: `/practice/sql/${p.slug}`,
    }))
    const order: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 }
    return [...code, ...sql].sort((a, b) => order[a.difficulty] - order[b.difficulty])
  }, [problems, sqlProblems])

  const filtered = items.filter((i) => (kind === 'all' || i.kind === kind) && (difficulty === 'all' || i.difficulty === difficulty))

  if (!problems || !sqlProblems) return <PageLoader />

  return (
    <>
      <PixelBackdrop scene="dungeon" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="pixel-corners flex h-16 w-16 shrink-0 items-center justify-center bg-[var(--color-accent-soft)]">
            <PixelSprite sprite="terminal" scale={3} fps={2} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold">Practice</h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Coding and SQL questions, each a monster to defeat. Pick one to open its play board.
            </p>
          </div>
          <Link
            to="/sql"
            className="flex items-center gap-2 border-2 border-[var(--color-info)]/40 bg-[var(--color-surface)] px-3 py-2 font-pixel text-sm text-[var(--color-info)] shadow-[3px_3px_0_var(--pixel-ink)] transition-transform hover:-translate-y-0.5"
          >
            <PixelSprite sprite="database" scale={1.5} /> SQL Sandbox
          </Link>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <FilterTabs label="Filter by question type" options={kindFilters} value={kind} onChange={setKind} />
          <span className="hidden h-6 w-0.5 bg-[var(--color-border-strong)] sm:block" aria-hidden="true" />
          <FilterTabs label="Filter by difficulty" options={difficultyFilters} value={difficulty} onChange={setDifficulty} />
        </div>

        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[auto_1fr_auto_auto_auto] gap-4 border-b-2 border-[var(--color-border)] px-5 py-3 font-pixel text-xs uppercase tracking-wider text-[var(--color-text-muted)] sm:grid">
            <span className="w-12">Foe</span>
            <span>Question</span>
            <span className="w-24 text-center">Reward</span>
            <span className="w-28 text-center">Acceptance</span>
            <span className="w-8" />
          </div>
          <div className="divide-y-2 divide-[var(--color-border)]">
            {filtered.map((item) => {
              const monster = monsters[item.difficulty]
              const meta = kindMeta[item.kind]
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className="group grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 px-5 py-4 text-sm transition-[transform,background-color] duration-100 hover:-translate-y-0.5 hover:bg-[var(--color-surface-elevated)] sm:grid-cols-[auto_1fr_auto_auto_auto]"
                >
                  <div
                    className="pixel-corners row-span-2 flex h-12 w-12 shrink-0 items-end justify-center pb-1 sm:row-span-1"
                    style={{ backgroundColor: `color-mix(in srgb, ${monster.color} 14%, transparent)` }}
                  >
                    <PixelSprite sprite={monster.sprite} scale={monster.scale} fps={monster.fps} className="group-hover:animate-pixel-bob" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={meta.variant}>
                        <PixelSprite sprite={meta.sprite} scale={1} /> {meta.label}
                      </Badge>
                      <span className="font-semibold text-[var(--color-text-primary)]">{item.title}</span>
                      <Badge variant={difficultyVariant(item.difficulty)} className="capitalize">
                        {item.difficulty}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-xs text-[var(--color-text-muted)]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-start-2 flex items-center gap-4 sm:contents">
                    <span className="flex items-center gap-1.5 font-pixel text-sm text-[var(--color-warning)] sm:w-24 sm:justify-center">
                      <PixelSprite sprite="star" scale={1.25} />+{item.xp} XP
                    </span>
                    <span className="font-pixel text-sm text-[var(--color-text-secondary)] sm:w-28 sm:text-center">
                      {item.acceptanceRate}%<span className="ml-1 text-[var(--color-text-muted)] sm:hidden">acceptance</span>
                    </span>
                  </div>
                  <ChevronRight className="hidden h-4 w-4 justify-self-end text-[var(--color-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)] sm:block" />
                </Link>
              )
            })}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-3 px-5 py-10 text-center text-sm text-[var(--color-text-muted)]">
                <PixelSprite sprite="treasureMap" scale={3} />
                No monsters roam here. Try another filter.
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  )
}
