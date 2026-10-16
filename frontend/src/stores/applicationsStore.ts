import { create } from 'zustand'
import type { JobApplication } from '@/types'

/** Job applications submitted from the Job Board. Client-side stand-in for an applications API. */

const STORAGE_KEY = 'codequest-applications-v1'

function load(): JobApplication[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as JobApplication[]
  } catch {
    // Unavailable or corrupt storage — start with no applications.
  }
  return []
}

interface ApplicationsState {
  applications: JobApplication[]
  add: (application: Omit<JobApplication, 'id' | 'appliedAt'>) => void
}

export const useApplicationsStore = create<ApplicationsState>((set) => ({
  applications: typeof window === 'undefined' ? [] : load(),
  add: (application) =>
    set((s) => ({
      applications: [{ ...application, id: `app-${Date.now()}`, appliedAt: Date.now() }, ...s.applications],
    })),
}))

useApplicationsStore.subscribe((state) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.applications))
  } catch {
    // Storage unavailable — applications still show for this session.
  }
})

/** Mock pipeline: an application moves to review a minute after it's sent. */
export function applicationStatus(app: JobApplication, now = Date.now()): { label: string; tone: 'info' | 'violet' } {
  return now - app.appliedAt < 60_000 ? { label: 'Submitted', tone: 'info' } : { label: 'In review', tone: 'violet' }
}
