'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Eye,
  Save,
  Loader2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  HelpCircle,
  X,
} from 'lucide-react';
import { Product, ProductCategory, ContentStatus } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

interface ProductEditorProps {
  initialProduct?: Product;
  isEditing?: boolean;
}

const DEFAULT_CATEGORIES: ProductCategory[] = [
  'Almond',
  'Cashew',
  'Dates',
  'Raisin',
  'Hazelnut',
  'Mixes & Blends',
];

export default function ProductEditor({ initialProduct, isEditing = false }: ProductEditorProps) {
  const router = useRouter();

  // Form State
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [category, setCategory] = useState<ProductCategory>(initialProduct?.category || 'Almond');
  const [flavour, setFlavour] = useState(initialProduct?.flavour || '');
  const [tagline, setTagline] = useState(initialProduct?.tagline || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [isJain, setIsJain] = useState(!!initialProduct?.isJain);
  const [isFeatured, setIsFeatured] = useState(!!initialProduct?.isFeatured);
  const [status, setStatus] = useState<ContentStatus>(initialProduct?.status || 'draft');

  // Main Image & Additional Images
  const [mainImage, setMainImage] = useState(initialProduct?.image || '/images/products/almond-plain.jpg');
  const [additionalImages, setAdditionalImages] = useState<string[]>(initialProduct?.additionalImages || []);

  // List Fields
  const [tasteProfile, setTasteProfile] = useState<string[]>(
    initialProduct?.tasteProfile && initialProduct.tasteProfile.length > 0
      ? initialProduct.tasteProfile
      : ['Nutty Crunch', 'Natural Sweetness']
  );
  const [features, setFeatures] = useState<string[]>(
    initialProduct?.features && initialProduct.features.length > 0
      ? initialProduct.features
      : ['100% Fresh Dry Roasted', 'Roasted to Order']
  );
  const [pairingSuggestions, setPairingSuggestions] = useState<string[]>(
    initialProduct?.pairingSuggestions && initialProduct.pairingSuggestions.length > 0
      ? initialProduct.pairingSuggestions
      : ['Festive Gifting', 'Daily Wellness']
  );
  const [idealFor, setIdealFor] = useState<string[]>(
    initialProduct?.idealFor && initialProduct.idealFor.length > 0
      ? initialProduct.idealFor
      : ['Corporate hampers', 'Health lovers']
  );
  const [packagingOptions, setPackagingOptions] = useState<string[]>(
    initialProduct?.packagingOptions && initialProduct.packagingOptions.length > 0
      ? initialProduct.packagingOptions
      : ['Glass Jars (175g–200g)', 'Gift Box Compartments', 'Custom Jute Bags']
  );

  // Upload & UI states
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper for slug generation
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing || !slug) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      );
    }
  };

  // List field handlers
  const updateListField = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    val: string
  ) => {
    setter((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const addListFieldItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, '']);
  };

  const removeListFieldItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // Image Upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setMainImage(data.url);
      setFeedback({ message: 'Product image uploaded successfully!', type: 'success' });
    } catch (err: any) {
      setFeedback({ message: err.message || 'Image upload failed', type: 'error' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Save handler
  const handleSave = async (targetStatus?: ContentStatus) => {
    if (!name.trim()) {
      setFeedback({ message: 'Please enter a product name', type: 'error' });
      return;
    }
    if (!category) {
      setFeedback({ message: 'Please select a category', type: 'error' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const payload = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      flavour: flavour.trim() || 'Plain',
      image: mainImage,
      additionalImages,
      tagline: tagline.trim(),
      description: description.trim(),
      isJain,
      isFeatured,
      tasteProfile: tasteProfile.filter((t) => t.trim().length > 0),
      features: features.filter((f) => f.trim().length > 0),
      pairingSuggestions: pairingSuggestions.filter((p) => p.trim().length > 0),
      idealFor: idealFor.filter((i) => i.trim().length > 0),
      packagingOptions: packagingOptions.filter((o) => o.trim().length > 0),
      status: targetStatus || status,
    };

    try {
      const endpoint = isEditing && initialProduct
        ? `/api/admin/products/${initialProduct.id}`
        : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save product');
      }

      setFeedback({
        message: isEditing
          ? 'Product updated successfully!'
          : 'Product created successfully!',
        type: 'success',
      });

      if (!isEditing) {
        setTimeout(() => {
          router.push('/admin/products');
        }, 1200);
      }
    } catch (err: any) {
      setFeedback({ message: err.message || 'Error saving product', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Current preview product object
  const previewProduct: Product = {
    id: initialProduct?.id || 'preview-prod',
    name: name || 'Product Name Example',
    slug: slug || 'product-slug',
    category,
    flavour: flavour || 'Artisanal Flavour',
    image: mainImage,
    additionalImages,
    tagline: tagline || 'Signature Roast • HariPrasadam',
    description: description || 'Detailed product description will appear here.',
    isJain,
    isFeatured,
    tasteProfile: tasteProfile.filter((t) => t.trim()),
    features: features.filter((f) => f.trim()),
    pairingSuggestions: pairingSuggestions.filter((p) => p.trim()),
    idealFor: idealFor.filter((i) => i.trim()),
    packagingOptions: packagingOptions.filter((o) => o.trim()),
    status,
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E6DEC8]">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="p-2 bg-white border border-[#DDD4C3] rounded-md text-[#4A3E37] hover:text-[#1A1412] hover:bg-[#FAF8F5] transition-colors"
            title="Back to Products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1412]">
              {isEditing ? `Edit: ${initialProduct?.name}` : 'Add New Product'}
            </h1>
            <p className="text-xs text-[#63574E]">
              {isEditing ? 'Update catalogue details, flavour tags and imagery' : 'Create a new product in the HariPrasadam catalogue'}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preview Button */}
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="px-3.5 py-2 bg-white border border-[#DDD4C3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#1A1412] rounded-md transition-colors flex items-center space-x-1.5 shadow-2xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#C59B3F]" />
            <span>Preview Product</span>
          </button>

          {/* Save as Draft */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave('draft')}
            className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#DDD4C3] text-xs font-semibold text-[#4A3E37] rounded-md transition-colors cursor-pointer"
          >
            Save Draft
          </button>

          {/* Publish / Save */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave(status)}
            className="px-5 py-2 bg-[#1A1412] hover:bg-[#2C221E] text-[#FAF8F5] text-xs font-semibold rounded-md shadow transition-colors flex items-center space-x-2 border border-[#C59B3F]/30 cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C59B3F]" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-[#C59B3F]" />
                <span>{status === 'published' ? 'Save & Publish Live' : 'Save Product'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-3.5 text-xs rounded-lg flex items-center justify-between ${
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Essential details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Core Info */}
          <div className="bg-white border border-[#E6DEC8] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1A1412] border-b border-[#F2ECE1] pb-3">
              Basic Product Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                  Product Name <span className="text-[#A85A2A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Honey Rose Almond"
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. honey-rose-almond"
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
                />
                <span className="text-[10px] text-[#8A7E75] mt-0.5 block">
                  Public link: /products/{slug || '...'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                  Category <span className="text-[#A85A2A]">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F] cursor-pointer"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Flavour Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                  Flavour Profile Name
                </label>
                <input
                  type="text"
                  value={flavour}
                  onChange={(e) => setFlavour(e.target.value)}
                  placeholder="e.g. Honey Rose, Kunafa, Oreo"
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
                />
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                Subtitle / Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Sweet Floral Glaze • Damask Rose Essence"
                className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe roasting style, ingredients, crunch, and aroma..."
                className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F] resize-none"
              />
            </div>
          </div>

          {/* Card 2: List Attributes (Taste, Features, Pairings, Packaging) */}
          <div className="bg-white border border-[#E6DEC8] rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#1A1412] border-b border-[#F2ECE1] pb-3">
              List Attributes & Taste Notes
            </h3>

            {/* Taste Profile */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#4A3E37]">
                  Taste Profile Pills
                </label>
                <button
                  type="button"
                  onClick={() => addListFieldItem(setTasteProfile)}
                  className="text-xs text-[#A85A2A] hover:underline flex items-center cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-0.5" />
                  <span>Add Taste Note</span>
                </button>
              </div>

              <div className="space-y-2">
                {tasteProfile.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateListField(setTasteProfile, idx, e.target.value)}
                      placeholder="e.g. Delicate Floral, Caramelized Snap"
                      className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeListFieldItem(setTasteProfile, idx)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#4A3E37]">
                  Highlights & Features
                </label>
                <button
                  type="button"
                  onClick={() => addListFieldItem(setFeatures)}
                  className="text-xs text-[#A85A2A] hover:underline flex items-center cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-0.5" />
                  <span>Add Feature</span>
                </button>
              </div>

              <div className="space-y-2">
                {features.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateListField(setFeatures, idx, e.target.value)}
                      placeholder="e.g. 100% Fresh Dry Roasted, All-Natural Glaze"
                      className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeListFieldItem(setFeatures, idx)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Packaging Options */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#4A3E37]">
                  Packaging Options
                </label>
                <button
                  type="button"
                  onClick={() => addListFieldItem(setPackagingOptions)}
                  className="text-xs text-[#A85A2A] hover:underline flex items-center cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-0.5" />
                  <span>Add Option</span>
                </button>
              </div>

              <div className="space-y-2">
                {packagingOptions.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateListField(setPackagingOptions, idx, e.target.value)}
                      placeholder="e.g. Glass Jars (175g–200g), Custom Jute Bags"
                      className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeListFieldItem(setPackagingOptions, idx)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status, Images & Flags (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Visibility Card */}
          <div className="bg-white border border-[#E6DEC8] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1A1412] border-b border-[#F2ECE1] pb-3">
              Publishing & Visibility
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none cursor-pointer"
              >
                <option value="draft">Draft (Unpublished)</option>
                <option value="published">Published (Live on Public Website)</option>
                <option value="archived">Archived (Hidden)</option>
              </select>
            </div>

            <div className="pt-2 space-y-3 border-t border-[#F2ECE1]">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isJain}
                  onChange={(e) => setIsJain(e.target.checked)}
                  className="rounded border-[#DDD4C3] text-[#2D4A27] focus:ring-[#2D4A27] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-medium text-[#1A1412]">
                  Pure Jain Product (J)
                </span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-[#DDD4C3] text-[#C59B3F] focus:ring-[#C59B3F] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-medium text-[#1A1412]">
                  Featured on Homepage
                </span>
              </label>
            </div>
          </div>

          {/* Product Image Card */}
          <div className="bg-white border border-[#E6DEC8] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1A1412] border-b border-[#F2ECE1] pb-3">
              Product Main Image
            </h3>

            {/* Current Image Preview */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-[#FAF8F5] border border-[#E6DEC8]">
              <Image
                src={mainImage}
                alt="Product preview"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Upload Button */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageFileChange}
                className="hidden"
                id="product-image-upload"
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-[#1A1412] hover:bg-[#2C221E] text-white text-xs font-semibold rounded-md shadow transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C59B3F]" />
                    <span>Uploading Image...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-[#C59B3F]" />
                    <span>Upload New Image</span>
                  </>
                )}
              </button>
            </div>

            {/* Guidance note */}
            <div className="p-3 bg-[#FAF8F5] border border-[#E6DEC8] rounded-md text-[11px] text-[#63574E] space-y-1">
              <span className="font-semibold text-[#1A1412] block">Recommended Dimensions:</span>
              <p>Square ratio (800 × 800 px or 1000 × 1000 px). JPG, PNG, or WebP. Max 5MB.</p>
            </div>

            {/* Manual URL input fallback */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8A7E75] mb-1">
                Or image URL path:
              </label>
              <input
                type="text"
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                className="w-full px-2.5 py-1 text-[11px] bg-[#FAF8F5] border border-[#DDD4C3] rounded font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PREVIEW MODAL */}
      {/* ========================================================= */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#E6DEC8] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC8] mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C59B3F]">
                  Live Website Simulation
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1A1412]">
                  Product Preview: {previewProduct.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#4A3E37]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview contents */}
            <div className="space-y-8">
              {/* How it appears in Product Grids */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A7E75] block mb-3">
                  1. Product Grid Card Preview
                </span>
                <div className="max-w-xs">
                  <ProductCard product={previewProduct} />
                </div>
              </div>

              {/* How it appears on Product Detail Page */}
              <div className="pt-6 border-t border-[#E6DEC8]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A7E75] block mb-4">
                  2. Product Detail Page Preview
                </span>

                <div className="bg-white border border-[#E6DEC8] rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-[#FAF8F5]">
                    <Image src={previewProduct.image} alt="preview" fill className="object-cover" />
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs text-[#C59B3F] font-bold uppercase tracking-wider">
                      {previewProduct.flavour}
                    </span>
                    <h2 className="font-serif text-3xl font-bold text-[#1A1412]">
                      {previewProduct.name}
                    </h2>
                    <p className="text-xs font-semibold text-[#A85A2A]">
                      {previewProduct.tagline}
                    </p>
                    <p className="text-xs text-[#63574E] leading-relaxed">
                      {previewProduct.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {previewProduct.tasteProfile.map((t, i) => (
                        <span key={i} className="text-[10px] bg-[#FAF8F5] border border-[#DDD4C3] px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E6DEC8] text-right">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="px-5 py-2 bg-[#1A1412] text-white text-xs font-semibold rounded-md"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
