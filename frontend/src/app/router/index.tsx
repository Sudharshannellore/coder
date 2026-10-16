import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { FocusShell } from '@/components/layout/FocusShell'
import { PageLoader } from '@/components/layout/PageLoader'
import { RouteError } from '@/components/layout/RouteError'

const Landing = lazy(() => import('@/pages/Landing'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Learn = lazy(() => import('@/pages/Learn'))
const CoursePage = lazy(() => import('@/pages/Learn/CoursePage'))
const LessonPage = lazy(() => import('@/pages/Learn/LessonPage'))
const Practice = lazy(() => import('@/pages/Practice'))
const CodeWorkspace = lazy(() => import('@/pages/Code'))
const SQLSandbox = lazy(() => import('@/pages/SQL'))
const SqlProblemPage = lazy(() => import('@/pages/Practice/SqlProblemPage'))
const Challenges = lazy(() => import('@/pages/Challenges'))
const BossBattlePage = lazy(() => import('@/pages/Challenges/BossBattlePage'))
const Leaderboard = lazy(() => import('@/pages/Leaderboard'))
const Quests = lazy(() => import('@/pages/Quests'))
const Achievements = lazy(() => import('@/pages/Achievements'))
const Profile = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))
const ResumeBuilder = lazy(() => import('@/pages/Resume'))
const JobBoard = lazy(() => import('@/pages/Jobs'))
const Subscription = lazy(() => import('@/pages/Subscription'))
const Friends = lazy(() => import('@/pages/Friends'))
const NotFound = lazy(() => import('@/pages/NotFound'))
function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{node}</Suspense>
}

export const router = createBrowserRouter([
  { path: '/', element: withSuspense(<Landing />), errorElement: <RouteError /> },
  {
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      { path: '/dashboard', element: withSuspense(<Dashboard />) },
      { path: '/learn', element: withSuspense(<Learn />) },
      { path: '/learn/:courseId', element: withSuspense(<CoursePage />) },
      { path: '/learn/:courseId/:lessonId', element: withSuspense(<LessonPage />) },
      { path: '/practice', element: withSuspense(<Practice />) },
      { path: '/challenges', element: withSuspense(<Challenges />) },
      { path: '/challenges/boss', element: withSuspense(<BossBattlePage />) },
      { path: '/friends', element: withSuspense(<Friends />) },
      { path: '/leaderboard', element: withSuspense(<Leaderboard />) },
      { path: '/quests', element: withSuspense(<Quests />) },
      { path: '/achievements', element: withSuspense(<Achievements />) },
      { path: '/profile', element: withSuspense(<Profile />) },
      { path: '/settings', element: withSuspense(<Settings />) },
      { path: '/resume', element: withSuspense(<ResumeBuilder />) },
      { path: '/jobs', element: withSuspense(<JobBoard />) },
      { path: '/subscription', element: withSuspense(<Subscription />) },
    ],
  },
  {
    // Play boards run full-screen without the sidebar, top bar, or mobile nav.
    element: <FocusShell />,
    errorElement: <RouteError />,
    children: [
      { path: '/practice/sql/:sqlProblemId', element: withSuspense(<SqlProblemPage />) },
      { path: '/practice/:problemId', element: withSuspense(<CodeWorkspace />) },
      { path: '/code', element: withSuspense(<CodeWorkspace />) },
      { path: '/sql', element: withSuspense(<SQLSandbox />) },
    ],
  },
  { path: '*', element: withSuspense(<NotFound />), errorElement: <RouteError /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
