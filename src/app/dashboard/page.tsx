'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FileText, Globe, Package, Car, Activity, Calendar, DollarSign, LogOut, LayoutDashboard } from 'lucide-react'
import { requests, mockUser, categories } from '@/lib/mock-data'
import { PaymentStatus, ServiceStatus } from '@/lib/types'

const categoryIcons = { 'cat-1': <FileText className="w-6 h-6" />, 'cat-2': <Globe className="w-6 h-6" />, 'cat-3': <Package className="w-6 h-6" />, 'cat-4': <Car className="w-6 h-6" /> }
const categoryColors = { 'cat-1': 'bg-blue-50 text-blue-600', 'cat-2': 'bg-green-50 text-green-600', 'cat-3': 'bg-orange-50 text-orange-600', 'cat-4': 'bg-purple-50 text-purple-600' }

const payBadge: Record<PaymentStatus, string> = { paid: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', failed: 'bg-red-100 text-red-700' }
const svcBadge: Record<ServiceStatus, string> = { completed: 'bg-green-100 text-green-700', processing: 'bg-blue-100 text-blue-700', pending: 'bg-yellow-100 text-yellow-700', cancelled: 'bg-gray-100 text-gray-600' }

export default function DashboardPage() {
  const router = useRouter()
  const [user] = useState(mockUser)
  const activeReqs = requests.filter(r => r.service_status \!== 'completed' && r.service_status \!== 'cancelled')
  const completedReqs = requests.filter(r => r.service_status === 'completed')
  const totalSpent = requests.reduce((s, r) => s + r.price, 0)

  const handleLogout = () => { toast.success('Logged out'); setTimeout(() => router.push('/'), 500) }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">Zaid Tours</Link>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <span className="text-sm text-gray-600">{user.full_name}</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.full_name}</h1>
          <p className="text-gray-500 mt-1">Account Overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: 'ACTIVE REQUESTS', value: activeReqs.length, icon: <Activity className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' },
            { label: 'COMPLETED REQUESTS', value: completedReqs.length, icon: <Calendar className="w-5 h-5 text-green-500" />, bg: 'bg-green-50' },
            { label: 'TOTAL SPENT', value: `${totalSpent}`, sub: 'USD', icon: <DollarSign className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{s.label}</p>
                <div className={`p-2 rounded-lg ${s.bg}`}>{s.icon}</div>
              </div>
              <p className="text-4xl font-bold text-gray-900">{s.value}</p>
              {s.sub && <p className="text-sm text-gray-400 mt-1">{s.sub}</p>}
            </div>
          ))}
        </div>

        {/* New Request */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-1">New Request</h2>
          <p className="text-gray-500 text-sm mb-6">Choose a service to get started</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => toast.info(`${cat.name_en} — Coming soon\!`)}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-transparent hover:border-blue-200 hover:shadow-md transition cursor-pointer ${categoryColors[cat.id as keyof typeof categoryColors] || 'bg-gray-50 text-gray-600'}`}>
                <div className="text-2xl">{cat.icon}</div>
                <span className="text-sm font-medium text-center">{cat.name_en}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Service History */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Service History</h2>
          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${req.category_name.includes('Translation') ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {req.category_name.includes('Translation') ? <FileText className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{req.service_name}</p>
                    <p className="text-sm text-gray-400">
                      {req.country === 'Jordan' ? '🇯🇴' : '🌍'} {req.country} · {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <span className="font-semibold text-gray-900">{req.price} USD</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${payBadge[req.payment_status]}`}>{req.payment_status}</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${svcBadge[req.service_status]}`}>{req.service_status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
