'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';
import { Search, MapPin, Award, Heart, User, LogOut, Globe, Menu, X, ShieldAlert, Store } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Brand Logo with Image 2 Circular Emblem */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-emerald-100 p-[3px] flex items-center justify-center shadow-md shadow-emerald-600/10 group-hover:scale-105 transition-transform">
              <Logo className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-wider text-slate-900">TNSEEDS</span>
              </div>
              <p className="text-xs text-emerald-700 font-semibold tracking-tight">
                Smart Seed Availability Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/seeds"
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 ${
                pathname === '/seeds' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-500" />
              {t('seeds')}
            </Link>

            <Link
              href="/nearby"
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 ${
                pathname === '/nearby' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-500" />
              {t('nearbySellers')}
            </Link>

            <Link
              href="/schemes"
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 ${
                pathname === '/schemes' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              {t('schemes')}
            </Link>

            <Link
              href="/favorites"
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 ${
                pathname === '/favorites' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              {t('favorites')}
            </Link>
          </nav>

          {/* Actions & Role Switches */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
              title="Toggle English / Tamil"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'தமிழ் (TA)' : 'English (EN)'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'SELLER' && (
                  <Link
                    href="/seller/dashboard"
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition shadow-md shadow-emerald-600/20"
                  >
                    <Store className="w-4 h-4" />
                    ERP Dashboard
                  </Link>
                )}

                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Admin Control
                  </Link>
                )}

                <div className="text-right pl-2 border-l border-slate-200">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{user.name}</p>
                  <p className="text-[10px] font-semibold text-emerald-600 uppercase">{user.role}</p>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-800"
            >
              {language === 'en' ? 'TA' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/seeds"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-emerald-50"
          >
            🌾 {t('seeds')}
          </Link>
          <Link
            href="/nearby"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-emerald-50"
          >
            📍 {t('nearbySellers')}
          </Link>
          <Link
            href="/schemes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-emerald-50"
          >
            🏆 {t('schemes')}
          </Link>
          <Link
            href="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-emerald-50"
          >
            ❤️ {t('favorites')}
          </Link>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                {user.role === 'SELLER' && (
                  <Link
                    href="/seller/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 bg-emerald-600 text-white font-medium rounded-xl"
                  >
                    Seller ERP Dashboard
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 bg-slate-900 text-white font-medium rounded-xl"
                  >
                    Admin Control Center
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-center py-2.5 text-rose-600 bg-rose-50 font-medium rounded-xl"
                >
                  Logout ({user.name})
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-slate-100 font-medium text-slate-800 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-emerald-600 font-medium text-white rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
