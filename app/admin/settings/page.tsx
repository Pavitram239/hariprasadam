'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, RefreshCw, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [isReseeding, setIsReseeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleReseed = async () => {
    if (!confirm('Are you sure you want to reset and re-seed the catalogue? This will ensure all 27 products and gift collections match the official brochures.')) {
      return;
    }

    setIsReseeding(true);
    setSeedResult(null);

    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      setSeedResult(data);
    } catch (err: any) {
      setSeedResult({ success: false, message: err.message || 'Error executing reseed' });
    } finally {
      setIsReseeding(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#E6DEC8]">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C59B3F]">
          Configuration & Diagnostics
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#1A1412] mt-0.5">
          System Settings
        </h1>
        <p className="text-xs text-[#63574E] mt-0.5">
          Platform status, database connection information, and maintenance utilities.
        </p>
      </div>

      {/* Card 1: System & Database Status */}
      <div className="bg-white border border-[#E6DEC8] rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#1A1412] border-b border-[#F2ECE1] pb-3 flex items-center space-x-2">
          <Database className="w-4 h-4 text-[#C59B3F]" />
          <span>Storage & Cloud Database Status</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-lg border border-[#E6DEC8]">
            <div>
              <strong className="text-[#1A1412] block">Storage Architecture:</strong>
              <span className="text-[#63574E]">Dual-Resilient (Supabase PostgreSQL + Persistent Local Storage)</span>
            </div>
            <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
              Operational
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-lg border border-[#E6DEC8]">
            <div>
              <strong className="text-[#1A1412] block">Client Authentication:</strong>
              <span className="text-[#63574E]">Supabase Auth with Encrypted Admin Session Cookies</span>
            </div>
            <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
              Protected
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-lg border border-[#E6DEC8]">
            <div>
              <strong className="text-[#1A1412] block">Enquiry Notification Service:</strong>
              <span className="text-[#63574E]">Nodemailer SMTP Dispatch to info@hariprasadam.com</span>
            </div>
            <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
              Configured
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Catalogue Maintenance Utility */}
      <div className="bg-white border border-[#E6DEC8] rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#1A1412] border-b border-[#F2ECE1] pb-3 flex items-center space-x-2">
          <RefreshCw className="w-4 h-4 text-[#C59B3F]" />
          <span>Catalogue Maintenance & Re-seeding</span>
        </h3>

        <p className="text-xs text-[#63574E] leading-relaxed">
          If you ever need to restore the official catalogue items (the authentic 27 product flavours, 6 categories, 2026 gift boxes, and 8 signature combos) from the source brochures, you can trigger a re-seed here.
        </p>

        {seedResult && (
          <div
            className={`p-3 text-xs rounded-lg ${
              seedResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {seedResult.message}
          </div>
        )}

        <div>
          <button
            onClick={handleReseed}
            disabled={isReseeding}
            className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#EFE8DC] text-[#1A1412] border border-[#DDD4C3] rounded-md text-xs font-semibold transition-colors flex items-center space-x-2 cursor-pointer disabled:opacity-60"
          >
            {isReseeding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#C59B3F]" />
                <span>Re-seeding Catalogue...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 text-[#C59B3F]" />
                <span>Re-sync Catalogue from Source Files</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
