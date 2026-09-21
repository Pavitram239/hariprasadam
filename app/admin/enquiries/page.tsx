'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Inbox,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  Building,
  Download,
  CheckCircle,
  Clock,
  Package,
  ExternalLink,
  Eye,
  X,
} from 'lucide-react';
import { Enquiry, EnquiryStatus } from '@/lib/types';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and search
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

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
    fetchAllEnquiries();
  }, []);

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
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry((prev) => prev ? { ...prev, status: newStatus } : null);
        }
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
    const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'Company', 'Type', 'Quantity', 'Status', 'Message', 'Source', 'Product'];
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
      `"${(e.product_name || '').replace(/"/g, '""')}"`,
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E6DEC8]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C59B3F]">
            Lead Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1A1412] mt-0.5">
            Customer Enquiries CRM
          </h1>
          <p className="text-xs text-[#63574E] mt-0.5">
            Incoming orders and gifting requests captured with product and page context.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportCSV}
            className="inline-flex items-center px-3.5 py-2 bg-white border border-[#DDD4C3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#1A1412] rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-[#C59B3F]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchAllEnquiries}
            className="inline-flex items-center px-3.5 py-2 bg-[#1A1412] text-[#FAF8F5] text-xs font-semibold rounded-md hover:bg-[#2C221E] transition-colors cursor-pointer"
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
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['All', 'New', 'Contacted', 'Quoted', 'Closed'].map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide whitespace-nowrap transition-colors cursor-pointer ${
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

      {/* Enquiries Table */}
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
              Try clearing search filters.
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
                  <th className="py-3 px-4">Message / Context</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
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
                        <span className="text-[10px] text-[#8A7E75] uppercase font-mono">{enq.id.slice(0, 8)}</span>
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
                        <p className="text-[#332A24] leading-relaxed line-clamp-3">
                          {enq.message}
                        </p>
                        <span className="text-[10px] text-[#8A7E75] block mt-1">
                          Source: {enq.source_page}
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

                      {/* View Details */}
                      <td className="py-4 px-4 text-right align-top whitespace-nowrap">
                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="p-1.5 text-[#4A3E37] hover:text-[#1A1412] hover:bg-[#FAF8F5] rounded border border-[#DDD4C3] cursor-pointer"
                          title="View Full Enquiry Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E6DEC8] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C59B3F]">
                  Enquiry Details
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1A1412]">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#4A3E37]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold uppercase text-[#8A7E75] block">Phone Number</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="text-sm font-semibold text-[#A85A2A] hover:underline">
                    {selectedEnquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="font-bold uppercase text-[#8A7E75] block">Email</span>
                  <span className="text-sm font-medium text-[#1A1412]">
                    {selectedEnquiry.email || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold uppercase text-[#8A7E75] block">Company</span>
                  <span className="text-xs text-[#1A1412]">{selectedEnquiry.company || 'Not provided'}</span>
                </div>
                <div>
                  <span className="font-bold uppercase text-[#8A7E75] block">Type</span>
                  <span className="text-xs font-semibold text-[#C59B3F]">{selectedEnquiry.enquiry_type}</span>
                </div>
              </div>

              {selectedEnquiry.quantity && (
                <div>
                  <span className="font-bold uppercase text-[#8A7E75] block">Estimated Quantity</span>
                  <span className="text-xs text-[#1A1412] font-semibold">{selectedEnquiry.quantity}</span>
                </div>
              )}

              {selectedEnquiry.product_name && (
                <div>
                  <span className="font-bold uppercase text-[#8A7E75] block">Enquired Product / Box</span>
                  <span className="text-xs text-[#C59B3F] font-semibold">{selectedEnquiry.product_name}</span>
                </div>
              )}

              <div>
                <span className="font-bold uppercase text-[#8A7E75] block">Source Page</span>
                <span className="text-xs font-mono text-[#4A3E37] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E6DEC8]">
                  {selectedEnquiry.source_page}
                </span>
              </div>

              <div>
                <span className="font-bold uppercase text-[#8A7E75] block mb-1">Customer Message</span>
                <div className="p-3 bg-[#FAF8F5] border border-[#E6DEC8] rounded-lg text-xs leading-relaxed text-[#2E2621]">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#F2ECE1]">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#8A7E75]">Status:</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value as EnquiryStatus)}
                    className="text-xs font-semibold py-1 px-2 rounded border"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedEnquiry.name)},%20thank%20you%20for%20contacting%20HariPrasadam%20regarding%20your%20enquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#25D366] text-white font-semibold rounded text-xs flex items-center space-x-1"
                >
                  <span>WhatsApp Lead</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
