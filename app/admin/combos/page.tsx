'use client';

import React, { useState, useEffect } from 'react';
import { Boxes, FileEdit, Save, Loader2, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { ComboItem } from '@/lib/types';

export default function AdminCombosPage() {
  const [combos, setCombos] = useState<ComboItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCombo, setEditingCombo] = useState<ComboItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadCombos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/combos');
      const data = await res.json();
      if (data.success) {
        setCombos(data.data);
      }
    } catch (err) {
      console.error('Failed to load combos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCombos();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCombo) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/combos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCombo),
      });
      const data = await res.json();
      if (data.success) {
        setCombos((prev) =>
          prev.map((c) => (c.id === editingCombo.id ? data.data : c))
        );
        setMessage(`Combo "${editingCombo.name}" updated successfully!`);
        setEditingCombo(null);
      }
    } catch (err) {
      console.error('Error saving combo:', err);
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
            Curated Assortments
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1A1412] mt-0.5">
            Signature Combos CMS
          </h1>
          <p className="text-xs text-[#63574E] mt-0.5">
            Manage the 8 catalogue combos and their included products with Jain indicators.
          </p>
        </div>

        <button
          onClick={loadCombos}
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

      {/* Combos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {combos.map((combo) => (
          <div
            key={combo.id}
            className="bg-white border border-[#E6DEC8] rounded-xl p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold text-[#C59B3F] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E6DEC8]">
                  {combo.subtitle}
                </span>
                <span className="text-[11px] text-[#7A6D63] italic truncate">
                  {combo.occasion}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-[#1A1412]">
                {combo.name}
              </h3>
              <p className="text-xs text-[#5C5047] font-medium mt-0.5">
                {combo.tagline}
              </p>

              <div className="mt-4 pt-3 border-t border-[#F2ECE1] space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#8A7E75] block">
                  Included Products:
                </span>
                {combo.products.map((p, i) => (
                  <div key={i} className="text-xs bg-[#FAF8F5] px-2.5 py-1.5 rounded border border-[#EBE3D3] flex items-center justify-between">
                    <span className="truncate text-[#2E2621]">{p.name}</span>
                    {p.isJain && (
                      <span className="text-[9px] font-bold bg-[#2D4A27] text-white px-1.5 py-0.2 rounded-full uppercase ml-1">
                        Jain
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3">
              <button
                onClick={() => setEditingCombo(combo)}
                className="w-full py-2 px-3 bg-[#FAF8F5] hover:bg-[#1A1412] text-[#1A1412] hover:text-[#FAF8F5] text-xs font-semibold rounded border border-[#DDD4C3] transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Edit Combo</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingCombo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E6DEC8] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 my-8">
            <h3 className="font-serif text-xl font-bold text-[#1A1412] border-b border-[#F2ECE1] pb-3">
              Edit Combo: {editingCombo.name}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                  Combo Name
                </label>
                <input
                  type="text"
                  required
                  value={editingCombo.name}
                  onChange={(e) => setEditingCombo({ ...editingCombo, name: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                    Subtitle / Code
                  </label>
                  <input
                    type="text"
                    value={editingCombo.subtitle}
                    onChange={(e) => setEditingCombo({ ...editingCombo, subtitle: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                    Occasion
                  </label>
                  <input
                    type="text"
                    value={editingCombo.occasion}
                    onChange={(e) => setEditingCombo({ ...editingCombo, occasion: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={editingCombo.tagline}
                  onChange={(e) => setEditingCombo({ ...editingCombo, tagline: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCombo.description}
                  onChange={(e) => setEditingCombo({ ...editingCombo, description: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md resize-none"
                />
              </div>

              {/* Products included */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase text-[#4A3E37]">
                    Included Products (with Jain tag)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingCombo({
                        ...editingCombo,
                        products: [...editingCombo.products, { name: '', isJain: false }],
                      })
                    }
                    className="text-xs text-[#A85A2A] hover:underline flex items-center"
                  >
                    <Plus className="w-3.5 h-3.5 mr-0.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingCombo.products.map((prod, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={prod.name}
                        onChange={(e) => {
                          const copy = [...editingCombo.products];
                          copy[idx] = { ...copy[idx], name: e.target.value };
                          setEditingCombo({ ...editingCombo, products: copy });
                        }}
                        className="flex-1 px-3 py-1 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                      />
                      <label className="flex items-center space-x-1 text-xs text-[#2D4A27] font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prod.isJain}
                          onChange={(e) => {
                            const copy = [...editingCombo.products];
                            copy[idx] = { ...copy[idx], isJain: e.target.checked };
                            setEditingCombo({ ...editingCombo, products: copy });
                          }}
                          className="w-3.5 h-3.5"
                        />
                        <span>Jain</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const copy = editingCombo.products.filter((_, i) => i !== idx);
                          setEditingCombo({ ...editingCombo, products: copy });
                        }}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingCombo(null)}
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
                  <span>Save Combo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
