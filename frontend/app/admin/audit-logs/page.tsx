'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';
import { Activity, ShieldCheck, FileCheck } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/admin/audit-logs')
      .then(data => {
        setLogs(data || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header with Uploaded Image Background */}
      <PageHeader
        badge="Immutable Audit Trail"
        badgeIcon={<FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
        title="📜 System Activity & Audit Log Ledger"
        subtitle="Permanent audit records capturing seed stock entries, user sign-ins, seller authorization toggles, and system security events"
        breadcrumbs={[{ label: 'Administration', href: '/admin/dashboard' }, { label: 'Audit Logs' }]}
      />

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Record ID / Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr><td colSpan={6} className="py-6 text-center text-slate-400">Loading system audit logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={6} className="py-6 text-center text-slate-400">No audit logs recorded yet.</td></tr>
              ) : (
                logs.map(log => (
                  <tr key={log._id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.userName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{log.role}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{log.action}</td>
                    <td className="py-3.5 px-4 text-slate-500">{log.module}</td>
                    <td className="py-3.5 px-4 text-slate-700">{log.newValue || log.recordId}</td>
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
