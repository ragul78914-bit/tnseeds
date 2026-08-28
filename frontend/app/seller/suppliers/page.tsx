'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';
import { Truck, Plus, Save } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';

export default function SellerSuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [supplierName, setSupplierName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  const loadSuppliers = () => {
    setLoading(true);
    fetchApi('/sellers/suppliers')
      .then(data => {
        setSuppliers(data || []);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/sellers/suppliers', {
        method: 'POST',
        body: JSON.stringify({ supplierName, contactPerson, phone, email, address, gstNumber })
      });
      setSupplierName('');
      setContactPerson('');
      setPhone('');
      setEmail('');
      setAddress('');
      setGstNumber('');
      loadSuppliers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header with Uploaded Image Background */}
      <PageHeader
        badge="Vendor & Supply Management"
        badgeIcon={<Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
        title="🚚 Seed Suppliers & Vendors Directory"
        subtitle="Manage certified seed producers, state seed corporations, and regional distributors"
        breadcrumbs={[{ label: 'Seller Center', href: '/seller/dashboard' }, { label: 'Suppliers' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Add Supplier Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-extrabold text-slate-900 text-base">Add New Supplier</h3>

          <form onSubmit={handleAddSupplier} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Company / Supplier Name *</label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
                placeholder="e.g. Syngenta India Ltd"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Karthik"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="9876543210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">GST Number</label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="33AABCS1234F1Z1"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Supplier
            </button>
          </form>
        </div>

        {/* Suppliers List */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Registered Suppliers ({suppliers.length})</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Supplier Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">GST No</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr><td colSpan={5} className="py-4 text-center">Loading suppliers...</td></tr>
                ) : suppliers.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 text-center">No suppliers added yet.</td></tr>
                ) : (
                  suppliers.map(s => (
                    <tr key={s._id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{s.supplierCode}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{s.supplierName}</td>
                      <td className="py-3 px-4 text-slate-600">{s.phone} ({s.contactPerson || 'N/A'})</td>
                      <td className="py-3 px-4 text-slate-500">{s.gstNumber || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">ACTIVE</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
