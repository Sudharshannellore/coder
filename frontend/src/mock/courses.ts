import type { Course, Difficulty, Lesson, NodeState, PathBoss, PathZone } from '@/types'

type Topic = [id: string, title: string, state: NodeState, xp: number, minutes: number]

function zone(id: string, name: string, tagline: string, difficulty: Difficulty, topics: Topic[], boss: Omit<PathBoss, 'id'>): PathZone {
  return {
    id,
    name,
    tagline,
    difficulty,
    nodes: topics.map(([tid, title, state, xpReward, estimatedMinutes]) => ({ id: tid, title, state, difficulty, xpReward, estimatedMinutes })),
    boss: { id: `${id}-boss`, ...boss },
  }
}

/** Each course's world map: topics grouped into difficulty zones, each guarded by a boss level. */
export const coursePaths: Record<string, PathZone[]> = {
  'python-mastery': [
    zone(
      'py-z1',
      'Syntax Meadows',
      'Your first steps: store values, make decisions, repeat.',
      'easy',
      [
        ['py1', 'Variables', 'completed', 50, 10],
        ['py2', 'Data Types', 'completed', 50, 10],
        ['py3', 'Input & Output', 'completed', 50, 10],
        ['py4', 'Conditions', 'completed', 60, 12],
        ['py5', 'Loops', 'completed', 70, 15],
      ],
      { name: 'Loop Golem', sprite: 'slime', challenge: 'Solve 3 problems mixing conditions and loops', stages: 3, xpReward: 250, state: 'completed' },
    ),
    zone(
      'py-z2',
      'Data Forest',
      'Organise data and write reusable, safe code.',
      'medium',
      [
        ['py6', 'Functions', 'completed', 90, 18],
        ['py7', 'Lists', 'completed', 100, 20],
        ['py8', 'Tuples & Sets', 'current', 100, 18],
        ['py9', 'Dictionaries', 'locked', 110, 20],
        ['py10', 'String Methods', 'locked', 100, 18],
        ['py11', 'Error Handling', 'locked', 110, 20],
      ],
      { name: 'Bug Hydra', sprite: 'bugSlime', challenge: 'Fix a buggy inventory program before time runs out', stages: 4, xpReward: 400, state: 'locked' },
    ),
    zone(
      'py-z3',
      'Algorithm Volcano',
      'Think like an engineer: objects, recursion and algorithms.',
      'hard',
      [
        ['py12', 'Object-Oriented Programming', 'locked', 150, 30],
        ['py13', 'Recursion', 'locked', 160, 30],
        ['py14', 'Sorting Algorithms', 'locked', 180, 35],
        ['py15', 'Searching & Binary Search', 'locked', 180, 30],
        ['py16', 'File Handling', 'locked', 150, 25],
      ],
      { name: 'Recursion Dragon', sprite: 'recursionBoss', challenge: 'Survive recursion, sorting and binary-search rounds', stages: 5, xpReward: 800, state: 'locked' },
    ),
  ],
  'javascript-essentials': [
    zone(
      'js-z1',
      'Syntax Plains',
      'Values, operators and the flow of a program.',
      'easy',
      [
        ['js1', 'Variables & Types', 'completed', 50, 10],
        ['js2', 'Operators', 'completed', 50, 10],
        ['js3', 'Conditionals', 'completed', 60, 12],
        ['js4', 'Loops', 'current', 70, 15],
        ['js5', 'Functions', 'locked', 70, 15],
      ],
      { name: 'Syntax Slime', sprite: 'slime', challenge: 'Clean up 3 broken snippets of everyday JavaScript', stages: 3, xpReward: 250, state: 'locked' },
    ),
    zone(
      'js-z2',
      'Closure Caves',
      'Scope, objects and the array toolbox.',
      'medium',
      [
        ['js6', 'Scope & Closures', 'locked', 90, 18],
        ['js7', 'Arrays & Objects', 'locked', 100, 20],
        ['js8', 'Array Methods', 'locked', 100, 20],
        ['js9', 'Promises', 'locked', 120, 22],
      ],
      { name: 'Callback Kraken', sprite: 'bugSlime', challenge: 'Untangle nested callbacks into clean promise chains', stages: 4, xpReward: 400, state: 'locked' },
    ),
    zone(
      'js-z3',
      'Async Peaks',
      'Talk to servers and bring web pages to life.',
      'hard',
      [
        ['js10', 'Async / Await', 'locked', 140, 25],
        ['js11', 'DOM Basics', 'locked', 160, 30],
        ['js12', 'Events', 'locked', 150, 25],
        ['js13', 'Modules', 'locked', 140, 22],
      ],
      { name: 'Event Loop Lich', sprite: 'recursionBoss', challenge: 'Predict the output of tricky async code, round by round', stages: 5, xpReward: 800, state: 'locked' },
    ),
  ],
  'sql-foundations': [
    zone(
      'sq-z1',
      'Query Shores',
      'Ask a table questions and get exactly the rows you need.',
      'easy',
      [
        ['sq1', 'SELECT Basics', 'completed', 50, 10],
        ['sq2', 'Filtering with WHERE', 'current', 60, 12],
        ['sq3', 'Sorting with ORDER BY', 'locked', 60, 12],
        ['sq4', 'LIMIT & DISTINCT', 'locked', 60, 12],
      ],
      { name: 'Query Goblin', sprite: 'slime', challenge: 'Answer 3 questions about the shop database', stages: 3, xpReward: 200, state: 'locked' },
    ),
    zone(
      'sq-z2',
      'Aggregate Mines',
      'Summarise thousands of rows into answers.',
      'medium',
      [
        ['sq5', 'Aggregate Functions', 'locked', 90, 18],
        ['sq6', 'GROUP BY', 'locked', 100, 20],
        ['sq7', 'HAVING', 'locked', 100, 18],
        ['sq8', 'Handling NULLs', 'locked', 90, 15],
      ],
      { name: 'Group-By Golem', sprite: 'bugSlime', challenge: 'Build a monthly sales report from raw orders', stages: 4, xpReward: 350, state: 'locked' },
    ),
    zone(
      'sq-z3',
      'Join Fortress',
      'Combine tables and write queries like a pro.',
      'hard',
      [
        ['sq9', 'INNER & OUTER Joins', 'locked', 140, 25],
        ['sq10', 'Subqueries', 'locked', 160, 30],
        ['sq11', 'Window Functions', 'locked', 180, 30],
        ['sq12', 'Indexes & Performance', 'locked', 160, 25],
      ],
      { name: 'Join Dragon', sprite: 'recursionBoss', challenge: 'Join 4 tables to crack the final leaderboard query', stages: 5, xpReward: 700, state: 'locked' },
    ),
  ],
}

