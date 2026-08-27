'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 p-1 flex items-center justify-center">
                <Logo className="w-8 h-8" />
              </div>
              <span className="font-extrabold text-2xl tracking-wider text-white">TNSEEDS</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Smart Seed Availability & Stock Management System connecting farmers directly with seed distribution centers across Tamil Nadu.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> Real-Time Inventory & Verified Sellers
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/seeds" className="hover:text-emerald-400 transition">Search Hybrid Seeds</Link></li>
              <li><Link href="/nearby" className="hover:text-emerald-400 transition">Nearby Distribution Centers</Link></li>
              <li><Link href="/schemes" className="hover:text-emerald-400 transition">Government Schemes & Subsidies</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition">Seller ERP Portal</Link></li>
            </ul>
          </div>

          {/* Crops Supported */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base">Featured Crops</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>🌾 Paddy & Hybrid Rice Varieties</li>
              <li>🌽 Maize / Corn Hybrids</li>
              <li>☁️ Bt Cotton Hybrids</li>
              <li>🥜 High Oil Groundnut</li>
              <li>🍅 Vegetable Hybrids (Tomato, Chilli, Onion)</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base">Helpline & Support</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-400" /> 1800-123-SEED (Toll Free)</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" /> support@tnseeds.in</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> Agriculture Complex, Coimbatore, TN</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 TNSEEDS - Smart Seed Availability & Stock Management System. All rights reserved.</p>
          <p className="flex items-center gap-1">Empowering Farmers with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & Digital Technology</p>
        </div>
      </div>
    </footer>
  );
}
