import type { ResumeData } from '@/types'
import { currentUser } from './user'

/** Starter draft pre-filled from the learner's CodeQuest profile. Bullets are intentionally plain so AI polish has something to improve. */
export function starterResume(): ResumeData {
  return {
    name: currentUser.username,
    headline: 'Software Developer',
    email: 'you@example.com',
    phone: '+00 00000 00000',
    location: 'Your City',
    links: `github.com/${currentUser.handle.replace('@', '')}`,
    summary: '',
    skills: currentUser.skills.map((s) => s.name),
    experience: [
      {
        id: 'exp-1',
        title: 'Software Developer Intern',
        subtitle: 'Your Company',
        period: '2025 – Present',
        bullets: ['worked on web features for the dashboard', 'fixed bugs reported by the QA team'],
      },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Algorithm Practice Portfolio',
        subtitle: 'Python, SQL',
        period: '2025',
        bullets: [`solved ${currentUser.stats.problemsSolved} coding and SQL problems on CodeQuest`],
      },
    ],
    education: [
      {
        id: 'edu-1',
        title: 'B.Tech in Computer Science',
        subtitle: 'Your University',
        period: '2021 – 2025',
        bullets: [],
      },
    ],
    includeCodeQuestStats: true,
  }
}
