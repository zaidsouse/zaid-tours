-- =============================================
-- Zaid Tours — Supabase Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  country TEXT,
  role TEXT DEFAULT 'individual' CHECK (role IN ('admin', 'individual', 'company')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  icon TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  requirements JSONB DEFAULT '[]',
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Companies
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  country TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Requests
CREATE TABLE requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  country TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  service_status TEXT DEFAULT 'pending' CHECK (service_status IN ('pending', 'processing', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff
CREATE TABLE staff (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('manager', 'agent', 'support')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visa Nationalities
CREATE TABLE visa_nationalities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nationality TEXT NOT NULL,
  flag_emoji TEXT,
  visa_types JSONB DEFAULT '[]',
  destinations JSONB DEFAULT '[]'
);

-- =============================================
-- Row Level Security
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Users see only their own profile
CREATE POLICY "Users see own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Users see only their own requests
CREATE POLICY "Users see own requests" ON requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own requests" ON requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins see everything (set role='admin' in profiles)
CREATE POLICY "Admin full access requests" ON requests FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =============================================
-- Seed Data
-- =============================================
INSERT INTO categories (name_en, name_ar, description, icon, display_order) VALUES
('Translation Services', 'خدمات الترجمة', 'Professional document translation services', '📄', 1),
('Visa Services', 'خدمات التأشيرات', 'Complete visa application and processing services', '🌍', 2),
('Shipping Services', 'خدمات الشحن', 'Domestic and international shipping solutions', '📦', 3),
('Transportation Services', 'خدمات النقل', 'Reliable transportation and logistics services', '🚗', 4);

INSERT INTO services (name_en, name_ar, category_id, price, description, requirements) VALUES
('Family Book Translation', 'ترجمة دفتر العائلة', (SELECT id FROM categories WHERE name_en='Translation Services'), 50, 'Professional family book translation', '["Original family book", "ID copy"]'),
('Other Document Translation', 'ترجمة مستندات أخرى', (SELECT id FROM categories WHERE name_en='Translation Services'), 25, 'Translation of all official documents', '["Original document", "ID copy"]'),
('Tourist Visa', 'تأشيرة سياحية', (SELECT id FROM categories WHERE name_en='Visa Services'), 800, 'Tourist visa application support', '["Passport copy", "Bank statement", "Hotel booking", "Flight ticket"]'),
('Business Visa', 'تأشيرة عمل', (SELECT id FROM categories WHERE name_en='Visa Services'), 1200, 'Business visa processing', '["Passport copy", "Company letter", "Bank statement", "Invitation letter"]'),
('Student Visa', 'تأشيرة دراسية', (SELECT id FROM categories WHERE name_en='Visa Services'), 1000, 'Student visa application', '["Passport copy", "Acceptance letter", "Bank statement", "Transcripts"]');

INSERT INTO visa_nationalities (nationality, flag_emoji, visa_types, destinations) VALUES
('Jordan', '🇯🇴', '["Tourist", "Business"]', '["UAE", "Turkey"]');
