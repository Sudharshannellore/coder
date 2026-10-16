import type { SqlProblem, SqlRow, SqlTable } from '@/types'

/**
 * Client-side stand-in for a SQL execution service. Swap these functions for API calls
 * once a real database sandbox exists; callers only depend on the result shapes.
 */
export interface QueryResult {
  columns: string[]
  rows: SqlRow[]
  executionMs: number
}

export interface GradeResult {
  passed: boolean
  missingHints: string[]
}

function normalise(query: string) {
  return ` ${query.toLowerCase().replace(/--.*$/gm, '').replace(/\s+/g, ' ')} `
}

function fakeLatency() {
  return Math.round(40 + Math.random() * 180)
}

/** Free-form sandbox execution: understands one GROUP BY demo and otherwise returns the referenced table. */
export function runSandboxQuery(query: string, tables: SqlTable[]): QueryResult | null {
  const q = normalise(query)
  const executionMs = fakeLatency()

  const employees = tables.find((t) => t.name === 'employees')
  if (employees && q.includes('employees') && q.includes('group by') && q.includes('department')) {
    const byDept = new Map<string, { total: number; count: number }>()
    for (const row of employees.rows) {
      const entry = byDept.get(String(row.department)) ?? { total: 0, count: 0 }
      entry.total += Number(row.salary) || 0
      entry.count += 1
      byDept.set(String(row.department), entry)
    }
    const rows = [...byDept.entries()].map(([department, { total, count }]) => ({ department, avg_salary: Math.round(total / count) }))
    return { columns: ['department', 'avg_salary'], rows, executionMs }
  }

  const match = tables.find((t) => q.includes(t.name))
  return match ? { columns: match.columns.map((c) => c.name), rows: match.rows, executionMs } : null
}

export function gradeSqlProblem(query: string, problem: SqlProblem): GradeResult {
  const q = normalise(query)
  const missingHints = problem.requiredClauses.filter((c) => !q.includes(c.fragment)).map((c) => c.hint)
  return { passed: missingHints.length === 0, missingHints }
}

/** Runs a query in the context of a problem: a correct query yields the problem's expected rows. */
export function runProblemQuery(query: string, problem: SqlProblem, tables: SqlTable[]): { result: QueryResult | null; grade: GradeResult } {
  const grade = gradeSqlProblem(query, problem)
  if (grade.passed) {
    return { result: { columns: problem.expectedColumns, rows: problem.expectedRows, executionMs: fakeLatency() }, grade }
  }
  return { result: runSandboxQuery(query, tables), grade }
}