export const courses: Course[] = [
  {
    id: 'python-mastery',
    title: 'Python Mastery',
    world: 'Python World',
    description: 'Go from zero to confident Python developer through hands-on, gamified lessons.',
    progressPercent: 64,
    totalXp: 3200,
    modules: [
      { id: 'm1', title: 'Python Basics', lessonsCount: 8, exercisesCount: 12, completedLessons: 8, progressPercent: 100 },
      { id: 'm2', title: 'Control Flow', lessonsCount: 6, exercisesCount: 10, completedLessons: 6, progressPercent: 100 },
      { id: 'm3', title: 'Functions', lessonsCount: 7, exercisesCount: 9, completedLessons: 7, progressPercent: 100 },
      { id: 'm4', title: 'Data Structures', lessonsCount: 9, exercisesCount: 14, completedLessons: 5, progressPercent: 55 },
      { id: 'm5', title: 'Object-Oriented Programming', lessonsCount: 8, exercisesCount: 12, completedLessons: 0, progressPercent: 0 },
      { id: 'm6', title: 'Algorithms', lessonsCount: 10, exercisesCount: 16, completedLessons: 0, progressPercent: 0 },
      { id: 'm7', title: 'Advanced Python', lessonsCount: 6, exercisesCount: 8, completedLessons: 0, progressPercent: 0 },
    ],
  },
  {
    id: 'javascript-essentials',
    title: 'JavaScript Essentials',
    world: 'JavaScript World',
    description: 'Master modern JavaScript and the fundamentals of web development.',
    progressPercent: 32,
    totalXp: 2100,
    modules: [
      { id: 'jm1', title: 'Syntax & Types', lessonsCount: 7, exercisesCount: 10, completedLessons: 7, progressPercent: 100 },
      { id: 'jm2', title: 'Functions & Scope', lessonsCount: 6, exercisesCount: 9, completedLessons: 2, progressPercent: 33 },
      { id: 'jm3', title: 'Async JavaScript', lessonsCount: 8, exercisesCount: 11, completedLessons: 0, progressPercent: 0 },
    ],
  },
  {
    id: 'sql-foundations',
    title: 'SQL Foundations',
    world: 'Database World',
    description: 'Learn to query, join, and reason about relational databases.',
    progressPercent: 18,
    totalXp: 900,
    modules: [
      { id: 'sm1', title: 'SELECT Basics', lessonsCount: 5, exercisesCount: 8, completedLessons: 5, progressPercent: 100 },
      { id: 'sm2', title: 'Joins', lessonsCount: 6, exercisesCount: 10, completedLessons: 1, progressPercent: 16 },
    ],
  },
]

