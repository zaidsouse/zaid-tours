export type UserRole = 'admin' | 'individual' | 'company'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type ServiceStatus = 'pending' | 'processing' | 'completed' | 'cancelled'
export type CompanyStatus = 'pending' | 'active' | 'revoked'

export interface Profile {
  id: string
  full_name: string
  email: string
  phone?: string
  country?: string
  role: UserRole
  created_at: string
}

export interface Category {
  id: string
  name_en: string
  name_ar: string
  description: string
  icon: string
  display_order: number
  is_visible: boolean
}

export interface Service {
  id: string
  name_en: string
  name_ar: string
  category_id: string
  category?: Category
  price: number
  description: string
  requirements: string[]
  is_visible: boolean
}

export interface Company {
  id: string
  name: string
  email: string
  phone: string
  country: string
  status: CompanyStatus
  total_services: number
  total_amount: number
  created_at: string
}

export interface Request {
  id: string
  request_number: string
  user_id: string
  user_name: string
  user_email: string
  service_id: string
  service_name: string
  category_name: string
  country: string
  price: number
  payment_status: PaymentStatus
  service_status: ServiceStatus
  notes?: string
  uploaded_files?: string[]
  return_reason?: string
  visa_nationality?: string
  visa_destination?: string
  visa_type?: string
  created_at: string
  updated_at: string
}

export interface Staff {
  id: string
  name: string
  email: string
  role: 'manager' | 'agent' | 'support'
  permissions: string[]
  created_at: string
}

export interface VisaNationality {
  id: string
  nationality: string
  flag_emoji: string
  visa_types: string[]
  destinations: string[]
  visa_prices: Record<string, number>
}
