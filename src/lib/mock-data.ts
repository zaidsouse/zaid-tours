import { Category, Service, Request, Company, Staff, VisaNationality } from './types'

export const categories: Category[] = [
  { id: 'cat-1', name_en: 'Translation Services', name_ar: 'خدمات الترجمة', description: 'Professional document translation services', icon: '📄', display_order: 1, is_visible: true },
  { id: 'cat-2', name_en: 'Visa Services', name_ar: 'خدمات التأشيرات', description: 'Complete visa application and processing services', icon: '🌍', display_order: 2, is_visible: true },
  { id: 'cat-3', name_en: 'Shipping Services', name_ar: 'خدمات الشحن', description: 'Domestic and international shipping solutions', icon: '📦', display_order: 3, is_visible: true },
  { id: 'cat-4', name_en: 'Transportation Services', name_ar: 'خدمات النقل', description: 'Reliable transportation and logistics services', icon: '🚗', display_order: 4, is_visible: true },
]

export const services: Service[] = [
  { id: 'svc-1', name_en: 'Family Book Translation', name_ar: 'ترجمة دفتر العائلة', category_id: 'cat-1', price: 50, description: 'Professional family book translation with certified accuracy', requirements: ['Original family book', 'ID copy'], is_visible: true },
  { id: 'svc-2', name_en: 'Other Document Translation', name_ar: 'ترجمة مستندات أخرى', category_id: 'cat-1', price: 25, description: 'Translation of all official documents', requirements: ['Original document', 'ID copy'], is_visible: true },
  { id: 'svc-3', name_en: 'Tourist Visa', name_ar: 'تأشيرة سياحية', category_id: 'cat-2', price: 800, description: 'Tourist visa application support for all destinations', requirements: ['Passport copy', 'Bank statement', 'Hotel booking', 'Flight ticket'], is_visible: true },
  { id: 'svc-4', name_en: 'Business Visa', name_ar: 'تأشيرة عمل', category_id: 'cat-2', price: 1200, description: 'Business visa processing with full support', requirements: ['Passport copy', 'Company letter', 'Bank statement', 'Invitation letter'], is_visible: true },
  { id: 'svc-5', name_en: 'Student Visa', name_ar: 'تأشيرة دراسية', category_id: 'cat-2', price: 1000, description: 'Student visa application for universities worldwide', requirements: ['Passport copy', 'Acceptance letter', 'Bank statement', 'Transcripts'], is_visible: true },
]

export const requests: Request[] = [
  { id: 'req-1', request_number: 'REQ-2026-0001', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-2', service_name: 'Translation Service', category_name: 'Translation Services', country: 'Jordan', price: 150, payment_status: 'paid', service_status: 'completed', created_at: '2026-04-01T10:00:00Z', updated_at: '2026-04-02T10:00:00Z' },
  { id: 'req-2', request_number: 'REQ-2026-0002', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-3', service_name: 'Visa Service', category_name: 'Visa Services', country: 'Jordan', price: 30, payment_status: 'pending', service_status: 'pending', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z' },
  { id: 'req-3', request_number: 'REQ-2026-0003', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-3', service_name: 'Visa Service', category_name: 'Visa Services', country: 'Jordan', price: 30, payment_status: 'pending', service_status: 'pending', created_at: '2026-04-05T10:00:00Z', updated_at: '2026-04-05T10:00:00Z' },
  { id: 'req-4', request_number: 'REQ-2026-0004', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-3', service_name: 'Visa Service', category_name: 'Visa Services', country: 'Jordan', price: 30, payment_status: 'pending', service_status: 'pending', created_at: '2026-04-06T10:00:00Z', updated_at: '2026-04-06T10:00:00Z' },
  { id: 'req-5', request_number: 'REQ-2026-0005', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-3', service_name: 'Visa Service', category_name: 'Visa Services', country: 'Jordan', price: 30, payment_status: 'pending', service_status: 'pending', created_at: '2026-04-13T10:00:00Z', updated_at: '2026-04-13T10:00:00Z' },
]

export const companies: Company[] = [
  { id: 'comp-1', name: 'Traveltours', email: 'traveltours@gmail.com', phone: '2892143293', country: 'Jordan', status: 'active', total_services: 30, total_amount: 0, created_at: '2026-01-15T10:00:00Z' },
]

export const staff: Staff[] = []

export const visaNationalities: VisaNationality[] = [
  { id: 'vn-1', nationality: 'Jordan', flag_emoji: '🇯🇴', visa_types: ['Tourist', 'Business'], destinations: ['UAE', 'Turkey'] },
]

export const mockUser = {
  id: 'user-1',
  full_name: 'zaid',
  email: 'zaid@outlook.com',
  role: 'individual' as const,
  country: 'Jordan',
}

export const mockAdmin = {
  id: 'admin-1',
  full_name: 'Zaid Sous',
  email: 'zaidsous@outlook.com',
  role: 'admin' as const,
}
