/**
 * Mock API client. Every function returns a Promise so call sites already
 * match the shape of a real network call — swap the body for a `fetch`
 * later without touching callers.
 */
export function mockDelay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}
