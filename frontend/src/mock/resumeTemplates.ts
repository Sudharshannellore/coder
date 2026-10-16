import type { ResumeTemplate, ResumeTemplateId } from '@/types'

/**
 * Text-only templates (no sidebars, colour blocks or graphics), so applicant tracking systems read them cleanly.
 * Two are free; the rest are unlocked once with XP and then usable on every resume.
 */
export const resumeTemplates: ResumeTemplate[] = [
  { id: 'classic', name: 'Classic', description: 'Clean single column with green section rules. A safe choice for any role.', cost: 0 },
  { id: 'minimal', name: 'Minimal', description: 'Centered serif header and quiet typography. Lets the content speak.', cost: 0 },
  { id: 'ats', name: 'ATS Plain', description: 'Zero styling, standard fonts, simple headings — the easiest for resume scanners to read.', cost: 80 },
  { id: 'professional', name: 'Professional', description: 'Name on the left, contact on the right, firm black section rules.', cost: 80 },
  { id: 'harvard', name: 'Harvard', description: 'The classic Times New Roman university format. Education comes first.', cost: 100 },
  { id: 'student', name: 'Fresher', description: 'Built for students and new grads: education, skills and projects lead.', cost: 100 },
  { id: 'developer', name: 'Developer', description: 'Monospace headings and a plain tech-stack line — made for engineering roles.', cost: 100 },
  { id: 'typewriter', name: 'Typewriter', description: 'All-monospace, uppercase headings. Simple, distinctive and fully readable.', cost: 100 },
  { id: 'compact', name: 'Compact', description: 'Small type with headings in the margin — fits a lot onto one page.', cost: 120 },
  { id: 'elegant', name: 'Elegant', description: 'Georgia serif, letter-spaced name and italic headings in deep red.', cost: 120 },
  { id: 'bold', name: 'Bold', description: 'Heavy uppercase name and thick black rules that stand out on a printout.', cost: 150 },
  { id: 'executive', name: 'Executive', description: 'Serif headings in navy with thin gold accents for a polished, senior look.', cost: 150 },
]

/** Templates that were retired — saved resumes using them switch to a close replacement. */
export const RETIRED_TEMPLATES: Record<string, ResumeTemplateId> = { modern: 'professional' }

export const FREE_TEMPLATE_IDS = resumeTemplates.filter((t) => t.cost === 0).map((t) => t.id)

export function getTemplate(id: string | undefined): ResumeTemplate {
  const key = id && RETIRED_TEMPLATES[id] ? RETIRED_TEMPLATES[id] : id
  return resumeTemplates.find((t) => t.id === key) ?? resumeTemplates[0]
}
