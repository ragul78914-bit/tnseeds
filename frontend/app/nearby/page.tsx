'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';
import MapView from '../../components/MapView';
import { MapPin, Phone, Store, ExternalLink, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';

export default function NearbyCentersPage() {
  const { t } = useLanguage();

  const [farmerLat, setFarmerLat] = useState(11.0168);
  const [farmerLng, setFarmerLng] = useState(76.9558);
  const [maxDistance, setMaxDistance] = useState('50');

  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState<any>(null);

  const loadCenters = () => {
    setLoading(true);
    fetchApi(`/search/nearby?farmerLat=${farmerLat}&farmerLng=${farmerLng}&maxDistance=${maxDistance}`)
      .then(res => {
        setCenters(res.centers || []);
        if (res.centers && res.centers.length > 0) setSelectedCenter(res.centers[0]);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadCenters();
  }, [farmerLat, farmerLng, maxDistance]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase border border-emerald-500/30">
            Interactive GIS Map
          </span>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            📍 {t('nearbySellers')}
          </h1>
          <p className="text-sm text-emerald-200">
            Locate authorized seed distribution centers and inspect available hybrid inventory in real-time
          </p>
        </div>

        {/* Distance Selector */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
          <span className="text-xs font-semibold text-white px-2">Radius:</span>
          <select
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            className="bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none"
          >
            <option value="10">Within 10 km</option>
            <option value="25">Within 25 km</option>
            <option value="50">Within 50 km</option>
            <option value="100">Within 100 km</option>
          </select>
        </div>
      </div>

      {/* Main Map & Centers List Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-base">Live Map View</h3>
            <span className="text-xs font-semibold text-emerald-600">Showing {centers.length} Centers</span>
          </div>
          <MapView
            farmerLat={farmerLat}
            farmerLng={farmerLng}
            centers={centers}
            onSelectCenter={(c) => setSelectedCenter(c)}
          />
        </div>

        {/* Right Column: Seller Directory Cards */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg">Distribution Centers Directory</h3>

          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading map centers...</div>
            ) : centers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
                No seed centers found within {maxDistance} km.
              </div>
            ) : (
              centers.map(center => {
                const isSelected = selectedCenter?._id === center._id;
                return (
                  <div
                    key={center._id}
                    onClick={() => setSelectedCenter(center)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{center.businessName}</h4>
                        <p className="text-xs text-slate-500">{center.address}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg shrink-0">
                        {center.distanceKm} km
                      </span>
                    </div>

                    {/* Available Seeds Preview */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Seed Availability Overview ({center.seedsCount} seeds)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {center.availableSeeds?.slice(0, 3).map((seed: any) => (
                          <span
                            key={seed._id}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              seed.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {seed.seedName} ({seed.currentStock} {seed.unit})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" /> {center.phone}
                      </span>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        Directions <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
