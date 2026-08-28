'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../../lib/api';
import { ArrowLeft, Package, Save, Plus, Sparkles } from 'lucide-react';
import PageHeader from '../../../../components/PageHeader';

export default function AddSeedPage() {
  const router = useRouter();

  const [seedName, setSeedName] = useState('');
  const [crop, setCrop] = useState('Paddy');
  const [category, setCategory] = useState('Hybrid Seed');
  const [variety, setVariety] = useState('');
  const [hybridName, setHybridName] = useState('');
  const [brand, setBrand] = useState('');
  const [hsnCode, setHsnCode] = useState('12099990');
  const [unit, setUnit] = useState('kg');
  const [packSize, setPackSize] = useState('1 kg');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [gstPercent, setGstPercent] = useState('0');
  const [openingQuantity, setOpeningQuantity] = useState('100');
  const [minStockLevel, setMinStockLevel] = useState('20');
  const [supplier, setSupplier] = useState('National Seed Corp');
  const [description, setDescription] = useState('');
  const [suitableSeason, setSuitableSeason] = useState('Kharif & Rabi');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await fetchApi('/seeds', {
        method: 'POST',
        body: JSON.stringify({
          seedName, crop, category, variety, hybridName, brand, hsnCode, unit, packSize,
          purchasePrice, sellingPrice, gstPercent, openingQuantity, minStockLevel,
          supplier, description, suitableSeason, imageUrl
        })
      });

      router.push('/seller/seeds');
    } catch (err: any) {
      setError(err.message || 'Failed to create seed product');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header with Uploaded Image Background */}
      <PageHeader
        badge="SKU Registry"
        badgeIcon={<Package className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
        title="🌱 Register New Hybrid Seed SKU"
        subtitle="Add seed specifications, pricing, pack units, and initial stock balance"
        breadcrumbs={[{ label: 'Seller Center', href: '/seller/dashboard' }, { label: 'Seeds', href: '/seller/seeds' }, { label: 'Add SKU' }]}
      >
        <Link
          href="/seller/seeds"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-white/20 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
      </PageHeader>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 text-xs font-bold rounded-2xl border border-rose-200">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">Seed Product Name *</label>
            <input
              type="text"
              value={seedName}
              onChange={(e) => setSeedName(e.target.value)}
              required
              placeholder="e.g. Maize Hybrid 520"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Crop Type *</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Paddy">Paddy (நெல்)</option>
              <option value="Maize">Maize (சோளம்)</option>
              <option value="Cotton">Cotton (பருத்தி)</option>
              <option value="Groundnut">Groundnut (நிலக்கடலை)</option>
              <option value="Tomato">Tomato (தக்காளி)</option>
              <option value="Chilli">Chilli (மிளகாய்)</option>
              <option value="Onion">Onion (வெங்காயம்)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Variety *</label>
            <input
              type="text"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              required
              placeholder="e.g. F1 Super Gold"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Hybrid Code / Name</label>
            <input
              type="text"
              value={hybridName}
              onChange={(e) => setHybridName(e.target.value)}
              placeholder="e.g. MH-520"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Brand / Company *</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              placeholder="e.g. Syngenta / Rasi Seeds"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Pack Size</label>
            <input
              type="text"
              value={packSize}
              onChange={(e) => setPackSize(e.target.value)}
              placeholder="e.g. 1 kg / 500 g"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Purchase Price per Unit (₹) *</label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
              placeholder="e.g. 340"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Selling Price per Unit (₹) *</label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
              placeholder="e.g. 420"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Opening Stock Quantity (kg/units)</label>
            <input
              type="number"
              value={openingQuantity}
              onChange={(e) => setOpeningQuantity(e.target.value)}
              placeholder="e.g. 100"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Minimum Stock Reorder Threshold</label>
            <input
              type="number"
              value={minStockLevel}
              onChange={(e) => setMinStockLevel(e.target.value)}
              placeholder="e.g. 20"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Product Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="High germination hybrid seeds suitable for..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Creating Seed Product...' : 'Save & Initialize Inventory'}
        </button>

      </form>

    </div>
  );
}
