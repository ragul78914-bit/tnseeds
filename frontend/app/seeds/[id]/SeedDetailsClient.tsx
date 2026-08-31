'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import { getMockSeedById, ALL_MOCK_SEEDS } from '../../../lib/mockData';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import MapView from '../../../components/MapView';
import {
  MapPin,
  Phone,
  Heart,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Clock,
  ExternalLink,
  Store,
  Tag,
  Lock,
  Sparkles,
  ShieldCheck,
  Sprout,
  Layers,
  Calendar
} from 'lucide-react';
import PageHeader from '../../../components/PageHeader';

interface SeedDetailsClientProps {
  id: string;
}

export default function SeedDetailsClient({ id }: SeedDetailsClientProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [seed, setSeed] = useState<any>(() => (id ? getMockSeedById(id) : null));
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Load initial fallback immediately for instant perceived performance
    const localSeed = getMockSeedById(id);
    if (localSeed) {
      setSeed(localSeed);
    }

    // Check favorites
    const favs = JSON.parse(localStorage.getItem('tnseeds_favorites') || '[]');
    if (localSeed && favs.includes(localSeed._id)) {
      setIsSaved(true);
    }

    // Also attempt fresh fetch from API (Next.js serverless or backend)
    fetchApi(`/search/${id}`)
      .then(data => {
        if (data && data.seedName) {
          setSeed(data);
          if (favs.includes(data._id)) setIsSaved(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('[SeedDetails] API fetch failed, fallback mock seed active:', err);
        setLoading(false);
      });
  }, [id]);

  const toggleSave = () => {
    if (!seed) return;
    const favs = JSON.parse(localStorage.getItem('tnseeds_favorites') || '[]');
    let updated;
    if (favs.includes(seed._id)) {
      updated = favs.filter((i: string) => i !== seed._id);
      setIsSaved(false);
    } else {
      updated = [...favs, seed._id];
      setIsSaved(true);
    }
    localStorage.setItem('tnseeds_favorites', JSON.stringify(updated));
  };

  if (loading && !seed) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm font-medium">Loading seed availability specifications...</p>
      </div>
    );
  }

  if (!seed) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl">
          🌾
        </div>
        <h2 className="text-xl font-bold text-slate-800">Seed Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The requested seed SKU or product could not be located. Browse our verified seed catalog below.
        </p>
        <Link href="/seeds" className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition">
          ← Back to Seeds Catalog
        </Link>
      </div>
    );
  }

  // Related seeds from same crop or seller
  const relatedSeeds = ALL_MOCK_SEEDS.filter(
    s => s._id !== seed._id && (s.crop === seed.crop || s.sellerId === seed.sellerId)
  ).slice(0, 3);

  const sellerCenters = seed.seller
    ? [
        {
          _id: seed.seller._id || 's_1',
          businessName: user ? seed.seller.businessName : 'Authorized Seed Center (Login to view)',
          ownerName: user ? seed.seller.ownerName : 'Authorized Center Head',
          phone: user ? seed.seller.phone : '9842212345',
          address: user ? seed.seller.address : `${seed.seller.district || 'Coimbatore'}, Tamil Nadu`,
          district: seed.seller.district || 'Coimbatore',
          latitude: seed.seller.latitude || 11.0014,
          longitude: seed.seller.longitude || 76.9516,
          distanceKm: seed.distanceKm || 2.4
        }
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header Banner */}
      <PageHeader
        badge={seed.crop ? `${seed.crop} Hybrid Variety` : 'Certified Hybrid Seed'}
        badgeIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
        title={seed.seedName}
        subtitle={`Variety: ${seed.variety || 'Certified Hybrid'} • Brand: ${seed.brand || 'TN Seeds'} • SKU: ${seed.seedCode || 'SEED-AUTO'}`}
        breadcrumbs={[{ label: 'Seed Directory', href: '/seeds' }, { label: seed.seedName }]}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSave}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-lg ${
              isSaved
                ? 'bg-rose-600 text-white shadow-rose-950/40 border border-rose-400/30'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            {isSaved ? 'Bookmarked' : 'Save Favorite'}
          </button>
          <Link
            href="/seeds"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-white/20 backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Seeds
          </Link>
        </div>
      </PageHeader>

      {!user && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Exact price per kg, high-res images, and seller phone numbers are locked for guest users.</span>
          </div>
          <Link
            href="/login"
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm font-bold shrink-0"
          >
            Login to Unlock All Details
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
        {/* Left Column: Image & Seller Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative h-80 rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
            <img
              src={seed.imageUrl}
              alt={seed.seedName}
              className={`w-full h-full object-cover transition-all duration-500 ${
                !user ? 'blur-lg scale-110 opacity-75' : ''
              }`}
            />

            {!user && (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px] flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center border border-white/30 shadow-lg">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs font-bold max-w-xs leading-relaxed">
                  Sign in to unlock clear high-resolution seed images, exact prices, and full seller details.
                </p>
                <Link
                  href="/login"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  Sign In Now
                </Link>
              </div>
            )}

            <div className="absolute top-4 left-4 z-10">
              {seed.stockStatus === 'AVAILABLE' && (
                <span className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-extrabold rounded-full shadow-md flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 🟢 {t('available')}
                </span>
              )}
              {seed.stockStatus === 'LOW_STOCK' && (
                <span className="px-4 py-1.5 bg-amber-500 text-white text-xs font-extrabold rounded-full shadow-md flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> 🟡 {t('lowStock')}
                </span>
              )}
              {seed.stockStatus === 'OUT_OF_STOCK' && (
                <span className="px-4 py-1.5 bg-rose-600 text-white text-xs font-extrabold rounded-full shadow-md flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> 🔴 {t('outOfStock')}
                </span>
              )}
            </div>

            <button
              onClick={toggleSave}
              className={`absolute top-4 right-4 z-10 p-3 rounded-full shadow-md transition ${
                isSaved ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-700 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Seller Contact Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">
                  Authorized Seed Seller
                </span>
                {user ? (
                  <h3 className="text-lg font-bold text-slate-900">{seed.seller?.businessName}</h3>
                ) : (
                  <h3 className="text-lg font-bold text-slate-400 blur-sm select-none">
                    Sri Lakshmi Seeds & Fertilisers
                  </h3>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                {user ? (
                  seed.seller?.address
                ) : (
                  <span className="blur-sm select-none">124 Agro Market Road, R.S. Puram, Coimbatore</span>
                )}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                {user ? seed.seller?.phone : <span className="blur-sm select-none">+91 98422 12345</span>}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                Hours: {seed.seller?.openingHours || '8:00 AM - 8:00 PM'}
              </p>
              <p className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                License: {user ? seed.seller?.licenseNo : <span className="blur-sm select-none">LIC-CBE-2024-8891</span>}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {user ? (
                <>
                  <a
                    href={`tel:${seed.seller?.phone}`}
                    className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl text-center shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-4 h-4" /> Contact Seller
                  </a>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${seed.seller?.latitude || 11.0014},${seed.seller?.longitude || 76.9516}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl text-center transition flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" /> Get Directions
                  </a>
                </>
              ) : (
                <Link
                  href="/login"
                  className="col-span-2 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl text-center shadow-md transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Login to Contact Seller & Get Map Directions
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Seed Specs & Map */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                <span>{seed.crop}</span> • <span>{seed.brand}</span> • <span>{seed.seedCode}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{seed.seedName}</h1>
              <p className="text-sm text-slate-500 mt-1">
                Hybrid Name: <span className="font-semibold text-slate-800">{seed.hybridName}</span>
              </p>
            </div>

            {/* Price & Quantity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Price per Unit</span>
                {user ? (
                  <span className="text-2xl font-extrabold text-slate-900">₹{seed.sellingPrice}</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-extrabold text-slate-800 blur-sm select-none">₹420</span>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md">
                      🔒 Locked
                    </span>
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Current Stock</span>
                <span className="text-2xl font-extrabold text-emerald-700">
                  {seed.availableQuantity} {seed.unit}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Pack Size</span>
                <span className="text-xl font-bold text-slate-800">{seed.packSize}</span>
              </div>
            </div>

            {/* Description & Agronomic Suitability */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Product Description & Specs</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{seed.description}</p>
            </div>

            {/* Agronomic Technical Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                  <Sprout className="w-3 h-3 text-emerald-600" /> Germination
                </span>
                <p className="font-bold text-slate-800">{seed.germinationRate || '95% Min'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Purity
                </span>
                <p className="font-bold text-slate-800">{seed.purityPercent || '98% Min'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-600" /> Duration
                </span>
                <p className="font-bold text-slate-800">{seed.durationDays || '110-120 Days'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-emerald-600" /> Season
                </span>
                <p className="font-bold text-slate-800 truncate">{seed.suitableSeason || 'Kharif & Rabi'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Suitable Season</span>
                <p className="font-bold text-slate-800">{seed.suitableSeason}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Recommended Region</span>
                <p className="font-bold text-slate-800">{seed.recommendedRegion}</p>
              </div>
            </div>
          </div>

          {/* Interactive Seller Location Map */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                📍 Seller Location & Distance ({seed.distanceKm || 2.4} km away)
              </h3>
            </div>
            <MapView farmerLat={11.0168} farmerLng={76.9558} centers={sellerCenters} />
          </div>

          {/* Related / Similar Seed Recommendations */}
          {relatedSeeds.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    🌾 Similar Certified {seed.crop} Hybrid Varieties
                  </h3>
                  <p className="text-xs text-slate-500">Other available stocks from verified sellers nearby</p>
                </div>
                <Link href="/seeds" className="text-xs font-bold text-emerald-600 hover:underline">
                  View All Seeds →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {relatedSeeds.map(item => (
                  <Link
                    key={item._id}
                    href={`/seeds/${item._id}`}
                    className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-2xl border border-slate-200/80 transition group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="h-28 rounded-xl overflow-hidden bg-slate-200">
                        <img
                          src={item.imageUrl}
                          alt={item.seedName}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {item.crop}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.seedName}</h4>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900">₹{item.sellingPrice}</span>
                      <span className="text-[11px] font-semibold text-emerald-600">
                        {item.availableQuantity} {item.unit}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
