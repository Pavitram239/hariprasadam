'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/SectionHeading';
import { useEnquiry } from '@/components/EnquiryContext';

interface ProductsCatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
}

function ProductsCatalogContent({ initialProducts, categories }: ProductsCatalogClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  const { openEnquiryModal } = useEnquiry();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [jainOnly, setJainOnly] = useState(false);

  // Dynamic category pill list from database categories
  const categoryNames = useMemo(() => {
    const names = categories.map((c) => c.name);
    // If not in database categories, still add from products
    initialProducts.forEach((p) => {
      if (!names.includes(p.category)) {
        names.push(p.category);
      }
    });
    return ['All', ...names];
  }, [categories, initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category match
      if (selectedCategory !== 'All' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Jain filter
      if (jainOnly && !product.isJain) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesFlavour = product.flavour.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesTaste = (product.tasteProfile || []).some((t) => t.toLowerCase().includes(query));
        return matchesName || matchesFlavour || matchesCategory || matchesTaste;
      }
      return true;
    });
  }, [initialProducts, selectedCategory, searchQuery, jainOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
      {/* Header */}
      <SectionHeading
        badge="Catalogue 2026"
        title="Artisanal Product Catalogue"
        subtitle={`${initialProducts.length} distinct flavours across ${categories.length || 6} categories. Freshly dry-roasted and coated to order with premium spices, rich chocolates, and floral nectar glazes.`}
      />

      {/* Filter and Search Controls */}
      <div className="bg-white border border-[#E6DEC8] rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categoryNames.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            const count = cat === 'All' 
              ? initialProducts.length 
              : initialProducts.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1A1412] text-[#FAF8F5] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#5C5047] hover:bg-[#F2ECE1] border border-[#E6DEC8]'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 opacity-60 text-[10px]">
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Jain Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-[#F2ECE1]">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8A7E75] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search flavours (e.g. Honey Rose, Kunafa, Oreo, Kesar)..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md text-[#1A1412] placeholder-[#8A7E75] focus:outline-none focus:ring-1 focus:ring-[#C59B3F] focus:border-[#C59B3F]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-4 text-xs font-medium text-[#4A3E37]">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={jainOnly}
                onChange={(e) => setJainOnly(e.target.checked)}
                className="rounded border-[#DDD4C3] text-[#2D4A27] focus:ring-[#2D4A27] w-4 h-4 cursor-pointer"
              />
              <span>Jain Friendly (J) Only</span>
            </label>

            <span className="text-[#DDD4C3]">•</span>

            <span className="text-[#8A7E75]">
              Showing <strong className="text-[#1A1412]">{filteredProducts.length}</strong> items
            </span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E6DEC8] rounded-xl p-12 text-center space-y-4">
          <p className="font-serif text-xl text-[#1A1412]">
            No products matched your selected filters.
          </p>
          <p className="text-xs text-[#63574E]">
            Try clearing your search query or selecting &ldquo;All&rdquo; categories.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setJainOnly(false);
            }}
            className="px-4 py-2 text-xs font-semibold bg-[#1A1412] text-[#FAF8F5] rounded-md cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Catalogue Customization Notice & Banner */}
      <div className="bg-[#FAF8F5] border border-[#E6DEC8] rounded-xl p-8 text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C59B3F]">
          Bespoke Roasting & Packaging
        </span>
        <h3 className="font-serif text-2xl font-semibold text-[#1A1412]">
          Need Custom Flavours or Jar Weights for Gifting?
        </h3>
        <p className="text-xs text-[#63574E] leading-relaxed max-w-xl mx-auto">
          All products in our catalogue are available in custom jar weights (100g, 175g–200g, or bulk kg packing) with customized corporate labels and branding.
        </p>
        <div>
          <button
            onClick={() =>
              openEnquiryModal({
                enquiryType: 'Customization',
                sourcePage: '/products',
                initialMessage: 'I would like to enquire about customized product packs and jar weights.',
              })
            }
            className="px-6 py-2.5 bg-[#1A1412] hover:bg-[#2C221E] text-[#FAF8F5] text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            Enquire About Customization
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsCatalogClient(props: ProductsCatalogClientProps) {
  return (
    <Suspense fallback={<div className="p-12 text-center font-serif text-[#1A1412]">Loading HariPrasadam Catalogue...</div>}>
      <ProductsCatalogContent {...props} />
    </Suspense>
  );
}
