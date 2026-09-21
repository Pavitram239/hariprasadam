'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, Sparkles, Phone, Mail, Building, PackageCheck } from 'lucide-react';
import { useEnquiry } from './EnquiryContext';
import WhatsAppButton from './WhatsAppButton';
import { EnquiryType } from '@/lib/types';

const enquiryFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name'),
  phone: z.string().trim().min(8, 'Please enter a valid contact phone number (at least 8 digits)'),
  email: z.string().trim().email('Please enter a valid email address').optional().or(z.literal('')),
  company: z.string().trim().optional(),
  enquiry_type: z.enum([
    'Corporate Gifting',
    'Bulk Order',
    'Festive Gifting',
    'Customization',
    'Retail',
    'Product Enquiry',
    'Other',
  ] as const),
  quantity: z.string().trim().optional(),
  message: z.string().trim().min(6, 'Please provide a brief message about your requirement'),
});

type EnquiryFormData = z.infer<typeof enquiryFormSchema>;

export default function EnquiryModal() {
  const { isOpen, options, closeEnquiryModal } = useEnquiry();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      company: '',
      enquiry_type: options.enquiryType || 'Corporate Gifting',
      quantity: '',
      message: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setServerError(null);
      if (options.enquiryType) {
        setValue('enquiry_type', options.enquiryType);
      }
      if (options.initialMessage) {
        setValue('message', options.initialMessage);
      } else if (options.productName) {
        setValue('message', `I would like to enquire about: ${options.productName}. Please share details and pricing.`);
      }
    }
  }, [isOpen, options, setValue]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeEnquiryModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeEnquiryModal]);

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source_page: options.sourcePage || (typeof window !== 'undefined' ? window.location.pathname : '/'),
          product_name: options.productName || undefined,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to submit enquiry');
      }

      setIsSuccess(true);
      reset();
    } catch (err: any) {
      console.error('Submission error:', err);
      setServerError(err.message || 'An unexpected error occurred. Please try again or reach out on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeEnquiryModal}
            className="fixed inset-0 bg-[#0E0B0A]/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-[#FAF8F5] border border-[#E6DEC8] rounded-xl shadow-2xl z-10 overflow-hidden my-auto max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="relative bg-[#1A1412] text-[#FAF8F5] p-6 pb-5 border-b border-[#C59B3F]/20">
              <button
                onClick={closeEnquiryModal}
                className="absolute top-5 right-5 text-[#FAF8F5]/60 hover:text-[#FAF8F5] transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2 text-[#C59B3F] text-xs uppercase tracking-widest font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HariPrasadam Exclusive Gifting & Treats</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#FAF8F5]">
                Let&apos;s Create Something Special
              </h3>
              <p className="text-sm text-[#FAF8F5]/70 mt-1">
                Tell us what you&apos;re looking for and our team will get back to you promptly.
              </p>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto">
              {isSuccess ? (
                <div className="py-8 text-center space-y-5">
                  <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mx-auto border border-[#25D366]/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="font-serif text-2xl text-[#1A1412] font-semibold">
                      Thank you. Your enquiry has been received.
                    </h4>
                    <p className="text-sm text-[#63574E] mt-2 max-w-md mx-auto leading-relaxed">
                      Our specialist gifting and corporate team will review your requirements and reach out to you within a few business hours.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E6DEC8]/60 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <WhatsAppButton
                      label="Continue on WhatsApp"
                      variant="primary"
                      message="Hello HariPrasadam, I have just submitted an enquiry on your website and would like to discuss my requirements further."
                      className="w-full sm:w-auto"
                    />
                    <button
                      type="button"
                      onClick={closeEnquiryModal}
                      className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-[#4A3E37] hover:text-[#1A1412] bg-white border border-[#DDD4C3] rounded-md transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {serverError && (
                    <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                      {serverError}
                    </div>
                  )}

                  {/* Name and Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                        Full Name <span className="text-[#A85A2A]">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('name')}
                        placeholder="e.g. Rajesh Mehta"
                        className={`w-full px-3.5 py-2 text-sm bg-white border rounded-md text-[#1A1412] placeholder-[#A3978E] focus:outline-none focus:ring-1 focus:ring-[#C59B3F] focus:border-[#C59B3F] transition-all ${
                          errors.name ? 'border-red-400 bg-red-50/20' : 'border-[#DDD4C3]'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                        Phone Number <span className="text-[#A85A2A]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          {...register('phone')}
                          placeholder="e.g. +91 98250 12345"
                          className={`w-full px-3.5 py-2 text-sm bg-white border rounded-md text-[#1A1412] placeholder-[#A3978E] focus:outline-none focus:ring-1 focus:ring-[#C59B3F] focus:border-[#C59B3F] transition-all ${
                            errors.phone ? 'border-red-400 bg-red-50/20' : 'border-[#DDD4C3]'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email and Company Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="e.g. name@company.com"
                        className={`w-full px-3.5 py-2 text-sm bg-white border rounded-md text-[#1A1412] placeholder-[#A3978E] focus:outline-none focus:ring-1 focus:ring-[#C59B3F] focus:border-[#C59B3F] transition-all ${
                          errors.email ? 'border-red-400 bg-red-50/20' : 'border-[#DDD4C3]'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        {...register('company')}
                        placeholder="Optional (for corporate gifting)"
                        className="w-full px-3.5 py-2 text-sm bg-white border border-[#DDD4C3] rounded-md text-[#1A1412] placeholder-[#A3978E] focus:outline-none focus:ring-1 focus:ring-[#C59B3F] focus:border-[#C59B3F] transition-all"
                      />
                    </div>
                  </div>

                  {/* Enquiry Type & Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                        Enquiry Type <span className="text-[#A85A2A]">*</span>
                      </label>
                      <select
                        {...register('enquiry_type')}
                        className="w-full px-3.5 py-2 text-sm bg-white border border-[#DDD4C3] rounded-md text-[#1A1412] focus:outline-none focus:ring-1 focus:ring-[#C59B3F] focus:border-[#C59B3F] transition-all cursor-pointer"
                      >
                        <option value="Corporate Gifting">Corporate Gifting</option>
                        <option value="Bulk Order">Bulk Order</option>
                        <option value="Festive Gifting">Festive Gifting</option>
                        <option value="Customization">Customization</option>
                        <option value="Retail">Retail</option>
                        <option value="Product Enquiry">Product Enquiry</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                        Estimated Quantity
                      </label>
                      <input
                        type="text"
                        {...register('quantity')}
                        placeholder="e.g. 50 boxes, 25 kg, etc."
                        className="w-full px-3.5 py-2 text-sm bg-white border border-[#DDD4C3] rounded-md text-[#1A1412] placeholder-[#A3978E] focus:outline-none focus:ring-1 focus:ring-[#C59B3F] focus:border-[#C59B3F] transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                      Message / Requirement <span className="text-[#A85A2A]">*</span>
                    </label>
                    <textarea
                      rows={3}
                      {...register('message')}
                      placeholder="Please specify specific gift boxes, flavour preferences, customization, delivery timeline, or any special instructions..."
                      className={`w-full px-3.5 py-2 text-sm bg-white border rounded-md text-[#1A1412] placeholder-[#A3978E] focus:outline-none focus:ring-1 focus:ring-[#C59B3F] focus:border-[#C59B3F] transition-all resize-none ${
                        errors.message ? 'border-red-400 bg-red-50/20' : 'border-[#DDD4C3]'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button & Direct WhatsApp */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 py-3 px-6 bg-[#1A1412] hover:bg-[#2C221E] text-[#FAF8F5] text-sm font-semibold rounded-md shadow transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#C59B3F]" />
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <span>Submit Enquiry</span>
                      )}
                    </button>
                    <WhatsAppButton
                      label="Chat on WhatsApp"
                      variant="outline"
                      message="Hello HariPrasadam, I have a quick question regarding your premium dry fruits and gifting collection."
                      className="w-full sm:w-auto text-sm py-2.5"
                    />
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
