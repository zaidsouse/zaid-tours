import { VisaNationality } from './types'
import { visaNationalities as defaultData } from './mock-data'

const STORAGE_KEY = 'zaid_tours_visa_nationalities'

export function getVisaNationalities(): VisaNationality[] {
  if (typeof window === 'undefined') return defaultData
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as VisaNationality[]
  } catch {}
  return defaultData
}

export function saveVisaNationalities(data: VisaNationality[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}
