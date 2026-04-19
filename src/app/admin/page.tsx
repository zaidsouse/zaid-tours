'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, CartesianGrid } from 'recharts'
import { LogOut, RefreshCw, Shield, Trash2, Eye, Pencil, Plus, Search, Download, RotateCcw, X, Mail, FileText, Check, AlertCircle, Paperclip } from 'lucide-react'
import { requests as initRequests, services as initServices, companies as initCompanies, categories as initCategories, visaNationalities as initVisa, staff as initStaff } from '@/lib/mock-data'
import { getVisaNationalities, saveVisaNationalities } from '@/lib/visa-store'
import { getRequests, saveRequests } from '@/lib/request-store'
import { getUsers } from '@/lib/user-store'
import { getUserFile, storeAdminFile, downloadFile } from '@/lib/file-store'
import { Request, Service, PaymentStatus, ServiceStatus, VisaNationality, Staff, Category } from '@/lib/types'

const payBadge: Record<PaymentStatus, string> = { paid: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', failed: 'bg-red-100 text-red-700' }
const svcBadge: Record<ServiceStatus, string> = { completed: 'bg-green-100 text-green-700', processing: 'bg-blue-100 text-blue-700', pending: 'bg-yellow-100 text-yellow-700', cancelled: 'bg-gray-100 text-gray-600' }
const ALL_PERMISSIONS = ['View Requests', 'Edit Services', 'View Analytics', 'Manage Companies', 'Manage Visa', 'Manage Staff', 'Manage Categories']

type Tab = 'requests' | 'services' | 'visa' | 'companies' | 'staff' | 'categories' | 'approvals' | 'individuals' | 'analytics'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('requests')
  const [requests, setRequests] = useState<Request[]>(() => getRequests())
  const [services, setServices] = useState<Service[]>(initServices)
  const [visaList, setVisaList] = useState<VisaNationality[]>(() => getVisaNationalities())
  const [staffList, setStaffList] = useState<Staff[]>(initStaff)
  const [catList, setCatList] = useState<Category[]>(initCategories)

  // Requests tab
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [docsModal, setDocsModal] = useState<Request | null>(null)
  const adminFileRef = useRef<HTMLInputElement | null>(null)
  const [returnModal, setReturnModal] = useState<{ id: string; reason: string } | null>(null)

  // Service Management
  const [showAddService, setShowAddService] = useState(false)
  const [editService, setEditService] = useState<Service | null>(null)
  const [newService, setNewService] = useState({ name_en: '', name_ar: '', category_id: 'cat-1', price: '', description: '', reqInput: '' })
  const [serviceReqs, setServiceReqs] = useState<string[]>([])

  // Visa Management
  const [showAddVisa, setShowAddVisa] = useState(false)
  const [editVisa, setEditVisa] = useState<VisaNationality | null>(null)
  const [visaForm, setVisaForm] = useState({ nationality: '', flag_emoji: '', destInput: '', typeInput: '', reqDest: '', reqInput: {} as Record<string, string>, destinations: [] as string[], visa_types: [] as string[], visa_prices: {} as Record<string, number>, visa_reqs: {} as Record<string, string[]> })

  // Staff Management
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [staffForm, setStaffForm] = useState({ name: '', email: '', role: 'agent' as 'manager' | 'agent' | 'support', permissions: [] as string[] })

  // Categories
  const [showAddCat, setShowAddCat] = useState(false)
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [catForm, setCatForm] = useState({ name_en: '', name_ar: '', icon: '', description: '' })

  // Companies
  const [companySearch, setCompanySearch] = useState('')
  const [emailModal, setEmailModal] = useState<{ email: string; name: string } | null>(null)
  const [emailForm, setEmailForm] = useState({ subject: '', body: '' })

  // Individuals
  const [viewIndModal, setViewIndModal] = useState<{ name: string; email: string } | null>(null)

  const totalReqs = requests.length
  const pending = requests.filter(r => r.service_status === 'pending').length
  const processing = requests.filter(r => r.service_status === 'processing').length
  const completed = requests.filter(r => r.service_status === 'completed').length
  const paidRevenue = requests.filter(r => r.payment_status === 'paid').reduce((s, r) => s + r.price, 0)
  const pendingRevenue = requests.filter(r => r.payment_status === 'pending').reduce((s, r) => s + r.price, 0)
  const totalRevenue = requests.reduce((s, r) => s + r.price, 0)

  const filteredRequests = requests.filter(r => {
    const matchSearch = r.user_name.toLowerCase().includes(search.toLowerCase()) || r.request_number.toLowerCase().includes(search.toLowerCase()) || r.service_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.service_status === statusFilter
    return matchSearch && matchStatus
  })
  const filteredCompanies = initCompanies.filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase()) || c.email.toLowerCase().includes(companySearch.toLowerCase()))

  const updateStatus = (id: string, status: ServiceStatus) => {
    setRequests(prev => { const u: Request[] = prev.map(r => r.id === id ? { ...r, service_status: status } : r); saveRequests(u); return u })
    toast.success('Status updated')
  }
  const deleteRequest = (id: string) => {
    setRequests(prev => { const u: Request[] = prev.filter(r => r.id !== id); saveRequests(u); return u })
    setDeleteConfirm(null); toast.success('Request deleted')
  }
  const handleReturnRequest = () => {
    if (!returnModal || !returnModal.reason.trim()) { toast.error('Please enter a reason'); return }
    setRequests(prev => { const u: Request[] = prev.map(r => r.id === returnModal.id ? { ...r, service_status: 'pending' as const, return_reason: returnModal.reason } : r); saveRequests(u); return u })
    setReturnModal(null); toast.success('Request returned to user')
  }

  const toggleServiceVisibility = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, is_visible: !s.is_visible } : s))
    toast.success('Visibility updated')
  }
  const handleOpenEditService = (svc: Service) => {
    setEditService(svc)
    setNewService({ name_en: svc.name_en, name_ar: svc.name_ar, category_id: svc.category_id, price: String(svc.price), description: svc.description, reqInput: '' })
    setServiceReqs([...svc.requirements])
  }
  const handleSaveService = () => {
    if (!newService.name_en || !newService.price) { toast.error('Fill required fields'); return }
    if (editService) {
      setServices(prev => prev.map(s => s.id === editService.id ? { ...s, ...newService, price: Number(newService.price), requirements: serviceReqs } : s))
      toast.success('Service updated'); setEditService(null)
    } else {
      const svc: Service = { id: 'svc-' + Date.now(), name_en: newService.name_en, name_ar: newService.name_ar, category_id: newService.category_id, price: Number(newService.price), description: newService.description, requirements: serviceReqs, is_visible: true }
      setServices(prev => [...prev, svc]); toast.success('Service added'); setShowAddService(false)
    }
    setNewService({ name_en: '', name_ar: '', category_id: 'cat-1', price: '', description: '', reqInput: '' })
    setServiceReqs([])
  }
  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id)); toast.success('Service deleted')
  }

  const openVisaModal = (vn?: VisaNationality) => {
    if (vn) {
      setEditVisa(vn)
      setVisaForm({ nationality: vn.nationality, flag_emoji: vn.flag_emoji, destInput: '', typeInput: '', reqDest: vn.destinations[0] || '', reqInput: {}, destinations: [...vn.destinations], visa_types: [...vn.visa_types], visa_prices: { ...(vn.visa_prices || {}) }, visa_reqs: JSON.parse(JSON.stringify(vn.visa_reqs || {})) })
    } else {
      setEditVisa(null)
      setVisaForm({ nationality: '', flag_emoji: '', destInput: '', typeInput: '', reqDest: '', reqInput: {} as Record<string, string>, destinations: [], visa_types: [], visa_prices: {}, visa_reqs: {} })
    }
    setShowAddVisa(true)
  }
  const handleSaveVisa = () => {
    if (!visaForm.nationality) { toast.error('Nationality is required'); return }
    if (editVisa) {
      const updated = visaList.map(v => v.id === editVisa.id ? { ...v, nationality: visaForm.nationality, flag_emoji: visaForm.flag_emoji, destinations: visaForm.destinations, visa_types: visaForm.visa_types, visa_prices: visaForm.visa_prices, visa_reqs: visaForm.visa_reqs } : v)
      setVisaList(updated); saveVisaNationalities(updated)
      toast.success('Nationality updated')
    } else {
      const updated = [...visaList, { id: 'vn-' + Date.now(), nationality: visaForm.nationality, flag_emoji: visaForm.flag_emoji, destinations: visaForm.destinations, visa_types: visaForm.visa_types, visa_prices: visaForm.visa_prices, visa_reqs: visaForm.visa_reqs }]
      setVisaList(updated); saveVisaNationalities(updated)
      toast.success('Nationality added')
    }
    setShowAddVisa(false)
  }
  const deleteVisa = (id: string) => { setVisaList(prev => prev.filter(v => v.id !== id)); toast.success('Deleted') }

  const handleSaveStaff = () => {
    if (!staffForm.name || !staffForm.email) { toast.error('Fill required fields'); return }
    setStaffList(prev => [...prev, { id: 'staff-' + Date.now(), name: staffForm.name, email: staffForm.email, role: staffForm.role, permissions: staffForm.permissions, created_at: new Date().toISOString() }])
    setShowAddStaff(false); setStaffForm({ name: '', email: '', role: 'agent', permissions: [] }); toast.success('Staff added')
  }
  const deleteStaff = (id: string) => { setStaffList(prev => prev.filter(s => s.id !== id)); toast.success('Staff removed') }
  const togglePermission = (perm: string) => {
    setStaffForm(prev => ({ ...prev, permissions: prev.permissions.includes(perm) ? prev.permissions.filter(p => p !== perm) : [...prev.permissions, perm] }))
  }

  const handleSaveCategory = () => {
    if (!catForm.name_en || !catForm.icon) { toast.error('Fill required fields'); return }
    if (editCat) {
      setCatList(prev => prev.map(c => c.id === editCat.id ? { ...c, ...catForm } : c))
      toast.success('Category updated'); setEditCat(null)
    } else {
      setCatList(prev => [...prev, { id: 'cat-' + Date.now(), name_en: catForm.name_en, name_ar: catForm.name_ar, icon: catForm.icon, description: catForm.description, display_order: catList.length + 1, is_visible: true }])
      toast.success('Category added'); setShowAddCat(false)
    }
    setCatForm({ name_en: '', name_ar: '', icon: '', description: '' })
  }
  const openEditCat = (cat: Category) => { setEditCat(cat); setCatForm({ name_en: cat.name_en, name_ar: cat.name_ar, icon: cat.icon, description: cat.description }); setShowAddCat(true) }
  const deleteCategory = (id: string) => {
    if (services.some(s => s.category_id === id)) { toast.error('Cannot delete: category has services'); return }
    setCatList(prev => prev.filter(c => c.id !== id)); toast.success('Category deleted')
  }

  const handleSendEmail = () => {
    if (!emailForm.subject || !emailForm.body) { toast.error('Fill subject and body'); return }
    toast.success('Email sent to ' + emailModal?.email)
    setEmailModal(null); setEmailForm({ subject: '', body: '' })
  }

  const handleDownloadPDF = (name: string) => {
    toast.success('PDF report for ' + name + ' downloaded')
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'requests', label: 'All Requests' }, { key: 'services', label: 'Services' },
    { key: 'visa', label: 'Visa Management' }, { key: 'companies', label: 'Companies' },
    { key: 'staff', label: 'Staff' }, { key: 'categories', label: 'Categories' },
    { key: 'approvals', label: 'Approvals' }, { key: 'individuals', label: 'Individuals' },
    { key: 'analytics', label: 'Analytics' },
  ]

  const serviceChartData = [
    { name: 'Visa', count: requests.filter(r => r.category_name.includes('Visa')).length },
    { name: 'Translation', count: requests.filter(r => r.category_name.includes('Translation')).length },
    { name: 'Shipping', count: requests.filter(r => r.category_name.includes('Shipping')).length },
    { name: 'Transport', count: requests.filter(r => r.category_name.includes('Transport')).length },
  ]
  const pieData = [
    { name: 'Paid', value: requests.filter(r => r.payment_status === 'paid').length, color: '#16A34A' },
    { name: 'Pending', value: requests.filter(r => r.payment_status === 'pending').length, color: '#D97706' },
    { name: 'Failed', value: requests.filter(r => r.payment_status === 'failed').length, color: '#DC2626' },
  ]

  const storedUsers = getUsers()
  const seedUsers = [
    { name: 'zaid', email: 'zaid@outlook.com', phone: '123545', country: 'Jordan', flag: '🇯🇴' },
    { name: 'Ali Khaled', email: 'alikhaled.iraqi@gmail.com', phone: '07712383920', country: 'Iraq', flag: '🇮🇶' },
    { name: 'Zaid Sous', email: 'zaidsouse_123@hotmail.com', phone: '0796137019', country: 'Jordan', flag: '🇯🇴' },
  ]
  const storedEmails = new Set(storedUsers.map(u => u.email))
  const mergedUsers = [
    ...storedUsers.map(u => ({ name: u.name, email: u.email, phone: u.dial_code + ' ' + u.phone, country: u.country, flag: u.flag })),
    ...seedUsers.filter(u => !storedEmails.has(u.email)),
  ]
  const individuals = mergedUsers.map(u => ({
    ...u,
    services: requests.filter(r => r.user_email === u.email).length,
    total: requests.filter(r => r.user_email === u.email).reduce((s, r) => s + r.price, 0),
  }))

  const serviceModal = showAddService || editService !== null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">Zaid Tours</Link>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">
              <Shield className="w-4 h-4" /> Admin Panel
            </button>
            <span className="text-sm text-gray-600">Zaid Sous</span>
            <button onClick={() => { document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'; toast.success('Logged out'); setTimeout(() => router.push('/'), 500) }}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage all service requests and users</p>
          </div>
          <button onClick={() => toast.success('Data refreshed')} className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: totalReqs, color: 'text-gray-900' },
            { label: 'Pending', value: pending, color: 'text-yellow-600' },
            { label: 'Processing', value: processing, color: 'text-blue-600' },
            { label: 'Completed', value: completed, color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center">
              <p className="text-xs text-gray-400 mb-2">{s.label}</p>
              <p className={['text-4xl font-bold', s.color].join(' ')}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-100">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={['px-4 py-3.5 text-sm font-medium whitespace-nowrap transition', tab === t.key ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-900'].join(' ')}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ─── ALL REQUESTS ─── */}
            {tab === 'requests' && (
              <div>
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <div><h2 className="text-lg font-semibold">All Requests</h2><p className="text-sm text-gray-500">View and manage service requests</p></div>
                  <div className="flex gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100">
                      {['Request', 'User', 'Service', 'Date', 'Price', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {filteredRequests.map(req => (
                        <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="py-3 px-3">
                            <p className="font-mono text-xs text-gray-500">{req.request_number}</p>
                            {req.return_reason && <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded mt-0.5 inline-block">Returned</span>}
                          </td>
                          <td className="py-3 px-3 font-medium">{req.user_name}</td>
                          <td className="py-3 px-3 text-gray-700 max-w-32 truncate">{req.service_name}</td>
                          <td className="py-3 px-3 text-gray-500 text-xs">{new Date(req.created_at).toLocaleDateString()}</td>
                          <td className="py-3 px-3 font-semibold">{req.price} USD</td>
                          <td className="py-3 px-3">
                            <span className={['text-xs font-medium px-2.5 py-1 rounded-full capitalize', svcBadge[req.service_status] || 'bg-gray-100 text-gray-600'].join(' ')}>{req.service_status}</span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1 flex-wrap">
                              <button onClick={() => setDocsModal(req)} title="View Documents" className="p-1.5 hover:bg-blue-50 rounded-lg transition">
                                <Paperclip className="w-4 h-4 text-blue-500" />
                              </button>
                              <button onClick={() => setReturnModal({ id: req.id, reason: req.return_reason || '' })} title="Return to User" className="p-1.5 hover:bg-orange-50 rounded-lg transition">
                                <RotateCcw className="w-4 h-4 text-orange-500" />
                              </button>
                              <select value={req.service_status} onChange={e => updateStatus(req.id, e.target.value as ServiceStatus)}
                                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <button onClick={() => setDeleteConfirm(req.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Delete confirm */}
                {deleteConfirm && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
                      <h3 className="font-semibold mb-2">Delete Request?</h3>
                      <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
                      <div className="flex gap-3">
                        <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                        <button onClick={() => deleteRequest(deleteConfirm)} className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700">Delete</button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Docs modal */}
                {docsModal && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
                      <input ref={adminFileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden"
                        onChange={async e => {
                          const files = Array.from(e.target.files || [])
                          if (!files.length || !docsModal) return
                          // Read base64 and embed directly in request object so user can download cross-session
                          const fileEntries: Array<{name: string, data: string}> = await Promise.all(
                            files.map(f => new Promise<{name: string, data: string}>((resolve, reject) => {
                              const reader = new FileReader()
                              reader.onload = () => resolve({ name: f.name, data: reader.result as string })
                              reader.onerror = reject
                              reader.readAsDataURL(f)
                            }))
                          )
                          const names = fileEntries.map(fe => fe.name)
                          const newData = Object.fromEntries(fileEntries.map(fe => [fe.name, fe.data]))
                          setRequests(prev => {
                            const u: Request[] = prev.map(r => r.id === docsModal.id
                              ? { ...r,
                                  admin_files: [...(r.admin_files || []), ...names],
                                  admin_file_data: { ...(r.admin_file_data || {}), ...newData }
                                }
                              : r)
                            saveRequests(u)
                            return u
                          })
                          setDocsModal(prev => prev ? {
                            ...prev,
                            admin_files: [...(prev.admin_files || []), ...names],
                            admin_file_data: { ...(prev.admin_file_data || {}), ...newData }
                          } : prev)
                          if (adminFileRef.current) adminFileRef.current.value = ''
                          toast.success(files.length + ' file(s) sent to user!')
                        }}
                      />
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Documents — {docsModal.request_number}</h3>
                        <button onClick={() => setDocsModal(null)}><X className="w-4 h-4 text-gray-400" /></button>
                      </div>

                      {/* User uploaded files */}
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">User Documents</p>
                      {docsModal.uploaded_files && docsModal.uploaded_files.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {docsModal.uploaded_files.map((f, i) => {
                            const data = getUserFile(docsModal.id, f)
                            return (
                              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-2">
                                  <Paperclip className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-700">{f}</span>
                                </div>
                                {data ? (
                                  <button onClick={() => downloadFile(data, f)} className="p-1.5 hover:bg-blue-50 rounded-lg" title="Download">
                                    <Download className="w-4 h-4 text-blue-500" />
                                  </button>
                                ) : (
                                  <span className="text-xs text-gray-400 px-2">Demo file</span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-3 mb-4">No documents uploaded</p>
                      )}

                      {/* Admin send file section */}
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Send Document to User</p>
                        {docsModal.admin_files && docsModal.admin_files.length > 0 && (
                          <div className="space-y-1.5 mb-3">
                            {docsModal.admin_files.map((f, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                                <Paperclip className="w-3.5 h-3.5 text-green-600 shrink-0" />
                                <span className="text-xs text-green-700 flex-1 truncate">{f}</span>
                                <span className="text-xs text-green-500">Sent ✓</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <button onClick={() => adminFileRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-blue-200 rounded-xl text-sm text-blue-600 hover:bg-blue-50 transition">
                          <Plus className="w-4 h-4" /> Upload & Send File to User
                        </button>
                      </div>

                      <button onClick={() => setDocsModal(null)} className="w-full mt-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Close</button>
                    </div>
                  </div>
                )}
                {/* Return modal */}
                {returnModal && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Return Request to User</h3>
                        <button onClick={() => setReturnModal(null)}><X className="w-4 h-4 text-gray-400" /></button>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">The user will see your message and be asked to resubmit with corrections.</p>
                      <textarea
                        value={returnModal.reason}
                        onChange={e => setReturnModal(prev => prev ? { ...prev, reason: e.target.value } : null)}
                        rows={4} placeholder="e.g. Please provide a clearer scan of your passport..."
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none mb-4" />
                      <div className="flex gap-3">
                        <button onClick={() => setReturnModal(null)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                        <button onClick={handleReturnRequest} className="flex-1 py-2 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600">Return Request</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── SERVICE MANAGEMENT ─── */}
            {tab === 'services' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div><h2 className="text-lg font-semibold">Service Management</h2><p className="text-sm text-gray-500">Manage services, pricing and visibility</p></div>
                  <button onClick={() => { setEditService(null); setNewService({ name_en: '', name_ar: '', category_id: 'cat-1', price: '', description: '', reqInput: '' }); setServiceReqs([]); setShowAddService(true) }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                    <Plus className="w-4 h-4" /> Add Service
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100">
                      {['Service', 'Category', 'Price', 'Requirements', 'Visible', 'Actions'].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {services.map(svc => {
                        const cat = catList.find(c => c.id === svc.category_id)
                        return (
                          <tr key={svc.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                            <td className="py-3 px-3">
                              <p className="font-medium text-gray-900">{svc.name_en}</p>
                              <p className="text-xs text-gray-400">{svc.name_ar}</p>
                            </td>
                            <td className="py-3 px-3"><span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{cat?.name_en}</span></td>
                            <td className="py-3 px-3 font-semibold">{svc.price} USD</td>
                            <td className="py-3 px-3 text-gray-500 text-xs">{svc.requirements.length > 0 ? svc.requirements.slice(0, 2).join(', ') + (svc.requirements.length > 2 ? '...' : '') : 'None'}</td>
                            <td className="py-3 px-3">
                              <button onClick={() => toggleServiceVisibility(svc.id)}
                                className={['relative inline-flex h-5 w-9 rounded-full transition', svc.is_visible ? 'bg-blue-600' : 'bg-gray-300'].join(' ')}>
                                <span className={['inline-block h-4 w-4 transform rounded-full bg-white shadow transition mt-0.5', svc.is_visible ? 'translate-x-4' : 'translate-x-0.5'].join(' ')} />
                              </button>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex gap-1">
                                <button onClick={() => handleOpenEditService(svc)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-500" /></button>
                                <button onClick={() => deleteService(svc.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Add/Edit Service Modal */}
                {serviceModal && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-gray-900">{editService ? 'Edit Service' : 'Add New Service'}</h3>
                        <button onClick={() => { setShowAddService(false); setEditService(null) }}><X className="w-4 h-4 text-gray-400" /></button>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          {[['name_en', 'Name (English)', 'text'], ['name_ar', 'Name (Arabic)', 'text']].map(([k, label]) => (
                            <div key={k}>
                              <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
                              <input type="text" value={newService[k as keyof typeof newService]} onChange={e => setNewService(p => ({ ...p, [k]: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Price (USD)</label>
                            <input type="number" value={newService.price} onChange={e => setNewService(p => ({ ...p, price: e.target.value }))}
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Category</label>
                            <select value={newService.category_id} onChange={e => setNewService(p => ({ ...p, category_id: e.target.value }))}
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                              {catList.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
                          <textarea value={newService.description} onChange={e => setNewService(p => ({ ...p, description: e.target.value }))} rows={2}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-2 block">Requirements</label>
                          <div className="flex gap-2 mb-2">
                            <input value={newService.reqInput} onChange={e => setNewService(p => ({ ...p, reqInput: e.target.value }))}
                              onKeyDown={e => { if (e.key === 'Enter' && newService.reqInput.trim()) { setServiceReqs(p => [...p, newService.reqInput.trim()]); setNewService(p => ({ ...p, reqInput: '' })) } }}
                              placeholder="Type requirement and press Enter"
                              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button onClick={() => { if (newService.reqInput.trim()) { setServiceReqs(p => [...p, newService.reqInput.trim()]); setNewService(p => ({ ...p, reqInput: '' })) } }}
                              className="px-3 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200"><Plus className="w-4 h-4" /></button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {serviceReqs.map((r, i) => (
                              <span key={i} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                                {r}
                                <button onClick={() => setServiceReqs(p => p.filter((_, j) => j !== i))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-5">
                        <button onClick={() => { setShowAddService(false); setEditService(null) }} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSaveService} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700">{editService ? 'Save Changes' : 'Add Service'}</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── VISA MANAGEMENT ─── */}
            {tab === 'visa' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div><h2 className="text-lg font-semibold">Visa & Nationality Management</h2><p className="text-sm text-gray-500">Manage nationalities, destinations and visa types</p></div>
                  <button onClick={() => openVisaModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                    <Plus className="w-4 h-4" /> Add Nationality
                  </button>
                </div>
                <div className="space-y-3">
                  {visaList.map(vn => (
                    <div key={vn.id} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{vn.flag_emoji}</span>
                          <div>
                            <p className="font-medium text-gray-900">{vn.nationality}</p>
                            <p className="text-xs text-gray-400">{vn.visa_types.length} visa types · {vn.destinations.length} destinations</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openVisaModal(vn)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-500" /></button>
                          <button onClick={() => deleteVisa(vn.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="text-xs font-medium text-gray-500 mr-1">Visa types:</span>
                        {vn.visa_types.map(t => <span key={t} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{t}</span>)}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs font-medium text-gray-500 mr-1">Destinations:</span>
                        {vn.destinations.map(d => <span key={d} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{d}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Visa Add/Edit Modal */}
                {showAddVisa && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold">{editVisa ? 'Edit Nationality' : 'Add Nationality'}</h3>
                        <button onClick={() => setShowAddVisa(false)}><X className="w-4 h-4 text-gray-400" /></button>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Nationality</label>
                            <input value={visaForm.nationality} onChange={e => setVisaForm(p => ({ ...p, nationality: e.target.value }))}
                              placeholder="e.g. Jordan" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Flag Emoji</label>
                            <input value={visaForm.flag_emoji} onChange={e => setVisaForm(p => ({ ...p, flag_emoji: e.target.value }))}
                              placeholder="🇯🇴" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-2 block">Visa Types</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {['Tourist', 'Work', 'Business', 'Student', 'Transit', 'Family'].map(vt => (
                              <button key={vt} onClick={() => setVisaForm(p => ({ ...p, visa_types: p.visa_types.includes(vt) ? p.visa_types.filter(x => x !== vt) : [...p.visa_types, vt] }))}
                                className={['text-xs px-3 py-1.5 rounded-full border transition', visaForm.visa_types.includes(vt) ? 'bg-green-100 text-green-700 border-green-300' : 'border-gray-200 text-gray-600 hover:border-gray-300'].join(' ')}>
                                {visaForm.visa_types.includes(vt) ? '✓ ' : ''}{vt}
                              </button>
                            ))}
                          </div>
                        </div>
                        {visaForm.visa_types.length > 0 && (
                          <div>
                            <label className="text-xs font-medium text-gray-600 mb-2 block">Prices per Visa Type (USD)</label>
                            <div className="space-y-2">
                              {visaForm.visa_types.map(vt => (
                                <div key={vt} className="flex items-center gap-3">
                                  <span className="text-sm text-gray-700 w-24 shrink-0">{vt}</span>
                                  <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                                    <input type="number" min="0" value={visaForm.visa_prices[vt] ?? ''} onChange={e => setVisaForm(p => ({ ...p, visa_prices: { ...p.visa_prices, [vt]: Number(e.target.value) } }))} placeholder="0" className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                  <span className="text-xs text-gray-400">USD</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {visaForm.visa_types.length > 0 && visaForm.destinations.length > 0 && (
                          <div>
                            <label className="text-xs font-medium text-gray-600 mb-2 block">Requirements per Destination & Visa Type</label>
                            <div className="flex gap-2 mb-3">
                              <select
                                value={visaForm.reqDest}
                                onChange={e => setVisaForm(p => ({ ...p, reqDest: e.target.value }))}
                                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              >
                                {visaForm.destinations.map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                            </div>
                            {visaForm.reqDest && (
                              <div className="space-y-3">
                                {visaForm.visa_types.map(vt => {
                                  const comboKey = `${visaForm.reqDest}_${vt}`
                                  return (
                                    <div key={vt} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                                      <p className="text-xs font-semibold text-gray-700 mb-2">{visaForm.reqDest} — {vt} Visa</p>
                                      <div className="flex gap-2 mb-2">
                                        <input
                                          value={visaForm.reqInput[comboKey] || ''}
                                          onChange={e => setVisaForm(p => ({ ...p, reqInput: { ...p.reqInput, [comboKey]: e.target.value } }))}
                                          onKeyDown={e => { if (e.key === 'Enter') { const val = (visaForm.reqInput[comboKey] || '').trim(); if (val) setVisaForm(p => ({ ...p, visa_reqs: { ...p.visa_reqs, [comboKey]: [...(p.visa_reqs[comboKey] || []), val] }, reqInput: { ...p.reqInput, [comboKey]: '' } })) } }}
                                          placeholder="Add requirement + Enter"
                                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        />
                                        <button onClick={() => { const val = (visaForm.reqInput[comboKey] || '').trim(); if (val) setVisaForm(p => ({ ...p, visa_reqs: { ...p.visa_reqs, [comboKey]: [...(p.visa_reqs[comboKey] || []), val] }, reqInput: { ...p.reqInput, [comboKey]: '' } })) }} className="px-2 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"><Plus className="w-3 h-3" /></button>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        {(visaForm.visa_reqs[comboKey] || []).map((req, i) => (
                                          <div key={i} className="flex items-center justify-between bg-white rounded-lg px-2 py-1 border border-gray-100">
                                            <span className="text-xs text-gray-700">• {req}</span>
                                            <button onClick={() => setVisaForm(p => ({ ...p, visa_reqs: { ...p.visa_reqs, [comboKey]: (p.visa_reqs[comboKey] || []).filter((_, j) => j !== i) } }))} className="text-red-400 hover:text-red-600 ml-2"><X className="w-3 h-3" /></button>
                                          </div>
                                        ))}
                                        {(visaForm.visa_reqs[comboKey] || []).length === 0 && <p className="text-xs text-gray-400 italic">No requirements added yet</p>}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )}
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-2 block">Destinations</label>
                          <div className="flex gap-2 mb-2">
                            <input value={visaForm.destInput} onChange={e => setVisaForm(p => ({ ...p, destInput: e.target.value }))}
                              onKeyDown={e => { if (e.key === 'Enter' && visaForm.destInput.trim()) { setVisaForm(p => ({ ...p, destinations: [...p.destinations, p.destInput.trim()], destInput: '' })) } }}
                              placeholder="Country name + Enter" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button onClick={() => { if (visaForm.destInput.trim()) setVisaForm(p => ({ ...p, destinations: [...p.destinations, p.destInput.trim()], destInput: '' })) }}
                              className="px-3 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200"><Plus className="w-4 h-4" /></button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {visaForm.destinations.map((d, i) => (
                              <span key={i} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                                {d}
                                <button onClick={() => setVisaForm(p => ({ ...p, destinations: p.destinations.filter((_, j) => j !== i) }))}><X className="w-3 h-3" /></button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-5">
                        <button onClick={() => setShowAddVisa(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSaveVisa} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700">{editVisa ? 'Save Changes' : 'Add Nationality'}</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── COMPANIES ─── */}
            {tab === 'companies' && (
              <div>
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <div><h2 className="text-lg font-semibold">Companies Management</h2><p className="text-sm text-gray-500">Manage company accounts and send communications</p></div>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={companySearch} onChange={e => setCompanySearch(e.target.value)} placeholder="Search companies..."
                      className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-52" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100">
                      {['Company', 'Contact', 'Country', 'Services', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {filteredCompanies.map(co => (
                        <tr key={co.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="py-3 px-3 font-medium">{co.name}</td>
                          <td className="py-3 px-3 text-gray-500 text-xs">{co.email}<br />{co.phone}</td>
                          <td className="py-3 px-3">{co.country === 'Jordan' ? '🇯🇴' : '🌍'} {co.country}</td>
                          <td className="py-3 px-3">{co.total_services}</td>
                          <td className="py-3 px-3"><span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 capitalize">{co.status}</span></td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1 flex-wrap">
                              <button onClick={() => toast.info('Viewing ' + co.name)} className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                                <Eye className="w-3 h-3" /> View
                              </button>
                              <button onClick={() => { setEmailModal({ email: co.email, name: co.name }); setEmailForm({ subject: 'Message from Zaid Tours — ' + co.name, body: '' }) }}
                                className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                                <Mail className="w-3 h-3" /> Email
                              </button>
                              <button onClick={() => handleDownloadPDF(co.name)}
                                className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                                <Download className="w-3 h-3" /> PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── STAFF ─── */}
            {tab === 'staff' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div><h2 className="text-lg font-semibold">Staff Management</h2><p className="text-sm text-gray-500">Manage staff accounts and permissions</p></div>
                  <button onClick={() => setShowAddStaff(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                    <Plus className="w-4 h-4" /> Add Staff
                  </button>
                </div>
                {staffList.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">👥</div>
                    <p className="text-gray-500 font-medium">No staff members yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add staff members and set their permissions</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {staffList.map(s => (
                      <div key={s.id} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{s.name}</p>
                            <p className="text-xs text-gray-500">{s.email} · <span className="capitalize">{s.role}</span></p>
                          </div>
                          <button onClick={() => deleteStaff(s.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {s.permissions.length > 0 ? s.permissions.map(p => (
                            <span key={p} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{p}</span>
                          )) : <span className="text-xs text-gray-400">No permissions assigned</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {showAddStaff && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold">Add Staff Member</h3>
                        <button onClick={() => setShowAddStaff(false)}><X className="w-4 h-4 text-gray-400" /></button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">Full Name</label>
                          <input value={staffForm.name} onChange={e => setStaffForm(p => ({ ...p, name: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
                          <input value={staffForm.email} onChange={e => setStaffForm(p => ({ ...p, email: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">Role</label>
                          <select value={staffForm.role} onChange={e => setStaffForm(p => ({ ...p, role: e.target.value as 'manager' | 'agent' | 'support' }))}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="manager">Manager</option>
                            <option value="agent">Agent</option>
                            <option value="support">Support</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-2 block">Permissions</label>
                          <div className="grid grid-cols-2 gap-2">
                            {ALL_PERMISSIONS.map(perm => (
                              <button key={perm} onClick={() => togglePermission(perm)}
                                className={['flex items-center gap-2 text-xs p-2.5 rounded-xl border transition text-left', staffForm.permissions.includes(perm) ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'].join(' ')}>
                                <div className={['w-4 h-4 rounded flex items-center justify-center shrink-0', staffForm.permissions.includes(perm) ? 'bg-blue-600' : 'border border-gray-300'].join(' ')}>
                                  {staffForm.permissions.includes(perm) && <Check className="w-2.5 h-2.5 text-white" />}
                                </div>
                                {perm}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-5">
                        <button onClick={() => setShowAddStaff(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSaveStaff} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700">Add Staff</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── CATEGORIES ─── */}
            {tab === 'categories' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div><h2 className="text-lg font-semibold">Category Management</h2><p className="text-sm text-gray-500">Add and manage service categories</p></div>
                  <button onClick={() => { setEditCat(null); setCatForm({ name_en: '', name_ar: '', icon: '', description: '' }); setShowAddCat(true) }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                </div>
                <div className="space-y-3">
                  {catList.map((cat, i) => (
                    <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl w-8 text-center font-bold text-gray-300">{i + 1}</span>
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{cat.name_en}</p>
                          <p className="text-sm text-gray-400">{cat.name_ar} · {services.filter(s => s.category_id === cat.id).length} services</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditCat(cat)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-500" /></button>
                        <button onClick={() => deleteCategory(cat.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                {showAddCat && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold">{editCat ? 'Edit Category' : 'Add Category'}</h3>
                        <button onClick={() => { setShowAddCat(false); setEditCat(null) }}><X className="w-4 h-4 text-gray-400" /></button>
                      </div>
                      <div className="space-y-3">
                        {[['name_en', 'Name (English)'], ['name_ar', 'Name (Arabic)'], ['icon', 'Icon (emoji)'], ['description', 'Description']].map(([k, label]) => (
                          <div key={k}>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
                            <input value={catForm[k as keyof typeof catForm]} onChange={e => setCatForm(p => ({ ...p, [k]: e.target.value }))}
                              placeholder={k === 'icon' ? '📄' : ''}
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3 mt-5">
                        <button onClick={() => { setShowAddCat(false); setEditCat(null) }} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSaveCategory} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700">{editCat ? 'Save' : 'Add'}</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── APPROVALS ─── */}
            {tab === 'approvals' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Pending Approvals</h2>
                  <p className="text-sm text-gray-500 mb-4">Review and approve company registrations</p>
                  <div className="text-center py-10 bg-gray-50 rounded-xl text-gray-400">
                    <p className="text-4xl mb-2">✓</p><p>No pending approvals</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4">Approved Companies</h2>
                  {initCompanies.filter(c => c.status === 'active').map(co => (
                    <div key={co.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-green-50">
                      <div>
                        <p className="font-semibold text-gray-900">{co.name}</p>
                        <p className="text-sm text-gray-500">{co.email} · {co.country === 'Jordan' ? '🇯🇴' : '🌍'} {co.country}</p>
                      </div>
                      <button onClick={() => toast.error('Revoke access: ' + co.name)} className="text-sm text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">Revoke</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── INDIVIDUALS ─── */}
            {tab === 'individuals' && (
              <div>
                <h2 className="text-lg font-semibold mb-1">Individuals Management</h2>
                <p className="text-sm text-gray-500 mb-5">Manage individual accounts and service history</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100">
                      {['Name', 'Contact', 'Country', 'Requests', 'Total', 'Actions'].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {individuals.map((u, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="py-3 px-3 font-medium">{u.name}</td>
                          <td className="py-3 px-3 text-gray-500 text-xs">{u.email}<br />{u.phone}</td>
                          <td className="py-3 px-3">{u.flag} {u.country}</td>
                          <td className="py-3 px-3">{u.services}</td>
                          <td className="py-3 px-3 font-semibold">{u.total} USD</td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1 flex-wrap">
                              <button onClick={() => setViewIndModal({ name: u.name, email: u.email })}
                                className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                                <Eye className="w-3 h-3" /> View
                              </button>
                              <button onClick={() => { setEmailModal({ email: u.email, name: u.name }); setEmailForm({ subject: 'Message from Zaid Tours', body: 'Dear ' + u.name + ',' }) }}
                                className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                                <Mail className="w-3 h-3" /> Email
                              </button>
                              <button onClick={() => handleDownloadPDF(u.name)}
                                className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                                <Download className="w-3 h-3" /> PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* View Individual Modal */}
                {viewIndModal && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[80vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h3 className="font-semibold">{viewIndModal.name}</h3>
                          <p className="text-xs text-gray-400">{viewIndModal.email}</p>
                        </div>
                        <button onClick={() => setViewIndModal(null)}><X className="w-4 h-4 text-gray-400" /></button>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Service History</h4>
                      {requests.filter(r => r.user_email === viewIndModal.email).length > 0 ? (
                        <div className="space-y-2">
                          {requests.filter(r => r.user_email === viewIndModal.email).map(req => (
                            <div key={req.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{req.service_name}</p>
                                <p className="text-xs text-gray-400">{req.request_number} · {new Date(req.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{req.price} USD</span>
                                <span className={['text-xs px-2 py-0.5 rounded-full font-medium capitalize', svcBadge[req.service_status]].join(' ')}>{req.service_status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-6">No requests found for this user</p>
                      )}
                      <div className="flex gap-3 mt-5">
                        <button onClick={() => handleDownloadPDF(viewIndModal.name)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" /> Download PDF
                        </button>
                        <button onClick={() => setViewIndModal(null)} className="flex-1 py-2 bg-gray-900 text-white rounded-xl text-sm hover:bg-gray-800">Close</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── ANALYTICS ─── */}
            {tab === 'analytics' && (
              <div>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <div><h2 className="text-lg font-semibold">Analytics</h2><p className="text-sm text-gray-500">Revenue and service statistics</p></div>
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"><option>Last Month</option><option>Last 3 Months</option></select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Orders', value: totalReqs, icon: '📋' },
                    { label: 'Total Revenue', value: '$' + totalRevenue.toFixed(0), icon: '💰' },
                    { label: 'Paid Revenue', value: '$' + paidRevenue.toFixed(0), icon: '✅' },
                    { label: 'Pending Revenue', value: '$' + pendingRevenue.toFixed(0), icon: '⏳' },
                  ].map(s => (
                    <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-2"><span>{s.icon}</span><p className="text-xs text-gray-400">{s.label}</p></div>
                      <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">Requests by Service</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={serviceChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" fontSize={12} />
                        <YAxis dataKey="name" type="category" fontSize={12} width={80} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">Payment Status</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => name + ': ' + value}>
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Email Modal (shared) */}
      {emailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div><h3 className="font-semibold">Send Email</h3><p className="text-xs text-gray-400">To: {emailModal.email}</p></div>
              <button onClick={() => setEmailModal(null)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Subject</label>
                <input value={emailForm.subject} onChange={e => setEmailForm(p => ({ ...p, subject: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Message</label>
                <textarea value={emailForm.body} onChange={e => setEmailForm(p => ({ ...p, body: e.target.value }))} rows={5}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Type your message..." />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEmailModal(null)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSendEmail} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
