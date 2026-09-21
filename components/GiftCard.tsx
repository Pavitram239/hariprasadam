'use client';

import React from 'react';
import Image from 'next/image';
import { GiftBox } from '@/lib/types';
import { useEnquiry } from './EnquiryContext';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface GiftCardProps {
  giftBox: GiftBox;
}

export default function GiftCard({ giftBox }: GiftCardProps) {
  const { openEnquiryModal } = useEnquiry();

  return (
    <div className="bg-white border border-[#E6DEC8] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Visual Showcase */}
        <div className="relative aspect-[4/3] bg-[#F7F4EE] overflow-hidden">
          <Image
            src={giftBox.image}
            alt={giftBox.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-[#1A1412]/90 backdrop-blur-sm text-[#C59B3F] text-xs font-semibold px-3 py-1 rounded tracking-wider uppercase border border-[#C59B3F]/30">
            Gift Box {giftBox.code}
          </div>
          {giftBox.badge && (
            <div className="absolute top-3 right-3 bg-[#C59B3F] text-[#140F0E] text-[11px] font-bold px-2.5 py-1 rounded shadow-sm">
              {giftBox.badge}
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-6">
          <div className="flex items-baseline justify-between gap-2 border-b border-[#F2ECE1] pb-3 mb-3">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#1A1412] leading-tight">
                {giftBox.title}
              </h3>
              <p className="text-xs font-medium text-[#7C6E64] uppercase tracking-wider mt-0.5">
                {giftBox.subtitle} • {giftBox.jarWeight}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-[#8E8278] uppercase tracking-wider block font-medium">Combo Price</span>
              <span className="font-serif text-2xl font-bold text-[#1A1412] text-[#A85A2A]">
                ₹{giftBox.price.toLocaleString('en-IN')}/-
              </span>
            </div>
          </div>

          {/* Curated Jars List */}
          <div className="space-y-1.5 mt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1412] block mb-2">
              Curated Jars Included:
            </span>
            {giftBox.curatedItems.map((item, idx) => (
              <div key={idx} className="flex items-center text-xs text-[#4A3E37]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C59B3F] mr-2 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Presentation Note */}
          <div className="mt-4 pt-3 border-t border-[#F2ECE1] bg-[#FAF8F5] p-3 rounded-md text-xs text-[#63574E] space-y-1">
            <div className="font-medium text-[#1A1412] flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#C59B3F]" />
              <span>Presentation:</span>
            </div>
            <p className="leading-relaxed">
              {giftBox.presentation[0]} with {giftBox.jarsCount} airtight jars. Suitable for festive & corporate gifting.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="p-6 pt-0">
        <button
          onClick={() =>
            openEnquiryModal({
              enquiryType: 'Festive Gifting',
              productName: `Gift Box ${giftBox.code}: ${giftBox.title} (₹${giftBox.price}/-)`,
              sourcePage: '/gifting',
              initialMessage: `I would like to enquire about Gift Box ${giftBox.code}: ${giftBox.title} (₹${giftBox.price}/-). Please provide availability, bulk discounts, and customization options.`,
            })
          }
          className="w-full py-3 px-4 bg-[#1A1412] hover:bg-[#2C221E] text-[#FAF8F5] text-sm font-semibold rounded-md shadow transition-colors flex items-center justify-center space-x-2 border border-[#C59B3F]/40 cursor-pointer"
        >
          <span>Enquire About This Gift</span>
          <ArrowRight className="w-4 h-4 text-[#C59B3F]" />
        </button>
      </div>
    </div>
  );
}
