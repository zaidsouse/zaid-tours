# Zaid Tours - Professional Services Platform

## نظرة عامة على المشروع

موقع "Zaid Tours" هو منصة شاملة لإدارة الخدمات المهنية (الترجمة، التأشيرات، الشحن، النقل) للأفراد والشركات.

## البنية الأساسية للمشروع

### المجلدات الرئيسية:

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # الصفحة الرئيسية (Hero + Services + Features)
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles + Tailwind
│   ├── login/
│   │   └── page.tsx       # صفحة تسجيل الدخول
│   ├── signup/
│   │   └── page.tsx       # صفحة التسجيل الجديد
│   ├── dashboard/
│   │   └── page.tsx       # لوحة تحكم المستخدم العادي
│   └── admin/
│       └── page.tsx       # لوحة تحكم الإدارة (9 tabs)
├── components/
│   ├── layout/
│   │   └── navbar.tsx     # شريط التنقل الذكي
│   └── ui/
│       ├── status-badge.tsx    # عنصر حالة الطلب
│       └── stats-card.tsx      # بطاقة الإحصائيات
├── lib/
│   ├── types.ts           # تعريفات TypeScript
│   ├── mock-data.ts       # بيانات وهمية للاختبار
│   └── supabase.ts        # إعدادات Supabase
└── middleware.ts          # حماية المسارات
```

## الصفحات والميزات

### 1. الصفحة الرئيسية (Home - /)
- Hero section جميل مع CTA
- عرض الخدمات الأربع الرئيسية
- قسم الميزات (Fast Processing, Secure, Expert Support)
- CTA قسم نهائي
- Footer احترافي

### 2. صفحة تسجيل الدخول (/login)
- نموذج تسجيل دخول مع validation
- خيار لتجربة حساب Admin
- Demo credentials مدرجة في الصفحة
- توجيه تلقائي حسب نوع المستخدم

### 3. صفحة التسجيل الجديد (/signup)
- نموذج تسجيل كامل
- اختيار نوع الحساب (فرد/شركة)
- Validation على جميع الحقول
- انتقال تلقائي للـ Dashboard

### 4. لوحة تحكم المستخدم (/dashboard)
- ترحيب شخصي
- 3 بطاقات إحصائيات:
  - Active Requests
  - Completed Requests
  - Total Spent
- قسم "طلب خدمة جديدة" بـ 4 بطاقات خدمات
- جدول كامل لسجل الخدمات مع:
  - أسماء الخدمات
  - الفئات
  - الدول مع الأعلام
  - التواريخ
  - الأسعار
  - حالات الدفع
  - حالات الخدمة

### 5. لوحة تحكم الإدارة (/admin)

#### Tab 1 - All Requests
- جدول شامل لجميع الطلبات
- فلترة ب Search و Status
- أزرار Edit و Delete لكل طلب

#### Tab 2 - Service Management
- قائمة الخدمات
- إمكانية Add/Edit/Delete
- Toggle Active/Inactive

#### Tab 3 - Visa Management
- إدارة أنواع التأشيرات
- 5 دول رئيسية
- أنواع التأشيرات والمتطلبات

#### Tab 4 - Companies
- جدول الشركات المسجلة
- عرض البيانات الكاملة
- حالة التصريح

#### Tab 5 - Staff Management
- جدول الموظفين
- إمكانية إضافة موظفين جدد
- عرض الطلبات المسندة

#### Tab 6 - Categories
- قائمة الفئات
- إمكانية Edit و Delete
- تفعيل/تعطيل الفئات

#### Tab 7 - Approvals
- الطلبات المعلقة (Pending)
- الطلبات المعتمدة (Approved)
- أزرار Approve/Reject

#### Tab 8 - Individuals
- قائمة المستخدمين الأفراد
- بيانات كاملة (الإسم، البريد، الهاتف)
- عدد الطلبات لكل فرد

#### Tab 9 - Analytics
- **Key Metrics:** إجمالي الإيرادات، المدفوع، المعلق، عدد الطلبات
- **Monthly Revenue Chart:** رسم بياني خطي للإيرادات الشهرية
- **Requests by Service Chart:** رسم بياني عمودي
- **Payment Status Chart:** رسم بياني دائري (Paid vs Pending)
- **Top Clients:** قائمة أفضل العملاء
- **Outstanding Payments:** جدول المتأخرات

## البيانات الوهمية (Mock Data)

### الفئات (4)
1. Translation - ترجمة
2. Visa - تأشيرات
3. Shipping - شحن
4. Transportation - نقل

### الخدمات (5)
1. Family Book Translation - $3 (2 أيام)
2. Other Document Translation - $25 (3 أيام)
3. Tourist Visa - $800 (15 يوم)
4. Business Visa - $1200 (20 يوم)
5. Student Visa - $1000 (25 يوم)

### المستخدمين (3)
1. **Zaid Admin** (زيد الإداري)
   - Email: zaid.admin@zaidtours.com
   - Role: admin

2. **Zaid User** (زيد المستخدم)
   - Email: zaid@zaidtours.com
   - Role: user
   - 5 طلبات

3. **Ali Hassan** (علي حسن)
   - Email: ali@example.com
   - Role: user

### الموظفين (3)
- Mohammad Ahmed (ضابط التأشيرات)
- Fatima Salem (مديرة الترجمة)
- Hassan Karim (منسق اللوجستيات)

### الشركات (3)
- Global Trading Company (معتمدة)
- Middle East Imports (قيد الانتظار)
- Express Logistics (معتمدة)

### بيانات التحليلات
- إجمالي الطلبات: 150
- الطلبات المنجزة: 98
- الإيرادات المدفوعة: $45,800
- الإيرادات المعلقة: $5,200
- إجمالي الإيرادات: $51,000

## أنواع البيانات (TypeScript)

### Profile
- معلومات المستخدم الكاملة
- النوع (فرد/شركة)
- الدور (admin/user/company/staff/guest)

### Service & Category
- معلومات الخدمات
- الفئات والترتيب
- السعر والأيام المعالجة

### ServiceRequest
- معلومات الطلب الكامل
- حالة الطلب والدفع
- البيانات والمرفقات

### Company & StaffMember
- معلومات الشركة والموظف
- الحالات والأدوار

### AnalyticsData
- الإحصائيات الشاملة
- البيانات الشهرية
- قائمة العملاء والديون

## المكونات المعاد استخدامها

### Navbar Component
- ذكية حسب دور المستخدم
- تغيير المحتوى (Admin/User/Guest)
- Responsive للجوال

### StatusBadge Component
- عرض حالات الطلب بألوان مختلفة:
  - Completed (أخضر)
  - Processing (أزرق)
  - Pending (أصفر)
  - Rejected (أحمر)

### StatsCard Component
- عرض الإحصائيات بشكل جميل
- أيقونة ملونة
- اتجاهات اختيارية (up/down)

## المكتبات المستخدمة

### الأساسية
- **Next.js 16.2.3** - React framework
- **React 19.2.4** - UI library
- **TypeScript 5** - Type safety

### UI/Styling
- **Tailwind CSS 4** - Utility CSS
- **Lucide React** - Icons
- **class-variance-authority** - Component variants
- **clsx** & **tailwind-merge** - CSS utilities

### Forms & Validation
- **react-hook-form** - Form management
- **zod** - Schema validation
- **@hookform/resolvers** - Form resolvers

### Data Visualization
- **Recharts 2.10.3** - Charts library
  - LineChart - للإيرادات الشهرية
  - BarChart - للخدمات
  - PieChart - لحالات الدفع

### التكامل الخارجي
- **@supabase/supabase-js** - Backend (معد للتكامل)
- **sonner** - Toast notifications

## الملفات الإضافية

### supabase/schema.sql
- SQL كامل لإنشاء الجداول
- RLS Policies للأمان
- Indexes للأداء

### middleware.ts
- حماية المسارات المحمية
- إعادة توجيه المستخدمين

### globals.css
- خطوط مخصصة (Inter)
- Utilities مخصصة
- Animations

## كيفية التشغيل

### التثبيت
```bash
npm install
# أو
yarn install
```

### بدء التطوير
```bash
npm run dev
```
سيبدأ الخادم على `http://localhost:3000`

### البناء للإنتاج
```bash
npm run build
npm start
```

## بيانات التجربة

### حساب Admin
- Email: `zaid.admin@zaidtours.com`
- Password: `admin123`

### حساب User
- Email: `zaid@zaidtours.com`
- Password: `password123`

## الميزات الرئيسية

✅ واجهة مستخدم احترافية وجميلة
✅ Dashboard ذكي للمستخدمين
✅ لوحة تحكم شاملة للإداريين
✅ 9 tabs إدارية متقدمة
✅ رسوم بيانية تفاعلية
✅ Validation كامل على النماذج
✅ Responsive Design للجوال والحاسوب
✅ Dark Mode جاهز للإضافة
✅ Mock data واقعية
✅ Code TypeScript آمن

## التطوير المستقبلي

- تكامل Supabase الكامل
- نظام الدفع (Stripe/PayPal)
- تحميل الملفات
- البريد الإلكتروني
- Notifications
- Dark Mode
- Multi-language support

---

تم الإنشاء: April 13, 2024
الإصدار: 0.1.0
الحالة: جاهز للتطوير
