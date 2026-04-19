'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UserPlus, Search, ChevronDown } from 'lucide-react'
import { addUser } from '@/lib/user-store'
import { signIn } from 'next-auth/react'

const COUNTRIES = [
  { name: 'Jordan', flag: '🇯🇴', dial: '+962' },
  { name: 'Palestine', flag: '🇵🇸', dial: '+970' },
  { name: 'Saudi Arabia', flag: '🇸🇦', dial: '+966' },
  { name: 'UAE', flag: '🇦🇪', dial: '+971' },
  { name: 'Kuwait', flag: '🇰🇼', dial: '+965' },
  { name: 'Qatar', flag: '🇶🇦', dial: '+974' },
  { name: 'Bahrain', flag: '🇧🇭', dial: '+973' },
  { name: 'Oman', flag: '🇴🇲', dial: '+968' },
  { name: 'Iraq', flag: '🇮🇶', dial: '+964' },
  { name: 'Syria', flag: '🇸🇾', dial: '+963' },
  { name: 'Lebanon', flag: '🇱🇧', dial: '+961' },
  { name: 'Egypt', flag: '🇪🇬', dial: '+20' },
  { name: 'Libya', flag: '🇱🇾', dial: '+218' },
  { name: 'Tunisia', flag: '🇹🇳', dial: '+216' },
  { name: 'Algeria', flag: '🇩🇿', dial: '+213' },
  { name: 'Morocco', flag: '🇲🇦', dial: '+212' },
  { name: 'Sudan', flag: '🇸🇩', dial: '+249' },
  { name: 'Yemen', flag: '🇾🇪', dial: '+967' },
  { name: 'Turkey', flag: '🇹🇷', dial: '+90' },
  { name: 'Iran', flag: '🇮🇷', dial: '+98' },
  { name: 'Pakistan', flag: '🇵🇰', dial: '+92' },
  { name: 'India', flag: '🇮🇳', dial: '+91' },
  { name: 'Philippines', flag: '🇵🇭', dial: '+63' },
  { name: 'Indonesia', flag: '🇮🇩', dial: '+62' },
  { name: 'Malaysia', flag: '🇲🇾', dial: '+60' },
  { name: 'Bangladesh', flag: '🇧🇩', dial: '+880' },
  { name: 'Sri Lanka', flag: '🇱🇰', dial: '+94' },
  { name: 'Nepal', flag: '🇳🇵', dial: '+977' },
  { name: 'UK', flag: '🇬🇧', dial: '+44' },
  { name: 'Germany', flag: '🇩🇪', dial: '+49' },
  { name: 'France', flag: '🇫🇷', dial: '+33' },
  { name: 'USA', flag: '🇺🇸', dial: '+1' },
  { name: 'Canada', flag: '🇨🇦', dial: '+1' },
  { name: 'Australia', flag: '🇦🇺', dial: '+61' },
  { name: 'Netherlands', flag: '🇳🇱', dial: '+31' },
  { name: 'Spain', flag: '🇪🇸', dial: '+34' },
  { name: 'Italy', flag: '🇮🇹', dial: '+39' },
  { name: 'Sweden', flag: '🇸🇪', dial: '+46' },
  { name: 'Norway', flag: '🇳🇴', dial: '+47' },
  { name: 'Denmark', flag: '🇩🇰', dial: '+45' },
  { name: 'Russia', flag: '🇷🇺', dial: '+7' },
  { name: 'China', flag: '🇨🇳', dial: '+86' },
  { name: 'Japan', flag: '🇯🇵', dial: '+81' },
  { name: 'South Korea', flag: '🇰🇷', dial: '+82' },
  { name: 'Brazil', flag: '🇧🇷', dial: '+55' },
  { name: 'South Africa', flag: '🇿🇦', dial: '+27' },
  { name: 'Nigeria', flag: '🇳🇬', dial: '+234' },
  { name: 'Ethiopia', flag: '🇪🇹', dial: '+251' },
  { name: 'Kenya', flag: '🇰🇪', dial: '+254' },
]

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '', type: 'individual',
    country: 'Jordan', flag: '🇯🇴', dial: '+962'
  })
  const [loading, setLoading] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')

  const filteredCountries = useMemo(
    () => COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())),
    [countrySearch]
  )

  const selectCountry = (c: typeof COUNTRIES[0]) => {
    setForm(p => ({ ...p, country: c.name, flag: c.flag, dial: c.dial }))
    setCountryOpen(false)
    setCountrySearch('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    if (!form.phone.trim()) { toast.error('Please enter your mobile number'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    addUser({
      id: 'user-' + Date.now(),
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      country: form.country,
      dial_code: form.dial,
      flag: form.flag,
      type: form.type as 'individual' | 'company',
      created_at: new Date().toISOString()
    })
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
            {/* Account type */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              {['individual', 'company'].map(t => (
                <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))}
                  className={[
                    'py-2.5 rounded-xl text-sm font-medium border-2 transition capitalize',
                    form.type === t ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  ].join(' ')}>
                  {t === 'individual' ? 'Individual' : 'Company'}
                </button>
              ))}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input type="text" required value={form.name} onChange={set('name')} placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={set('email')} placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
            </div>

            {/* Country picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
              <div className="relative">
                <button type="button" onClick={() => setCountryOpen(o => !o)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition bg-white">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{form.flag}</span>
                    <span className="text-gray-800 font-medium">{form.country}</span>
                    <span className="text-gray-400 text-xs">{form.dial}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${countryOpen ? 'rotate-180' : ''}`} />
                </button>
                {countryOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                        <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <input autoFocus value={countrySearch} onChange={e => setCountrySearch(e.target.value)}
                          placeholder="Search country..."
                          className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400" />
                      </div>
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                      {filteredCountries.map(c => (
                        <button key={c.name} type="button" onClick={() => selectCountry(c)}
                          className={[
                            'w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition text-left',
                            form.country === c.name ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          ].join(' ')}>
                          <span className="text-base">{c.flag}</span>
                          <span className="flex-1">{c.name}</span>
                          <span className="text-gray-400 text-xs">{c.dial}</span>
                        </button>
                      ))}
                      {filteredCountries.length === 0 && (
                        <div className="px-4 py-6 text-center text-sm text-gray-400">No countries found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Phone with dial code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
              <div className="flex gap-0">
                <span className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border border-gray-200 border-r-0 rounded-l-xl text-sm text-gray-600 font-medium whitespace-nowrap">
                  <span>{form.flag}</span> {form.dial}
                </span>
                <input type="tel" required value={form.phone} onChange={set('phone')} placeholder="79 000 0000"
                  className="flex-1 px-3 py-3 rounded-r-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" required value={form.password} onChange={set('password')} placeholder="Min 6 characters"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input type="password" required value={form.confirm} onChange={set('confirm')} placeholder=""
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs text-gray-400"><span className="bg-white px-3">or sign up with</span></div>
          </div>
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/auth/google-success' })}
            className="w-full border border-gray-200 py-3 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign up with Google
          </button>
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?
            <Link href="/login" className="text-blue-600 font-medium hover:underline ml-1">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
