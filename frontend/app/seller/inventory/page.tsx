'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import { Layers, Plus, RefreshCw, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight } from 'lucide-react';

export default function SellerInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInventory = () => {
    setLoading(true);
    fetchApi('/inventory/table')
      .then(data => {
        setInventory(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadInventory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            📊 Central Inventory Ledger Table
          </h1>
          <p className="text-xs text-slate-500">
            Current Stock = Opening + Purchases + Adjustments In - Sales - Damaged - Shortage - Adjustments Out
          </p>
        </div>

        <Link
          href="/seller/stock"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Record Stock Transaction
        </Link>
      </div>

      {/* Sub Header */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 border-b border-slate-200 pb-2">
        <Link href="/seller/dashboard" className="px-4 py-2 hover:bg-slate-100 rounded-xl">Overview</Link>
        <Link href="/seller/seeds" className="px-4 py-2 hover:bg-slate-100 rounded-xl">Seeds Catalog</Link>
        <Link href="/seller/inventory" className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl">Inventory Balances</Link>
        <Link href="/seller/stock" className="px-4 py-2 hover:bg-slate-100 rounded-xl">Stock Entry & Adjustments</Link>
      </div>

      {/* Inventory Master Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Seed Code</th>
                <th className="py-3.5 px-4">Seed Name</th>
                <th className="py-3.5 px-4">Crop</th>
                <th className="py-3.5 px-4">Opening</th>
                <th className="py-3.5 px-4 text-emerald-700">+Purchases</th>
                <th className="py-3.5 px-4 text-blue-700">-Sales</th>
                <th className="py-3.5 px-4 text-rose-700">-Damaged</th>
                <th className="py-3.5 px-4 text-amber-700">-Shortage</th>
                <th className="py-3.5 px-4 font-extrabold text-slate-900 bg-emerald-50">Current Stock</th>
                <th className="py-3.5 px-4">Asset Value</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">Calculating inventory ledger...</td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">No inventory records found.</td>
                </tr>
              ) : (
                inventory.map(row => (
                  <tr key={row._id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{row.seedCode}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.seedName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{row.crop}</td>
                    <td className="py-3.5 px-4 text-slate-500">{row.openingStock} {row.unit}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">+{row.purchased}</td>
                    <td className="py-3.5 px-4 font-bold text-blue-700">-{row.sold}</td>
                    <td className="py-3.5 px-4 font-bold text-rose-600">-{row.damaged}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-600">-{row.shortage}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm bg-emerald-50/50">{row.currentStock} {row.unit}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">₹{(row.stockValue || 0).toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      {row.status === 'AVAILABLE' && (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">🟢 AVAILABLE</span>
                      )}
                      {row.status === 'LOW_STOCK' && (
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">🟡 LOW STOCK</span>
                      )}
                      {row.status === 'OUT_OF_STOCK' && (
                        <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-md">🔴 OUT OF STOCK</span>
                      )}
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
