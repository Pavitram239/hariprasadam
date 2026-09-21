'use client';

import React from 'react';
import { ComboItem } from '@/lib/types';
import { useEnquiry } from './EnquiryContext';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface ComboCardProps {
  combo: ComboItem;
}

export default function ComboCard({ combo }: ComboCardProps) {
  const { openEnquiryModal } = useEnquiry();

  return (
    <div className="bg-white border border-[#E6DEC8] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C59B3F] bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#C59B3F]/30">
            {combo.subtitle}
          </span>
          <span className="text-xs text-[#7A6D63] font-medium italic">
            {combo.occasion}
          </span>
        </div>

        <h3 className="font-serif text-2xl font-semibold text-[#1A1412] group-hover:text-[#A85A2A] transition-colors mt-1">
          {combo.name}
        </h3>
        
        <p className="text-xs text-[#5C5047] font-medium mt-0.5">
          {combo.tagline}
        </p>

        <p className="text-xs text-[#63574E] mt-2.5 leading-relaxed">
          {combo.description}
        </p>

        {/* Included Products List */}
        <div className="mt-5 pt-4 border-t border-[#F2ECE1]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1A1412] block mb-2.5">
            Included Products:
          </span>
          <div className="space-y-2">
            {combo.products.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs bg-[#FAF8F5] px-3 py-2 rounded border border-[#EBE3D3]"
              >
                <span className="font-medium text-[#2E2621]">{item.name}</span>
                {item.isJain && (
                  <span className="text-[10px] font-bold bg-[#2D4A27] text-white px-2 py-0.5 rounded-full uppercase ml-2 shrink-0">
                    Jain (J)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 pt-3">
        <button
          onClick={() =>
            openEnquiryModal({
              enquiryType: 'Corporate Gifting',
              productName: `${combo.subtitle}: ${combo.name} (${combo.occasion})`,
              sourcePage: '/',
              initialMessage: `I would like to enquire about ${combo.subtitle}: ${combo.name} (${combo.occasion}). Please share available packaging options, minimum quantities, and pricing.`,
            })
          }
          className="w-full py-2.5 px-4 bg-[#FAF8F5] hover:bg-[#1A1412] text-[#1A1412] hover:text-[#FAF8F5] text-xs font-semibold rounded-md border border-[#DDD4C3] hover:border-[#1A1412] transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Enquire About This Combo</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#C59B3F]" />
        </button>
      </div>
    </div>
  );
}
