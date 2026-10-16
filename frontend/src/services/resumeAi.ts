import type { ResumeData } from '@/types'
import { currentUser } from '@/mock/user'

/**
 * Mock "Quest AI" resume assistant. Each action costs XP (charged by the caller). The rules below
 * stand in for a real model; keep the signatures when wiring up the AI backend.
 * The assistant never invents numbers — missing metrics become [bracketed placeholders] to fill in.
 */

export const RESUME_AI_COST = {
  summary: 30,
  bullet: 10,
  skills: 15,
  tailor: 50,
  coverNote: 25,
} as const

/** Fee for submitting a job application on the Job Board. */
export const JOB_APPLY_COST = 20

const WEAK_OPENERS: [RegExp, string][] = [
  [/^(worked on|working on)\s+/i, 'Built '],
  [/^(fixed|fixing)\s+/i, 'Resolved '],
  [/^(helped|helping)( with)?\s+/i, 'Collaborated on '],
  [/^(made|making)\s+/i, 'Developed '],
  [/^(did|doing)\s+/i, 'Delivered '],
  [/^(was responsible for|responsible for)\s+/i, 'Owned '],
  [/^(used|using)\s+/i, 'Leveraged '],
  [/^(solved)\s+/i, 'Solved '],
  [/^(wrote|writing)\s+/i, 'Authored '],
]

export function improveBullet(text: string): string {
  let out = text.trim().replace(/\.$/, '')
  if (!out) return out
  const weak = WEAK_OPENERS.find(([re]) => re.test(out))
  if (weak) out = out.replace(weak[0], weak[1])
  out = out.charAt(0).toUpperCase() + out.slice(1)
  if (!/\d/.test(out)) out += ', resulting in [measurable impact — e.g. 30% faster load times]'
  return out + '.'
}

export function generateSummary(data: ResumeData): string {
  const skills = data.skills.slice(0, 3)
  const skillText = skills.length > 1 ? `${skills.slice(0, -1).join(', ')} and ${skills[skills.length - 1]}` : skills[0] ?? 'modern programming'
  const { problemsSolved, accuracy } = currentUser.stats
  return (
    `${data.headline || 'Software developer'} skilled in ${skillText}, with ${problemsSolved} algorithm and SQL problems solved at ` +
    `${accuracy}% accuracy. Ranked #${currentUser.rank} globally (${currentUser.league.label} league) and focused on clean, efficient code — ` +
    `from O(n) solutions to well-structured features. Eager to bring strong problem-solving and fast learning to a product engineering team.`
  )
}

/** Skills evidenced by the learner's cleared CodeQuest topics. */
const EARNED_SKILLS = ['Data Structures', 'Algorithms', 'Hash Tables', 'Recursion', 'Problem Solving', 'SQL Joins', 'Git']

export function suggestSkills(existing: string[]): string[] {
  const have = new Set(existing.map((s) => s.toLowerCase()))
  return EARNED_SKILLS.filter((s) => !have.has(s.toLowerCase()))
}

const KNOWN_KEYWORDS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'PostgreSQL', 'MySQL', 'Java', 'C++', 'Go',
  'REST', 'API', 'GraphQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'CI/CD', 'Testing', 'Agile', 'Algorithms',
  'Data Structures', 'Machine Learning', 'HTML', 'CSS', 'Linux', 'Microservices',
]

export interface TailorResult {
  score: number
  matched: string[]
  missing: string[]
  summary: string
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function mentions(text: string, keyword: string) {
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(keyword.toLowerCase())}([^a-z0-9]|$)`).test(text)
}

export interface JobMatch {
  score: number
  matched: string[]
  missing: string[]
}

function resumeText(data: ResumeData) {
  return [
    data.headline,
    data.summary,
    data.skills.join(' '),
    ...[...data.experience, ...data.projects].flatMap((e) => [e.title, e.subtitle, ...e.bullets]),
  ]
    .join(' ')
    .toLowerCase()
}

/** Which of the job's tech keywords the resume shows. */
export function matchJob(data: ResumeData, jobDescription: string): JobMatch {
  const job = jobDescription.toLowerCase()
  const text = resumeText(data)
  const wanted = KNOWN_KEYWORDS.filter((k) => mentions(job, k))
  const matched = wanted.filter((k) => mentions(text, k))
  const missing = wanted.filter((k) => !matched.includes(k))
  const score = wanted.length === 0 ? 0 : Math.round((matched.length / wanted.length) * 100)
  return { score, matched, missing }
}

export function tailorToJob(data: ResumeData, jobDescription: string, target?: { role: string; company: string }): TailorResult {
  const match = matchJob(data, jobDescription)
  const focus = match.matched.slice(0, 4)
  const focusText = focus.length ? `hands-on experience with ${focus.join(', ')}` : 'a strong foundation in programming fundamentals'
  const closer = target
    ? `Excited to bring that to the ${target.role} role at ${target.company}.`
    : 'Known for turning requirements into clean, tested code and learning new tools quickly.'
  const summary =
    `${data.headline || 'Software developer'} with ${focusText}, backed by ${currentUser.stats.problemsSolved} solved coding challenges ` +
    `and a ${currentUser.stats.longestStreak}-day practice streak. ${closer}`

  return { ...match, summary }
}

/** Applies a tailoring result: the job-specific summary, and skills the job asks for listed first. Nothing is added. */
export function applyTailoring(data: ResumeData, result: TailorResult): ResumeData {
  const relevant = (skill: string) => result.matched.some((k) => mentions(skill.toLowerCase(), k))
  return {
    ...data,
    summary: result.summary,
    skills: [...data.skills.filter(relevant), ...data.skills.filter((s) => !relevant(s))],
  }
}

/** Short cover note. Anything only the applicant knows is left as a [placeholder]. */
export function writeCoverNote(data: ResumeData, job: { role: string; company: string }, jobDescription: string): string {
  const { matched } = matchJob(data, jobDescription)
  const strengths = (matched.length ? matched : data.skills).slice(0, 3)
  const strengthText = strengths.length > 1 ? `${strengths.slice(0, -1).join(', ')} and ${strengths[strengths.length - 1]}` : strengths[0] ?? 'core programming'
  const recent = [...data.experience, ...data.projects].find((e) => e.title.trim())
  const { problemsSolved, accuracy } = currentUser.stats

  return [
    `Dear ${job.company} hiring team,`,
    `I'm applying for the ${job.role} position. I'm a ${(data.headline || 'software developer').toLowerCase()} with hands-on experience in ${strengthText}, and I've solved ${problemsSolved} coding and SQL problems on CodeQuest at ${accuracy}% accuracy.`,
    recent
      ? `Most recently, as ${recent.title}${recent.subtitle ? ` (${recent.subtitle})` : ''}, I [one result you're proud of from this role or project].`
      : `[One result you're proud of from a recent project.]`,
    `What draws me to ${job.company} is [one specific reason — the product, the team, or the problem you want to work on]. I'd love to talk about how I can help.`,
    `Best regards,\n${data.name || '[Your name]'}`,
  ].join('\n\n')
}
