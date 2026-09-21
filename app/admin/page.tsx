'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  CheckCircle,
  FileEdit,
  Gift,
  Boxes,
  ArrowRight,
  Plus,
  RefreshCw,
  ExternalLink,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { Product, GiftBox, ComboItem } from '@/lib/types';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [gifting, setGifting] = useState<GiftBox[]>([]);
  const [combos, setCombos] = useState<ComboItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [pRes, gRes, cRes] = await Promise.all([
        fetch('/api/admin/products?includeArchived=true'),
        fetch('/api/admin/gifting'),
        fetch('/api/admin/combos'),
      ]);

      const pData = await pRes.json();
      const gData = await gRes.json();
      const cData = await cRes.json();

      if (pData.success) setProducts(pData.data);
      if (gData.success) setGifting(gData.data);
      if (cData.success) setCombos(cData.data);
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
  const totalGiftBoxes = gifting.length;
  const totalCombos = combos.length;

  // Recently updated products
  const recentlyUpdated = [...products]
    .sort((a, b) => new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime())
    .slice(0, 6);

  // Recently added products
  const recentlyAdded = [...products]
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DEC8]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C59B3F]">
            Overview
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1A1412] mt-0.5">
            Catalogue Dashboard
          </h1>
          <p className="text-xs text-[#63574E] mt-0.5">
            Welcome to the HariPrasadam Admin CMS. Manage flavours, categories, gift collections, and signature combos.
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

      {/* Real Database Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Products */}
        <div className="bg-white border border-[#E6DEC8] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7A6D63] font-medium">Total Products</span>
            <Package className="w-4 h-4 text-[#C59B3F]" />
          </div>
          <span className="font-serif text-3xl font-bold text-[#1A1412] block">
            {totalProducts}
          </span>
          <span className="text-[10px] text-[#8A7E75] block">Active catalogue</span>
        </div>

        {/* Published Products */}
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

        {/* Draft Products */}
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

        {/* Gift Collections */}
        <div className="bg-white border border-[#E6DEC8] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7A6D63] font-medium">Gift Collections</span>
            <Gift className="w-4 h-4 text-[#A85A2A]" />
          </div>
          <span className="font-serif text-3xl font-bold text-[#A85A2A] block">
            {totalGiftBoxes}
          </span>
          <span className="text-[10px] text-[#8A7E75] block">2026 Collection boxes</span>
        </div>

        {/* Signature Combos */}
        <div className="bg-white border border-[#E6DEC8] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7A6D63] font-medium">Signature Combos</span>
            <Boxes className="w-4 h-4 text-[#C59B3F]" />
          </div>
          <span className="font-serif text-3xl font-bold text-[#1A1412] block">
            {totalCombos}
          </span>
          <span className="text-[10px] text-[#8A7E75] block">Curated assortments</span>
        </div>
      </div>

      {/* Quick Access Actions */}
      <div className="bg-[#FAF8F5] border border-[#E6DEC8] rounded-xl p-5 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1A1412] mr-2">
          Quick Actions:
        </span>
        <Link
          href="/admin/products"
          className="px-3 py-1.5 bg-white border border-[#DDD4C3] hover:border-[#C59B3F] text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5"
        >
          <Package className="w-3.5 h-3.5 text-[#C59B3F]" />
          <span>All Products</span>
        </Link>
        <Link
          href="/admin/categories"
          className="px-3 py-1.5 bg-white border border-[#DDD4C3] hover:border-[#C59B3F] text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5"
        >
          <Layers className="w-3.5 h-3.5 text-[#C59B3F]" />
          <span>Categories</span>
        </Link>
        <Link
          href="/admin/gifting"
          className="px-3 py-1.5 bg-white border border-[#DDD4C3] hover:border-[#C59B3F] text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5"
        >
          <Gift className="w-3.5 h-3.5 text-[#C59B3F]" />
          <span>Gifting Suites</span>
        </Link>
        <Link
          href="/admin/combos"
          className="px-3 py-1.5 bg-white border border-[#DDD4C3] hover:border-[#C59B3F] text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5"
        >
          <Boxes className="w-3.5 h-3.5 text-[#C59B3F]" />
          <span>Combos</span>
        </Link>
        <Link
          href="/admin/media"
          className="px-3 py-1.5 bg-white border border-[#DDD4C3] hover:border-[#C59B3F] text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5"
        >
          <ImageIcon className="w-3.5 h-3.5 text-[#C59B3F]" />
          <span>Media Library</span>
        </Link>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs font-semibold text-[#A85A2A] hover:underline flex items-center space-x-1"
        >
          <span>Open Live Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Two-Column Section: Recently Updated Products & Recently Added Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Recently Updated Products */}
        <div className="bg-white border border-[#E6DEC8] rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#F2ECE1] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1A1412]">
                Recently Updated Products
              </h3>
              <p className="text-xs text-[#63574E]">
                Products with the most recent catalogue edits.
              </p>
            </div>

            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#A85A2A] hover:underline flex items-center"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="divide-y divide-[#F2ECE1]">
            {recentlyUpdated.map((prod) => (
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

        {/* Right Column: Recently Added Products */}
        <div className="bg-white border border-[#E6DEC8] rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#F2ECE1] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1A1412]">
                Recently Added Products
              </h3>
              <p className="text-xs text-[#63574E]">
                Newest items created in the catalogue database.
              </p>
            </div>

            <Link
              href="/admin/products/new"
              className="text-xs font-semibold text-[#A85A2A] hover:underline flex items-center"
            >
              <span>+ Add New</span>
            </Link>
          </div>

          <div className="divide-y divide-[#F2ECE1]">
            {recentlyAdded.map((prod) => (
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
