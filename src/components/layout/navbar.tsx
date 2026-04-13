'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  userRole?: 'admin' | 'user' | 'guest';
  userName?: string;
}

export default function Navbar({ userRole = 'guest', userName = '' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const toggleMenu = () => setIsOpen(\!isOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl">✈️</div>
              <span className="font-bold text-xl text-blue-600">Zaid Tours</span>
            </Link>

            <div className="hidden md:flex gap-1">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>

              {userRole === 'user' && (
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
              )}

              {userRole === 'admin' && (
                <>
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin')
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Admin
                  </Link>
                  <Link
                    href="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {userRole === 'guest' ? (
              <div className="hidden sm:flex gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm text-gray-700">{userName}</span>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                    <User size={20} />
                  </button>
                  <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                    <Settings size={20} />
                  </button>
                  <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {userRole === 'user' && (
              <Link
                href="/dashboard"
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {userRole === 'admin' && (
              <>
                <Link
                  href="/admin"
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin')
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
                <Link
                  href="/dashboard"
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}

            {userRole === 'guest' && (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
