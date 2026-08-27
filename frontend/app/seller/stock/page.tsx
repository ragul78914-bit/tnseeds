'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../lib/api';
import { Plus, Save, History, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function StockEntryPage() {
  const router = useRouter();

  const [seeds, setSeeds] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  
  const [selectedSeedId, setSelectedSeedId] = useState('');
  const [type, setType] = useState<'PURCHASE' | 'SALE' | 'RETURN' | 'DAMAGE' | 'SHORTAGE' | 'MANUAL_ADJUSTMENT'>('PURCHASE');
  const [quantity, setQuantity] = useState('50');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [supplier, setSupplier] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = () => {
    fetchApi('/seeds/seller')
      .then(data => {
        setSeeds(data || []);
        if (data && data.length > 0) setSelectedSeedId(data[0]._id);
      })
      .catch(console.error);

    fetchApi('/inventory/history')
      .then(data => setHistory(data || []))
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetchApi('/inventory/transaction', {
        method: 'POST',
        body: JSON.stringify({
          seedId: selectedSeedId,
          type,
          quantity: parseFloat(quantity),
          batchNumber,
          expiryDate,
          invoiceNo,
          supplier,
          notes
        })
      });

      setSuccess(`✅ Stock transaction ${res.transaction.transactionNo} processed! Current Stock: ${res.inventory.currentStock} ${res.inventory.unit}`);
      setQuantity('50');
      setBatchNumber('');
      setNotes('');
      setLoading(false);

      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to process transaction');
      setLoading(false);
    }
  };

  const selectedSeed = seeds.find(s => s._id === selectedSeedId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            📝 Stock Entry & Inventory Transaction Audit
          </h1>
          <p className="text-xs text-slate-500">
            Record purchases, sales, damage, shortage, and manual adjustments with permanent transaction log
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Transaction Entry Form */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
            New Stock Transaction
          </h3>

          {error && (
            <div className="p-4 bg-rose-50 text-rose-700 text-xs font-bold rounded-2xl border border-rose-200">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Seed Product *</label>
              <select
                value={selectedSeedId}
                onChange={(e) => setSelectedSeedId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
              >
                {seeds.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.seedName} ({s.crop}) — Current: {s.inventory?.currentStock || 0} {s.unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Transaction Type *</label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="PURCHASE">➕ Stock Purchase (Inflow)</option>
                <option value="SALE">➖ Stock Sale (Outflow)</option>
                <option value="RETURN">➕ Customer Return (Inflow)</option>
                <option value="DAMAGE">➖ Damaged Quantity (Outflow)</option>
                <option value="SHORTAGE">➖ Stock Shortage (Outflow)</option>
                <option value="MANUAL_ADJUSTMENT">⚙️ Manual Adjustment In</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Quantity ({selectedSeed?.unit || 'kg'}) *</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="0.1"
                step="any"
                placeholder="e.g. 50"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch Number</label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="BATCH-2026-01"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Invoice / Ref No</label>
                <input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  placeholder="INV-9901"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Supplier / Customer Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes for audit trail..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Recording Transaction...' : 'Submit Stock Entry'}
            </button>

          </form>
        </div>

        {/* Right Column: Permanent Transaction Audit History Table */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base">Transaction Audit Trail Ledger</h3>
            <span className="text-xs text-slate-400">Total: {history.length} records</span>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase sticky top-0 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-3">Txn #</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Seed</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Qty</th>
                  <th className="py-3 px-3">Old → New Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">No transaction logs recorded yet.</td>
                  </tr>
                ) : (
                  history.map((t: any) => (
                    <tr key={t._id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">{t.transactionNo}</td>
                      <td className="py-3 px-3 text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{t.seedName || t.seedId?.seedName}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                          ['PURCHASE', 'RETURN', 'ADJUSTMENT_IN'].includes(t.type)
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold">{t.quantity} {t.unit}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{t.oldStock} → <span className="font-bold text-slate-900">{t.newStock}</span></td>
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
