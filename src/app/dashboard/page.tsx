'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FileText, Globe, Package, Car, Activity, Calendar, DollarSign, LogOut, LayoutDashboard, X, ChevronRight, Plus } from 'lucide-react'
import { mockUser, categories, services as allServices } from '@/lib/mock-data'
import { PaymentStatus, ServiceStatus, Service, Request } from '@/lib/types'

const categoryIcons: Record<string, React.ReactNode> = {
  'cat-1': <FileText className="w-6 h-6" />,
  'cat-2': <Globe className="w-6 h-6" />,
  'cat-3': <Package className="w-6 h-6" />,
  'cat-4': <Car className="w-6 h-6" />,
}
const categoryColors: Record<string, string> = {
  'cat-1': 'bg-blue-50 text-blue-600 border-blue-100',
  'cat-2': 'bg-green-50 text-green-600 border-green-100',
  'cat-3': 'bg-orange-50 text-orange-600 border-orange-100',
  'cat-4': 'bg-purple-50 text-purple-600 border-purple-100',
}
const categoryBadge: Record<string, string> = {
  'cat-1': 'bg-blue-100 text-blue-600',
  'cat-2': 'bg-green-100 text-green-600',
  'cat-3': 'bg-orange-100 text-orange-600',
  'cat-4': 'bg-purple-100 text-purple-600',
}

