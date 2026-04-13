import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    })
    if (error) throw error
    return data
  },
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },
  async getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}

// Profile helpers
export const profilesService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles').select('*').eq('id', userId).single()
    if (error) throw error
    return data
  },
  async updateProfile(userId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('profiles').update(updates).eq('id', userId).select().single()
    if (error) throw error
    return data
  }
}

// Requests helpers
export const requestsService = {
  async getUserRequests(userId: string) {
    const { data, error } = await supabase
      .from('requests').select('*, services(name_en, categories(name_en))')
      .eq('user_id', userId).order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async getAllRequests() {
    const { data, error } = await supabase
      .from('requests').select('*, profiles(full_name, email), services(name_en)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async updateStatus(id: string, serviceStatus: string) {
    const { data, error } = await supabase
      .from('requests').update({ service_status: serviceStatus }).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteRequest(id: string) {
    const { error } = await supabase.from('requests').delete().eq('id', id)
    if (error) throw error
  },
  async createRequest(request: Record<string, unknown>) {
    const { data, error } = await supabase.from('requests').insert(request).select().single()
    if (error) throw error
    return data
  }
}

// Services helpers
export const servicesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('services').select('*, categories(name_en, name_ar)').order('created_at')
    if (error) throw error
    return data
  },
  async getVisible() {
    const { data, error } = await supabase
      .from('services').select('*, categories(name_en, name_ar)')
      .eq('is_visible', true).order('created_at')
    if (error) throw error
    return data
  },
  async toggleVisibility(id: string, isVisible: boolean) {
    const { error } = await supabase.from('services').update({ is_visible: isVisible }).eq('id', id)
    if (error) throw error
  },
  async create(service: Record<string, unknown>) {
    const { data, error } = await supabase.from('services').insert(service).select().single()
    if (error) throw error
    return data
  },
  async delete(id: string) {
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) throw error
  }
}

// Categories helpers
export const categoriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories').select('*').order('display_order')
    if (error) throw error
    return data
  }
}

// Companies helpers
export const companiesService = {
  async getAll() {
    const { data, error } = await supabase.from('companies').select('*').order('created_at')
    if (error) throw error
    return data
  }
}

// Analytics helpers
export const analyticsService = {
  async getSummary() {
    const { data: reqs } = await supabase.from('requests').select('price, payment_status, service_status, service_id, services(name_en)')
    if (!reqs) return null
    const totalRevenue = reqs.reduce((s, r) => s + r.price, 0)
    const paidRevenue = reqs.filter(r => r.payment_status === 'paid').reduce((s, r) => s + r.price, 0)
    const pendingRevenue = reqs.filter(r => r.payment_status === 'pending').reduce((s, r) => s + r.price, 0)
    return { totalOrders: reqs.length, totalRevenue, paidRevenue, pendingRevenue, requests: reqs }
  }
}
