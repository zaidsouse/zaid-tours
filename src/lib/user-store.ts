'use client'

export interface StoredUser {
  id: string
  name: string
  email: string
  password: string
  phone: string
  country: string
  dial_code: string
  flag: string
  type: 'individual' | 'company'
  created_at: string
}

const KEY = 'zaid_tours_users'

export function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(users))
}

export function addUser(user: StoredUser): void {
  const existing = getUsers()
  const filtered = existing.filter(u => u.email !== user.email)
  saveUsers([user, ...filtered])
}

export function getUserByEmail(email: string): StoredUser | null {
  return getUsers().find(u => u.email === email) || null
}
