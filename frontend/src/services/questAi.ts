/**
 * Mock "Quest AI" mentor: question suggestions and replies for the coding board and lessons.
 * Rule-based stand-in for a real model — keep the signatures when wiring up the AI backend.
 */

export type MentorContext =
  | {
      kind: 'problem'
      title: string
      description: string
      tags: string[]
      hints: string[]
      examples: { input: string; output: string; explanation?: string }[]
    }
  | {
      kind: 'lesson'
      title: string
      concept: string
      explanation: string
      analogy?: string
      keyPoints?: string[]
      /** Current lesson step, e.g. "concept", "tryit", "quiz". */
      step?: string
      tryHint?: string
    }

/** Questions related to what the learner is looking at, most useful first. */
export function suggestedQuestions(ctx: MentorContext): string[] {
  if (ctx.kind === 'problem') {
    return [
      `Give me a hint for ${ctx.title}`,
      'What should my first step be?',
      'Why is my code failing the tests?',
      'Walk me through Example 1',
      'How do I handle edge cases here?',
      'What is the time complexity of the best approach?',
      'Is there a faster approach than brute force?',
      ...ctx.tags.map((t) => `How does a ${t.toLowerCase()} help in this problem?`),
      'Explain the problem in simpler words',
      'Give me a similar problem to practice',
    ]
  }
  const c = ctx.concept.toLowerCase()
  return [
    ...(ctx.step === 'tryit' ? ['Give me a hint for the Try it exercise'] : []),
    ...(ctx.step === 'quiz' ? ['Help me think through the quiz'] : []),
    `Explain ${c} in simpler words`,
    `Show me a real-world example of ${c}`,
    'How does the code example work?',
    `When should I use ${c}?`,
    `What are common mistakes with ${c}?`,
    `What is the time complexity of ${c}?`,
    `What should I learn after ${c}?`,
  ]
}

const words = (text: string) => text.toLowerCase().match(/[a-z0-9+#]+/g) ?? []

/** Levenshtein distance, capped early — only used to forgive one-letter typos. */
function editDistance(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return 2
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = tmp
    }
  }
  return prev[b.length]
}

/** Does a typed token match a word — as a prefix while typing, or with one typo for longer words? */
function tokenMatches(token: string, word: string) {
  if (word.startsWith(token)) return true
  if (token.length >= 4 && editDistance(token, word.slice(0, token.length)) <= 1) return true
  return token.length >= 4 && editDistance(token, word) <= 1
}

