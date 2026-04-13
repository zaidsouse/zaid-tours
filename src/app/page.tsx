'use client'
import Link from 'next/link'
import { Globe, FileText, Package, Car, Zap, Shield, HeadphonesIcon, ArrowRight, CheckCircle } from 'lucide-react'

const services = [
  {
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    title: 'Translation Services',
    desc: 'Professional document translation with certified accuracy',
    items: ['Family Book Translation', 'Other Document Translation'],
  },
  {
    icon: <Globe className="w-8 h-8 text-green-600" />,
    title: 'Visa Services',
    desc: 'Complete visa application support for all destinations',
    items: ['Tourist Visa', 'Business Visa', 'Student Visa'],
  },
  {
    icon: <Package className="w-8 h-8 text-orange-600" />,
    title: 'Shipping Services',
    desc: 'Domestic and international shipping solutions',
    items: ['Local Shipping', 'International Shipping'],
  },
  {
    icon: <Car className="w-8 h-8 text-purple-600" />,
    title: 'Transportation Services',
    desc: 'Reliable transportation and logistics services',
    items: ['Airport Transfer', 'City Tours'],
  },
]

const features = [
  { icon: <Zap className="w-7 h-7 text-blue-600" />, title: 'Fast Processing', desc: 'Quick turnaround time for all services with real-time tracking' },
  { icon: <Shield className="w-7 h-7 text-blue-600" />, title: 'Secure & Reliable', desc: 'Your documents are protected with enterprise-grade security' },
  { icon: <HeadphonesIcon className="w-7 h-7 text-blue-600" />, title: 'Expert Support', desc: 'Professional assistance from certified experts available 24/7' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">Zaid Tours</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition">Login</Link>
            <Link href="/signup" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-24 px-4 text-center">
        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          ✦ Professional Services
        </span>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Your Global Gateway
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Fast, reliable, and secure document processing for companies and individuals
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="text-gray-700 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-100 transition border border-gray-200">
            Login
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Services</h2>
            <p className="text-gray-500 text-lg">Comprehensive solutions tailored for your needs</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.title} className="p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition bg-white">
                <div className="mb-4 p-3 bg-gray-50 rounded-xl w-fit">{s.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{s.desc}</p>
                <ul className="space-y-2">
                  {s.items.map(i => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />{i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-center mb-4 p-3 bg-blue-50 rounded-xl w-fit mx-auto">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600 text-center text-white">
        <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
        <p className="text-blue-100 mb-8 text-lg">Join thousands of satisfied customers who trust us with their services</p>
        <Link href="/signup" className="bg-white text-blue-600 px-8 py-3.5 rounded-full font-semibold hover:bg-blue-50 transition inline-flex items-center gap-2">
          Create Your Account <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-100">
        © 2026 Zaid Tours. All rights reserved.
      </footer>
    </div>
  )
}
