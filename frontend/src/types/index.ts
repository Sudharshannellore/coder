export type Difficulty = 'easy' | 'medium' | 'hard'

export type Language = 'python' | 'javascript' | 'cpp' | 'java' | 'sql'

export type League = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master'

export interface LeagueInfo {
  tier: League
  division: 1 | 2 | 3
  label: string
}

export interface UserProfile {
  id: string
  username: string
  handle: string
  avatarColor: string
  avatarInitials: string
  level: number
  xp: number
  xpToNextLevel: number
  streakDays: number
  league: LeagueInfo
  rank: number
  joinedAt: string
  stats: {
    problemsSolved: number
    challengesWon: number
    longestStreak: number
    accuracy: number
    avgSolveTimeSeconds: number
    languages: string[]
  }
  skills: { name: string; percent: number }[]
}

export interface QuestTask {
  id: string
  label: string
  done: boolean
}

export interface DailyQuest {
  id: string
  title: string
  rewardXp: number
  progressPercent: number
  tasks: QuestTask[]
}

export interface CourseModule {
  id: string
  title: string
  lessonsCount: number
  exercisesCount: number
  completedLessons: number
  progressPercent: number
}

export interface Course {
  id: string
  title: string
  world: string
  description: string
  progressPercent: number
  totalXp: number
  modules: CourseModule[]
}

export type NodeState = 'completed' | 'current' | 'locked'

export interface PathNode {
  id: string
  title: string
  state: NodeState
  difficulty: Difficulty
  xpReward: number
  estimatedMinutes: number
}

/** The boss guarding the end of a zone: unlocked once every topic in the zone is cleared. */
export interface PathBoss {
  id: string
  name: string
  /** Sprite name from the pixel sprite set. */
  sprite: string
  challenge: string
  /** Rounds in the boss fight — shown as hearts. */
  stages: number
  xpReward: number
  /** completed = defeated, current = ready to fight. */
  state: NodeState
}

/** A difficulty tier of a course's world map: a group of topics that ends in a boss level. */
export interface PathZone {
  id: string
  name: string
  tagline: string
  difficulty: Difficulty
  nodes: PathNode[]
  boss: PathBoss
}

export interface Lesson {
  id: string
  courseId: string
  moduleId: string
  title: string
  concept: string
  explanation: string
  codeExample: string
  quiz: { question: string; options: string[]; correctIndex: number; explanation?: string }
  xp?: number
  estimatedMinutes?: number
  keyPoints?: string[]
  analogy?: string
  /** One note per notable line of `codeExample`, in order. */
  codeWalkthrough?: string[]
  tryIt?: {
    prompt: string
    starterCode: string
    /** Mock grader: every regex (source string) must match the learner's code. */
    checks: { pattern: string; hint: string }[]
    expectedOutput: string
  }
}

export interface TestCase {
  id: string
  input: string
  expectedOutput: string
}

export interface Problem {
  id: string
  title: string
  slug: string
  difficulty: Difficulty
  xp: number
  acceptanceRate: number
  tags: string[]
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  hints: string[]
  starterCode: Record<Language, string>
  testCases: TestCase[]
}

export interface TestResult {
  id: string
  passed: boolean
  input: string
  expectedOutput: string
  receivedOutput: string
}

export interface SubmissionResult {
  status: 'running' | 'passed' | 'failed' | 'error'
  runtimeMs?: number
  memoryMb?: number
  testResults: TestResult[]
  aiReview?: {
    correct: boolean
    timeComplexity: string
    spaceComplexity: string
    codeQuality: number
    recommendation: string
  }
  aiFailureExplanation?: string
}

export type ChallengeCategory =
  | 'daily'
  | 'speed'
  | 'debug'
  | 'optimization'
  | 'boss'
  | 'sql'
  | 'ai'

export interface Challenge {
  id: string
  title: string
  category: ChallengeCategory
  difficulty: Difficulty
  timeLimitMinutes: number
  xp: number
  playersActive: number
  reward: string
  description: string
}

export interface BossStage {
  id: string
  title: string
  description: string
  completed: boolean
}

export interface BossBattle {
  id: string
  name: string
  timeRemainingSeconds: number
  rewardXp: number
  stages: BossStage[]
}

export interface LeaderboardEntry {
  rank: number
  username: string
  avatarColor: string
  avatarInitials: string
  level: number
  xp: number
  winRate: number
  badges: string[]
  isCurrentUser?: boolean
}

export interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  unlocked: boolean
  unlockedAt?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface AIMessage {
  id: string
  role: 'ai' | 'user'
  text: string
  timestamp: string
}

export interface ResumeEntry {
  id: string
  /** Role (experience), project name, or degree (education). */
  title: string
  /** Company, tech stack, or school. */
  subtitle: string
  period: string
  bullets: string[]
}

export interface ResumeData {
  name: string
  headline: string
  email: string
  phone: string
  location: string
  links: string
  summary: string
  skills: string[]
  experience: ResumeEntry[]
  projects: ResumeEntry[]
  education: ResumeEntry[]
  /** Optional CodeQuest highlights (league, rank, streak) shown as achievements. */
  includeCodeQuestStats: boolean
}

export type ResumeTemplateId =
  | 'classic'
  | 'minimal'
  | 'ats'
  | 'professional'
  | 'harvard'
  | 'student'
  | 'developer'
  | 'typewriter'
  | 'compact'
  | 'elegant'
  | 'bold'
  | 'executive'

export interface ResumeTemplate {
  id: ResumeTemplateId
  name: string
  description: string
  /** XP to unlock; 0 = free. */
  cost: number
}

export interface SavedResume {
  id: string
  title: string
  templateId: ResumeTemplateId
  data: ResumeData
  updatedAt: number
}

export interface Job {
  id: string
  company: string
  role: string
  location: string
  workMode: 'Remote' | 'Hybrid' | 'On-site'
  employment: 'Full-time' | 'Internship' | 'Contract'
  level: 'Intern' | 'Junior' | 'Mid-level'
  salary: string
  postedDaysAgo: number
  applicants: number
  /** Pixel logo: a sprite name on a brand-colored tile. */
  logo: { sprite: string; color: string }
  about: string
  responsibilities: string[]
  requirements: string[]
  tags: string[]
}

export interface JobApplication {
  id: string
  jobId: string
  appliedAt: number
  /** Snapshot of the resume exactly as it was sent. */
  resume: ResumeData
  /** Template the resume was sent in (older applications have none: classic). */
  templateId?: ResumeTemplateId
  resumeTitle?: string
  coverNote: string
  tailored: boolean
  /** Keyword match at submission; null when the resume wasn't checked against the job. */
  matchScore: number | null
  /** Everything this application cost: AI help plus the apply fee. */
  xpSpent: number
}

export type SqlRow = Record<string, string | number>

export interface SqlProblem {
  id: string
  title: string
  slug: string
  difficulty: Difficulty
  xp: number
  acceptanceRate: number
  tags: string[]
  description: string
  tablesUsed: string[]
  starterQuery: string
  hints: string[]
  /** Mock grader: lowercase fragments a correct query must contain, with a friendly hint for each. */
  requiredClauses: { fragment: string; hint: string }[]
  expectedColumns: string[]
  expectedRows: SqlRow[]
  successNote: string
}

export interface SqlTable {
  name: string
  columns: { name: string; type: string }[]
  rows: Record<string, string | number>[]
}
