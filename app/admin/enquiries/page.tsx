'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  Building,
  Calendar,
  Package,
  CheckCircle2,
  Clock,
  ExternalLink,
  Lock,
  Download,
} from 'lucide-react';
import { Enquiry, EnquiryStatus } from '@/lib/types';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Security passcode protection
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Filters and search
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAllEnquiries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/enquiries');
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.data);
      } else {
        setError(data.error || 'Failed to fetch enquiries');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if previously logged in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('hp_admin_auth') === 'true') {
      setIsAuthenticated(true);
      fetchAllEnquiries();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default passcode or custom passcode
    if (passcode === 'hari2026admin' || passcode === 'admin') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('hp_admin_auth', 'true');
      }
      fetchAllEnquiries();
    } else {
      setPasscodeError(true);
    }
  };

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((enq) => (enq.id === id ? { ...enq, status: newStatus } : enq))
        );
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enq) => {
      // Status filter
      if (statusFilter !== 'All' && enq.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = enq.name.toLowerCase().includes(q);
        const matchesPhone = enq.phone.toLowerCase().includes(q);
        const matchesEmail = (enq.email || '').toLowerCase().includes(q);
        const matchesCompany = (enq.company || '').toLowerCase().includes(q);
        const matchesType = enq.enquiry_type.toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesEmail || matchesCompany || matchesType;
      }
      return true;
    });
  }, [enquiries, statusFilter, searchQuery]);

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'Company', 'Type', 'Quantity', 'Status', 'Message', 'Source'];
    const rows = filteredEnquiries.map((e) => [
      e.id,
      new Date(e.created_at).toISOString(),
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.phone.replace(/"/g, '""')}"`,
      `"${(e.email || '').replace(/"/g, '""')}"`,
      `"${(e.company || '').replace(/"/g, '""')}"`,
      `"${e.enquiry_type}"`,
      `"${(e.quantity || '').replace(/"/g, '""')}"`,
      `"${e.status}"`,
      `"${e.message.replace(/"/g, '""')}"`,
      `"${e.source_page}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hariprasadam_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Passcode login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="bg-white border border-[#E6DEC8] rounded-2xl p-8 max-w-md w-full shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#FAF8F5] border border-[#C59B3F]/40 rounded-full flex items-center justify-center text-[#C59B3F] mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1A1412]">
              HariPrasadam Admin Portal
            </h2>
            <p className="text-xs text-[#63574E]">
              Enter the administration passcode to view customer enquiries.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                placeholder="Enter passcode (e.g. hari2026admin)"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
              />
              {passcodeError && (
                <p className="text-xs text-red-600 mt-1">
                  Incorrect passcode. (Use: <code className="bg-red-50 px-1 py-0.5 rounded">hari2026admin</code>)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1A1412] hover:bg-[#2C221E] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DEC8]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#C59B3F] uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Management Console</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1412]">
            Customer Enquiries Dashboard
          </h1>
          <p className="text-xs text-[#63574E] mt-0.5">
            Real-time lead tracking from website, product catalogues, and corporate pages.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportCSV}
            className="inline-flex items-center px-3.5 py-2 bg-white border border-[#DDD4C3] hover:bg-[#FAF8F5] text-xs font-medium text-[#1A1412] rounded-md transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-[#C59B3F]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchAllEnquiries}
            className="inline-flex items-center px-3.5 py-2 bg-[#1A1412] text-[#FAF8F5] text-xs font-medium rounded-md hover:bg-[#2C221E] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Enquiries', value: enquiries.length, color: 'text-[#1A1412]' },
          { label: 'New Enquiries', value: enquiries.filter((e) => e.status === 'New').length, color: 'text-blue-600' },
          { label: 'Contacted', value: enquiries.filter((e) => e.status === 'Contacted').length, color: 'text-amber-600' },
          { label: 'Quoted / Closed', value: enquiries.filter((e) => e.status === 'Quoted' || e.status === 'Closed').length, color: 'text-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-[#E6DEC8] rounded-xl p-4 shadow-2xs">
            <span className="text-xs font-medium text-[#7A6D63] block">{stat.label}</span>
            <span className={`font-serif text-2xl font-bold mt-1 block ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-[#E6DEC8] rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['All', 'New', 'Contacted', 'Quoted', 'Closed'].map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#1A1412] text-[#FAF8F5]'
                    : 'bg-[#FAF8F5] text-[#5C5047] hover:bg-[#F2ECE1] border border-[#E6DEC8]'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#8A7E75] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, company..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
          />
        </div>
      </div>

      {/* Enquiries Table / Card List */}
      <div className="bg-white border border-[#E6DEC8] rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-16 text-center text-xs text-[#63574E]">
            Loading enquiries...
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <p className="font-serif text-lg font-medium text-[#1A1412]">
              No enquiries found
            </p>
            <p className="text-xs text-[#63574E]">
              Try clearing search filters or check back after visitors submit forms.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E6DEC8] text-[#5C5047] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Customer Info</th>
                  <th className="py-3 px-4">Type & Quantity</th>
                  <th className="py-3 px-4">Message / Requirement</th>
                  <th className="py-3 px-4">Source Page</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {filteredEnquiries.map((enq) => {
                  const dateStr = new Date(enq.created_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  });

                  return (
                    <tr key={enq.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap align-top text-[#63574E]">
                        <span className="font-medium text-[#1A1412] block">{dateStr}</span>
                        <span className="text-[10px] text-[#8A7E75] uppercase">{enq.id.slice(0, 8)}</span>
                      </td>

                      {/* Customer info */}
                      <td className="py-4 px-4 align-top space-y-1">
                        <strong className="font-serif text-sm font-semibold text-[#1A1412] block">
                          {enq.name}
                        </strong>
                        <a
                          href={`tel:${enq.phone}`}
                          className="text-[#A85A2A] hover:underline flex items-center"
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          <span>{enq.phone}</span>
                        </a>
                        {enq.email && (
                          <a
                            href={`mailto:${enq.email}`}
                            className="text-[#63574E] hover:underline flex items-center"
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            <span>{enq.email}</span>
                          </a>
                        )}
                        {enq.company && (
                          <div className="text-[11px] text-[#4A3E37] font-medium flex items-center">
                            <Building className="w-3 h-3 mr-1 text-[#8A7E75]" />
                            <span>{enq.company}</span>
                          </div>
                        )}
                      </td>

                      {/* Type & Quantity */}
                      <td className="py-4 px-4 align-top space-y-1 whitespace-nowrap">
                        <span className="inline-block bg-[#F2ECE1] text-[#1A1412] px-2 py-0.5 rounded font-semibold text-[10px] uppercase tracking-wide">
                          {enq.enquiry_type}
                        </span>
                        {enq.quantity && (
                          <div className="text-[11px] text-[#63574E]">
                            Qty: <strong className="text-[#1A1412]">{enq.quantity}</strong>
                          </div>
                        )}
                        {enq.product_name && (
                          <div className="text-[11px] text-[#C59B3F] font-medium truncate max-w-[180px]">
                            {enq.product_name}
                          </div>
                        )}
                      </td>

                      {/* Message */}
                      <td className="py-4 px-4 align-top max-w-xs">
                        <p className="text-[#332A24] leading-relaxed line-clamp-4">
                          {enq.message}
                        </p>
                      </td>

                      {/* Source */}
                      <td className="py-4 px-4 align-top whitespace-nowrap text-[#7A6D63]">
                        <span className="bg-[#FAF8F5] border border-[#E6DEC8] px-2 py-0.5 rounded font-mono text-[10px]">
                          {enq.source_page}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <select
                          value={enq.status}
                          disabled={updatingId === enq.id}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                          className={`text-xs font-semibold py-1 px-2 rounded border cursor-pointer focus:outline-none ${
                            enq.status === 'New'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : enq.status === 'Contacted'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : enq.status === 'Quoted'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Quoted">Quoted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
