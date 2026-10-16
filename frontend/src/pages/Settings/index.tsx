import { useState, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { PageLoader } from '@/components/layout/PageLoader'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import type { Sprite, SpriteName } from '@/components/pixel/sprites'
import { cn } from '@/utils/cn'

function PixelToggle({ checked, onChange, label }: { checked: boolean; onChange: (next: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-8 w-[68px] shrink-0 border-2 shadow-[3px_3px_0_var(--pixel-ink)] outline-none transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]',
        checked
          ? 'border-[var(--pixel-ink)] bg-[var(--color-accent)]'
          : 'border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)]',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-1/2 -translate-y-1/2 font-pixel text-xs leading-none',
          checked ? 'left-2 text-[#06120a]' : 'right-1.5 text-[var(--color-text-muted)]',
        )}
      >
        {checked ? 'ON' : 'OFF'}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-[3px] h-[22px] w-[22px] border-2 border-[var(--pixel-ink)] shadow-[inset_-3px_-3px_0_rgba(0,0,0,0.25),inset_3px_3px_0_rgba(255,255,255,0.5)] transition-[left] duration-150 ease-[steps(3)]',
          checked ? 'left-[39px] bg-white' : 'left-[3px] bg-[var(--color-text-muted)]',
        )}
      />
    </button>
  )
}

function SettingRow({
  sprite,
  title,
  description,
  children,
}: {
  sprite: Sprite | SpriteName
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="pixel-corners flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--color-surface-elevated)]">
          <PixelSprite sprite={sprite} scale={2} />
        </div>
        <div>
          <p className="font-pixel text-sm text-[var(--color-text-primary)]">{title}</p>
          {description && <p className="text-xs text-[var(--color-text-muted)]">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { data: user } = useQuery({ queryKey: ['current-user'], queryFn: api.getCurrentUser })
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)

  if (!user) return <PageLoader />

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="group pixel-corners flex h-14 w-14 shrink-0 items-center justify-center bg-[var(--color-surface-elevated)]">
          <PixelSprite sprite="gear" scale={3} className="group-hover:animate-gear-spin" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Manage your account and preferences.</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar initials={user.avatarInitials} color={user.avatarColor} size="lg" />
            <div>
              <p className="font-pixel text-lg text-[var(--color-text-primary)]">{user.username}</p>
              <p className="font-mono text-sm text-[var(--color-text-muted)]">{user.handle}</p>
              <p className="mt-1 font-pixel text-xs text-[var(--color-accent)]">
                Lv {user.level} · {user.league.label}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <SettingRow sprite="scroll" title="Email notifications" description="Quest reminders and weekly recaps.">
              <PixelToggle checked={emailNotifications} onChange={setEmailNotifications} label="Email notifications" />
            </SettingRow>
            <SettingRow sprite="star" title="Sound effects" description="XP chimes, level-up fanfares.">
              <PixelToggle checked={soundEffects} onChange={setSoundEffects} label="Sound effects" />
            </SettingRow>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