export const lessons: Lesson[] = [
  {
    id: 'lesson-hash-tables',
    courseId: 'python-mastery',
    moduleId: 'm4',
    title: 'Understanding Hash Tables',
    concept: 'Hash Tables',
    explanation:
      'A hash table stores key-value pairs. A hash function converts each key into an index in an underlying array, giving average O(1) lookup, insert, and delete.',
    codeExample: `table = {}\ntable["apple"] = 3\ntable["banana"] = 7\n\nprint(table["apple"])  # 3\nprint("banana" in table)  # True`,
    quiz: {
      question: 'What is the average time complexity of a hash table lookup?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'],
      correctIndex: 2,
      explanation: 'The hash function jumps straight to the right bucket, so the lookup cost does not grow with the number of items.',
    },
    xp: 90,
    estimatedMinutes: 12,
    keyPoints: [
      'A hash function turns each key into an index in an array.',
      'Lookups, inserts and deletes take O(1) time on average.',
      'Two keys can land in the same bucket — a collision — and the table resolves it for you.',
    ],
    analogy:
      'Think of a coat check: you hand over your coat and get a numbered ticket. Showing the ticket takes the attendant straight to the right hook — nobody searches every rack.',
    codeWalkthrough: [
      '`table = {}` creates an empty hash table — in Python that is a dict.',
      '`table["apple"] = 3` hashes "apple" to pick a bucket and stores 3 there.',
      '`table["banana"] = 7` does the same for "banana", landing in a different bucket.',
      '`table["apple"]` hashes the key again and jumps straight to its value.',
      '`"banana" in table` checks membership in O(1) — no scanning through items.',
    ],
    tryIt: {
      prompt: 'Add "cherry" with the value 5 to the table, then print the value stored for "cherry".',
      starterCode: 'table = {"apple": 3, "banana": 7}\n\n# 1. Add "cherry" with the value 5\n\n# 2. Print the value stored for "cherry"\n',
      checks: [
        { pattern: 'table\\s*\\[\\s*["\']cherry["\']\\s*\\]\\s*=\\s*5', hint: 'Store the value with table["cherry"] = 5.' },
        { pattern: 'print\\s*\\(\\s*table\\s*\\[\\s*["\']cherry["\']\\s*\\]\\s*\\)', hint: 'Print it by looking the key up: print(table["cherry"]).' },
      ],
      expectedOutput: '5',
    },
  },
]