/** Suggestions related to what's being typed, best match first. */
export function matchSuggestions(pool: string[], input: string, limit = 4): string[] {
  const tokens = words(input).filter((t) => t.length >= 2)
  if (!tokens.length) return pool.slice(0, limit)
  return pool
    .map((q) => {
      const qWords = words(q)
      const score = tokens.filter((t) => qWords.some((w) => tokenMatches(t, w))).length
      return { q, score }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.q)
}

const has = (q: string, ...keys: string[]) => keys.some((k) => q.includes(k))

const TAG_APPROACH: Record<string, string> = {
  'hash table': 'store what you have seen in a hash map so each lookup is O(1) — one pass, O(n) time and O(n) space',
  array: 'a single pass with a running value (like a best-so-far) usually beats nested loops',
  'two pointers': 'move a left and right pointer toward each other so each element is visited once — O(n)',
  string: 'count characters with a map or a fixed-size array instead of comparing every pair',
  'linked list': 'use a slow and a fast pointer, or reverse pointers in place, for O(1) extra space',
  stack: 'push items as you scan and pop when a match closes them — one pass, O(n)',
  'binary search': 'halve the search range every step — O(log n)',
  recursion: 'solve a smaller version of the problem and combine — watch the base case',
  'dynamic programming': 'save answers to sub-problems in a table so nothing is computed twice',
  sorting: 'sort first (O(n log n)), then a single scan often finds the answer',
}

function approachFor(tags: string[]) {
  const tag = tags.find((t) => TAG_APPROACH[t.toLowerCase()])
  return tag ? { tag, text: TAG_APPROACH[tag.toLowerCase()] } : null
}

/** `turn` = how many questions were asked before, so repeated hint requests reveal the next hint. */
export function mentorReply(question: string, ctx: MentorContext, turn = 0): string {
  const q = question.toLowerCase()

  if (ctx.kind === 'problem') {
    const approach = approachFor(ctx.tags)
    const ex = ctx.examples[0]
    if (has(q, 'hint', 'stuck', 'clue')) {
      const hint = ctx.hints[turn % Math.max(1, ctx.hints.length)]
      return hint ? `Hint: ${hint}` : `Think about what you need to remember as you scan the input once.`
    }
    if (has(q, 'complex', 'big o', 'time', 'space', 'faster', 'optimal', 'brute', 'efficient')) {
      return approach
        ? `Brute force compares every pair — O(n²). The ${approach.tag.toLowerCase()} approach is better: ${approach.text}.`
        : 'Start from brute force (often O(n²)), then ask: what am I recomputing? Caching it usually brings you to O(n) or O(n log n).'
    }
    if (has(q, 'edge', 'corner')) {
      return 'Check these before submitting: an empty or one-element input, duplicates, negative numbers and zero, and the largest input the constraints allow. Trace your code on each one.'
    }
    if (has(q, 'example', 'walk', 'trace') && ex) {
      return `Example 1: input ${ex.input} → output ${ex.output}. ${ex.explanation ?? 'Trace your loop on it by hand and write down every variable after each step.'}`
    }
    if (has(q, 'fail', 'wrong', 'error', 'bug', 'not work', "doesn't")) {
      return 'Run the failing test by hand: print your variables each iteration and compare with what you expect. Most failures here are off-by-one loop bounds, returning too early, or not handling duplicates.'
    }
    if (has(q, 'similar', 'practice', 'another')) {
      return approach
        ? `Practice the same ${approach.tag.toLowerCase()} pattern with another problem from the Practice list tagged "${approach.tag}". Solving 2–3 in a row makes the pattern stick.`
        : 'Open the Practice list and filter by the same topic — solving 2–3 problems with the same pattern makes it stick.'
    }
    if (has(q, 'first step', 'start', 'begin', 'approach')) {
      return `First, restate the goal in one sentence. Then solve Example 1 by hand${approach ? ` and notice how a ${approach.tag.toLowerCase()} could remember what you've seen` : ''}. Only then write code.`
    }
    if (approach && ctx.tags.some((t) => q.includes(t.toLowerCase()))) {
      return `Here a ${approach.tag.toLowerCase()} lets you ${approach.text}.`
    }
    if (has(q, 'simple', 'explain', 'understand', 'mean', 'what is')) {
      return `In plain words: ${ctx.description.split(/(?<=\.)\s/)[0]} Focus on what goes in, what must come out, and the smallest example.`
    }
    return `Good question. For ${ctx.title}, ${approach ? `the key idea is that a ${approach.tag.toLowerCase()} lets you ${approach.text}` : 'solve the first example by hand, then turn each step into code'}. Ask me for a hint if you want a nudge.`
  }

  const c = ctx.concept.toLowerCase()
  if (has(q, 'try it', 'exercise', 'hint')) {
    return ctx.tryHint ?? `Re-read the step's instructions, then change one line at a time and run it to see what happens.`
  }
  if (has(q, 'quiz')) {
    return `Don't guess — rule options out. Which ones contradict what you just learned about ${c}? ${ctx.keyPoints?.[0] ?? ''}`.trim()
  }
  if (has(q, 'real', 'world', 'example')) {
    return ctx.analogy ? `Think of it like this: ${ctx.analogy}` : `Apps use ${c} all the time — caches, search, and settings lookups are common places to find it.`
  }
  if (has(q, 'code', 'work', 'line')) {
    return `Read the example top to bottom: each line does one thing. Run it, then change a value and predict the new output before running again — that's the fastest way to really get ${c}.`
  }
  if (has(q, 'mistake', 'wrong', 'avoid', 'pitfall')) {
    return ctx.keyPoints?.length
      ? `Most mistakes come from forgetting: ${ctx.keyPoints.slice(0, 2).join(' · ')}.`
      : `The usual mistakes are using ${c} where a simpler tool would do, and not testing the empty or edge case.`
  }
  if (has(q, 'when', 'use', 'why')) {
    return `Reach for ${c} when it makes the job simpler or faster. ${ctx.keyPoints?.[0] ?? ctx.explanation}`
  }
  if (has(q, 'complex', 'big o', 'fast', 'slow')) {
    return `Ask how many steps the operation takes as the input grows. For ${c}, the lesson's key points show where it's fast — and where it isn't.`
  }
  if (has(q, 'next', 'after', 'learn')) {
    return `Finish this lesson's quiz, then follow the next node on your course roadmap — it builds directly on ${c}.`
  }
  return `Here's another angle on ${c}: ${ctx.analogy ?? ctx.explanation}`
}
