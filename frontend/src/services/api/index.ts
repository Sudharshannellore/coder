import { achievements } from '@/mock/achievements'
import { mentorIntroMessages } from '@/mock/ai'
import { bossBattle, challenges } from '@/mock/challenges'
import { coursePaths, courses, lessons } from '@/mock/courses'
import { globalLeaderboard } from '@/mock/leaderboard'
import { getProblemBySlug, problems } from '@/mock/problems'
import { dailyQuest } from '@/mock/quests'
import { sqlTables } from '@/mock/sql'
import { getSqlProblemBySlug, sqlProblems } from '@/mock/sqlProblems'
import { currentUser } from '@/mock/user'
import type { SubmissionResult, TestResult } from '@/types'
import { mockDelay } from './client'

export const api = {
  getCurrentUser: () => mockDelay(currentUser),
  getDailyQuest: () => mockDelay(dailyQuest),
  getCourses: () => mockDelay(courses),
  getCourse: (courseId: string) => mockDelay(courses.find((c) => c.id === courseId) ?? null),
  getCoursePath: (courseId: string) => mockDelay(coursePaths[courseId] ?? []),
  getLesson: (lessonId: string) => mockDelay(lessons.find((l) => l.id === lessonId) ?? lessons[0]),
  getProblems: () => mockDelay(problems),
  getProblem: (slug: string) => mockDelay(getProblemBySlug(slug) ?? null),
  getChallenges: () => mockDelay(challenges),
  getBossBattle: () => mockDelay(bossBattle),
  getLeaderboard: () => mockDelay(globalLeaderboard),
  getAchievements: () => mockDelay(achievements),
  getSqlTables: () => mockDelay(sqlTables),
  getSqlProblems: () => mockDelay(sqlProblems),
  getSqlProblem: (slug: string) => mockDelay(getSqlProblemBySlug(slug) ?? null),
  getMentorIntro: () => mockDelay(mentorIntroMessages),

  runCode: async (problemSlug: string): Promise<SubmissionResult> => {
    const problem = getProblemBySlug(problemSlug)
    await mockDelay(null, 900)
    const shouldPass = Math.random() > 0.3
    const testResults: TestResult[] = (problem?.testCases ?? []).map((tc, i) => {
      const passed = shouldPass || i < (problem?.testCases.length ?? 1) - 1
      return {
        id: tc.id,
        passed,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        receivedOutput: passed ? tc.expectedOutput : '[1,3,2]',
      }
    })
    const allPassed = testResults.every((t) => t.passed)
    return {
      status: allPassed ? 'passed' : 'failed',
      runtimeMs: 82,
      memoryMb: 18,
      testResults,
      aiReview: allPassed
        ? {
            correct: true,
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            codeQuality: 92,
            recommendation:
              'Your solution is already optimal for time complexity. Consider improving variable naming to make the intent clearer.',
          }
        : undefined,
      aiFailureExplanation: allPassed
        ? undefined
        : 'Your sorting step is modifying the original array before the second operation runs on it.',
    }
  },
}
