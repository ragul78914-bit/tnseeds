'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import { FileText, Download, Printer, Filter, Table, Sparkles } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';

export default function SellerReportsPage() {
  const [reportType, setReportType] = useState<'valuation' | 'movement'>('valuation');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = () => {
    setLoading(true);
    fetchApi(`/reports/${reportType}`)
      .then(data => {
        setReportData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const exportCSV = () => {
    if (!reportData || !reportData.report) return;
    const items = reportData.report;
    if (items.length === 0) return;

    const keys = Object.keys(items[0]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [
      keys.join(','),
      ...items.map((row: any) => keys.map(k => `"${row[k] || ''}"`).join(','))
    ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header with Uploaded Image Background */}
      <PageHeader
        badge="Analytics & Accounting"
        badgeIcon={<FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
        title="📄 Stock Reports & Inventory Valuation"
        subtitle="Generate inventory valuation statements, stock movement audit trails, and export formatted CSV reports"
        breadcrumbs={[{ label: 'Seller Center', href: '/seller/dashboard' }, { label: 'Reports' }]}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={fetchReport}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition flex items-center gap-1.5 border border-emerald-400/30"
          >
            <Filter className="w-3.5 h-3.5" /> Generate Report
          </button>
          {reportData && (
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-white/20 backdrop-blur-md"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          )}
        </div>
      </PageHeader>

      {/* Selector controls */}
      <div className="flex gap-3 bg-slate-100 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setReportType('valuation')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            reportType === 'valuation' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
          }`}
        >
          Stock Valuation Report
        </button>
        <button
          onClick={() => setReportType('movement')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            reportType === 'movement' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
          }`}
        >
          Stock Movement Ledger
        </button>
      </div>

      {/* Report Data Display */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Generating report data...</div>
      ) : reportData ? (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {reportType === 'valuation' ? 'Stock Valuation & Asset Audit Report' : 'Stock Movement Audit Log'}
              </h3>
              <p className="text-xs text-slate-500">Seller: {reportData.seller} • Generated: {new Date(reportData.generatedAt).toLocaleString()}</p>
            </div>
            {reportData.totalValuation !== undefined && (
              <div className="text-right">
                <span className="text-xs text-slate-400 font-bold uppercase">Total Stock Asset Value</span>
                <p className="text-xl font-extrabold text-emerald-700">₹{reportData.totalValuation.toLocaleString()}</p>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  {reportData.report && reportData.report.length > 0 &&
                    Object.keys(reportData.report[0]).map(key => (
                      <th key={key} className="py-3 px-4 uppercase">{key}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reportData.report?.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {Object.keys(row).map(key => (
                      <td key={key} className="py-3 px-4">
                        {String(row[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          Click "Generate Report" above to inspect stock valuation data.
        </div>
      )}

    </div>
  );
}
