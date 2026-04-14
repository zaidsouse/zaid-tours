import { Category, Service, Request, Company, Staff, VisaNationality } from './types'

export const categories: Category[] = [
  { id: 'cat-1', name_en: 'Translation Services', name_ar: 'خدمات الترجمة', description: 'Professional document translation services', icon: '📄', display_order: 1, is_visible: true },
  { id: 'cat-2', name_en: 'Visa Services', name_ar: 'خدمات التأشيرات', description: 'Complete visa application and processing services', icon: '🌍', display_order: 2, is_visible: true },
  { id: 'cat-3', name_en: 'Shipping Services', name_ar: 'خدمات الشحن', description: 'Domestic and international shipping solutions', icon: '📦', display_order: 3, is_visible: true },
  { id: 'cat-4', name_en: 'Transportation Services', name_ar: 'خدمات النقل', description: 'Reliable transportation and logistics services', icon: '🚗', display_order: 4, is_visible: true },
]

export const services: Service[] = [
  // Translation Services
  { id: 'svc-1', name_en: 'Family Book Translation', name_ar: 'ترجمة دفتر العائلة', category_id: 'cat-1', price: 50, description: 'Professional family book translation with certified accuracy', requirements: ['Original family book', 'ID copy'], is_visible: true },
  { id: 'svc-2', name_en: 'Official Document Translation', name_ar: 'ترجمة مستندات رسمية', category_id: 'cat-1', price: 25, description: 'Translation of all official documents', requirements: ['Original document', 'ID copy'], is_visible: true },
  { id: 'svc-9', name_en: 'Legal Contract Translation', name_ar: 'ترجمة عقود قانونية', category_id: 'cat-1', price: 80, description: 'Certified legal contract translation for courts and authorities', requirements: ['Original contract', 'ID copy'], is_visible: true },
  { id: 'svc-10', name_en: 'Medical Report Translation', name_ar: 'ترجمة تقارير طبية', category_id: 'cat-1', price: 60, description: 'Accurate medical report translation for hospitals and insurance', requirements: ['Medical report', 'ID copy'], is_visible: true },
  // Visa Services
  { id: 'svc-3', name_en: 'Tourist Visa', name_ar: 'تأشيرة سىاحية', category_id: 'cat-2', price: 800, description: 'Tourist visa application support for all destinations', requirements: ['Passport copy', 'Bank statement', 'Hotel booking', 'Flight ticket'], is_visible: true },
  { id: 'svc-4', name_en: 'Business Visa', name_ar: 'تأشيرة عمل', category_id: 'cat-2', price: 1200, description: 'Business visa processing with full support', requirements: ['Passport copy', 'Company letter', 'Bank statement', 'Invitation letter'], is_visible: true },
  { id: 'svc-5', name_en: 'Student Visa', name_ar: 'تأشيرة دراسية', category_id: 'cat-2', price: 1000, description: 'Student visa application for universities worldwide', requirements: ['Passport copy', 'Acceptance letter', 'Bank statement', 'Transcripts'], is_visible: true },
  { id: 'svc-11', name_en: 'Work Visa', name_ar: 'تأشيرة عمل', category_id: 'cat-2', price: 1500, description: 'Work permit and visa processing for professionals', requirements: ['Passport copy', 'Employment contract', 'Bank statement'], is_visible: true },
  { id: 'svc-12', name_en: 'Family Reunion Visa', name_ar: 'تأشيرة لمّ الشمل', category_id: 'cat-2', price: 900, description: 'Family reunification visa for all countries', requirements: ['Passport copy', 'Family certificate', 'Sponsor letter', 'Bank statement'], is_visible: true },
  // Shipping Services
  { id: 'svc-6', name_en: 'Local Shipping', name_ar: 'شحن محمي', category_id: 'cat-3', price: 15, description: 'Fast and reliable local delivery within Jordan', requirements: ['Package dimensions', 'Delivery address', 'Phone number'], is_visible: true },
  { id: 'svc-7', name_en: 'International Shipping', name_ar: 'شحن دومي', category_id: 'cat-3', price: 120, description: 'Worldwide shipping with full tracking and insurance', requirements: ['Package dimensions and weight', 'Destination address', 'Contents declaration'], is_visible: true },
  { id: 'svc-13', name_en: 'Express Delivery', name_ar: 'توصيل سريع', category_id: 'cat-3', price: 35, description: 'Same-day or next-day express delivery within the city', requirements: ['Package details', 'Pickup address', 'Delivery address'], is_visible: true },
  { id: 'svc-14', name_en: 'Freight Shipping', name_ar: 'شحن بصائع', category_id: 'cat-3', price: 500, description: 'Heavy freight and commercial goods shipping worldwide', requirements: ['Cargo weight and dimensions', 'Commercial invoice', 'Destination port'], is_visible: true },
  // Transportation Services
  { id: 'svc-8', name_en: 'Airport Transfer', name_ar: 'نقل المطار', category_id: 'cat-4', price: 40, description: 'Comfortable and punctual airport pickup and drop-off', requirements: ['Flight number', 'Arrival time', 'Number of passengers'], is_visible: true },
  { id: 'svc-15', name_en: 'City Tour', name_ar: 'جولة المدينة', category_id: 'cat-4', price: 80, description: 'Guided city tours with professional driver across Jordan', requirements: ['Preferred sites', 'Number of passengers', 'Tour duration'], is_visible: true },
  { id: 'svc-16', name_en: 'Long Distance Travel', name_ar: 'سفر المسافات الطييلة', category_id: 'cat-4', price: 150, description: 'Comfortable long distance travel between cities', requirements: ['Departure city', 'Destination city', 'Travel date', 'Number of passengers'], is_visible: true },
  { id: 'svc-17', name_en: 'VIP Chauffeur Service', name_ar: 'خدمة سائق خاص VIP', category_id: 'cat-4', price: 200, description: 'Luxury chauffeur service with premium vehicles for special occasions', requirements: ['Date and duration', 'Pickup location', 'Number of passengers'], is_visible: true },
]

export const requests: Request[] = [
  { id: 'req-1', request_number: 'REQ-2026-0001', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-2', service_name: 'Official Document Translation', category_name: 'Translation Services', country: 'Jordan', price: 150, payment_status: 'paid', service_status: 'completed', created_at: '2026-04-01T10:00:00Z', updated_at: '2026-04-02T10:00:00Z' },
  { id: 'req-2', request_number: 'REQ-2026-0002', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-3', service_name: 'Tourist Visa', category_name: 'Visa Services', country: 'UAE', price: 800, payment_status: 'pending', service_status: 'processing', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z' },
  { id: 'req-3', request_number: 'REQ-2026-0003', user_id: 'user-1', user_name: 'zaid', user_email: 'zaid@outlook.com', service_id: 'svc-8', service_name: 'Airport Transfer', category_name: 'Transportation Services', country: 'Jordan', price: 40, payment_status: 'paid', service_status: 'pending', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z' },
]

export const companies: Company[] = [
  { id: 'comp-1', name: 'Traveltours', email: 'traveltours@gmail.com', phone: '2892143293', country: 'Jordan', status: 'active', total_services: 30, total_amount: 0, created_at: '2026-01-15T10:00:00Z' },
]

export const staff: Staff[] = []

export const visaNationalities: VisaNationality[] = [
  { id: 'vn-1', nationality: 'Jordan', flag_emoji: '🇯🇴', visa_types: ['Tourist', 'Business', 'Work', 'Student'], destinations: ['UAE', 'Turkey', 'UK', 'USA', 'Schengen'] },
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
