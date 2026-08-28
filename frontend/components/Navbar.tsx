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
    <header className="sticky top-0 z-50 transition-all duration-500">
      {/* === GLASSMORPHISM HEADER SHELL === */}
      {/* Multi-layer glass: dark tinted base + frosted blur + luminous border */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xl" />
      {/* Subtle inner top-light reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      {/* Glowing bottom border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      {/* Soft ambient emerald glow emanating downward */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-emerald-950/20 to-transparent pointer-events-none" />
      {/* Animated gradient accent bar */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-600 via-green-400 to-teal-500 animate-pulse" style={{ animationDuration: '4s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Brand Logo with Shimmering Glass Emblem */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full flex items-center justify-center">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md group-hover:bg-emerald-400/35 transition-all duration-300" />
              {/* Glass disc */}
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-slate-800/80 to-emerald-950/80 backdrop-blur-md border border-emerald-400/40 p-[2px] flex items-center justify-center shadow-xl shadow-emerald-950/60 group-hover:scale-110 group-hover:border-emerald-300/60 transition-all duration-300">
                <Logo className="w-9 h-9" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-widest bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]">
                  TNSEEDS
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/90 font-semibold tracking-wide drop-shadow-sm">
                Smart Seed Availability Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 group/link ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {/* Active / hover glass pill */}
                  <span className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-500/20 border border-emerald-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md'
                      : 'group-hover/link:bg-white/8 group-hover/link:border group-hover/link:border-white/15 backdrop-blur-sm'
                  }`} />
                  <Icon className={`relative w-4 h-4 ${link.color} transition-transform duration-200 group-hover/link:scale-110`} />
                  <span className="relative">{link.label}</span>
                  {/* Active dot indicator */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.6)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Role Switches */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Language Switcher — glass pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/8 hover:bg-white/15 text-emerald-200 border border-white/15 hover:border-emerald-400/40 backdrop-blur-md transition-all duration-200 shadow-sm"
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
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-950/50 border border-emerald-400/30 active:scale-95"
                  >
                    <Store className="w-4 h-4" />
                    ERP Dashboard
                  </Link>
                )}

                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl transition-all duration-200 border border-white/20 hover:border-amber-400/40 backdrop-blur-md"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Admin Control
                  </Link>
                )}

                <div className="text-right pl-3 border-l border-white/15">
                  <p className="text-xs font-bold text-white truncate max-w-[120px]">{user.name}</p>
                  <p className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">{user.role}</p>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-300 hover:text-rose-300 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/25 rounded-xl transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white bg-white/8 hover:bg-white/14 rounded-xl transition-all duration-200 border border-white/12 hover:border-white/25 backdrop-blur-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition-all duration-200 active:scale-95"
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
              className="p-2 text-slate-200 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-emerald-400/40 backdrop-blur-md transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer — glass */}
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
