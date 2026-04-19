// Shared localStorage store for all requests
// Both admin and dashboard pages use this to stay in sync

import { Request } from './types'
import { requests as mockRequests } from './mock-data'

const STORAGE_KEY = 'zaid_tours_requests'

export function getRequests(): Request[] {
  if (typeof window === 'undefined') return mockRequests
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as Request[]
  } catch {}
  return mockRequests
}

export function saveRequests(data: Request[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Request store save failed', e)
  }
}
