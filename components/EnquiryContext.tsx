'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EnquiryType } from '@/lib/types';

interface EnquiryModalOptions {
  enquiryType?: EnquiryType;
  productName?: string;
  sourcePage?: string;
  initialMessage?: string;
}

interface EnquiryContextType {
  isOpen: boolean;
  options: EnquiryModalOptions;
  openEnquiryModal: (options?: EnquiryModalOptions) => void;
  closeEnquiryModal: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<EnquiryModalOptions>({});

  const openEnquiryModal = (newOptions?: EnquiryModalOptions) => {
    setOptions(newOptions || {});
    setIsOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsOpen(false);
  };

  return (
    <EnquiryContext.Provider value={{ isOpen, options, openEnquiryModal, closeEnquiryModal }}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
}
