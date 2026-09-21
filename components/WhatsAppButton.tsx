'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'pill';
  label?: string;
  iconOnly?: boolean;
}

export default function WhatsAppButton({
  message = 'Hello HariPrasadam, I would like to enquire about your products and gifting collections.',
  className = '',
  variant = 'primary',
  label = 'WhatsApp Us',
  iconOnly = false,
}: WhatsAppButtonProps) {
  const encoded = encodeURIComponent(message);
  const href = `https://wa.me/919909799369?text=${encoded}`;

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer';
  
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-2.5 rounded-md shadow-sm hover:shadow';
      break;
    case 'secondary':
      variantStyles = 'bg-[#1A1412] hover:bg-[#2c221f] text-[#FDFBF7] px-5 py-2.5 rounded-md border border-[#C59B3F]/30';
      break;
    case 'outline':
      variantStyles = 'border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 px-4 py-2 rounded-md';
      break;
    case 'pill':
      variantStyles = 'bg-[#25D366] hover:bg-[#20b858] text-white px-4 py-2 rounded-full shadow-md text-sm';
      break;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variantStyles} ${className}`}
      aria-label="Contact HariPrasadam on WhatsApp"
    >
      <MessageCircle className={`h-4 w-4 ${iconOnly ? '' : 'mr-2'}`} />
      {!iconOnly && <span>{label}</span>}
    </a>
  );
}
