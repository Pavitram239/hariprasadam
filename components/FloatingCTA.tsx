'use client';

import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { getGeneralWhatsAppUrl } from '@/lib/whatsapp';

export default function FloatingCTA() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center">
      {/* Subtle tooltip on hover / desktop */}
      <div
        className={`hidden sm:block mr-3 px-3 py-1.5 rounded-lg bg-[#1A1412] text-[#FAF8F5] text-xs font-medium border border-[#C59B3F]/40 shadow-lg transition-all duration-200 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="text-[#C59B3F] font-semibold">Chat with us</span> • Quick WhatsApp Enquiry
      </div>

      {/* Floating WhatsApp Bubble */}
      <a
        href={getGeneralWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Enquire with HariPrasadam on WhatsApp"
      >
        {/* Gentle Pulse Halo */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none group-hover:opacity-0" />
        <MessageCircle className="w-6 h-6 fill-white text-white relative z-10" />
      </a>
    </div>
  );
}
