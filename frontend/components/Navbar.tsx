'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';
import { Search, MapPin, Award, Heart, User, LogOut, Globe, Menu, X, ShieldAlert, Store, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const navLinks = [
    { href: '/seeds', label: t('seeds'), icon: Search, color: 'text-emerald-400' },
    { href: '/nearby', label: t('nearbySellers'), icon: MapPin, color: 'text-emerald-400' },
    { href: '/schemes', label: t('schemes'), icon: Award, color: 'text-amber-400' },
    { href: '/favorites', label: t('favorites'), icon: Heart, color: 'text-rose-400' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-emerald-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.35)] transition-all duration-300">
      {/* Top micro indicator line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Brand Logo with Glass Circular Emblem */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-emerald-950/60 backdrop-blur-md border border-emerald-500/30 p-[2px] flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <Logo className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-wider text-white drop-shadow-md">TNSEEDS</span>
              </div>
              <p className="text-xs text-emerald-300 font-semibold tracking-tight drop-shadow-sm">
                Smart Seed Availability Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-white font-semibold border border-emerald-400/40 shadow-inner backdrop-blur-md'
                      : 'text-slate-200 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.color}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Role Switches */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/20 backdrop-blur-md transition shadow-sm"
              title="Toggle English / Tamil"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'தமிழ் (TA)' : 'English (EN)'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'SELLER' && (
                  <Link
                    href="/seller/dashboard"
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-emerald-950/30 border border-emerald-400/30"
                  >
                    <Store className="w-4 h-4" />
                    ERP Dashboard
                  </Link>
                )}

                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-medium text-sm rounded-xl transition border border-white/20 backdrop-blur-md"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Admin Control
                  </Link>
                )}

                <div className="text-right pl-2 border-l border-white/20">
                  <p className="text-xs font-bold text-white truncate max-w-[120px]">{user.name}</p>
                  <p className="text-[10px] font-semibold text-emerald-300 uppercase">{user.role}</p>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-300 hover:text-rose-300 hover:bg-rose-500/20 rounded-xl transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 rounded-xl transition border border-white/10 hover:border-white/20 backdrop-blur-sm"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition transform active:scale-95"
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
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-emerald-200 border border-white/20 backdrop-blur-md"
            >
              {language === 'en' ? 'TA' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white rounded-xl bg-white/10 border border-white/20 backdrop-blur-md"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-emerald-500/20 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-2xl text-white">
          <Link
            href="/seeds"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-white/10 transition"
          >
            🌾 {t('seeds')}
          </Link>
          <Link
            href="/nearby"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-white/10 transition"
          >
            📍 {t('nearbySellers')}
          </Link>
          <Link
            href="/schemes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-white/10 transition"
          >
            🏆 {t('schemes')}
          </Link>
          <Link
            href="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-white/10 transition"
          >
            ❤️ {t('favorites')}
          </Link>

          <div className="pt-4 border-t border-white/15 space-y-2">
            {user ? (
              <>
                {user.role === 'SELLER' && (
                  <Link
                    href="/seller/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 bg-emerald-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-950/30"
                  >
                    Seller ERP Dashboard
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 bg-white/20 text-white font-medium rounded-xl border border-white/20"
                  >
                    Admin Control Center
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-center py-2.5 text-rose-300 bg-rose-500/20 border border-rose-500/30 font-medium rounded-xl"
                >
                  Logout ({user.name})
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-white/10 font-medium text-slate-200 hover:text-white rounded-xl border border-white/15"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-emerald-600 font-semibold text-white rounded-xl shadow-lg shadow-emerald-950/30"
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
