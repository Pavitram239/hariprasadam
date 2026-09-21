'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { useEnquiry } from './EnquiryContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { openEnquiryModal } = useEnquiry();

  return (
    <div className="group bg-white border border-[#E6DEC8] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-[#F7F4EE] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {product.isJain && (
            <div className="absolute top-3 right-3 bg-[#2D4A27] text-white text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-sm">
              Jain (J)
            </div>
          )}
          <div className="absolute top-3 left-3 bg-[#1A1412]/85 backdrop-blur-sm text-[#FAF8F5] text-[10px] font-medium tracking-widest px-2.5 py-1 rounded uppercase">
            {product.category}
          </div>
        </Link>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center space-x-1.5 text-xs text-[#C59B3F] font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            <span>{product.flavour}</span>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-xl font-semibold text-[#1A1412] hover:text-[#A85A2A] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[#63574E] mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Taste Notes Pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {product.tasteProfile.slice(0, 3).map((taste) => (
              <span
                key={taste}
                className="text-[11px] bg-[#FAF8F5] text-[#5A4D45] px-2 py-0.5 rounded border border-[#E6DEC8]"
              >
                {taste}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-2 border-t border-[#F2ECE1] flex items-center justify-between gap-2">
        <Link
          href={`/products/${product.slug}`}
          className="text-xs font-semibold text-[#1A1412] hover:text-[#C59B3F] transition-colors flex items-center"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3 ml-1" />
        </Link>

        <button
          onClick={() =>
            openEnquiryModal({
              enquiryType: 'Product Enquiry',
              productName: product.name,
              sourcePage: `/products/${product.slug}`,
              initialMessage: `I am interested in ordering/enquiring about ${product.name} (${product.category} - ${product.flavour}). Please provide available packaging and pricing.`,
            })
          }
          className="px-3.5 py-1.5 bg-[#1A1412] hover:bg-[#2C221E] text-[#FAF8F5] text-xs font-medium rounded transition-colors cursor-pointer border border-[#C59B3F]/30"
        >
          Enquire
        </button>
      </div>
    </div>
  );
}
