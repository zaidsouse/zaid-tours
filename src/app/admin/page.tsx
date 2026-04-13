'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, CartesianGrid } from 'recharts'
import { LogOut, RefreshCw, Shield, Trash2, Eye, Pencil, Plus, Search } from 'lucide-react'
import { requests as initRequests, services as initServices, companies, categories, visaNationalities, staff as initStaff } from '@/lib/mock-data'
import { Request, Service, PaymentStatus, ServiceStatus } from '@/lib/types'

const payBadge: Record<PaymentStatus, string> = { paid: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', failed: 'bg-red-100 text-red-700' }
const svcBadge: Record<ServiceStatus, string> = { completed: 'bg-green-100 text-green-700', processing: 'bg-blue-100 text-blue-700', pending: 'bg-yellow-100 text-yellow-700', cancelled: 'bg-gray-100 text-gray-600' }

type Tab = 'requests' | 'services' | 'visa' | 'companies' | 'staff' | 'categories' | 'approvals' | 'individuals' | 'analytics'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('requests')
  const [requests, setRequests] = useState<Request[]>(initRequests)
  const [services, setServices] = useState<Service[]>(initServices)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [showAddService, setShowAddService] = useState(false)
  const [newService, setNewService] = useState({ name_en: '', name_ar: '', category_id: 'cat-1', price: '', description: '' })

  const totalReqs = requests.length
  const pending = requests.filter(r => r.service_status === 'pending').length
  const processing = requests.filter(r => r.service_status === 'processing').length
  const completed = requests.filter(r => r.service_status === 'completed').length

  // Analytics calculations (FIXED)
  const paidRevenue = requests.filter(r => r.payment_status === 'paid').reduce((s, r) => s + r.price, 0)
  const pendingRevenue = requests.filter(r => r.payment_status === 'pending').reduce((s, r) => s + r.price, 0)
  const totalRevenue = requests.reduce((s, r) => s + r.price, 0)

  const filteredRequests = requests.filter(r => {
    const matchSearch = r.user_name.toLowerCase().includes(search.toLowerCase()) || r.request_number.toLowerCase().includes(search.toLowerCase()) || r.service_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.service_status === statusFilter
    return matchSearch && matchStatus
  })

  const updateStatus = (id: string, status: ServiceStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, service_status: status } : r))
    toast.success('Status updated successfully')
  }

  const deleteRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id != id))
    setDeleteConfirm(null)
    toast.success('Request deleted')
  }

  const toggleServiceVisibility = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, is_visible: !s.is_visible } : s))
    toast.success('Visibility updated')
  }

  const addService = () => {
    if (!newService.name_en || !newService.price) { toast.error('Please fill required fields'); return }
    const svc: Service = {
      id: `svc-${Date.now()}`, name_en: newService.name_en, name_ar: newService.name_ar,
      category_id: newService.category_id, price: Number(newService.price),
      description: newService.description, requirements: [], is_visible: true,
    }
    setServices(prev => [...prev, svc])
    setShowAddService(false)
    setNewService({ name_en: '', name_ar: '', category_id: 'cat-1', price: '', description: '' })
    toast.success('Service added successfully')
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'requests', label: 'All Requests' }, { key: 'services', label: 'Service Management' },
    { key: 'visa', label: 'Visa Management' }, { key: 'companies', label: 'Companies' },
    { key: 'staff', label: 'Staff Management' }, { key: 'categories', label: 'Categories' },
    { key: 'approvals', label: 'Approvals' }, { key: 'individuals', label: 'Individuals' },
    { key: 'analytics', label: 'Analytics' },
  ]

  const serviceChartData = [
    { name: 'Visa', count: requests.filter(r => r.category_name.includes('Visa')).length },
    { name: 'Translation', count: requests.filter(r => r.category_name.includes('Translation')).length },
    { name: 'Shipping', count: requests.filter(r => r.category_name.includes('Shipping')).length },
  ]
  const pieData = [
    { name: 'Paid', value: requests.filter(r => r.payment_status === 'paid').length, color: '#16A34A' },
    { name: 'Pending', value: requests.filter(r => r.payment_status === 'pending').length, color: '#D97706' },
    { name: 'Failed', value: requests.filter(r => r.payment_status === 'failed').length, color: '#DC2626' },
  ]
  const revenueData = [{ month: 'Apr 2026', revenue: totalRevenue }]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">Zaid Tours</Link>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">
              <Shield className="w-4 h-4" /> Admin Panel
            </button>
            <span className="text-sm text-gray-600">Zaid Sous</span>
            <button onClick={() => { toast.success('Logged out'); setTimeout(() => router.push('/'), 500) }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage all service requests and users</p>
          </div>
          <button onClick={() => toast.success('Data refreshed')} className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Requests', value: totalReqs, color: 'text-gray-900' },
            { label: 'Pending', value: pending, color: 'text-yellow-600' },
            { label: 'Processing', value: processing, color: 'text-blue-600' },
            { label: 'Completed', value: completed, color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center">
              <p className="text-xs text-gray-400 mb-2">{s.label}</p>
              <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-100">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap transition ${tab === t.key ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* TAB: All Requests */}
            {tab === 'requests' && (
              <div>
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">All Requests</h2>
                    <p className="text-sm text-gray-500">View and manage all service requests</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests..."
                        className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-52" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                      {['Request ID', 'Country', 'User', 'Service', 'Date', 'Price', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {filteredRequests.map(req => (
                        <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="py-3 px-3 font-mono text-xs text-gray-500">{req.request_number}</td>
                          <td className="py-3 px-3">{req.country === 'Jordan' ? '🇯🇴' : '🌍'} {req.country}</td>
                          <td className="py-3 px-3 font-medium">{req.user_name}</td>
                          <td className="py-3 px-3 capitalize">{req.service_name.toLowerCase()}</td>
                          <td className="py-3 px-3 text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                          <td className="py-3 px-3 font-semibold">{req.price} USD</td>
                          <td className="py-3 px-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${svcBadge[req.service_status]}`}>{req.service_status}</span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => toast.info(`Request: ${req.request_number}`)} className="p-1.5 hover:bg-gray-100 rounded-lg transition"><Eye className="w-4 h-4 text-gray-500" /></button>
                              <select value={req.service_status} onChange={e => updateStatus(req.id, e.target.value as ServiceStatus)}
                                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <button onClick={() => setDeleteConfirm(req.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4 text-red-400" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {deleteConfirm && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Delete Request?</h3>
                      <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
                      <div className="flex gap-3">
                        <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                        <button onClick={() => deleteRequest(deleteConfirm)} className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Delete</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Service Management */}
            {tab === 'services' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Service Management</h2>
                    <p className="text-sm text-gray-500">Manage available services and pricing</p>
                  </div>
                  <button onClick={() => setShowAddService(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                    <Plus className="w-4 h-4" /> Add New Service
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100">
                      {['Service Name', 'Category', 'Price', 'Requirements', 'Visible', 'Actions'].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {services.map(svc => {
                        const cat = categories.find(c => c.id === svc.category_id)
                        return (
                          <tr key={svc.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                            <td className="py-3 px-3">
                              <div><p className="font-medium text-gray-900">{svc.name_en}</p><p className="text-xs text-gray-400">{svc.name_ar}</p></div>
                            </td>
                            <td className="py-3 px-3"><span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{cat?.name_en}</span></td>
                            <td className="py-3 px-3 font-semibold">{svc.price} USD</td>
                            <td className="py-3 px-3 text-gray-500">{svc.requirements.length} items</td>
                            <td className="py-3 px-3">
                              <button onClick={() => toggleServiceVisibility(svc.id)}
                                className={`relative inline-flex h-5 w-9 rounded-full transition ${svc.is_visible ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition mt-0.5 ${svc.is_visible ? 'translate-x-4' : 'translate-x-0.5'}`} />
                              </button>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex gap-1">
                                <button onClick={() => toast.info('Edit: ' + svc.name_en)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-500" /></button>
                                <button onClick={() => toast.error('Delete: ' + svc.name_en)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {showAddService && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
                      <h3 className="font-semibold text-gray-900 mb-5">Add New Service</h3>
                      <div className="space-y-3">
                        {[['name_en', 'Service Name (EN)', 'text'], ['name_ar', 'Service Name (AR)', 'text'], ['price', 'Price (USD)', 'number'], ['description', 'Description', 'text']].map(([k, label, type]) => (
                          <div key={k}>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
                            <input type={type} value={newService[k as keyof typeof newService]} onChange={e => setNewService(p => ({ ...p, [k]: e.target.value }))}
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        ))}
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">Category</label>
                          <select value={newService.category_id} onChange={e => setNewService(p => ({ ...p, category_id: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-5">
                        <button onClick={() => setShowAddService(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                        <button onClick={addService} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">Add Service</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Visa Management */}
            {tab === 'visa' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div><h2 className="text-lg font-semibold text-gray-900">Visa & Nationality Management</h2><p className="text-sm text-gray-500">Manage visa requirements by nationality</p></div>
                  <button onClick={() => toast.info('Add Nationality — Coming soon')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"><Plus className="w-4 h-4" /> Add Nationality</button>
                </div>
                <div className="space-y-3">
                  {visaNationalities.map(vn => (
                    <div key={vn.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{vn.flag_emoji}</span>
                        <div>
                          <p className="font-medium text-gray-900">{vn.nationality}</p>
                          <p className="text-sm text-gray-400">{vn.visa_types.length} visa types · {vn.destinations.length} destinations</p>
                        </div>
                      </div>
                      <button onClick={() => toast.info('Edit: ' + vn.nationality)} className="p-2 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-500" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Companies */}
            {tab === 'companies' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Companies Management</h2>
                <p className="text-sm text-gray-500 mb-5">Manage company accounts and invoices</p>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100">
                    {['Company', 'Contact', 'Services', 'Total Amount', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {companies.map(co => (
                      <tr key={co.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="py-3 px-3 font-medium">{co.name}</td>
                        <td className="py-3 px-3 text-gray-500">{co.email}<br /><span className="text-xs">{co.phone}</span></td>
                        <td className="py-3 px-3">{co.total_services}</td>
                        <td className="py-3 px-3 font-semibold">{co.total_amount} USD</td>
                        <td className="py-3 px-3"><span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 capitalize">{co.status}</span></td>
                        <td className="py-3 px-3">
                          <div className="flex gap-1">
                            <button onClick={() => toast.info('View: ' + co.name)} className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">View</button>
                            <button onClick={() => toast.info('PDF: ' + co.name)} className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">PDF</button>
                            <button onClick={() => toast.info('Email: ' + co.email)} className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">Email</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB: Staff */}
            {tab === 'staff' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div><h2 className="text-lg font-semibold text-gray-900">Staff Management</h2><p className="text-sm text-gray-500">Manage staff accounts and permissions</p></div>
                  <button onClick={() => toast.info('Add Staff Member — Coming soon')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"><Plus className="w-4 h-4" /> Add Staff Member</button>
                </div>
                {initStaff.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">👥</div>
                    <p className="text-gray-500 font-medium">No staff members yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add your first staff member to get started</p>
                  </div>
                ) : null}
              </div>
            )}

            {/* TAB: Categories */}
            {tab === 'categories' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div><h2 className="text-lg font-semibold text-gray-900">Category Management</h2><p className="text-sm text-gray-500">Manage service categories</p></div>
                  <button onClick={() => toast.info('Add Category — Coming soon')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"><Plus className="w-4 h-4" /> Add New Category</button>
                </div>
                <div className="space-y-3">
                  {categories.map((cat, i) => (
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
                        <button onClick={() => toast.info('Edit: ' + cat.name_en)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-500" /></button>
                        <button onClick={() => toast.error('Cannot delete category with services')} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Approvals */}
            {tab === 'approvals' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Pending Company Approvals</h2>
                  <p className="text-sm text-gray-500 mb-4">Review and approve company registrations</p>
                  <div className="text-center py-10 bg-gray-50 rounded-xl text-gray-400">
                    <p className="text-4xl mb-2">✓</p>
                    <p>No pending approvals</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Approved Companies</h2>
                  {companies.filter(c => c.status === 'active').map(co => (
                    <div key={co.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-green-50">
                      <div>
                        <p className="font-semibold text-gray-900">{co.name}</p>
                        <p className="text-sm text-gray-500">{co.email} · {co.phone} · {co.country === 'Jordan' ? '🇯🇴' : '🌍'} {co.country}</p>
                      </div>
                      <button onClick={() => toast.error('Revoke: ' + co.name)} className="text-sm text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">Revoke Access</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Individuals */}
            {tab === 'individuals' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Individuals Management</h2>
                <p className="text-sm text-gray-500 mb-5">Manage individual accounts and invoices</p>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100">
                    {['Name', 'Contact', 'Country', 'Services', 'Total Amount', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {[
                      { name: 'zaid', email: 'zaid@outlook.com', phone: '123545', country: 'Jordan', flag: '🇯🇴', services: 5, total: 270 },
                      { name: 'Ali20 khaled', email: 'alikhaled.iraqi@gmail.com', phone: '07712383920', country: 'Iraq', flag: '🇮🇶', services: 0, total: 0 },
                      { name: 'zaid', email: 'zaidsouse_123@hotmail.com', phone: '0796137019', country: 'Jordan', flag: '🇯🇴', services: 0, total: 0 },
                    ].map((u, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="py-3 px-3 font-medium">{u.name}</td>
                        <td className="py-3 px-3 text-gray-500">{u.email}<br /><span className="text-xs">{u.phone}</span></td>
                        <td className="py-3 px-3">{u.flag} {u.country}</td>
                        <td className="py-3 px-3">{u.services}</td>
                        <td className="py-3 px-3 font-semibold">{u.total} USD</td>
                        <td className="py-3 px-3">
                          <div className="flex gap-1">
                            <button onClick={() => toast.info('View: ' + u.name)} className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">View</button>
                            <button onClick={() => toast.info('PDF: ' + u.name)} className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">PDF</button>
                            <button onClick={() => toast.info('Email: ' + u.email)} className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">Email</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB: Analytics */}
            {tab === 'analytics' && (
              <div>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <div><h2 className="text-lg font-semibold text-gray-900">Data Analytics</h2><p className="text-sm text-gray-500">Comprehensive analysis of services and payments</p></div>
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"><option>Last Month</option><option>Last 3 Months</option><option>Last Year</option></select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Orders', value: totalReqs, icon: '📋', color: 'text-gray-900' },
                    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: '💰', color: 'text-gray-900' },
                    { label: 'Paid Revenue', value: `$${paidRevenue.toFixed(2)}`, icon: '✅', color: 'text-green-600' },
                    { label: 'Pending Revenue', value: `$${pendingRevenue.toFixed(2)}`, icon: '⏳', color: 'text-yellow-600' },
                  ].map(s => (
                    <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{s.icon}</span>
                        <p className="text-xs text-gray-400">{s.label}</p>
                      </div>
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">Most Requested Services</h3>
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
                    <h3 className="font-semibold text-gray-800 mb-4">Payment Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Revenue Over Time</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">Top Clients</h3>
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-gray-100"><th className="text-left py-2 text-xs text-gray-400">Rank</th><th className="text-left py-2 text-xs text-gray-400">Client</th><th className="text-left py-2 text-xs text-gray-400">Orders</th><th className="text-left py-2 text-xs text-gray-400">Revenue</th></tr></thead>
                      <tbody><tr className="border-b border-gray-50"><td className="py-2 font-bold text-yellow-500">1</td><td className="py-2 font-medium">zaid</td><td className="py-2">5</td><td className="py-2 font-semibold text-green-600">${totalRevenue.toFixed(2)}</td></tr></tbody>
                    </table>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">Outstanding Payments</h3>
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-gray-100"><th className="text-left py-2 text-xs text-gray-400">Client</th><th className="text-left py-2 text-xs text-gray-400">Unpaid Orders</th><th className="text-left py-2 text-xs text-gray-400">Amount</th><th className="text-left py-2 text-xs text-gray-400">Action</th></tr></thead>
                      <tbody><tr className="border-b border-gray-50">
                        <td className="py-2 font-medium">zaid</td>
                        <td className="py-2">{requests.filter(r => r.payment_status === 'pending').length}</td>
                        <td className="py-2 font-semibold text-yellow-600">${pendingRevenue.toFixed(2)}</td>
                        <td className="py-2"><button onClick={() => toast.success('Payment updated')} className="text-xs bg-blue-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-700">Update</button></td>
                      </tr></tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
