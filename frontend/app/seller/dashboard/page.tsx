'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Package, TrendingUp, AlertTriangle, XCircle, DollarSign, Store, ShoppingCart, ArrowUpRight, Plus, Download, RefreshCw, FileText, Sparkles } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';

const COLORS = ['#16a34a', '#0284c7', '#f59e0b', '#dc2626', '#8b5cf6', '#ec4899'];

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = () => {
    setLoading(true);
    fetchApi('/sellers/dashboard')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-xs font-semibold">Loading Seller ERP Dashboard Metrics...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Seller Header Bar with Uploaded Image Background */}
      <PageHeader
        badge="SaaS Stock ERP Command Center"
        badgeIcon={<Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
        title={
          <>
            🏪 {user?.seller?.businessName || 'Agri Seed Center'} Dashboard
          </>
        }
        subtitle="Real-time digital inventory, stock transaction ledger, and farmer search visibility across Tamil Nadu"
        breadcrumbs={[{ label: 'Seller Center' }, { label: 'ERP Dashboard' }]}
      >
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Link
            href="/seller/stock"
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/40 transition flex items-center justify-center gap-1.5 border border-emerald-400/30"
          >
            <Plus className="w-3.5 h-3.5" /> Stock Entry
          </Link>
          <Link
            href="/seller/seeds"
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-white/20 backdrop-blur-md"
          >
            <Package className="w-3.5 h-3.5" /> Manage Seeds
          </Link>
        </div>
      </PageHeader>

      {/* Navigation Sub-Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold text-slate-600 shrink-0">
        <Link href="/seller/dashboard" className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl whitespace-nowrap">Overview</Link>
        <Link href="/seller/seeds" className="px-3.5 py-1.5 hover:bg-slate-100 rounded-xl whitespace-nowrap">Seeds Catalog</Link>
        <Link href="/seller/inventory" className="px-3.5 py-1.5 hover:bg-slate-100 rounded-xl whitespace-nowrap">Inventory Balances</Link>
        <Link href="/seller/stock" className="px-3.5 py-1.5 hover:bg-slate-100 rounded-xl whitespace-nowrap">Stock Entry & Adjustments</Link>
        <Link href="/seller/suppliers" className="px-3.5 py-1.5 hover:bg-slate-100 rounded-xl whitespace-nowrap">Suppliers</Link>
        <Link href="/seller/reports" className="px-3.5 py-1.5 hover:bg-slate-100 rounded-xl whitespace-nowrap">Reports & Exports</Link>
        <Link href="/seller/settings" className="px-3.5 py-1.5 hover:bg-slate-100 rounded-xl whitespace-nowrap">Store Location Settings</Link>
      </div>

      {/* Responsive KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-4">
        
        {/* Total Seeds */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Seeds</span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{metrics.totalSeeds || 0}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
            <Package className="w-3 h-3 mr-1" /> Active Products
          </span>
        </div>

        {/* Total Stock */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Stock</span>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-700">{metrics.totalStockKg || 0} kg</p>
          <span className="text-[10px] text-slate-500 font-semibold">Available Units</span>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-amber-600 block">Low Stock</span>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600">{metrics.lowStockCount || 0}</p>
          <span className="text-[10px] text-amber-600 font-semibold flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" /> Reorder Needed
          </span>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-rose-600 block">Out of Stock</span>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-600">{metrics.outOfStockCount || 0}</p>
          <span className="text-[10px] text-rose-500 font-semibold flex items-center">
            <XCircle className="w-3 h-3 mr-1" /> Zero Balance
          </span>
        </div>

        {/* Today's Purchases */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Today's Purchases</span>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900">₹{(metrics.todayPurchases || 0).toLocaleString()}</p>
          <span className="text-[10px] text-blue-600 font-semibold">Stock Inflow</span>
        </div>

        {/* Today's Sales */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Today's Sales</span>
          <p className="text-lg sm:text-xl font-extrabold text-emerald-700">₹{(metrics.todaySales || 0).toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Revenue Outflow</span>
        </div>

        {/* Stock Value */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Stock Valuation</span>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900">₹{(metrics.totalStockValue || 0).toLocaleString()}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Asset Value</span>
        </div>

      </div>

      {/* Visual Recharts Section (Adaptive Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
        
        {/* Monthly Purchases vs Sales Chart */}
        <div className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Monthly Purchases vs Sales Trend (₹)</h3>
              <p className="text-[11px] text-slate-500">Stock acquisition vs farmer sales revenue comparison</p>
            </div>
          </div>
          <div className="h-60 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={3} name="Sales (₹)" />
                <Line type="monotone" dataKey="purchases" stroke="#0284c7" strokeWidth={3} name="Purchases (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Distribution by Crop Pie Chart */}
        <div className="lg:col-span-4 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Inventory Share by Crop</h3>
          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.stockByCrop || []}
                  dataKey="stock"
                  nameKey="crop"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ crop, stock }) => `${crop}: ${stock}kg`}
                >
                  {(data?.stockByCrop || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Low Stock Alerts Table */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Low Stock & Out-of-Stock Warnings</h3>
          </div>
          <Link href="/seller/stock" className="text-xs font-bold text-emerald-600 hover:underline">
            + Restock Inventory
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-y border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Seed Product</th>
                <th className="py-2.5 px-3">Crop</th>
                <th className="py-2.5 px-3">Current Balance</th>
                <th className="py-2.5 px-3">Min Reorder Level</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(data?.lowStockSeeds || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    ✅ All seed products are currently above minimum stock thresholds.
                  </td>
                </tr>
              ) : (
                data?.lowStockSeeds?.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.seedName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.crop}</td>
                    <td className="py-2.5 px-3 font-extrabold text-rose-600">{item.currentStock} {item.unit}</td>
                    <td className="py-2.5 px-3 text-slate-500">{item.minStockLevel} {item.unit}</td>
                    <td className="py-2.5 px-3">
                      {item.currentStock === 0 ? (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-md">🔴 Out of Stock</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">🟡 Low Stock</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        href="/seller/stock"
                        className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] hover:bg-emerald-700 transition"
                      >
                        Add Purchase Stock
                      </Link>
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
