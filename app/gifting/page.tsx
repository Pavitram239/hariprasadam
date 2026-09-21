'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Gift, ArrowRight, CheckCircle2, ShieldCheck, Box, ShoppingBag } from 'lucide-react';
import { GIFT_BOXES_2026, CATALOGUE_PACKAGING } from '@/lib/giftingData';
import GiftCard from '@/components/GiftCard';
import SectionHeading from '@/components/SectionHeading';
import { useEnquiry } from '@/components/EnquiryContext';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function GiftingPage() {
  const { openEnquiryModal } = useEnquiry();
  const [activePackagingTab, setActivePackagingTab] = useState<'all' | 'gift-box' | 'branded-jute' | 'plain-jute' | 'pocket-mix'>('all');

  const filteredPackaging = CATALOGUE_PACKAGING.filter((item) => {
    if (activePackagingTab === 'all') return true;
    return item.type === activePackagingTab;
  });

  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      {/* ========================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================= */}
      <section className="bg-[#140F0E] text-[#FAF8F5] pt-14 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[#C59B3F]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B3F]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C59B3F]">
                2026 Collection
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
              Premium Gifting,{' '}
              <span className="italic font-normal text-[#C59B3F]">
                Thoughtfully Curated.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#C8BDB4] max-w-xl leading-relaxed">
              Refined presentation boxes, golden seals, airtight glass jars, and signature flavours. Built around festive celebrations, corporate appreciation, and distinguished personal gestures.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() =>
                  openEnquiryModal({
                    enquiryType: 'Festive Gifting',
                    sourcePage: '/gifting',
                    initialMessage: 'I am interested in ordering curated gift boxes from the 2026 Gifting Collection.',
                  })
                }
                className="px-7 py-3.5 bg-[#C59B3F] hover:bg-[#b88c32] text-[#140F0E] text-sm font-semibold rounded-md shadow transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Enquire 2026 Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <WhatsAppButton
                variant="secondary"
                label="WhatsApp Gifting Desk"
                message="Hello HariPrasadam, I would like to enquire about your 2026 Gifting Collection and bulk pricing."
                className="py-3.5 px-6 text-sm"
              />
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#C59B3F]/30 shadow-2xl bg-[#1D1715]">
              <Image
                src="/images/gifting/gifting-spread.jpg"
                alt="HariPrasadam 2026 Gifting Collection"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2026 FLAGSHIP GIFT BOXES (EXACT PRICES ₹1,530 - ₹1,975) */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Flagship Jars Collection"
          title="The 2026 Premium Gift Boxes"
          subtitle="Featuring 5 or 6 airtight jars (175–200g each) in gold-embossed presentation packaging. Exact catalogue pricing as supplied."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GIFT_BOXES_2026.map((box) => (
            <GiftCard key={box.id} giftBox={box} />
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* ADDITIONAL PACKAGING SUITES FROM CATALOGUE */}
      {/* ========================================================= */}
      <section className="bg-[#FAF8F5] py-16 lg:py-24 border-y border-[#E6DEC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeading
            badge="Versatile Presentation Suites"
            title="Artisan Gift Boxes & Eco Jute Packaging"
            subtitle="Explore our catalogue's specialized gift formats: artisan floral boxes, 5-compartment snack boxes, branded jute bags, and festive pocket favours."
          />

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Formats' },
              { id: 'gift-box', label: 'Artisan Gift Boxes' },
              { id: 'branded-jute', label: 'Branded Jute Bags (With Logo)' },
              { id: 'plain-jute', label: 'Plain Jute Bags' },
              { id: 'pocket-mix', label: '4 Mix Pocket Favour' },
            ].map((tab) => {
              const isActive = activePackagingTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePackagingTab(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1A1412] text-[#FAF8F5] shadow-sm'
                      : 'bg-white text-[#5C5047] hover:bg-[#F2ECE1] border border-[#DDD4C3]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Additional Packaging Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPackaging.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E6DEC8] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-[#F7F4EE] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 right-3 bg-[#1A1412]/90 text-[#FAF8F5] text-xs font-bold px-2.5 py-1 rounded">
                      ₹{item.price.toLocaleString('en-IN')}/-
                    </div>
                    {item.tag && (
                      <div className="absolute top-3 left-3 bg-[#C59B3F] text-[#140F0E] text-[10px] font-bold px-2 py-0.5 rounded">
                        {item.tag}
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <h4 className="font-serif text-lg font-semibold text-[#1A1412] leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#7A6D63] font-medium">
                      Weight: {item.weight}
                    </p>

                    <div className="pt-2 border-t border-[#F2ECE1] space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#8A7E75] block">
                        Included Items:
                      </span>
                      {item.items.map((it, idx) => (
                        <div key={idx} className="text-xs text-[#4A3E37] flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C59B3F] mr-1.5 shrink-0" />
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-2">
                  <button
                    onClick={() =>
                      openEnquiryModal({
                        enquiryType: 'Corporate Gifting',
                        productName: `${item.title} (₹${item.price}/-)`,
                        sourcePage: '/gifting',
                        initialMessage: `I am interested in ordering ${item.title} (₹${item.price}/-). Please provide availability, minimum order quantity, and lead time.`,
                      })
                    }
                    className="w-full py-2 px-3 bg-[#FAF8F5] hover:bg-[#1A1412] text-[#1A1412] hover:text-[#FAF8F5] text-xs font-semibold rounded border border-[#DDD4C3] transition-colors"
                  >
                    Enquire This Option
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CORPORATE & BULK ORDERS NOTICE */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1412] text-[#FAF8F5] rounded-2xl p-8 sm:p-12 border border-[#C59B3F]/30 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C59B3F]">
              Direct from Manufacturer in Surat
            </span>
            <h3 className="font-serif text-3xl font-medium tracking-tight text-white">
              Planning Bulk Festive or Corporate Hampers?
            </h3>
            <p className="text-xs sm:text-sm text-[#C8BDB4] leading-relaxed">
              We offer bespoke ribbon printing, corporate logo card inserts, custom weight jar combinations, and delivery assistance for large volumes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() =>
                openEnquiryModal({
                  enquiryType: 'Corporate Gifting',
                  sourcePage: '/gifting',
                  initialMessage: 'I would like to discuss a bulk gifting requirement with HariPrasadam.',
                })
              }
              className="px-6 py-3.5 bg-[#C59B3F] hover:bg-[#b88c32] text-[#140F0E] text-xs font-bold uppercase tracking-wider rounded transition-colors text-center"
            >
              Discuss Custom Gifting
            </button>
            <WhatsAppButton
              variant="outline"
              label="WhatsApp Enquiry"
              className="py-3.5 px-5 text-xs font-semibold"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