const payBadge: Record<PaymentStatus, string> = { paid: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', failed: 'bg-red-100 text-red-700' }
const svcBadge: Record<ServiceStatus, string> = { completed: 'bg-green-100 text-green-700', processing: 'bg-blue-100 text-blue-700', pending: 'bg-yellow-100 text-yellow-700', cancelled: 'bg-gray-100 text-gray-600' }

const initRequests: Request[] = [
  { id: 'req-1', request_number: 'REQ-2026-0001', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-2', service_name: 'Official Document Translation', category_name: 'Translation Services', country: 'Jordan', price: 150, payment_status: 'paid', service_status: 'completed', created_at: '2026-04-01T10:00:00Z', updated_at: '2026-04-02T10:00:00Z' },
  { id: 'req-2', request_number: 'REQ-2026-0002', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-3', service_name: 'Tourist Visa', category_name: 'Visa Services', country: 'UAE', price: 800, payment_status: 'pending', service_status: 'processing', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z' },
  { id: 'req-3', request_number: 'REQ-2026-0003', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-8', service_name: 'Airport Transfer', category_name: 'Transportation Services', country: 'Jordan', price: 40, payment_status: 'paid', service_status: 'pending', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user] = useState(mockUser)
  const [userRequests, setUserRequests] = useState<Request[]>(initRequests)
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [reqCountry, setReqCountry] = useState('Jordan')
  const [reqNotes, setReqNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const activeReqs = userRequests.filter(r => r.service_status !== 'completed' && r.service_status !== 'cancelled')
  const completedReqs = userRequests.filter(r => r.service_status === 'completed')
  const totalSpent = userRequests.reduce((s, r) => s + r.price, 0)

  const handleLogout = () => {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    toast.success('Logged out')
    setTimeout(() => router.push('/'), 500)
  }

  const handleCatClick = (catId: string) => {
    setSelectedCat(selectedCat === catId ? null : catId)
    setSelectedService(null)
  }

  const handleSubmitRequest = async () => {
    if (!selectedService) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 700))
    const cat = categories.find(c => c.id === selectedService.category_id)
    const newReq: Request = {
      id: 'req-' + Date.now(),
      request_number: 'REQ-2026-' + String(userRequests.length + 1).padStart(4, '0'),
      user_id: 'user-1',
      user_name: user.full_name,
      user_email: user.email,
      service_id: selectedService.id,
      service_name: selectedService.name_en,
      category_name: cat?.name_en || '',
      country: reqCountry,
      price: selectedService.price,
      payment_status: 'pending',
      service_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setUserRequests(prev => [newReq, ...prev])
    toast.success('Request submitted successfully' + String.fromCharCode(33))
    setSelectedService(null)
    setSelectedCat(null)
    setReqCountry('Jordan')
    setReqNotes('')
    setSubmitting(false)
  }

  const catServices = selectedCat ? allServices.filter(s => s.category_id === selectedCat && s.is_visible) : []

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

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.full_name}</h1>
          <p className="text-gray-500 mt-1">Manage your services and requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: 'ACTIVE REQUESTS', value: activeReqs.length, icon: <Activity className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' },
            { label: 'COMPLETED REQUESTS', value: completedReqs.length, icon: <Calendar className="w-5 h-5 text-green-500" />, bg: 'bg-green-50' },
            { label: 'TOTAL SPENT', value: totalSpent + ' USD', icon: <DollarSign className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{s.label}</p>
                <div className={`p-2 rounded-lg ${s.bg}`}>{s.icon}</div>
              </div>
              <p className="text-4xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* New Request */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 pb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">New Request</h2>
            <p className="text-gray-500 text-sm mb-6">Choose a category to see available services</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(cat => (
                <button key={cat.id} onClick={() => handleCatClick(cat.id)}
                  className={[
                    'flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition cursor-pointer',
                    selectedCat === cat.id
                      ? 'border-blue-500 shadow-md ' + categoryColors[cat.id]
                      : 'border-transparent hover:border-blue-200 hover:shadow-md ' + categoryColors[cat.id]
                  ].join(' ')}>
                  <div className="text-2xl">{cat.icon}</div>
                  <span className="text-sm font-medium text-center leading-tight">{cat.name_en}</span>
                  <span className="text-xs opacity-60">{allServices.filter(s => s.category_id === cat.id && s.is_visible).length} services</span>
                </button>
              ))}
            </div>
          </div>

          {/* Services List */}
          {selectedCat && catServices.length > 0 && (
            <div className="border-t border-gray-100 px-8 py-6 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                {categories.find(c => c.id === selectedCat)?.name_en} — Select a Service
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {catServices.map(svc => (
                  <button key={svc.id} onClick={() => setSelectedService(svc)}
                    className={[
                      'flex items-center justify-between p-4 rounded-xl border-2 text-left transition',
                      selectedService?.id === svc.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    ].join(' ')}>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{svc.name_en}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{svc.description}</p>
                    </div>
                    <div className="ml-3 text-right shrink-0">
                      <span className="text-sm font-bold text-gray-900">{svc.price} USD</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 mt-1 ml-auto" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Request Form */}
              {selectedService && (
                <div className="mt-5 p-5 bg-white rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">{selectedService.name_en}</p>
                      <p className="text-sm text-blue-600 font-medium">{selectedService.price} USD</p>
                    </div>
                    <button onClick={() => setSelectedService(null)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {selectedService.requirements.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Requirements</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.requirements.map((req, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{req}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Country</label>
                    <input value={reqCountry} onChange={e => setReqCountry(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Jordan, UAE, Turkey" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Notes (optional)</label>
                    <textarea value={reqNotes} onChange={e => setReqNotes(e.target.value)} rows={2}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Any additional information..." />
                  </div>
                  <button onClick={handleSubmitRequest} disabled={submitting}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60 text-sm">
                    {submitting
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <Plus className="w-4 h-4" />}
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Service History */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Service History</h2>
          {userRequests.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No requests yet. Choose a service above to get started.</p>
          ) : (
            <div className="space-y-3">
              {userRequests.map(req => {
                const catId = allServices.find(s => s.id === req.service_id)?.category_id || 'cat-1'
                return (
                  <div key={req.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      <div className={['p-2.5 rounded-xl', categoryBadge[catId] || 'bg-gray-100 text-gray-600'].join(' ')}>
                        {categoryIcons[catId] || <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{req.service_name}</p>
                        <p className="text-xs text-gray-400">
                          {req.country === 'Jordan' ? '🇯🇴' : req.country === 'UAE' ? '🇦🇪' : '🌍'} {req.country} · {new Date(req.created_at).toLocaleDateString()} · {req.request_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap justify-end">
                      <span className="font-semibold text-gray-900 text-sm">{req.price} USD</span>
                      <span className={['text-xs font-medium px-2.5 py-1 rounded-full capitalize', payBadge[req.payment_status]].join(' ')}>{req.payment_status}</span>
                      <span className={['text-xs font-medium px-2.5 py-1 rounded-full capitalize', svcBadge[req.service_status]].join(' ')}>{req.service_status}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
