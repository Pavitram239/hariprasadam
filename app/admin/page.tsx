'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  CheckCircle,
  FileEdit,
  Inbox,
  Bell,
  Gift,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Product, GiftBox, Enquiry, EnquiryStatus } from '@/lib/types';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [gifting, setGifting] = useState<GiftBox[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [pRes, gRes, eRes] = await Promise.all([
        fetch('/api/admin/products?includeArchived=true'),
        fetch('/api/admin/gifting'),
        fetch('/api/admin/enquiries'),
      ]);

      const pData = await pRes.json();
      const gData = await gRes.json();
      const eData = await eRes.json();

      if (pData.success) setProducts(pData.data);
      if (gData.success) setGifting(gData.data);
      if (eData.success) setEnquiries(eData.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalProducts = products.filter((p) => p.status !== 'archived').length;
  const publishedProducts = products.filter((p) => p.status === 'published').length;
  const draftProducts = products.filter((p) => p.status === 'draft').length;
  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter((e) => e.status === 'New').length;
  const totalGiftBoxes = gifting.length;

  const recentEnquiries = enquiries.slice(0, 5);
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime())
    .slice(0, 5);

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    try {
      await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DEC8]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C59B3F]">
            Overview
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1A1412] mt-0.5">
            Admin Dashboard
          </h1>
          <p className="text-xs text-[#63574E] mt-0.5">
            Welcome to HariPrasadam Content Management. Manage catalogue flavours, gift boxes, and incoming leads.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadDashboardData}
            className="px-3.5 py-2 bg-white border border-[#DDD4C3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#1A1412] rounded-md transition-colors flex items-center shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-[#1A1412] hover:bg-[#2C221E] text-[#FAF8F5] text-xs font-semibold rounded-md shadow transition-colors flex items-center space-x-1.5 border border-[#C59B3F]/30 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C59B3F]" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Products */}
        <div className="bg-white border border-[#E6DEC8] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7A6D63] font-medium">Total Products</span>
            <Package className="w-4 h-4 text-[#C59B3F]" />
          </div>
          <span className="font-serif text-3xl font-bold text-[#1A1412] block">
            {totalProducts}
          </span>
          <span className="text-[10px] text-[#8A7E75] block">In catalogue</span>
        </div>

        {/* Published */}
        <div className="bg-white border border-[#E6DEC8] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7A6D63] font-medium">Published</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif text-3xl font-bold text-emerald-700 block">
            {publishedProducts}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium block">Live on website</span>
        </div>

        {/* Drafts */}
        <div className="bg-white border border-[#E6DEC8] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7A6D63] font-medium">Drafts</span>
            <FileEdit className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-serif text-3xl font-bold text-amber-600 block">
            {draftProducts}
          </span>
          <span className="text-[10px] text-amber-700 font-medium block">Unpublished</span>
        </div>

        {/* Total Enquiries */}
        <div className="bg-white border border-[#E6DEC8] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7A6D63] font-medium">Total Enquiries</span>
            <Inbox className="w-4 h-4 text-[#C59B3F]" />
          </div>
          <span className="font-serif text-3xl font-bold text-[#1A1412] block">
            {totalEnquiries}
          </span>
          <span className="text-[10px] text-[#8A7E75] block">Customer leads</span>
        </div>

        {/* New Enquiries */}
        <div className="bg-white border border-[#E6DEC8] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7A6D63] font-medium">New Enquiries</span>
            <Bell className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-serif text-3xl font-bold text-blue-600 block">
            {newEnquiries}
          </span>
          <span className="text-[10px] text-blue-700 font-medium block">Awaiting reply</span>
        </div>

        {/* Gift Collections */}
        <div className="bg-white border border-[#E6DEC8] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7A6D63] font-medium">Gift Collections</span>
            <Gift className="w-4 h-4 text-[#A85A2A]" />
          </div>
          <span className="font-serif text-3xl font-bold text-[#A85A2A] block">
            {totalGiftBoxes}
          </span>
          <span className="text-[10px] text-[#8A7E75] block">Boxes & Jute suites</span>
        </div>
      </div>

      {/* Two-Column Section: Recent Enquiries & Recently Updated Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Enquiries (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E6DEC8] rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#F2ECE1] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1A1412]">
                Recent Customer Enquiries
              </h3>
              <p className="text-xs text-[#63574E]">
                Latest enquiries from website and product pages.
              </p>
            </div>

            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-[#A85A2A] hover:underline flex items-center"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="divide-y divide-[#F2ECE1]">
            {recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8A7E75]">
                No customer enquiries yet.
              </div>
            ) : (
              recentEnquiries.map((enq) => (
                <div key={enq.id} className="p-4 flex items-start justify-between gap-4 hover:bg-[#FAF8F5] transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <strong className="text-xs font-semibold text-[#1A1412]">
                        {enq.name}
                      </strong>
                      <span className="text-[10px] bg-[#FAF8F5] text-[#7A6D63] px-2 py-0.5 rounded border border-[#E6DEC8]">
                        {enq.enquiry_type}
                      </span>
                    </div>

                    <p className="text-xs text-[#63574E] line-clamp-1">
                      {enq.message}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-[#8A7E75]">
                      <span>{enq.phone}</span>
                      {enq.product_name && (
                        <>
                          <span>•</span>
                          <span className="text-[#C59B3F] font-medium">{enq.product_name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right space-y-1">
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                      className={`text-[11px] font-semibold py-0.5 px-2 rounded border cursor-pointer ${
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

                    <span className="block text-[10px] text-[#8A7E75]">
                      {new Date(enq.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recently Updated Products (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E6DEC8] rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#F2ECE1] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1A1412]">
                Recently Updated Products
              </h3>
              <p className="text-xs text-[#63574E]">
                Quick access to edit products.
              </p>
            </div>

            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#A85A2A] hover:underline flex items-center"
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="divide-y divide-[#F2ECE1]">
            {recentProducts.map((prod) => (
              <div key={prod.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-[#FAF8F5] border border-[#E6DEC8] relative shrink-0">
                    <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-[#1A1412] truncate">
                      {prod.name}
                    </h4>
                    <span className="text-[10px] text-[#8A7E75] block">
                      {prod.category} • {prod.flavour}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      prod.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {prod.status}
                  </span>

                  <Link
                    href={`/admin/products/${prod.id}`}
                    className="p-1 text-[#63574E] hover:text-[#1A1412] rounded hover:bg-[#EFE8DC]"
                    title="Edit Product"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
