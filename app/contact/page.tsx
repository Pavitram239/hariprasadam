'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Globe, MessageCircle, Sparkles, CheckCircle2, Loader2, Send } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import WhatsAppButton from '@/components/WhatsAppButton';
import { EnquiryType } from '@/lib/types';

const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name'),
  phone: z.string().trim().min(8, 'Please enter a valid phone number (at least 8 digits)'),
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
  message: z.string().trim().min(6, 'Please provide details about your requirement'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      company: '',
      enquiry_type: 'Corporate Gifting',
      quantity: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source_page: '/contact',
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to submit enquiry');
      }

      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setServerError(err.message || 'Error sending message. Please connect via WhatsApp or phone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-24">
      {/* Hero Header */}
      <section className="bg-[#140F0E] text-[#FAF8F5] pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#C59B3F]/20">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C59B3F]">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight">
            Contact & Enquiries
          </h1>
          <p className="text-sm sm:text-base text-[#C8BDB4] max-w-xl mx-auto">
            Retail • Bulk • Festive • Corporate Gifting. We look forward to creating memorable dry-fruit experiences for you.
          </p>
        </div>
      </section>

      {/* Main Content Grid: Info & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Official Contact Card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-[#E6DEC8] rounded-2xl p-8 shadow-sm space-y-6">
              <div className="border-b border-[#F2ECE1] pb-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C59B3F] block mb-1">
                  HariPrasadam Pvt. Ltd.
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1A1412]">
                  Surat Headquarters
                </h3>
                <p className="text-xs text-[#63574E] mt-1">
                  Premium Dry Fruits • Nuts • Treats • Gifting
                </p>
              </div>

              {/* Detail Items */}
              <div className="space-y-5 text-sm text-[#4A3E37]">
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#C59B3F]/30 flex items-center justify-center text-[#C59B3F] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1A1412] uppercase tracking-wider block">
                      Facility & Office Address
                    </span>
                    <p className="text-xs text-[#63574E] mt-1 leading-relaxed">
                      286 Nagariyo Mohallo,<br />
                      Adajan – Hazira Road,<br />
                      Surat, Gujarat
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#C59B3F]/30 flex items-center justify-center text-[#C59B3F] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1A1412] uppercase tracking-wider block">
                      Direct Phone
                    </span>
                    <a
                      href="tel:+919909799369"
                      className="text-xs text-[#1A1412] hover:text-[#C59B3F] font-semibold mt-1 block"
                    >
                      +91 9909 799369
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#C59B3F]/30 flex items-center justify-center text-[#C59B3F] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1A1412] uppercase tracking-wider block">
                      Email Address
                    </span>
                    <a
                      href="mailto:info@hariprasadam.com"
                      className="text-xs text-[#1A1412] hover:text-[#C59B3F] font-semibold mt-1 block"
                    >
                      info@hariprasadam.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#C59B3F]/30 flex items-center justify-center text-[#C59B3F] shrink-0 mt-0.5">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1A1412] uppercase tracking-wider block">
                      Website
                    </span>
                    <a
                      href="https://www.hariprasadam.com"
                      className="text-xs text-[#1A1412] hover:text-[#C59B3F] font-semibold mt-1 block"
                    >
                      www.hariprasadam.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-4 border-t border-[#F2ECE1]">
                <WhatsAppButton
                  label="Message us on WhatsApp"
                  variant="primary"
                  className="w-full text-xs font-semibold py-3"
                />
              </div>
            </div>

            {/* Note banner */}
            <div className="bg-[#FAF8F5] border border-[#E6DEC8] rounded-xl p-5 text-xs text-[#63574E] space-y-1.5">
              <span className="font-semibold text-[#1A1412] block">
                Share Goodness. Share Happiness.
              </span>
              <p>
                Bulk orders, corporate gifting, and bespoke packaging customization available across Gujarat and all-India destinations.
              </p>
            </div>
          </div>

          {/* Right Column: Direct Contact Form */}
          <div className="lg:col-span-7 bg-white border border-[#E6DEC8] rounded-2xl p-8 sm:p-10 shadow-sm">
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C59B3F] block mb-1">
                Send an Enquiry
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1412]">
                Let&apos;s Create Something Special
              </h3>
              <p className="text-xs text-[#63574E] mt-1">
                Fill out the details below and our team will get back to you with custom catalog recommendations and pricing.
              </p>
            </div>

            {isSuccess ? (
              <div className="py-12 text-center space-y-5">
                <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mx-auto border border-[#25D366]/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl text-[#1A1412] font-semibold">
                    Thank you. Your enquiry has been received.
                  </h4>
                  <p className="text-xs text-[#63574E] mt-2 max-w-md mx-auto leading-relaxed">
                    Our team in Surat has logged your requirement and will connect with you shortly.
                  </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <WhatsAppButton
                    label="Continue on WhatsApp"
                    message="Hello HariPrasadam, I submitted an enquiry on your contact page and would like to connect."
                  />
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="px-5 py-2.5 text-xs font-semibold bg-white border border-[#DDD4C3] rounded-md hover:bg-[#FAF8F5]"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && (
                  <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
                    {serverError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                      Full Name <span className="text-[#A85A2A]">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="e.g. Rajesh Mehta"
                      className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                      Phone Number <span className="text-[#A85A2A]">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="e.g. +91 98250 12345"
                      className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="e.g. name@company.com"
                      className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>
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
                      className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                      Enquiry Type <span className="text-[#A85A2A]">*</span>
                    </label>
                    <select
                      {...register('enquiry_type')}
                      className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F] cursor-pointer"
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
                      placeholder="e.g. 100 boxes, 25 kg, etc."
                      className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1">
                    Message / Requirement <span className="text-[#A85A2A]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    {...register('message')}
                    placeholder="Tell us about the occasion, preferred products or flavours, delivery location, or any specific instructions..."
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C59B3F] resize-none"
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.message.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-[#1A1412] hover:bg-[#2C221E] text-[#FAF8F5] text-xs font-semibold rounded-md shadow transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#C59B3F]" />
                        <span>Submitting Your Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message to HariPrasadam</span>
                        <Send className="w-3.5 h-3.5 text-[#C59B3F]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Embedded Location Map of Surat */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E6DEC8] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 bg-[#FAF8F5] border-b border-[#E6DEC8] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C59B3F] block">
                Find Us in Surat
              </span>
              <h4 className="font-serif text-xl font-bold text-[#1A1412]">
                Adajan – Hazira Road, Surat, Gujarat
              </h4>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Adajan+Hazira+Road+Surat+Gujarat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#A85A2A] hover:underline"
            >
              Open in Google Maps
            </a>
          </div>

          <div className="relative aspect-[21/9] min-h-[320px] w-full bg-[#EFE8DC]">
            <iframe
              title="HariPrasadam Surat Location"
              src="https://maps.google.com/maps?q=286+Nagariyo+Mohallo+Adajan+Hazira+Road+Surat+Gujarat&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </div>
  );
}
