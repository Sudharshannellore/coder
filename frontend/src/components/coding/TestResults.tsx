import type { TestResult } from '@/types'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { cn } from '@/utils/cn'

interface TestResultsProps {
  testResults: TestResult[] | null
  status: 'idle' | 'running' | 'passed' | 'failed' | 'error'
  runtimeMs?: number
  memoryMb?: number
  className?: string
}

const panel = 'border-2 bg-[var(--color-surface)] shadow-[4px_4px_0_var(--pixel-ink)]'

export function TestResults({ testResults, status, runtimeMs, memoryMb, className }: TestResultsProps) {
  if (status === 'running') {
    return (
      <div
        role="status"
        className={cn(panel, 'flex h-full flex-col items-center justify-center gap-3 border-[var(--color-accent)]/40 p-6 text-center', className)}
      >
        <PixelSprite sprite="heroRun" scale={3} fps={8} />
        <p className="font-pixel text-sm uppercase tracking-widest text-[var(--color-accent)]">
          Running tests
          <span aria-hidden className="animate-caret ml-1 inline-block h-3.5 w-2 translate-y-0.5 bg-[var(--color-accent)]" />
        </p>
      </div>
    )
  }

  if (!testResults || testResults.length === 0) {
    return (
      <div
        className={cn(panel, 'flex h-full flex-col items-center justify-center gap-2 border-dashed border-[var(--color-border-strong)] p-6 text-center', className)}
      >
        <PixelSprite sprite="terminal" scale={3} />
        <p className="font-pixel text-sm text-[var(--color-text-primary)]">Awaiting your first run</p>
        <p className="text-sm text-[var(--color-text-secondary)]">Hit Run to send your code into battle. Test results will show up here.</p>
      </div>
    )
  }

  const passedCount = testResults.filter((t) => t.passed).length
  const allPassed = passedCount === testResults.length

  return (
    <div className={cn(panel, 'flex h-full flex-col overflow-hidden border-[var(--color-border)]', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--color-border)] px-4 py-2.5">
        <p className="flex items-center gap-2 font-pixel text-sm">
          Test Cases
          <span
            className={cn(
              'border-2 px-1.5 leading-5',
              allPassed
                ? 'border-[var(--color-success)]/40 bg-[var(--color-success)]/15 text-[var(--color-success)]'
                : 'border-[var(--color-error)]/40 bg-[var(--color-error)]/15 text-[var(--color-error)]',
            )}
          >
            {passedCount}/{testResults.length}
          </span>
        </p>
        {(runtimeMs !== undefined || memoryMb !== undefined) && (
          <div className="flex items-center gap-2 font-pixel text-xs text-[var(--color-text-secondary)]">
            {runtimeMs !== undefined && (
              <span className="flex items-center gap-1 border-2 border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] px-1.5 py-0.5">
                <PixelSprite sprite="lightning" scale={1} />
                {runtimeMs}ms
              </span>
            )}
            {memoryMb !== undefined && (
              <span className="flex items-center gap-1 border-2 border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] px-1.5 py-0.5">
                <PixelSprite sprite="floppy" scale={1} />
                {memoryMb}MB
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pixel-scroll flex-1 space-y-2 overflow-y-auto p-3">
        {testResults.map((result, i) => (
          <div
            key={result.id}
            className={cn(
              'border-2 p-3 text-xs',
              result.passed
                ? 'border-[var(--color-success)]/30 bg-[var(--color-success)]/5'
                : 'border-[var(--color-error)]/35 bg-[var(--color-error)]/5',
            )}
          >
            <div className="flex items-center gap-2 font-pixel text-sm">
              <PixelSprite sprite={result.passed ? 'star' : 'bug'} scale={1.5} />
              <span>Test Case {i + 1}</span>
              <span
                className={cn(
                  'ml-auto text-xs uppercase tracking-wider',
                  result.passed ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]',
                )}
              >
                {result.passed ? 'Cleared' : 'Bug found'}
              </span>
            </div>
            <div className="mt-2 grid gap-1.5 font-mono text-[var(--color-text-secondary)]">
              <p>
                <span className="text-[var(--color-text-muted)]">Input: </span>
                {result.input}
              </p>
              <p>
                <span className="text-[var(--color-text-muted)]">Expected: </span>
                {result.expectedOutput}
              </p>
              <p className={cn(!result.passed && 'text-[var(--color-error)]')}>
                <span className="text-[var(--color-text-muted)]">Received: </span>
                {result.receivedOutput}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
