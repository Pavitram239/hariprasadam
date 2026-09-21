'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Layers, FileEdit, Save, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? data.data : c))
        );
        setMessage(`Category "${editingCategory.name}" updated successfully!`);
        setEditingCategory(null);
      }
    } catch (err) {
      console.error('Error saving category:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E6DEC8]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C59B3F]">
            Catalogue Structure
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1A1412] mt-0.5">
            Categories CMS
          </h1>
          <p className="text-xs text-[#63574E] mt-0.5">
            Manage category banners, taglines, and public display orders.
          </p>
        </div>

        <button
          onClick={loadCategories}
          className="px-3.5 py-2 bg-white border border-[#DDD4C3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#1A1412] rounded-md transition-colors flex items-center shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="font-bold underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-[#E6DEC8] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-[#FAF8F5] overflow-hidden">
                <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  Order: #{cat.display_order}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A85A2A] block">
                  {cat.tagline}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1A1412]">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#63574E] leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => setEditingCategory(cat)}
                className="w-full py-2 px-3 bg-[#FAF8F5] hover:bg-[#1A1412] text-[#1A1412] hover:text-[#FAF8F5] text-xs font-semibold rounded border border-[#DDD4C3] transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Edit Category</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E6DEC8] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1A1412] border-b border-[#F2ECE1] pb-3">
              Edit Category: {editingCategory.name}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={editingCategory.tagline}
                  onChange={(e) => setEditingCategory({ ...editingCategory, tagline: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingCategory.display_order}
                    onChange={(e) => setEditingCategory({ ...editingCategory, display_order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                    Status
                  </label>
                  <select
                    value={editingCategory.status}
                    onChange={(e) => setEditingCategory({ ...editingCategory, status: e.target.value as 'published' | 'draft' })}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md cursor-pointer"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                  Category Image Path
                </label>
                <input
                  type="text"
                  value={editingCategory.image}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md font-mono"
                />
              </div>

              <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#4A3E37] hover:bg-[#FAF8F5] rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#1A1412] hover:bg-[#2C221E] text-white text-xs font-semibold rounded-md shadow flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C59B3F]" /> : <Save className="w-3.5 h-3.5 text-[#C59B3F]" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
