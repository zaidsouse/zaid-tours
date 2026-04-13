'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', type: 'individual' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Account created successfully! Welcome to Zaid Tours')
    setTimeout(() => router.push('/dashboard'), 1000)
    setLoading(false)
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900">Zaid Tours</Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Your Account</h1>
          <p className="text-gray-500 text-sm mb-8">Join thousands of satisfied customers</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2 mb-2">
              {['individual', 'company'].map(t => (
                <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))}
                  className={\}>
                  {t === 'individual' ? 'Individual' : 'Company'}
                </button>
              ))}
            </div>
            {([['name', 'Full Name', 'text', 'John Doe'], ['email', 'Email', 'email', 'your@email.com'], ['phone', 'Phone', 'tel', '+962 79 000 0000'], ['password', 'Password', 'password', ''], ['confirm', 'Confirm Password', 'password', '']] as [string, string, string, string][]).map(([k, label, type, ph]) => (
              <div key={k}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input type={type} required={k !== 'phone'} value={form[k as keyof typeof form]} onChange={set(k)}
                  placeholder={ph}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?
            <Link href="/login" className="text-blue-600 font-medium hover:underline ml-1">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
