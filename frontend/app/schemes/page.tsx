'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';
import { Award, FileText, CheckCircle2, ExternalLink, Building2, Calendar, Sparkles } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

export default function GovernmentSchemesPage() {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/schemes')
      .then(data => {
        setSchemes(data || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Banner with Uploaded Image Background */}
      <PageHeader
        badge="Government Subsidies & Benefits"
        badgeIcon={<Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
        title={
          <>
            🏆 {t('governmentSchemes')}
          </>
        }
        subtitle="Explore seed subsidy schemes, certified hybrid mini-kit distribution programs, and state agricultural financial assistance available in Tamil Nadu."
        breadcrumbs={[{ label: 'Government Subsidies' }]}
      />

      {/* Schemes List Grid */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-44 bg-slate-100 animate-pulse rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {schemes.map(scheme => (
            <div key={scheme._id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 hover:border-amber-400 transition">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                    {scheme.department}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-2">{scheme.schemeName}</h3>
                </div>

                <a
                  href={scheme.officialLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
                >
                  Official Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{scheme.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Key Benefits & Subsidy
                  </span>
                  <p className="text-xs font-semibold text-slate-800">{scheme.benefits}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Eligibility Criteria</span>
                  <p className="text-xs font-semibold text-slate-800">{scheme.eligibility}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-500" /> Required Documents
                  </span>
                  <p className="text-xs font-semibold text-slate-800">{scheme.requiredDocuments}</p>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
