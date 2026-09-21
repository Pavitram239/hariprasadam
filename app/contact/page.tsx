'use client';

import React from 'react';
import { MapPin, Phone, Mail, Globe, Building2, Sparkles, HeartHandshake, PackageCheck, Clock } from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton';
import {
  getCorporateWhatsAppUrl,
  getGiftWhatsAppUrl,
  getCustomGiftingWhatsAppUrl,
  getGeneralWhatsAppUrl,
  HARIPRASADAM_DISPLAY_PHONE,
} from '@/lib/whatsapp';

const ENQUIRY_TOPICS = [
  {
    icon: Building2,
    title: 'Corporate Gifting',
    tagline: 'Client gifts & employee appreciation',
    description: 'Custom branded ribbon sleeves, executive presentation boxes, and volume pricing.',
    url: getCorporateWhatsAppUrl(),
  },
  {
    icon: Sparkles,
    title: 'Festive & Celebration Hampers',
    tagline: 'Diwali, weddings & family occasions',
    description: 'Gold-embossed gift boxes featuring 5 or 6 airtight jars with signature treats.',
    url: getGiftWhatsAppUrl('Festive & Wedding Hampers'),
  },
  {
    icon: PackageCheck,
    title: 'Custom Packaging & Weights',
    tagline: 'Tailored jar weights & bespoke labels',
    description: '100g, 175g–200g, or bulk kg packing with custom flavour selections.',
    url: getCustomGiftingWhatsAppUrl('custom jar weights and branding'),
  },
  {
    icon: HeartHandshake,
    title: 'Personal & Retail Orders',
    tagline: 'Handcrafted flavours for home enjoyment',
    description: 'Freshly roasted Honey Rose almonds, Kunafa dates, and signature mixes.',
    url: getGeneralWhatsAppUrl(),
  },
];

export default function ContactPage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-24">
      {/* Hero Header */}
      <section className="bg-[#140F0E] text-[#FAF8F5] pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#C59B3F]/20">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C59B3F]">
            Direct Connectivity
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight">
            Contact & WhatsApp Desk
          </h1>
          <p className="text-sm sm:text-base text-[#C8BDB4] max-w-xl mx-auto">
            Retail • Bulk • Festive • Corporate Gifting. Connect with our team in Surat directly on WhatsApp for instant assistance, catalogue requests, and custom quotes.
          </p>
        </div>
      </section>

      {/* Main Content Grid: Info & WhatsApp Conversion Suite */}
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
                      {HARIPRASADAM_DISPLAY_PHONE}
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

                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#C59B3F]/30 flex items-center justify-center text-[#C59B3F] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1A1412] uppercase tracking-wider block">
                      Operating & Response Hours
                    </span>
                    <p className="text-xs text-[#63574E] mt-1 leading-relaxed">
                      Monday – Saturday: 9:30 AM – 7:30 PM<br />
                      WhatsApp enquiries accepted 24/7
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-4 border-t border-[#F2ECE1]">
                <WhatsAppButton
                  type="general"
                  label="WhatsApp Us"
                  variant="primary"
                  className="w-full text-sm font-semibold py-3.5"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Context-Aware WhatsApp Topics */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#E6DEC8] rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C59B3F] block mb-1">
                  Instant WhatsApp Desk
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1412]">
                  Choose Your Enquiry Topic
                </h3>
                <p className="text-xs text-[#63574E] mt-1">
                  Click any topic below to open WhatsApp with a pre-filled message tailored to your requirement.
                </p>
              </div>

              {/* Topic Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ENQUIRY_TOPICS.map((topic, idx) => {
                  const Icon = topic.icon;
                  return (
                    <a
                      key={idx}
                      href={topic.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-[#FAF8F5] hover:bg-white border border-[#E6DEC8] hover:border-[#C59B3F] rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-lg bg-white group-hover:bg-[#FAF8F5] border border-[#C59B3F]/30 flex items-center justify-center text-[#C59B3F]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-serif text-lg font-semibold text-[#1A1412] group-hover:text-[#A85A2A] transition-colors">
                          {topic.title}
                        </h4>
                        <span className="text-[11px] text-[#A85A2A] font-semibold block">
                          {topic.tagline}
                        </span>
                        <p className="text-xs text-[#63574E] leading-relaxed">
                          {topic.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#EAE3D2] flex items-center justify-between text-xs font-semibold text-[#25D366]">
                        <span>Start WhatsApp Chat</span>
                        <span className="text-sm transform group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Primary Direct Chat Banner */}
              <div className="p-5 bg-[#140F0E] text-[#FAF8F5] rounded-xl border border-[#C59B3F]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C59B3F] block">
                    General Enquiry
                  </span>
                  <h4 className="font-serif text-base font-semibold">
                    Have a specific question or custom requirement?
                  </h4>
                </div>
                <WhatsAppButton
                  type="general"
                  label="WhatsApp Us"
                  variant="gold"
                  size="md"
                  className="shrink-0 font-semibold"
                />
              </div>
            </div>
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
