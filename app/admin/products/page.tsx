'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Filter,
  FileEdit,
  Copy,
  Archive,
  Eye,
  CheckCircle,
  XCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Product, ContentStatus } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/products?includeArchived=true');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleTogglePublish = async (product: Product) => {
    const nextStatus: ContentStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
        );
        setMessage({
          text: `Product "${product.name}" is now ${nextStatus === 'published' ? 'Live (Published)' : 'Draft (Unpublished)'}.`,
          type: 'success',
        });
      }
    } catch (err) {
      setMessage({ text: 'Failed to update publish status', type: 'error' });
    }
  };

  const handleDuplicate = async (product: Product) => {
    try {
      const duplicateData = {
        name: `${product.name} (Copy)`,
        slug: `${product.slug}-copy-${Date.now().toString().slice(-4)}`,
        category: product.category,
        flavour: product.flavour,
        image: product.image,
        additionalImages: product.additionalImages || [],
        tagline: product.tagline,
        description: product.description,
        isJain: product.isJain,
        isFeatured: false,
        tasteProfile: product.tasteProfile,
        features: product.features,
        pairingSuggestions: product.pairingSuggestions,
        idealFor: product.idealFor,
        packagingOptions: product.packagingOptions,
        status: 'draft' as ContentStatus,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData),
      });

      const data = await res.json();
      if (data.success) {
        setProducts([data.data, ...products]);
        setMessage({ text: `Duplicated "${product.name}" successfully as draft.`, type: 'success' });
      }
    } catch (err) {
      setMessage({ text: 'Failed to duplicate product', type: 'error' });
    }
  };

  const handleArchive = async (product: Product) => {
    if (!confirm(`Are you sure you want to archive "${product.name}"? It will no longer appear on the website, but its record will be safely retained.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: 'archived' } : p))
        );
        setMessage({ text: `Product "${product.name}" archived successfully.`, type: 'success' });
      }
    } catch (err) {
      setMessage({ text: 'Failed to archive product', type: 'error' });
    }
  };

  // Categories list
  const categoryOptions = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ['All', ...cats];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.flavour.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E6DEC8]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C59B3F]">
            Catalogue Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1A1412] mt-0.5">
            Products CMS
          </h1>
          <p className="text-xs text-[#63574E] mt-0.5">
            Manage your dry fruits, flavoured nuts, descriptions, taste profiles, and images.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-[#1A1412] hover:bg-[#2C221E] text-[#FAF8F5] text-xs font-semibold rounded-md shadow transition-colors flex items-center space-x-2 border border-[#C59B3F]/30 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C59B3F]" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Message alert */}
      {message && (
        <div
          className={`p-3 text-xs rounded-lg flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-xs font-bold underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Filters bar */}
      <div className="bg-white border border-[#E6DEC8] rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#8A7E75] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name or flavour..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md text-[#1A1412] focus:outline-none cursor-pointer"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md text-[#1A1412] focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="published">Published (Live)</option>
              <option value="draft">Draft (Unpublished)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-[#7A6D63]">
          Showing <strong className="text-[#1A1412]">{filteredProducts.length}</strong> of{' '}
          {products.length} products
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E6DEC8] rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-16 text-center text-xs text-[#8A7E75]">
            Loading catalogue products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <p className="font-serif text-lg text-[#1A1412]">No products matched your criteria.</p>
            <p className="text-xs text-[#63574E]">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E6DEC8] text-[#5C5047] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category & Flavour</th>
                  <th className="py-3 px-4">Taste Profile</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    {/* Visual & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#E6DEC8] relative overflow-hidden shrink-0">
                          <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        </div>
                        <div>
                          <strong className="font-serif text-sm text-[#1A1412] block">
                            {prod.name}
                          </strong>
                          <span className="text-[10px] text-[#8A7E75] block font-mono">
                            /products/{prod.slug}
                          </span>
                          {prod.isJain && (
                            <span className="inline-block mt-0.5 text-[9px] font-bold bg-[#2D4A27] text-white px-1.5 py-0.2 rounded-full uppercase">
                              Jain (J)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category & Flavour */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-[#1A1412] block">{prod.category}</span>
                      <span className="text-[#C59B3F] font-medium text-[11px] flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {prod.flavour}
                      </span>
                    </td>

                    {/* Taste Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {prod.tasteProfile.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="bg-[#FAF8F5] text-[#5C5047] border border-[#E6DEC8] px-1.5 py-0.5 rounded text-[10px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status Badge & Toggle */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(prod)}
                        title="Click to toggle publish status"
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          prod.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : prod.status === 'draft'
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {prod.status === 'published' ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : prod.status === 'draft' ? (
                          <>
                            <FileEdit className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        ) : (
                          <>
                            <Archive className="w-3 h-3" />
                            <span>Archived</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center space-x-1.5">
                        {/* Edit */}
                        <Link
                          href={`/admin/products/${prod.id}`}
                          className="p-1.5 text-[#4A3E37] hover:text-[#1A1412] hover:bg-[#FAF8F5] rounded-md transition-colors border border-[#DDD4C3]"
                          title="Edit Product Details"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                        </Link>

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(prod)}
                          className="p-1.5 text-[#4A3E37] hover:text-[#1A1412] hover:bg-[#FAF8F5] rounded-md transition-colors border border-[#DDD4C3] cursor-pointer"
                          title="Duplicate as Draft"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* View live public page */}
                        <a
                          href={`/products/${prod.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-[#4A3E37] hover:text-[#1A1412] hover:bg-[#FAF8F5] rounded-md transition-colors border border-[#DDD4C3]"
                          title="View on Public Website"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>

                        {/* Archive */}
                        {prod.status !== 'archived' && (
                          <button
                            onClick={() => handleArchive(prod)}
                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors border border-red-200 cursor-pointer"
                            title="Archive Product"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
