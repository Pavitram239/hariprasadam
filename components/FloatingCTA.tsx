'use client';

import React from 'react';
import { MessageCircle, MailQuestion } from 'lucide-react';
import { useEnquiry } from './EnquiryContext';

export default function FloatingCTA() {
  const { openEnquiryModal } = useEnquiry();

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col sm:flex-row items-end sm:items-center space-y-2.5 sm:space-y-0 sm:space-x-3">
      {/* Enquire floating trigger */}
      <button
        onClick={() => openEnquiryModal({ enquiryType: 'Corporate Gifting' })}
        className="flex items-center space-x-2 bg-[#1A1412] hover:bg-[#2A201C] text-[#FAF8F5] px-4 py-2.5 rounded-full shadow-lg border border-[#C59B3F]/40 transition-all duration-200 hover:scale-105 cursor-pointer text-xs font-semibold tracking-wide"
        aria-label="Open enquiry form"
      >
        <MailQuestion className="w-4 h-4 text-[#C59B3F]" />
        <span className="hidden sm:inline">Enquire Now</span>
        <span className="sm:hidden">Enquire</span>
      </button>

      {/* WhatsApp floating trigger */}
      <a
        href="https://wa.me/919909799369?text=Hello%20HariPrasadam,%20I%20would%20like%20to%20enquire%20about%20your%20products/gifting%20collection."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer text-xs font-semibold tracking-wide"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}
