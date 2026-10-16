import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Users, Clock } from 'lucide-react'
import { api } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge, difficultyVariant } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { PageLoader } from '@/components/layout/PageLoader'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import type { SpriteName } from '@/components/pixel/sprites'
import type { Challenge, ChallengeCategory } from '@/types'
import { FriendDuels } from '@/components/duels/FriendDuels'
import { cn } from '@/utils/cn'

const categoryMeta: Record<ChallengeCategory, { label: string; sprite: SpriteName; color: string }> = {
  daily: { label: 'Daily Challenge', sprite: 'star', color: 'var(--color-accent)' },
  speed: { label: 'Speed Challenge', sprite: 'lightning', color: 'var(--color-info)' },
  debug: { label: 'Debug Challenge', sprite: 'bug', color: 'var(--color-error)' },
  optimization: { label: 'Optimization Challenge', sprite: 'potion', color: 'var(--color-warning)' },
  boss: { label: 'Boss Battle', sprite: 'recursionBoss', color: 'var(--color-violet)' },
  sql: { label: 'SQL Challenge', sprite: 'database', color: 'var(--color-info)' },
  ai: { label: 'AI Challenge', sprite: 'questBot', color: 'var(--color-accent)' },
}

function destinationFor(challenge: Challenge) {
  if (challenge.category === 'boss') return '/challenges/boss'
  if (challenge.category === 'sql') return '/practice/sql/department-averages'
  return '/code'
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const meta = categoryMeta[challenge.category]
  return (
    <Card className="flex flex-col transition-all hover:-translate-y-0.5 hover:border-[var(--color-border-strong)]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div
            className="pixel-corners flex h-12 w-12 shrink-0 items-center justify-center"
            style={{ backgroundColor: `${meta.color}1f` }}
          >
            <PixelSprite sprite={meta.sprite} scale={meta.sprite === 'recursionBoss' ? 1.5 : 2.5} fps={meta.sprite === 'recursionBoss' || meta.sprite === 'questBot' ? 3 : 0} />
          </div>
          <div>
            <p className="font-pixel text-xs uppercase tracking-wider" style={{ color: meta.color }}>
              {meta.label}
            </p>
            <CardTitle className="text-sm leading-tight">{challenge.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="mb-4 flex-1 text-sm text-[var(--color-text-secondary)]">{challenge.description}</p>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant={difficultyVariant(challenge.difficulty)}>{challenge.difficulty}</Badge>
          <Badge variant="neutral" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {challenge.timeLimitMinutes}m
          </Badge>
          <Badge variant="neutral" className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {challenge.playersActive.toLocaleString()}
          </Badge>
        </div>

        <div className="mb-4 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
          <PixelSprite sprite="star" scale={1.25} />
          {challenge.reward}
        </div>

        <Link
          to={destinationFor(challenge)}
          className={cn(buttonVariants({ variant: challenge.category === 'boss' ? 'pixelViolet' : 'pixelDark' }), 'w-full')}
        >
          {challenge.category === 'boss' ? 'Enter Boss Battle' : 'Start Challenge'}
        </Link>
      </CardContent>
    </Card>
  )
}

export default function Challenges() {
  const { data: challenges } = useQuery({ queryKey: ['challenges'], queryFn: api.getChallenges })

  if (!challenges) return <PageLoader />

  if (challenges.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <PixelSprite sprite="bugSlime" scale={4} fps={3} />
            <p className="text-sm text-[var(--color-text-secondary)]">
              No challenges are live right now. Check back soon, or practice freely in the meantime.
            </p>
            <Link to="/practice" className={cn(buttonVariants())}>
              Go to Practice
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <PixelSprite sprite="sword" scale={3} />
          Challenges
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Test your skills under pressure — speed, debugging, optimization, and more.
        </p>
      </div>

      <FriendDuels />

      <h2 className="mb-4 text-xl">Solo challenges</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  )
}
