'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import { Search, MapPin, ArrowRight, CheckCircle2, Sparkles, Building2, Store, Users } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [seedName, setSeedName] = useState('Maize Hybrid');
  const [selectedCrop, setSelectedCrop] = useState('Maize');
  const [selectedLocation, setSelectedLocation] = useState('Coimbatore');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/seeds?keyword=${encodeURIComponent(seedName)}&crop=${encodeURIComponent(selectedCrop)}&district=${encodeURIComponent(selectedLocation)}`);
  };

  return (
    <div className="space-y-10 sm:space-y-16 pb-16">
      
      {/* Hero Section with Farmer Planting Seeds Background Image */}
      <section className="relative overflow-hidden hero-bg-farmer text-white py-14 sm:py-24 px-3 sm:px-6 lg:px-8 border-b border-emerald-500/20 shadow-2xl">
        <div className="relative max-w-7xl mx-auto text-center space-y-6 sm:space-y-8">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide shadow-inner">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span>TNSEEDS Real-Time Agriculture Seed Network</span>
          </div>

          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight text-white drop-shadow-md">
              {t('appTitle')}
            </h1>
            <p className="text-lg sm:text-2xl font-medium text-emerald-200 drop-shadow">
              {t('subtitle')}
            </p>
            <p className="text-xs sm:text-base text-slate-200 max-w-2xl mx-auto">
              {t('heroTitle')} Check current stock before travelling to seed centers.
            </p>
          </div>

          {/* Responsive Search Card */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-900 border border-white/60">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3 items-center">
              
              {/* Seed Name Input */}
              <div className="sm:col-span-4 relative">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-500 mb-1 text-left px-1">
                  Search Seed Name
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={seedName}
                    onChange={(e) => setSeedName(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-9 sm:pl-11 pr-3 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Crop Select */}
              <div className="sm:col-span-3">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-500 mb-1 text-left px-1">
                  {t('cropSelect')}
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                >
                  <option value="">{t('allCrops')}</option>
                  <option value="Paddy">Paddy (நெல்)</option>
                  <option value="Maize">Maize (சோளம்)</option>
                  <option value="Cotton">Cotton (பருத்தி)</option>
                  <option value="Groundnut">Groundnut (நிலக்கடலை)</option>
                  <option value="Tomato">Tomato (தக்காளி)</option>
                  <option value="Chilli">Chilli (மிளகாய்)</option>
                  <option value="Onion">Onion (வெங்காயம்)</option>
                </select>
              </div>

              {/* Location Select */}
              <div className="sm:col-span-3">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-500 mb-1 text-left px-1">
                  {t('locationSelect')}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-9 sm:pl-11 pr-3 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  >
                    <option value="">{t('allDistricts')}</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Erode">Erode</option>
                    <option value="Salem">Salem</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Thanjavur">Thanjavur</option>
                    <option value="Tiruppur">Tiruppur</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="sm:col-span-2 pt-2 sm:pt-0">
                <button
                  type="submit"
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-600/30 transition transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  {t('findSeedsBtn')}
                </button>
              </div>
            </form>

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs font-semibold text-slate-500">
              <span className="text-slate-400">Popular:</span>
              <button onClick={() => { setSeedName('Maize Hybrid 520'); setSelectedCrop('Maize'); }} className="px-2.5 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-full">🌽 Maize 520</button>
              <button onClick={() => { setSeedName('Paddy CR 1009'); setSelectedCrop('Paddy'); }} className="px-2.5 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-full">🌾 Paddy CR 1009</button>
              <button onClick={() => { setSeedName('Bt Cotton Rasi 659'); setSelectedCrop('Cotton'); }} className="px-2.5 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-full">☁️ Cotton 659</button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Account Roles Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-emerald-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Demo Portals</span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Explore TNSEEDS Platform by Role</h3>
              <p className="text-xs text-slate-600 max-w-xl">
                Test the complete seller stock management ERP, farmer search, and system admin analytics.
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-2 text-xs">
              <Link
                href="/login?role=FARMER"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm transition"
              >
                👨‍🌾 Farmer Login
              </Link>
              <Link
                href="/login?role=SELLER"
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition"
              >
                🏪 Seller ERP
              </Link>
              <Link
                href="/login?role=ADMIN"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-sm transition"
              >
                🛡️ Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Problem & Solution Grid (Mobile / Tablet Adaptive) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Solving Real Agriculture Supply Chain Challenges</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Eliminating physical guesswork for farmers while digitizing manual register notebooks for seed sellers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          
          {/* Problem Card */}
          <div className="bg-rose-50/60 border border-rose-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 sm:space-y-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg sm:text-xl">
              ⚠️
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-rose-950">Traditional Manual Problems</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span> Farmers travel long distances without knowing if hybrid seeds are in stock.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span> Seed sellers maintain inventory manually in paper registers leading to errors.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span> Stock data becomes outdated, causing farmers to visit multiple centers.
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 sm:space-y-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg sm:text-xl">
              ✅
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-emerald-950">TNSEEDS Digital Solution</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
                Sellers update inventory digitally via powerful SaaS ERP dashboard.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
                Central database immediately syncs real-time stock balances.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
                Farmers search availability, check exact quantities & distance in km.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white py-12 sm:py-20 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16 text-center">
          
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-bold tracking-wider uppercase border border-emerald-500/30">
              Workflow Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold">How TNSEEDS Real-Time System Works</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
              From seller inventory update to farmer collection in 8 seamless steps
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-left">
            {[
              { step: '1', title: 'Seed Registration', desc: 'Seller creates product & auto-generates Seed Code SEED-XXXXXX' },
              { step: '2', title: 'Stock Entry', desc: 'Sellers record purchases, batches, and opening inventory' },
              { step: '3', title: 'Stock Updates', desc: 'Transactions record sales, damage & manual adjustments' },
              { step: '4', title: 'Farmer Search', desc: 'Farmers search by crop, variety, hybrid name, or district' },
              { step: '5', title: 'Availability Check', desc: 'Live engine shows Available, Low Stock, or Out of Stock' },
              { step: '6', title: 'Location Selection', desc: 'Haversine distance calculates nearest distribution centers' },
              { step: '7', title: 'Seed Collection', desc: 'Farmer visits center directly with Google Maps directions' },
              { step: '8', title: 'Digital Audit Logs', desc: 'System updates stock history and generates report ledger' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800/80 border border-slate-700 p-4 sm:p-6 rounded-xl sm:rounded-2xl space-y-2 group hover:border-emerald-500 transition">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white font-extrabold flex items-center justify-center text-sm sm:text-lg shadow-md">
                  {item.step}
                </div>
                <h4 className="font-bold text-white text-xs sm:text-base">{item.title}</h4>
                <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Tailored Features for Every Stakeholder</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Role-based authentication ensuring security, transparency, and operational speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          
          {/* Farmer Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition space-y-3 sm:space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Farmer Application</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Search hybrid seeds by name, crop, hybrid brand, or distance. View quantity available, maps, directions, and govt subsidies.
            </p>
            <Link href="/seeds" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700">
              Search Seeds Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Seller ERP Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition space-y-3 sm:space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Store className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Seller Seed Stock ERP</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Manage product codes, purchases, sales, damage, batches, low-stock warnings, PDF/CSV report downloads, and map location.
            </p>
            <Link href="/login?role=SELLER" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700">
              Open ERP Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Admin Control Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition space-y-3 sm:space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Admin Control Portal</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Monitor system activity, activate/deactivate sellers, publish government schemes, review system audit logs, and view district metrics.
            </p>
            <Link href="/login?role=ADMIN" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700">
              Access Admin Panel <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
