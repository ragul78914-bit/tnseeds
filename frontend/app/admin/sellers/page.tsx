'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import { Store, Power, MapPin, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSellers = () => {
    setLoading(true);
    fetchApi('/admin/sellers')
      .then(data => {
        setSellers(data || []);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const toggleSeller = async (sellerId: string) => {
    try {
      await fetchApi(`/admin/sellers/${sellerId}/toggle`, { method: 'PATCH' });
      loadSellers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            🏪 Seller Centers & Distribution Outlets Management
          </h1>
          <p className="text-xs text-slate-500">
            Activate or Deactivate sellers. Deactivating a seller immediately hides their seed inventory from farmer search queries.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Business Name</th>
                <th className="py-3.5 px-4">Owner Name</th>
                <th className="py-3.5 px-4">District / Address</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">License No</th>
                <th className="py-3.5 px-4">Seeds Listed</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr><td colSpan={8} className="py-6 text-center text-slate-400">Loading sellers...</td></tr>
              ) : (
                sellers.map(s => (
                  <tr key={s._id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{s.businessName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{s.ownerName}</td>
                    <td className="py-3.5 px-4 text-slate-500">{s.district} • {s.address}</td>
                    <td className="py-3.5 px-4 text-slate-600">{s.phone}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{s.licenseNo}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">{s.seedCount || 8} products</td>
                    <td className="py-3.5 px-4">
                      {s.status === 'ACTIVE' ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">ACTIVE</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-md">DEACTIVATED</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleSeller(s._id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          s.status === 'ACTIVE'
                            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        }`}
                      >
                        {s.status === 'ACTIVE' ? 'Deactivate Seller' : 'Activate Seller'}
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
