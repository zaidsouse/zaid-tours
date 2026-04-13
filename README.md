# Zaid Tours — Next.js App

## 🚀 تشغيل المشروع (3 أوامر فقط)

```bash
npm install --legacy-peer-deps
npm run dev
```

ثم افتح: **http://localhost:3000**

## 🔑 بيانات الدخول

| الحساب | الإيميل | كلمة المرور |
|--------|---------|-------------|
| 👑 Admin | zaidsous@outlook.com | Zaid123@ |
| 👤 User | zaid@outlook.com | 123 |

## 📁 الصفحات

| المسار | الوصف |
|--------|-------|
| `/` | الصفحة الرئيسية |
| `/login` | تسجيل الدخول |
| `/signup` | إنشاء حساب |
| `/dashboard` | لوحة المستخدم |
| `/admin` | لوحة الأدمن (9 tabs) |

## 🔧 Supabase Setup

ارفع ملف `supabase/schema.sql` على مشروع Supabase الخاص بك،
ثم أضف في `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
