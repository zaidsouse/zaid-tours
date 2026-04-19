'use client'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addUser } from '@/lib/user-store'

export default function GoogleSuccessPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'authenticated' && session?.user?.email) {
      const { name, email } = session.user
      // Store Google user in localStorage (no password needed)
      addUser({
        id: 'google-' + Date.now(),
        name: name ?? '',
        email: email ?? '',
        password: '__google__',
        phone: '',
        country: '',
        dial_code: '',
        flag: '',
        type: 'individual',
        created_at: new Date().toISOString(),
      })
      // Set the same cookie the rest of the app uses
      document.cookie = 'auth_token=user_mock; path=/; max-age=86400'
      router.replace('/dashboard')
    } else if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Completing Google sign-in...</p>
      </div>
    </div>
  )
}
