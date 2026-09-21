'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Gift, FileEdit, Save, Loader2, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { GiftBox } from '@/lib/types';

export default function AdminGiftingPage() {
  const [boxes, setBoxes] = useState<GiftBox[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBox, setEditingBox] = useState<GiftBox | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadGifting = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/gifting');
      const data = await res.json();
      if (data.success) {
        setBoxes(data.data);
      }
    } catch (err) {
      console.error('Failed to load gift collections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGifting();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBox) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/gifting', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBox),
      });
      const data = await res.json();
      if (data.success) {
        setBoxes((prev) =>
          prev.map((b) => (b.id === editingBox.id ? data.data : b))
        );
        setMessage(`Gift Box "${editingBox.title}" updated successfully!`);
        setEditingBox(null);
      }
    } catch (err) {
      console.error('Error saving gift collection:', err);
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
            2026 Collection
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1A1412] mt-0.5">
            Gift Collections CMS
          </h1>
          <p className="text-xs text-[#63574E] mt-0.5">
            Manage your premium gift boxes, jar assortments, and exact catalogue prices.
          </p>
        </div>

        <button
          onClick={loadGifting}
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

      {/* Gift Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boxes.map((box) => (
          <div
            key={box.id}
            className="bg-white border border-[#E6DEC8] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] bg-[#FAF8F5] overflow-hidden">
                <Image src={box.image} alt={box.title} fill className="object-cover" />
                <div className="absolute top-2 left-2 bg-[#1A1412]/90 text-[#C59B3F] text-[10px] font-bold px-2.5 py-1 rounded uppercase">
                  Box {box.code}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded font-serif">
                  ₹{box.price.toLocaleString('en-IN')}/-
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1A1412]">
                    {box.title}
                  </h3>
                  <p className="text-[11px] text-[#7A6D63] font-medium">
                    {box.subtitle} • {box.jarsCount} Jars ({box.jarWeight})
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F2ECE1] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8A7E75] block">
                    Curated Assortment:
                  </span>
                  {box.curatedItems.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="text-xs text-[#4A3E37] flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C59B3F] mr-1.5 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                  {box.curatedItems.length > 3 && (
                    <span className="text-[10px] text-[#8A7E75] block italic">
                      + {box.curatedItems.length - 3} more items
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => setEditingBox(box)}
                className="w-full py-2 px-3 bg-[#FAF8F5] hover:bg-[#1A1412] text-[#1A1412] hover:text-[#FAF8F5] text-xs font-semibold rounded border border-[#DDD4C3] transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Edit Gift Box</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Gift Box Modal */}
      {editingBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E6DEC8] rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-bold text-[#1A1412] border-b border-[#F2ECE1] pb-3">
              Edit Gift Box {editingBox.code}: {editingBox.title}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBox.title}
                    onChange={(e) => setEditingBox({ ...editingBox, title: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={editingBox.subtitle}
                    onChange={(e) => setEditingBox({ ...editingBox, subtitle: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                    Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingBox.price}
                    onChange={(e) => setEditingBox({ ...editingBox, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md font-bold text-[#A85A2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                    Number of Jars
                  </label>
                  <input
                    type="number"
                    value={editingBox.jarsCount}
                    onChange={(e) => setEditingBox({ ...editingBox, jarsCount: parseInt(e.target.value, 10) || 5 })}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#4A3E37] mb-1">
                    Jar Weight
                  </label>
                  <input
                    type="text"
                    value={editingBox.jarWeight}
                    onChange={(e) => setEditingBox({ ...editingBox, jarWeight: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                  />
                </div>
              </div>

              {/* Curated items list */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase text-[#4A3E37]">
                    Curated Jars Included
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingBox({ ...editingBox, curatedItems: [...editingBox.curatedItems, ''] })}
                    className="text-xs text-[#A85A2A] hover:underline flex items-center"
                  >
                    <Plus className="w-3.5 h-3.5 mr-0.5" />
                    <span>Add Jar Item</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editingBox.curatedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const copy = [...editingBox.curatedItems];
                          copy[idx] = e.target.value;
                          setEditingBox({ ...editingBox, curatedItems: copy });
                        }}
                        className="flex-1 px-3 py-1 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const copy = editingBox.curatedItems.filter((_, i) => i !== idx);
                          setEditingBox({ ...editingBox, curatedItems: copy });
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
                  onClick={() => setEditingBox(null)}
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
                  <span>Save Box Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
