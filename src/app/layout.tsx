import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Zaid Tours — Your Global Gateway',
  description: 'Fast, reliable, and secure document processing for companies and individuals',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
