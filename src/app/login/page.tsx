'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    if (email === 'zaidsous@outlook.com' && password === 'Zaid123@') {
      document.cookie = 'auth_token=admin_mock; path=/; max-age=86400'
      toast.success('Login successful' + String.fromCharCode(33))
      setTimeout(() => router.push('/admin'), 500)
    } else if (email === 'zaid@outlook.com' && password === '123') {
      document.cookie = 'auth_token=user_mock; path=/; max-age=86400'
      toast.success('Login successful' + String.fromCharCode(33))
      setTimeout(() => router.push('/dashboard'), 500)
    } else {
      toast.error('Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900">Zaid Tours</Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Login to Your Account</h1>
          <p className="text-gray-500 text-sm mb-8">Use the same email and password to access from any device</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition pr-11"
                  placeholder={String.fromCharCode(8226,8226,8226,8226,8226,8226,8226,8226)}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 font-medium hover:underline">Sign Up</Link>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
            <p className="text-xs text-gray-400 text-center mb-2">Demo Accounts:</p>
            <button onClick={() => { setEmail('zaidsous@outlook.com'); setPassword('Zaid123@') }}
              className="w-full text-xs text-left px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition">
              Admin: zaidsous@outlook.com / Zaid123@
            </button>
            <button onClick={() => { setEmail('zaid@outlook.com'); setPassword('123') }}
              className="w-full text-xs text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">
              User: zaid@outlook.com / 123
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
