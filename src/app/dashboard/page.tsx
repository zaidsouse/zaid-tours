'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FileText, Globe, Package, Car, Activity, Calendar, DollarSign, LogOut, LayoutDashboard, X, ChevronRight, Plus, Upload, Paperclip, AlertCircle, RotateCcw, Download } from 'lucide-react'
import { mockUser, categories, services as allServices } from '@/lib/mock-data'
import { getVisaNationalities } from '@/lib/visa-store'
import { storeUserFile, getAdminFile, downloadFile } from '@/lib/file-store'
import { getRequests, saveRequests } from '@/lib/request-store'
import { PaymentStatus, ServiceStatus, Service, Request } from '@/lib/types'




const categoryIcons: Record<string, React.ReactNode> = {
  'cat-1': <FileText className="w-5 h-5" />,
  'cat-2': <Globe className="w-5 h-5" />,
  'cat-3': <Package className="w-5 h-5" />,
  'cat-4': <Car className="w-5 h-5" />,
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
  { id: 'req-1', request_number: 'REQ-2026-0001', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-2', service_name: 'Official Document Translation', category_name: 'Translation Services', country: 'N/A', price: 150, payment_status: 'paid', service_status: 'completed', uploaded_files: ['family_book.pdf', 'national_id.jpg'], created_at: '2026-04-01T10:00:00Z', updated_at: '2026-04-02T10:00:00Z' },
  { id: 'req-2', request_number: 'REQ-2026-0002', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-visa-tourist', service_name: 'Tourist Visa — UAE', category_name: 'Visa Services', country: 'UAE', price: 800, payment_status: 'pending', service_status: 'processing', uploaded_files: ['passport.pdf', 'bank_statement.pdf'], visa_nationality: 'Jordan', visa_destination: 'UAE', visa_type: 'Tourist', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z' },
  { id: 'req-3', request_number: 'REQ-2026-0003', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-8', service_name: 'Airport Transfer', category_name: 'Transportation Services', country: 'N/A', price: 40, payment_status: 'paid', service_status: 'pending', uploaded_files: [], return_reason: 'Please provide your flight number and exact arrival time', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [visaNationalities] = useState(() => getVisaNationalities())
  const [user] = useState(mockUser)
  const [userRequests, setUserRequests] = useState<Request[]>(() => {
    const all = getRequests()
    return all.filter(r => r.user_email === mockUser.email)
  })
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [visaStep, setVisaStep] = useState(1)
  const [visaNat, setVisaNat] = useState('')
  const [visaDest, setVisaDest] = useState('')
  const [visaType, setVisaType] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [pendingFileObjects, setPendingFileObjects] = useState<File[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const [reqNotes, setReqNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const activeReqs = userRequests.filter(r => r.service_status !== 'completed' && r.service_status !== 'cancelled')
  const completedReqs = userRequests.filter(r => r.service_status === 'completed')
  const totalSpent = userRequests.reduce((s, r) => s + r.price, 0)

  const resetForm = () => {
    setSelectedCat(null); setSelectedService(null)
    setVisaStep(1); setVisaNat(''); setVisaDest(''); setVisaType('')
    setUploadedFiles([]); setPendingFileObjects([]); setReqNotes('')
  }

  const handleLogout = () => {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    toast.success('Logged out')
    setTimeout(() => router.push('/'), 500)
  }

  const handleCatClick = (catId: string) => {
    if (selectedCat === catId) { resetForm(); return }
    setSelectedCat(catId); setSelectedService(null)
    setVisaStep(1); setVisaNat(''); setVisaDest(''); setVisaType('')
    setUploadedFiles([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files.map(f => f.name)])
      setPendingFileObjects(prev => [...prev, ...files])
      if (fileRef.current) fileRef.current.value = ''
      toast.success(files.length + ' file(s) uploaded')
    }
  }

  const removeFile = (name: string) => setUploadedFiles(prev => prev.filter(f => f !== name))

  const handleReRequest = (req: Request) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setUploadedFiles([]); setReqNotes('')
    if (req.category_name.includes('Visa') && req.visa_nationality) {
      setSelectedCat('cat-2')
      setVisaNat(req.visa_nationality)
      setVisaDest(req.visa_destination || '')
      setVisaType(req.visa_type || '')
      setVisaStep(req.visa_type ? 4 : req.visa_destination ? 3 : 2)
    } else {
      const svc = allServices.find(s => s.id === req.service_id)
      if (svc) { setSelectedCat(svc.category_id); setSelectedService(svc) }
    }
    toast.info('Form pre-filled — upload documents and resubmit')
  }

  const handleSubmitService = async () => {
    if (!selectedService) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 700))
    const cat = categories.find(c => c.id === selectedService.category_id)
    const newReq: Request = {
      id: 'req-' + Date.now(),
      request_number: 'REQ-2026-' + String(userRequests.length + 1).padStart(4, '0'),
      user_id: user.id, user_name: user.full_name, user_email: user.email,
      service_id: selectedService.id, service_name: selectedService.name_en,
      category_name: cat?.name_en || '', country: 'N/A',
      price: selectedService.price, payment_status: 'pending', service_status: 'pending',
      notes: reqNotes, uploaded_files: uploadedFiles,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
    setUserRequests(prev => {
      const updated = [newReq, ...prev]
      const allReqs = getRequests().filter(r => r.user_email !== user.email)
      saveRequests([newReq, ...allReqs])
      return updated
    })
    await Promise.all(pendingFileObjects.map(f => storeUserFile(newReq.id, f)))
    toast.success('Request submitted successfully!')
    resetForm(); setSubmitting(false)
  }

  const handleSubmitVisa = async () => {
    if (!visaNat || !visaDest || !visaType) { toast.error('Please complete all steps'); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 700))
    const newReq: Request = {
      id: 'req-' + Date.now(),
      request_number: 'REQ-2026-' + String(userRequests.length + 1).padStart(4, '0'),
      user_id: user.id, user_name: user.full_name, user_email: user.email,
      service_id: 'svc-visa-' + visaType.toLowerCase(),
      service_name: visaType + ' Visa — ' + visaDest,
      category_name: 'Visa Services', country: visaDest,
      price: (currentNatData?.visa_prices?.[visaType]) ?? 800, payment_status: 'pending', service_status: 'pending',
      notes: reqNotes, uploaded_files: uploadedFiles,
      visa_nationality: visaNat, visa_destination: visaDest, visa_type: visaType,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
    setUserRequests(prev => {
      const updated = [newReq, ...prev]
      const allReqs = getRequests().filter(r => r.user_email !== user.email)
      saveRequests([newReq, ...allReqs])
      return updated
    })
    toast.success('Visa request submitted successfully!')
    await Promise.all(pendingFileObjects.map(f => storeUserFile(newReq.id, f)))
    resetForm(); setSubmitting(false)
  }

  const catServices = selectedCat && selectedCat !== 'cat-2' ? allServices.filter(s => s.category_id === selectedCat && s.is_visible) : []
  const currentNatData = visaNationalities.find(v => v.nationality === visaNat)

  return (
    <div className="min-h-screen bg-gray-50">
      <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={handleFileChange} />

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.full_name}</h1>
          <p className="text-gray-500 mt-1">Manage your services and requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: 'ACTIVE REQUESTS', value: activeReqs.length, icon: <Activity className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' },
            { label: 'COMPLETED', value: completedReqs.length, icon: <Calendar className="w-5 h-5 text-green-500" />, bg: 'bg-green-50' },
            { label: 'TOTAL SPENT', value: totalSpent + ' USD', icon: <DollarSign className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{s.label}</p>
                <div className={['p-2 rounded-lg', s.bg].join(' ')}>{s.icon}</div>
              </div>
              <p className="text-4xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* New Request */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 pb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">New Request</h2>
            <p className="text-gray-500 text-sm mb-6">Choose a category to get started</p>
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

          {/* Non-visa: service list */}
          {selectedCat && selectedCat !== 'cat-2' && catServices.length > 0 && (
            <div className="border-t border-gray-100 px-8 py-6 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                {categories.find(c => c.id === selectedCat)?.name_en} — Select a Service
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {catServices.map(svc => (
                  <button key={svc.id} onClick={() => setSelectedService(selectedService?.id === svc.id ? null : svc)}
                    className={[
                      'flex items-center justify-between p-4 rounded-xl border-2 text-left transition',
                      selectedService?.id === svc.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
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
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Required Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.requirements.map((r, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{r}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* File Upload */}
                  <div className="mb-4">
                             <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Upload Documents</p>
                    <div onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 transition cursor-pointer">
                      <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Click to upload <span className="text-gray-400">(PDF, JPG, PNG)</span></p>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {uploadedFiles.map((f, i) => (
                          <div key={i} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                            <div className="flex items-center gap-2">
                              <Paperclip className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-xs text-green-700 font-medium">{f}</span>
                            </div>
                            <button onClick={() => removeFile(f)} className="text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Notes (optional)</label>
                    <textarea value={reqNotes} onChange={e => setReqNotes(e.target.value)} rows={2}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Any additional information..." />
                  </div>
                  <button onClick={handleSubmitService} disabled={submitting}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60 text-sm">
                    {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Visa multi-step flow */}
          {selectedCat === 'cat-2' && (
            <div className="border-t border-gray-100 px-8 py-6 bg-gray-50">
              {/* Step indicator */}
              <div className="flex items-center gap-1 mb-6 overflow-x-auto">
                {['Nationality', 'Destination', 'Visa Type', 'Documents'].map((step, i) => (
                  <div key={i} className="flex items-center gap-1 shrink-0">
                    <div className={[
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition',
                      visaStep > i + 1 ? 'bg-green-500 text-white' : visaStep === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                    ].join(' ')}>
                      {visaStep > i + 1 ? '✓' : i + 1}
                    </div>
                    <span className={['text-xs font-medium hidden sm:block mr-1', visaStep === i + 1 ? 'text-blue-600' : 'text-gray-400'].join(' ')}>{step}</span>
                    {i < 3 && <ChevronRight className="w-3 h-3 text-gray-300" />}
                  </div>
                ))}
              </div>

              {/* Step 1: Nationality */}
              {visaStep === 1 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Your Nationality</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {visaNationalities.map(vn => (
                      <button key={vn.id} onClick={() => { setVisaNat(vn.nationality); setVisaStep(2) }}
                        className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition text-left">
                        <span className="text-2xl">{vn.flag_emoji}</span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{vn.nationality}</p>
                          <p className="text-xs text-gray-400">{vn.destinations.length} destinations</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Destination */}
              {visaStep === 2 && currentNatData && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => { setVisaStep(1); setVisaNat('') }} className="text-xs text-blue-600 hover:underline">← Back</button>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-600">{currentNatData.flag_emoji} {visaNat}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Destination Country</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {currentNatData.destinations.map(dest => (
                      <button key={dest} onClick={() => { setVisaDest(dest); setVisaStep(3) }}
                        className="p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition font-medium text-gray-900 text-sm text-center">
                        🌍 {dest}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Visa type */}
              {visaStep === 3 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => { setVisaStep(2); setVisaDest('') }} className="text-xs text-blue-600 hover:underline">← Back</button>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-600">{visaNat} → {visaDest}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Visa Type</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(currentNatData?.visa_types || []).map(vt => (
                      <button key={vt} onClick={() => { setVisaType(vt); setVisaStep(4) }}
                        className="p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition text-center">
                        <p className="font-semibold text-gray-900 text-sm">{vt} Visa</p>
                        <p className="text-xs text-blue-600 mt-1">{(currentNatData?.visa_prices?.[vt]) ?? 800} USD</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Docs & submit */}
              {visaStep === 4 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => { setVisaStep(3); setVisaType('') }} className="text-xs text-blue-600 hover:underline">← Back</button>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-600">{visaNat} → {visaDest} → {visaType} Visa</span>
                  </div>
                  <div className="p-5 bg-white rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-semibold text-gray-900">{visaType} Visa — {visaDest}</p>
                        <p className="text-sm text-blue-600 font-medium">{(currentNatData?.visa_prices?.[visaType]) ?? 800} USD</p>
                      </div>
                    </div>
                    {(currentNatData?.visa_reqs?.[visaType] || []).length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Required Documents</p>
                        <div className="flex flex-wrap gap-2">
                          {(currentNatData?.visa_reqs?.[visaType] || []).map((r, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{r}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* File upload */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Upload Documents</p>
                      <div onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 transition cursor-pointer">
                        <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Click to upload <span className="text-gray-400">(PDF, JPG, PNG)</span></p>
                      </div>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {uploadedFiles.map((f, i) => (
                            <div key={i} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                              <div className="flex items-center gap-2">
                                <Paperclip className="w-3.5 h-3.5 text-green-600" />
                                <span className="text-xs text-green-700 font-medium">{f}</span>
                              </div>
                              <button onClick={() => removeFile(f)} className="text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Notes (optional)</label>
                      <textarea value={reqNotes} onChange={e => setReqNotes(e.target.value)} rows={2}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Travel dates, special requirements..." />
                    </div>
                    <button onClick={handleSubmitVisa} disabled={submitting}
                      className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-60 text-sm">
                      {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                      {submitting ? 'Submitting...' : 'Submit Visa Request'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Service History */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Service History</h2>
          {userRequests.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No requests yet.</p>
          ) : (
            <div className="space-y-3">
              {userRequests.map(req => {
                const catId = allServices.find(s => s.id === req.service_id)?.category_id
                  || (req.category_name.includes('Visa') ? 'cat-2' : req.category_name.includes('Transport') ? 'cat-4' : req.category_name.includes('Ship') ? 'cat-3' : 'cat-1')
                return (
                  <div key={req.id} className="rounded-xl border border-gray-100 hover:border-gray-200 transition overflow-hidden">
                    {req.return_reason && (
                      <div className="flex items-start gap-2 bg-orange-50 border-b border-orange-100 px-4 py-3">
                        <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-orange-700">Action Required — Please resubmit with corrections</p>
                          <p className="text-xs text-orange-600 mt-0.5">{req.return_reason}</p>
                        </div>
                      </div>
                    )}
                    {req.admin_files && req.admin_files.length > 0 && (
                      <div className="flex items-start gap-2 bg-green-50 border-b border-green-100 px-4 py-3">
                        <Download className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-green-700">Document Ready — Download from Admin</p>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            {req.admin_files.map((f, i) => {
                              const data = getAdminFile(req.id, f)
                              return data ? (
                                <button key={i} onClick={() => downloadFile(data, f)} className="flex items-center gap-1 text-xs bg-white border border-green-200 text-green-700 px-2.5 py-1 rounded-lg hover:bg-green-100 transition">
                                  <Paperclip className="w-3 h-3" /> {f}
                                </button>
                              ) : (
                                <span key={i} className="text-xs text-green-600 flex items-center gap-1"><Paperclip className="w-3 h-3" />{f}</span>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 flex-wrap gap-3">
                      <div className="flex items-center gap-4">
                        <div className={['p-2.5 rounded-xl', categoryBadge[catId] || 'bg-gray-100 text-gray-600'].join(' ')}>
                          {categoryIcons[catId] || <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{req.service_name}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <p className="text-xs text-gray-400">{req.request_number} · {new Date(req.created_at).toLocaleDateString()}</p>
                            {req.uploaded_files && req.uploaded_files.length > 0 && (
                              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                                <Paperclip className="w-3 h-3" /> {req.uploaded_files.length} files
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <span className="font-semibold text-gray-900 text-sm">{req.price} USD</span>
                        <span className={['text-xs font-medium px-2.5 py-1 rounded-full capitalize', payBadge[req.payment_status]].join(' ')}>{req.payment_status}</span>
                        <span className={['text-xs font-medium px-2.5 py-1 rounded-full capitalize', svcBadge[req.service_status] || 'bg-orange-100 text-orange-700'].join(' ')}>{req.service_status}</span>
                        <button onClick={() => handleReRequest(req)}
                          className="flex items-center gap-1 text-xs text-blue-600 border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition">
                          <RotateCcw className="w-3 h-3" /> Request Again
                        </button>
                      </div>
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
