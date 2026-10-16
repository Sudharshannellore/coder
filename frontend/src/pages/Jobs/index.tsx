import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, FileText, MapPin, Search, Users } from 'lucide-react'
import type { Job, JobApplication } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button, buttonVariants } from '@/components/ui/Button'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { XpBalance } from '@/components/economy/EconomyBits'
import { ApplyDialog } from '@/components/jobs/ApplyDialog'
import { JobLogo } from '@/components/jobs/JobLogo'
import { ScaledResume } from '@/components/resume/ScaledResume'
import { jobs } from '@/mock/jobs'
import { JOB_APPLY_COST, RESUME_AI_COST } from '@/services/resumeAi'
import { applicationStatus, useApplicationsStore } from '@/stores/applicationsStore'
import { useWalletStore } from '@/stores/walletStore'
import { cn } from '@/utils/cn'

const MODES = ['All', 'Remote', 'Hybrid', 'On-site'] as const
const TYPES = ['All', 'Full-time', 'Internship', 'Contract'] as const

const priceList = [
  { label: 'Apply', cost: JOB_APPLY_COST },
  { label: 'Tailor & match resume', cost: RESUME_AI_COST.tailor },
  { label: 'AI cover note', cost: RESUME_AI_COST.coverNote },
]

const posted = (days: number) => (days === 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`)

function FilterChips<T extends string>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={cn(
            'border-2 px-2.5 py-1 font-pixel text-xs transition-colors',
            value === o
              ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
              : 'border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function JobListItem({ job, active, applied, onSelect }: { job: Job; active: boolean; applied: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex w-full items-start gap-3 border-2 p-3.5 text-left transition-colors',
        active
          ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-elevated)]',
      )}
    >
      <JobLogo job={job} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('font-pixel text-[15px] leading-tight', active && 'text-[var(--color-accent)]')}>{job.role}</p>
          {applied && <Badge variant="success">Applied</Badge>}
        </div>
        <p className="mt-0.5 truncate text-sm text-[var(--color-text-secondary)]">{job.company}</p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {job.location}
          </span>
          <span>{job.salary}</span>
          <span>{posted(job.postedDaysAgo)}</span>
        </p>
      </div>
    </button>
  )
}

function JobDetail({ job, application, onApply, onBack }: { job: Job; application?: JobApplication; onApply: () => void; onBack: () => void }) {
  const xp = useWalletStore((s) => s.xp)

  return (
    <article className="border-2 border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[4px_4px_0_var(--pixel-ink)]">
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 px-5 pt-4 font-pixel text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] lg:hidden">
        <ArrowLeft className="h-4 w-4" /> All roles
      </button>

      <header className="flex flex-wrap items-start gap-4 border-b-2 border-[var(--color-border)] p-5 sm:p-6">
        <JobLogo job={job} size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl leading-tight">{job.role}</h2>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            {job.company} · {job.location}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="info">{job.workMode}</Badge>
            <Badge>{job.employment}</Badge>
            <Badge>{job.level}</Badge>
            <Badge variant="accent">{job.salary}</Badge>
          </div>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)]">
            <span>Posted {posted(job.postedDaysAgo).toLowerCase()}</span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" /> {job.applicants + (application ? 1 : 0)} applicants
            </span>
          </p>
        </div>
        <div className="flex w-full flex-col items-stretch gap-1.5 sm:w-auto sm:items-end">
          {application ? (
            <>
              <Badge variant="success" className="justify-center px-3 py-1.5 text-sm">
                Applied {new Date(application.appliedAt).toLocaleDateString()}
              </Badge>
              <span className="text-center text-xs text-[var(--color-text-muted)] sm:text-right">{applicationStatus(application).label}</span>
            </>
          ) : (
            <>
              <Button variant="pixel" size="lg" onClick={onApply}>
                Apply · {JOB_APPLY_COST} XP
              </Button>
              <span className={cn('text-center text-xs sm:text-right', xp < JOB_APPLY_COST ? 'text-[var(--color-warning)]' : 'text-[var(--color-text-muted)]')}>
                {xp < JOB_APPLY_COST ? `You need ${JOB_APPLY_COST - xp} more XP` : 'Tailoring is optional, in the next step'}
              </span>
            </>
          )}
        </div>
      </header>

      <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-6">
          <section>
            <h3 className="mb-2 text-base">About the role</h3>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{job.about}</p>
          </section>
          <section>
            <h3 className="mb-2 text-base">What you'll do</h3>
            <ul className="space-y-1.5 text-sm text-[var(--color-text-secondary)]">
              {job.responsibilities.map((r) => (
                <li key={r} className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[var(--color-accent)]" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 text-base">What they're looking for</h3>
            <ul className="space-y-1.5 text-sm text-[var(--color-text-secondary)]">
              {job.requirements.map((r) => (
                <li key={r} className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[var(--color-violet)]" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          <div>
            <h3 className="mb-2 text-base">Tech stack</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.tags.map((t) => (
                <span key={t} className="border-2 border-[var(--color-border-strong)] px-2 py-0.5 font-pixel text-xs text-[var(--color-text-secondary)]">
                  {t}
                </span>
              ))}
            </div>
          </div>
          {!application && (
            <div className="border-2 border-[var(--color-violet)]/40 bg-[var(--color-violet-soft)] p-3.5">
              <p className="flex items-center gap-2 font-pixel text-sm text-[var(--color-violet)]">
                <PixelSprite sprite="questBot" scale={1.5} /> Stand out
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                While applying, Quest AI can match your resume to these requirements and tailor it for {job.company} ({RESUME_AI_COST.tailor} XP).
              </p>
            </div>
          )}
        </aside>
      </div>
    </article>
  )
}

function ApplicationCard({ app }: { app: JobApplication }) {
  const [open, setOpen] = useState(false)
  const job = jobs.find((j) => j.id === app.jobId)
  if (!job) return null
  const status = applicationStatus(app)

  return (
    <div className="border-2 border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[4px_4px_0_var(--pixel-ink)]">
      <div className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
        <JobLogo job={job} />
        <div className="min-w-0 flex-1">
          <p className="font-pixel text-base">{job.role}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {job.company} · applied {new Date(app.appliedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={status.tone}>{status.label}</Badge>
          {app.tailored ? <Badge variant="violet">Tailored · {app.matchScore}% match</Badge> : <Badge>Resume as is</Badge>}
          <Badge variant="accent">{app.xpSpent} XP</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <FileText className="h-3.5 w-3.5" /> What I sent <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
        </Button>
      </div>
      {open && (
        <div className="grid gap-5 border-t-2 border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="mb-2 font-pixel text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              Resume{app.resumeTitle ? ` · ${app.resumeTitle}` : ''}
            </p>
            <ScaledResume data={app.resume} template={app.templateId} />
          </div>
          <div>
            <p className="mb-2 font-pixel text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Cover note</p>
            {app.coverNote ? (
              <p className="whitespace-pre-line border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{app.coverNote}</p>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">No cover note sent.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function JobBoard() {
  const applications = useApplicationsStore((s) => s.applications)
  const [tab, setTab] = useState<'roles' | 'applications'>('roles')
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<(typeof MODES)[number]>('All')
  const [type, setType] = useState<(typeof TYPES)[number]>('All')
  const [selectedId, setSelectedId] = useState(jobs[0].id)
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false)
  const [applying, setApplying] = useState<Job | null>(null)

  const appliedByJob = useMemo(() => new Map(applications.map((a) => [a.jobId, a])), [applications])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return jobs.filter(
      (j) =>
        (mode === 'All' || j.workMode === mode) &&
        (type === 'All' || j.employment === type) &&
        (!q || [j.role, j.company, j.location, ...j.tags].some((s) => s.toLowerCase().includes(q))),
    )
  }, [query, mode, type])

  const selected = filtered.find((j) => j.id === selectedId) ?? filtered[0]

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6 flex flex-wrap items-center gap-4">
        <div className="pixel-corners flex h-16 w-16 shrink-0 items-center justify-center bg-[var(--color-accent-soft)]">
          <PixelSprite sprite="briefcase" scale={4} className="animate-pixel-hover" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl">Job Board</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Spend the XP you've earned to apply — and let Quest AI tailor your resume to each role.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <XpBalance className="px-2 py-1.5 text-sm" />
          <Link to="/resume" className={buttonVariants({ variant: 'outline', size: 'md' })}>
            <PixelSprite sprite="resume" scale={1.5} /> Edit resume
          </Link>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-2 border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5">
        <span className="mr-1 flex items-center gap-1.5 font-pixel text-xs uppercase tracking-wider text-[var(--color-violet)]">
          <PixelSprite sprite="star" scale={1} /> XP prices
        </span>
        {priceList.map((p) => (
          <span key={p.label} className="border-2 border-[var(--color-border-strong)] px-2 py-0.5 font-pixel text-xs text-[var(--color-text-secondary)]">
            {p.label} <span className="text-[var(--color-accent)]">{p.cost} XP</span>
          </span>
        ))}
        <span className="ml-auto text-xs text-[var(--color-text-muted)]">Browsing roles is always free.</span>
      </div>

      <div role="tablist" aria-label="Job board" className="mb-5 flex gap-1 border-b-2 border-[var(--color-border)]">
        {(
          [
            ['roles', `Open roles (${jobs.length})`],
            ['applications', `My applications (${applications.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              '-mb-0.5 border-b-2 px-4 py-2 font-pixel text-sm transition-colors',
              tab === key ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'roles' ? (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <label className="relative min-w-[220px] flex-1 sm:max-w-sm">
              <span className="sr-only">Search roles</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Role, company, skill…"
                className="w-full border-2 border-[var(--color-border-strong)] bg-[var(--color-bg)] py-2 pl-9 pr-3 text-sm outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
              />
            </label>
            <FilterChips label="Work mode" options={MODES} value={mode} onChange={setMode} />
            <FilterChips label="Job type" options={TYPES} value={type} onChange={setType} />
          </div>

          {filtered.length === 0 || !selected ? (
            <div className="flex flex-col items-center gap-3 border-2 border-dashed border-[var(--color-border-strong)] py-16 text-center">
              <PixelSprite sprite="compass" scale={4} />
              <p className="font-pixel">No roles match those filters</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery('')
                  setMode('All')
                  setType('All')
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
              <div className={cn('space-y-2.5', showDetailOnMobile && 'hidden lg:block')}>
                {filtered.map((job) => (
                  <JobListItem
                    key={job.id}
                    job={job}
                    active={job.id === selected.id}
                    applied={appliedByJob.has(job.id)}
                    onSelect={() => {
                      setSelectedId(job.id)
                      setShowDetailOnMobile(true)
                      if (window.innerWidth < 1024) window.scrollTo({ top: 0 })
                    }}
                  />
                ))}
              </div>
              <div className={cn('lg:sticky lg:top-20 lg:self-start', !showDetailOnMobile && 'hidden lg:block')}>
                <JobDetail job={selected} application={appliedByJob.get(selected.id)} onApply={() => setApplying(selected)} onBack={() => setShowDetailOnMobile(false)} />
              </div>
            </div>
          )}
        </>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border-2 border-dashed border-[var(--color-border-strong)] py-16 text-center">
          <PixelSprite sprite="briefcase" scale={5} className="animate-pixel-bob" />
          <p className="font-pixel text-lg">No applications yet</p>
          <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">Pick a role, tailor your resume with Quest AI and send your first application.</p>
          <Button variant="pixel" onClick={() => setTab('roles')}>
            Browse roles
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}

      {applying && (
        <ApplyDialog
          job={applying}
          onClose={() => setApplying(null)}
          onViewApplications={() => {
            setApplying(null)
            setTab('applications')
          }}
        />
      )}
    </div>
  )
}
