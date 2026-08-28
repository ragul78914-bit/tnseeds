'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { ShieldAlert, Users, Store, Package, Layers, Activity, Award, CheckCircle2, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageHeader from '../../../components/PageHeader';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/admin/dashboard')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm font-semibold">Loading System Admin Metrics...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner with Uploaded Image Background */}
      <PageHeader
        badge="State Agriculture Control Center"
        badgeIcon={<ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
        title="🛡️ Admin System Administration"
        subtitle="Monitor registered farmers, active seed sellers, certified stocks across Tamil Nadu, and system audit logs"
        breadcrumbs={[{ label: 'Administration' }, { label: 'Command Center' }]}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/admin/sellers"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-950/40 border border-emerald-400/30"
          >
            Manage Sellers
          </Link>
          <Link
            href="/admin/audit-logs"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 backdrop-blur-md transition"
          >
            View Audit Logs
          </Link>
        </div>
      </PageHeader>

      {/* Sub Nav */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold text-slate-600">
        <Link href="/admin/dashboard" className="px-4 py-2 bg-slate-900 text-white rounded-xl">Overview</Link>
        <Link href="/admin/sellers" className="px-4 py-2 hover:bg-slate-100 rounded-xl">Sellers Management</Link>
        <Link href="/admin/audit-logs" className="px-4 py-2 hover:bg-slate-100 rounded-xl">System Audit Logs</Link>
        <Link href="/schemes" className="px-4 py-2 hover:bg-slate-100 rounded-xl">Government Schemes</Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Farmers</span>
          <p className="text-2xl font-extrabold text-slate-900">{metrics.totalFarmers || 0}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center"><Users className="w-3 h-3 mr-1" /> Registered Users</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Sellers</span>
          <p className="text-2xl font-extrabold text-blue-700">{metrics.totalSellers || 0}</p>
          <span className="text-[10px] text-blue-600 font-semibold">{metrics.activeSellers} Active Outlets</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Seeds</span>
          <p className="text-2xl font-extrabold text-slate-900">{metrics.totalSeeds || 0}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Global Products</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">System Available Stock</span>
          <p className="text-2xl font-extrabold text-emerald-700">{metrics.totalStockKg || 0} kg</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Live Availability</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-amber-600 block">Low Stock</span>
          <p className="text-2xl font-extrabold text-amber-600">{metrics.lowStockCount || 0}</p>
          <span className="text-[10px] text-amber-600 font-semibold">Near Reorder</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-rose-600 block">Out of Stock</span>
          <p className="text-2xl font-extrabold text-rose-600">{metrics.outOfStockCount || 0}</p>
          <span className="text-[10px] text-rose-600 font-semibold">Zero Balance</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Govt Schemes</span>
          <p className="text-2xl font-extrabold text-amber-700">{metrics.totalSchemes || 0}</p>
          <span className="text-[10px] text-amber-600 font-semibold">Active Programs</span>
        </div>

      </div>

      {/* District & Crop Distribution Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">District-Wise Seller Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.districtDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="district" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" radius={[6, 6, 0, 0]} name="Sellers Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Crop-Wise Stock Volume (kg)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.cropDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="stock" fill="#0284c7" radius={[6, 6, 0, 0]} name="Total Stock (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Audit Activity */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-extrabold text-slate-900 text-base">Recent System Audit Logs</h3>
          <Link href="/admin/audit-logs" className="text-xs font-bold text-emerald-600 hover:underline">
            View All Audit Logs →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(data?.recentLogs || []).map((log: any) => (
                <tr key={log._id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.userName}</td>
                  <td className="py-3 px-4 text-slate-600">{log.role}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{log.action}</td>
                  <td className="py-3 px-4 text-slate-600">{log.newValue || log.recordId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
