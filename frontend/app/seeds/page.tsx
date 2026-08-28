'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Search, MapPin, Heart, CheckCircle2, AlertTriangle, XCircle, Clock, ExternalLink, RefreshCw, Lock, Sparkles } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

function SeedsSearchPageContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [crop, setCrop] = useState(searchParams.get('crop') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [availability, setAvailability] = useState('');
  const [maxDistance, setMaxDistance] = useState('50');
  const [sortBy, setSortBy] = useState('distance');

  const [farmerLat, setFarmerLat] = useState(11.0168);
  const [farmerLng, setFarmerLng] = useState(76.9558);

  const [seeds, setSeeds] = useState<any[]>([]);
  const [cropsList, setCropsList] = useState<any[]>([]);
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedSeeds, setSavedSeeds] = useState<string[]>([]);

  useEffect(() => {
    fetchApi('/search/meta')
      .then(res => {
        setCropsList(res.crops || []);
        setDistrictsList(res.districts || []);
      })
      .catch(console.error);

    const favs = localStorage.getItem('tnseeds_favorites');
    if (favs) setSavedSeeds(JSON.parse(favs));
  }, []);

  const loadSeeds = () => {
    setLoading(true);
    const query = new URLSearchParams({
      keyword,
      crop,
      district,
      availability,
      maxDistance,
      farmerLat: String(farmerLat),
      farmerLng: String(farmerLng),
      sortBy
    }).toString();

    fetchApi(`/search?${query}`)
      .then(res => {
        setSeeds(res.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSeeds();
  }, [keyword, crop, district, availability, maxDistance, sortBy, farmerLat, farmerLng]);

  const toggleSave = (seedId: string) => {
    let updated;
    if (savedSeeds.includes(seedId)) {
      updated = savedSeeds.filter(id => id !== seedId);
    } else {
      updated = [...savedSeeds, seedId];
    }
    setSavedSeeds(updated);
    localStorage.setItem('tnseeds_favorites', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner with Uploaded Image Background */}
      <PageHeader
        badge="Verified Hybrid Network"
        badgeIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
        title={
          <>
            🌾 Seed Availability Directory
          </>
        }
        subtitle="Real-time stock quantities and location-based seller distance across all Tamil Nadu districts"
        breadcrumbs={[{ label: 'Seed Catalog' }]}
      >
        <button
          onClick={loadSeeds}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-950/40 border border-emerald-400/30"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Stock Status
        </button>
      </PageHeader>

      {!user && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Images, seed prices, and seller contact details are currently blurred. Sign in to view clear details.</span>
          </div>
          <Link
            href="/login"
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm font-bold shrink-0"
          >
            Login Now
          </Link>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search seed or brand..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Crop Filter */}
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Crops (எல்லாப் பயிர்களும்)</option>
            {cropsList.map((c: any) => (
              <option key={c._id || c.name} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* District Filter */}
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Districts (மாவட்டங்கள்)</option>
            {districtsList.map((d: string) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Availability Status Filter */}
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Availability</option>
            <option value="available">🟢 Available Only</option>
            <option value="low_stock">🟡 Low Stock</option>
            <option value="out_of_stock">🔴 Out of Stock</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
          >
            <option value="distance">Sort: Nearest Seller (Distance)</option>
            <option value="price_asc">Sort: Price Low to High</option>
            <option value="price_desc">Sort: Price High to Low</option>
            <option value="availability">Sort: Availability Status</option>
          </select>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex justify-between items-center text-xs text-slate-500 px-1 font-semibold">
        <span>Found {seeds.length} hybrid seed products near your location</span>
        <span>Displaying distance from current search coordinates</span>
      </div>

      {/* Seeds Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : seeds.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            🌾
          </div>
          <h3 className="text-lg font-extrabold text-slate-800">{t('noSeedsFound')}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords, expanding distance radius, or checking nearby seed centers map.
          </p>
          <Link
            href="/nearby"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-700 transition"
          >
            <MapPin className="w-4 h-4" /> {t('checkNearby')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seeds.map((seed: any) => {
            const isSaved = savedSeeds.includes(seed._id);
            return (
              <div
                key={seed._id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Seed Image Header with Blur Option */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={seed.imageUrl}
                    alt={seed.seedName}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      !user ? 'blur-md scale-110 opacity-75' : 'group-hover:scale-105'
                    }`}
                  />

                  {/* Blur Lock Overlay Banner if NOT Logged In */}
                  {!user && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[3px] flex flex-col items-center justify-center p-3 text-center text-white space-y-2">
                      <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center border border-white/30">
                        <Lock className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-[11px] font-extrabold tracking-wide uppercase px-2.5 py-1 bg-black/60 rounded-full border border-white/20">
                        {t('loginToView')}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    {seed.stockStatus === 'AVAILABLE' && (
                      <span className="px-3 py-1 bg-emerald-500 text-white text-[11px] font-extrabold rounded-full flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 🟢 {t('available')}
                      </span>
                    )}
                    {seed.stockStatus === 'LOW_STOCK' && (
                      <span className="px-3 py-1 bg-amber-500 text-white text-[11px] font-extrabold rounded-full flex items-center gap-1 shadow-md">
                        <AlertTriangle className="w-3.5 h-3.5" /> 🟡 {t('lowStock')}
                      </span>
                    )}
                    {seed.stockStatus === 'OUT_OF_STOCK' && (
                      <span className="px-3 py-1 bg-rose-600 text-white text-[11px] font-extrabold rounded-full flex items-center gap-1 shadow-md">
                        <XCircle className="w-3.5 h-3.5" /> 🔴 {t('outOfStock')}
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleSave(seed._id)}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition ${
                      isSaved ? 'bg-rose-500 text-white' : 'bg-white/80 backdrop-blur-md text-slate-600 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white z-10">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-black/40 px-2 py-0.5 rounded-md">
                        {seed.crop} • {seed.brand}
                      </span>
                      <h3 className="text-lg font-bold truncate leading-snug">{seed.seedName}</h3>
                    </div>
                  </div>
                </div>

                {/* Seed Content Specs */}
                <div className="p-5 space-y-4 flex-grow">
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Pack Size & Unit</span>
                      <span className="font-semibold text-slate-800">{seed.packSize}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Available Stock</span>
                      <span className="font-bold text-emerald-700">{seed.availableQuantity} {seed.unit}</span>
                    </div>
                  </div>

                  {/* Seller Details (Blurred if not logged in) */}
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Seller Center</span>
                      {user ? (
                        <span className="font-semibold text-slate-900 truncate max-w-[140px] block">
                          {seed.seller?.businessName}
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-400 blur-sm select-none block">
                          Sri Lakshmi Seeds
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Distance</span>
                      <span className="font-bold text-blue-600 flex items-center gap-1 justify-end">
                        <MapPin className="w-3 h-3" /> {seed.distanceKm} km away
                      </span>
                    </div>
                  </div>

                  {/* Price (Blurred if not logged in) */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xs text-slate-400">Price</span>
                      {user ? (
                        <p className="text-xl font-extrabold text-slate-900">₹{seed.sellingPrice}</p>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl font-extrabold text-slate-800 blur-sm select-none">₹420</span>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            🔒 Login
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Updated 5m ago
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <Link
                    href={`/seeds/${seed._id}`}
                    className="py-2.5 px-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl text-center transition flex items-center justify-center gap-1"
                  >
                    View Details
                  </Link>

                  {user ? (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${seed.seller?.latitude},${seed.seller?.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl text-center transition flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Directions
                    </a>
                  ) : (
                    <Link
                      href="/login"
                      className="py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl text-center transition flex items-center justify-center gap-1"
                    >
                      <Lock className="w-3.5 h-3.5" /> Login
                    </Link>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default function SeedsSearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 font-semibold">Loading seeds catalog...</div>}>
      <SeedsSearchPageContent />
    </Suspense>
  );
}
