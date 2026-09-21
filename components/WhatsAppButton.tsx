'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import {
  buildWhatsAppUrl,
  getProductWhatsAppUrl,
  getGiftWhatsAppUrl,
  getComboWhatsAppUrl,
  getCorporateWhatsAppUrl,
  getGeneralWhatsAppUrl,
} from '@/lib/whatsapp';

export interface WhatsAppButtonProps {
  message?: string;
  type?: 'general' | 'product' | 'gift' | 'combo' | 'corporate';
  targetName?: string;
  flavour?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'pill';
  label?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function WhatsAppButton({
  message,
  type,
  targetName,
  flavour,
  className = '',
  variant = 'primary',
  label = 'WhatsApp Us',
  iconOnly = false,
  size = 'md',
}: WhatsAppButtonProps) {
  let href: string;

  if (message) {
    href = buildWhatsAppUrl(message);
  } else if (type === 'product' && targetName) {
    href = getProductWhatsAppUrl(targetName, flavour);
  } else if (type === 'gift' && targetName) {
    href = getGiftWhatsAppUrl(targetName);
  } else if (type === 'combo' && targetName) {
    href = getComboWhatsAppUrl(targetName);
  } else if (type === 'corporate') {
    href = getCorporateWhatsAppUrl();
  } else {
    href = getGeneralWhatsAppUrl();
  }

  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none';

  let sizeStyles = 'text-xs px-4 py-2 rounded-md';
  if (size === 'sm') {
    sizeStyles = 'text-[11px] px-3 py-1.5 rounded';
  } else if (size === 'lg') {
    sizeStyles = 'text-sm px-7 py-3.5 rounded-md';
  }

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles =
        'bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm hover:shadow active:scale-[0.99]';
      break;
    case 'secondary':
      variantStyles =
        'bg-[#1A1412] hover:bg-[#2B201B] text-[#FAF8F5] border border-[#C59B3F]/40 shadow-sm hover:border-[#C59B3F]';
      break;
    case 'gold':
      variantStyles =
        'bg-[#C59B3F] hover:bg-[#b88c32] text-[#140F0E] font-semibold shadow-sm hover:shadow active:scale-[0.99]';
      break;
    case 'outline':
      variantStyles =
        'border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10';
      break;
    case 'pill':
      variantStyles =
        'bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-md';
      break;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      aria-label={label || 'Contact HariPrasadam on WhatsApp'}
    >
      <MessageCircle className={`h-4 w-4 shrink-0 ${iconOnly ? '' : 'mr-2'}`} />
      {!iconOnly && <span>{label}</span>}
    </a>
  );
}
