import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { api } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { buttonVariants } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { PageLoader } from '@/components/layout/PageLoader'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import type { SpriteName } from '@/components/pixel/sprites'
import { cn } from '@/utils/cn'

const worldSprites: Record<string, SpriteName> = {
  'python-mastery': 'book',
  'javascript-essentials': 'terminal',
  'sql-foundations': 'database',
}

export default function Learn() {
  const { data: courses } = useQuery({ queryKey: ['courses'], queryFn: api.getCourses })

  if (!courses) return <PageLoader />

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Learn</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Pick a world to explore — each one has its own map of topics to conquer.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader className="flex-col items-start gap-1">
              <div className="flex items-center justify-between">
                <p className="font-pixel text-sm uppercase tracking-wide text-[var(--color-accent)]">{course.world}</p>
                <PixelSprite sprite={worldSprites[course.id] ?? 'star'} scale={3} className="animate-pixel-hover" />
              </div>
              <CardTitle className="text-lg">{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="flex-1 text-sm text-[var(--color-text-secondary)]">{course.description}</p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--color-text-muted)]">Progress</span>
                  <span className="font-mono text-[var(--color-accent)]">{course.progressPercent}%</span>
                </div>
                <ProgressBar percent={course.progressPercent} className="mt-1.5" />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <span>{course.modules.length} modules</span>
                <span className="font-mono">{course.totalXp.toLocaleString()} XP total</span>
              </div>

              <Link
                to={`/learn/${course.id}`}
                className={cn(buttonVariants({ variant: 'secondary' }), 'mt-4 w-full')}
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}
