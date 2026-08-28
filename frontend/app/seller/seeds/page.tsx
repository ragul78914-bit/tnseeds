'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import { Package, Plus, Search, Edit, Power, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';

export default function SellerSeedsPage() {
  const [seeds, setSeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadSeeds = () => {
    setLoading(true);
    fetchApi('/seeds/seller')
      .then(data => {
        setSeeds(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSeeds();
  }, []);

  const toggleStatus = async (id: string) => {
    try {
      await fetchApi(`/seeds/${id}/toggle`, { method: 'PATCH' });
      loadSeeds();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = seeds.filter(s => 
    s.seedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.seedCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header with Uploaded Image Background */}
      <PageHeader
        badge="SKU & Product Master"
        badgeIcon={<Package className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
        title="📦 Seed Products Catalog"
        subtitle="Create, modify, and manage hybrid seeds with auto-generated product codes (SEED-XXXXXX)"
        breadcrumbs={[{ label: 'Seller Center', href: '/seller/dashboard' }, { label: 'Seeds Catalog' }]}
      >
        <Link
          href="/seller/seeds/add"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition flex items-center gap-1.5 border border-emerald-400/30"
        >
          <Plus className="w-4 h-4" /> Add New Seed SKU
        </Link>
      </PageHeader>

      {/* Sub Header */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 border-b border-slate-200 pb-2">
        <Link href="/seller/dashboard" className="px-4 py-2 hover:bg-slate-100 rounded-xl">Overview</Link>
        <Link href="/seller/seeds" className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl">Seeds Catalog</Link>
        <Link href="/seller/inventory" className="px-4 py-2 hover:bg-slate-100 rounded-xl">Inventory Balances</Link>
        <Link href="/seller/stock" className="px-4 py-2 hover:bg-slate-100 rounded-xl">Stock Entry & Adjustments</Link>
        <Link href="/seller/suppliers" className="px-4 py-2 hover:bg-slate-100 rounded-xl">Suppliers</Link>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by seed name, crop, or seed code..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Seeds Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Seed Code</th>
                <th className="py-3.5 px-4">Seed Name</th>
                <th className="py-3.5 px-4">Crop</th>
                <th className="py-3.5 px-4">Variety / Hybrid</th>
                <th className="py-3.5 px-4">Cost Price</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4">Pack Size</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">Loading catalog...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">No seed products found.</td>
                </tr>
              ) : (
                filtered.map(seed => (
                  <tr key={seed._id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{seed.seedCode}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{seed.seedName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{seed.crop}</td>
                    <td className="py-3.5 px-4 text-slate-500">{seed.variety} ({seed.hybridName || 'N/A'})</td>
                    <td className="py-3.5 px-4 text-slate-600">₹{seed.purchasePrice}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">₹{seed.sellingPrice}</td>
                    <td className="py-3.5 px-4 text-slate-500">{seed.packSize}</td>
                    <td className="py-3.5 px-4">
                      {seed.status === 'ACTIVE' ? (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">ACTIVE</span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">INACTIVE</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleStatus(seed._id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                          seed.status === 'ACTIVE' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {seed.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
