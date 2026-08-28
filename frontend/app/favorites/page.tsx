'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../lib/api';
import { Heart, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

export default function FavoritesPage() {
  const [seeds, setSeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem('tnseeds_favorites') || '[]');
    if (savedIds.length === 0) {
      setLoading(false);
      return;
    }

    fetchApi('/search')
      .then(res => {
        const filtered = (res.results || []).filter((s: any) => savedIds.includes(s._id));
        setSeeds(filtered);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const removeFavorite = (id: string) => {
    const savedIds = JSON.parse(localStorage.getItem('tnseeds_favorites') || '[]');
    const updated = savedIds.filter((i: string) => i !== id);
    localStorage.setItem('tnseeds_favorites', JSON.stringify(updated));
    setSeeds(seeds.filter(s => s._id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header with Uploaded Image Background */}
      <PageHeader
        badge="Farmer Bookmarks"
        badgeIcon={<Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 shrink-0" />}
        title="❤️ Saved Favorite Seeds"
        subtitle="Quickly monitor real-time stock levels, seller distance, and price changes for your saved hybrid seeds"
        breadcrumbs={[{ label: 'Saved Favorites' }]}
      />

      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading saved seeds...</div>
      ) : seeds.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto text-2xl">
            ❤️
          </div>
          <h3 className="text-lg font-extrabold text-slate-800">No Saved Seeds Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any seed card during your search to bookmark it here for quick availability checks.
          </p>
          <Link
            href="/seeds"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Browse Hybrid Seeds <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {seeds.map(seed => (
            <div key={seed._id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden p-6 space-y-4 shadow-sm relative">
              <button
                onClick={() => removeFavorite(seed._id)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-2"
                title="Remove from favorites"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">{seed.crop} • {seed.brand}</span>
                <h3 className="font-bold text-slate-900 text-base">{seed.seedName}</h3>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1">
                <p>Available Stock: <span className="font-bold text-emerald-700">{seed.availableQuantity} {seed.unit}</span></p>
                <p>Price: <span className="font-bold text-slate-900">₹{seed.sellingPrice}</span></p>
                <p>Seller: <span className="font-semibold text-slate-700">{seed.seller?.businessName}</span></p>
              </div>

              <Link
                href={`/seeds/${seed._id}`}
                className="block w-full py-2.5 bg-emerald-600 text-white text-center font-bold text-xs rounded-xl hover:bg-emerald-700 transition"
              >
                View Seed Details
              </Link>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
