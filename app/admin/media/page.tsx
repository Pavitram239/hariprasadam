'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ImageIcon,
  Upload,
  Copy,
  Check,
  Trash2,
  Loader2,
  RefreshCw,
  ExternalLink,
  Info,
} from 'lucide-react';
import { MediaItem } from '@/lib/types';

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (data.success) {
        setMedia(data.data);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setMedia([data.media, ...media]);
      setFeedback({ message: 'Image uploaded to media library successfully!', type: 'success' });
    } catch (err: any) {
      setFeedback({ message: err.message || 'Error uploading image', type: 'error' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this media reference?')) return;

    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E6DEC8]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C59B3F]">
            Asset Storage
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1A1412] mt-0.5">
            Media Library
          </h1>
          <p className="text-xs text-[#63574E] mt-0.5">
            Upload, preview, and manage product photography and banner assets.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadMedia}
            className="px-3.5 py-2 bg-white border border-[#DDD4C3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#1A1412] rounded-md transition-colors flex items-center shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            className="hidden"
            id="media-file-input"
          />

          <button
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-[#1A1412] hover:bg-[#2C221E] text-white text-xs font-semibold rounded-md shadow transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C59B3F]" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-[#C59B3F]" />
                <span>Upload Media</span>
              </>
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 text-xs rounded-lg flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="font-bold underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Media Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-[#8A7E75]">
          Loading media library...
        </div>
      ) : media.length === 0 ? (
        <div className="bg-white border border-[#E6DEC8] rounded-xl p-16 text-center space-y-3">
          <ImageIcon className="w-10 h-10 text-[#C59B3F]/40 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#1A1412]">
            No uploaded media yet
          </h3>
          <p className="text-xs text-[#63574E] max-w-sm mx-auto">
            Click &ldquo;Upload Media&rdquo; above to add product shots or banners. Standard catalogue images in <code>/public/images/</code> remain accessible across all pages.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-[#1A1412] text-white text-xs font-semibold rounded-md inline-flex items-center space-x-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-[#C59B3F]" />
            <span>Upload Your First Photo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E6DEC8] rounded-xl overflow-hidden shadow-2xs group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square bg-[#FAF8F5] overflow-hidden">
                  <Image src={item.url} alt={item.filename} fill className="object-cover" />
                </div>
                <div className="p-2.5 space-y-1">
                  <p className="text-[11px] font-semibold text-[#1A1412] truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <span className="text-[10px] text-[#8A7E75] block">
                    {(item.size / 1024).toFixed(1)} KB • {item.mimeType.split('/')[1]?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-2.5 pt-0 border-t border-[#F2ECE1] flex items-center justify-between gap-1">
                <button
                  onClick={() => handleCopyUrl(item)}
                  className="flex-1 py-1 px-2 bg-[#FAF8F5] hover:bg-[#EFE8DC] text-[10px] font-semibold text-[#1A1412] rounded flex items-center justify-center space-x-1 transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#C59B3F]" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  title="Remove from Library"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
