'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Check, Package, Coffee, Users, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/lib/productsData';
import { useEnquiry } from '@/components/EnquiryContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { openEnquiryModal } = useEnquiry();

  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-[#1A1412]">Product Not Found</h1>
        <p className="text-sm text-[#63574E]">
          The product you are looking for does not exist in our current catalogue.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center px-5 py-2.5 bg-[#1A1412] text-[#FAF8F5] text-xs font-semibold rounded-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back to All Products</span>
        </Link>
      </div>
    );
  }

  // Related products from same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const whatsappMessage = `Hello HariPrasadam, I am viewing ${product.name} (${product.category} - ${product.flavour}) on your website and would like to enquire about ordering.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-16">
      {/* Breadcrumb navigation */}
      <div className="flex items-center space-x-2 text-xs text-[#7A6D63]">
        <Link href="/" className="hover:text-[#1A1412] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#1A1412] transition-colors">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-[#1A1412] transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#1A1412] font-semibold">{product.name}</span>
      </div>

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Product Visuals */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F7F4EE] border border-[#E6DEC8] shadow-sm">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {product.isJain && (
              <div className="absolute top-4 right-4 bg-[#2D4A27] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase shadow-md">
                Pure Jain (J)
              </div>
            )}
            <div className="absolute top-4 left-4 bg-[#1A1412]/90 text-[#FAF8F5] text-xs font-semibold tracking-wider px-3 py-1 rounded uppercase">
              {product.category} Selection
            </div>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E6DEC8] rounded-xl p-4 flex items-center justify-between text-xs text-[#63574E]">
            <span className="flex items-center">
              <ShieldCheck className="w-4 h-4 text-[#C59B3F] mr-1.5" />
              100% Fresh Roasted to Order
            </span>
            <span>Surat, Gujarat</span>
          </div>
        </div>

        {/* Right Column: Editorial Details & Enquire CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#C59B3F] uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flavour: {product.flavour}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1A1412]">
              {product.name}
            </h1>

            <p className="text-sm font-medium text-[#A85A2A] uppercase tracking-wider mt-1.5">
              {product.tagline}
            </p>
          </div>

          {/* Description */}
          <div className="border-t border-b border-[#E6DEC8] py-4">
            <p className="text-sm sm:text-base text-[#4A3E37] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Taste Notes */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1412] mb-2">
              Flavour & Taste Profile
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.tasteProfile.map((t) => (
                <span
                  key={t}
                  className="text-xs font-medium bg-white text-[#4A3E37] px-3 py-1 rounded-full border border-[#DDD4C3] shadow-2xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Highlights & Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {product.features.map((f, i) => (
              <div key={i} className="flex items-center text-xs text-[#2E2621]">
                <Check className="w-3.5 h-3.5 text-[#C59B3F] mr-2 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          {/* Packaging Options from Catalogue */}
          <div className="bg-white border border-[#E6DEC8] rounded-xl p-4 space-y-2">
            <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-[#1A1412]">
              <Package className="w-4 h-4 text-[#C59B3F] mr-2" />
              <span>Available Presentation & Packaging</span>
            </div>
            <ul className="text-xs text-[#63574E] space-y-1 pl-6 list-disc">
              {product.packagingOptions.map((opt, i) => (
                <li key={i}>{opt}</li>
              ))}
            </ul>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() =>
                openEnquiryModal({
                  enquiryType: 'Product Enquiry',
                  productName: `${product.name} (${product.flavour})`,
                  sourcePage: `/products/${product.slug}`,
                  initialMessage: `I would like to enquire about ${product.name} (${product.category} - ${product.flavour}). Please provide available jar options, minimum order, and pricing.`,
                })
              }
              className="flex-1 py-3.5 px-6 bg-[#1A1412] hover:bg-[#2C221E] text-[#FAF8F5] text-sm font-semibold rounded-md shadow-sm transition-all flex items-center justify-center space-x-2 border border-[#C59B3F]/40 cursor-pointer"
            >
              <span>Enquire About This Product</span>
              <ArrowRight className="w-4 h-4 text-[#C59B3F]" />
            </button>

            <WhatsAppButton
              label="WhatsApp Us"
              message={whatsappMessage}
              className="py-3.5 px-6 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Related Products from same category */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#E6DEC8] space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C59B3F]">
                More from {product.category}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1412]">
                Explore Related Flavours
              </h3>
            </div>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold text-[#1A1412] hover:text-[#C59B3F] transition-colors flex items-center"
            >
              <span>View All {product.category}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
