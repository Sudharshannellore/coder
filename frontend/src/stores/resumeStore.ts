import { create } from 'zustand'
import type { ResumeData, ResumeTemplateId, SavedResume } from '@/types'
import { starterResume } from '@/mock/resume'
import { FREE_TEMPLATE_IDS, getTemplate } from '@/mock/resumeTemplates'
import { useWalletStore } from './walletStore'

/**
 * The learner's saved resumes, shared by the Resume Builder and the Job Board. Saved per browser.
 * One resume slot is free; extra slots and premium templates are bought once with XP.
 */

export const FREE_RESUME_SLOTS = 1
export const RESUME_SLOT_COST = 100
export const MAX_RESUMES = 8

const STORAGE_KEY = 'codequest-resumes-v2'
/** Single-draft storage from before multiple resumes — migrated into the first slot. */
const LEGACY_DRAFT_KEY = 'codequest-resume-draft-v1'

interface ResumeLibrary {
  resumes: SavedResume[]
  activeId: string
  /** Slots bought with XP on top of the free ones. Deleting a resume frees its slot; it's never lost. */
  extraSlots: number
  unlockedTemplates: ResumeTemplateId[]
}

interface ResumeState extends ResumeLibrary {
  /** Edits the active resume. */
  update: (fn: (draft: ResumeData) => ResumeData) => void
  updateById: (id: string, fn: (draft: ResumeData) => ResumeData) => void
  reset: () => void
  select: (id: string) => void
  /** Adds a resume (blank or a copy of the active one), buying a slot with XP when all are used. Returns false if it couldn't. */
  create: (source: 'starter' | 'duplicate') => boolean
  rename: (id: string, title: string) => void
  remove: (id: string) => void
  setTemplate: (templateId: ResumeTemplateId) => void
  unlockTemplate: (templateId: ResumeTemplateId) => boolean
}

let counter = 0
const newId = () => `resume-${Date.now()}-${counter++}`

function makeResume(title: string, data: ResumeData, templateId: ResumeTemplateId = 'classic'): SavedResume {
  return { id: newId(), title, templateId, data, updatedAt: Date.now() }
}

function defaults(): ResumeLibrary {
  let data = starterResume()
  try {
    const legacy = window.localStorage.getItem(LEGACY_DRAFT_KEY)
    if (legacy) data = { ...data, ...(JSON.parse(legacy) as Partial<ResumeData>) }
  } catch {
    // Unavailable or corrupt storage — start from the profile-based draft.
  }
  const first = makeResume('My resume', data)
  return { resumes: [first], activeId: first.id, extraSlots: 0, unlockedTemplates: [...FREE_TEMPLATE_IDS] }
}

function load(): ResumeLibrary {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw) as ResumeLibrary
      if (saved.resumes?.length) {
        return {
          ...saved,
          // getTemplate() maps retired templates to their replacement, so a paid unlock carries over.
          resumes: saved.resumes.map((r) => ({ ...r, templateId: getTemplate(r.templateId).id, data: { ...starterResume(), ...r.data } })),
          unlockedTemplates: [...new Set([...FREE_TEMPLATE_IDS, ...(saved.unlockedTemplates ?? []).map((t) => getTemplate(t).id)])],
        }
      }
    }
  } catch {
    // Unavailable or corrupt storage — fall through to defaults.
  }
  return defaults()
}

export const slotCount = (s: ResumeLibrary) => FREE_RESUME_SLOTS + s.extraSlots
export const selectActive = (s: ResumeLibrary) => s.resumes.find((r) => r.id === s.activeId) ?? s.resumes[0]

function nextTitle(resumes: SavedResume[], base: string) {
  const taken = new Set(resumes.map((r) => r.title))
  if (!taken.has(base)) return base
  let n = 2
  while (taken.has(`${base} ${n}`)) n++
  return `${base} ${n}`
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  ...(typeof window === 'undefined' ? defaults() : load()),

  update: (fn) => get().updateById(get().activeId, fn),

  updateById: (id, fn) =>
    set((s) => ({ resumes: s.resumes.map((r) => (r.id === id ? { ...r, data: fn(r.data), updatedAt: Date.now() } : r)) })),

  reset: () => get().update(() => starterResume()),

  select: (id) => set((s) => (s.resumes.some((r) => r.id === id) ? { activeId: id } : {})),

  create: (source) => {
    const s = get()
    if (s.resumes.length >= MAX_RESUMES) return false
    const needsSlot = s.resumes.length >= slotCount(s)
    if (needsSlot && !useWalletStore.getState().spendXp(RESUME_SLOT_COST)) return false
    const active = selectActive(s)
    const resume =
      source === 'duplicate'
        ? makeResume(nextTitle(s.resumes, `${active.title} (copy)`), structuredClone(active.data), active.templateId)
        : makeResume(nextTitle(s.resumes, 'New resume'), starterResume())
    set({ resumes: [...s.resumes, resume], activeId: resume.id, extraSlots: s.extraSlots + (needsSlot ? 1 : 0) })
    return true
  },

  rename: (id, title) => set((s) => ({ resumes: s.resumes.map((r) => (r.id === id ? { ...r, title: title.slice(0, 40) } : r)) })),

  remove: (id) =>
    set((s) => {
      if (s.resumes.length <= 1) return {}
      const resumes = s.resumes.filter((r) => r.id !== id)
      return { resumes, activeId: s.activeId === id ? resumes[0].id : s.activeId }
    }),

  setTemplate: (templateId) =>
    set((s) =>
      s.unlockedTemplates.includes(templateId)
        ? { resumes: s.resumes.map((r) => (r.id === s.activeId ? { ...r, templateId, updatedAt: Date.now() } : r)) }
        : {},
    ),

  unlockTemplate: (templateId) => {
    const s = get()
    if (s.unlockedTemplates.includes(templateId)) return true
    if (!useWalletStore.getState().spendXp(getTemplate(templateId).cost)) return false
    set({ unlockedTemplates: [...s.unlockedTemplates, templateId] })
    return true
  },
}))

function persist(state: ResumeLibrary) {
  const { resumes, activeId, extraSlots, unlockedTemplates } = state
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ resumes, activeId, extraSlots, unlockedTemplates }))
  } catch {
    // Storage unavailable — resumes still work for this session.
  }
}

// Save right away too, so a freshly created or migrated library keeps stable ids across reloads.
if (typeof window !== 'undefined') persist(useResumeStore.getState())
useResumeStore.subscribe(persist)
