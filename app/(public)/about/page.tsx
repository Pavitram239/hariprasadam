'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ShieldCheck, CheckCircle2, Heart, Award } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function AboutPage() {
  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      {/* Hero */}
      <section className="bg-[#140F0E] text-[#FAF8F5] pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#C59B3F]/20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B3F]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C59B3F]">
              Our Heritage & Philosophy
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
            Pure Fruit.{' '}
            <span className="italic font-normal text-[#C59B3F]">
              Pure Health.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#C8BDB4] max-w-2xl mx-auto leading-relaxed">
            Rooted in Surat, Gujarat, HariPrasadam Pvt. Ltd. was founded on a singular commitment: to deliver exceptional dry fruits, artisanal roasted nuts, and unforgettable gifting presentations without compromise.
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C59B3F]">
              <span className="h-[1px] w-6 bg-[#C59B3F]" />
              <span>The HariPrasadam Standard</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#1A1412] leading-tight">
              &ldquo;Premium Nuts & Dry Fruits, Every Way You Love Them&rdquo;
            </h2>

            <p className="text-sm sm:text-base text-[#5C5047] leading-relaxed">
              We believe dry fruits should be celebrated in all their dimensions — from unadorned, crisp natural roasts for daily wellness to inventive, handcrafted culinary coatings like Honey Rose, Mediterranean Cheese & Herbs, and Middle Eastern Kunafa.
            </p>

            <p className="text-sm sm:text-base text-[#5C5047] leading-relaxed">
              Every batch is slow-roasted and coated to order to maintain prime crunch, essential natural oils, and peak fragrance. We never cut corners with cheap fillers or artificial glazes.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3 text-xs text-[#2E2621]">
                <CheckCircle2 className="w-4 h-4 text-[#C59B3F] mt-0.5 shrink-0" />
                <span>
                  <strong>100% Fresh Roasted to Order:</strong> Ensures pristine freshness and maximum crunch in every jar.
                </span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-[#2E2621]">
                <CheckCircle2 className="w-4 h-4 text-[#C59B3F] mt-0.5 shrink-0" />
                <span>
                  <strong>Pure Jain Friendly Options (J):</strong> Formulated strictly according to traditional Jain dietary guidelines.
                </span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-[#2E2621]">
                <CheckCircle2 className="w-4 h-4 text-[#C59B3F] mt-0.5 shrink-0" />
                <span>
                  <strong>Thoughtfully Curated Gifting:</strong> Elegant presentation boxes crafted to leave a lasting impression.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden border border-[#E6DEC8] shadow-xl bg-[#F7F4EE]">
              <Image
                src="/images/gifting/gifting-spread.jpg"
                alt="HariPrasadam Heritage and Quality"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Pillars */}
      <section className="bg-[#FAF8F5] py-16 lg:py-24 border-y border-[#E6DEC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="What Defines Us"
            title="Our Four Pillars of Quality"
            subtitle="The principles that guide every batch roasted and every gift box assembled."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#E6DEC8] rounded-xl p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#C59B3F]/30 flex items-center justify-center text-[#C59B3F]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#1A1412]">
                1. Meticulous Sourcing
              </h3>
              <p className="text-xs text-[#63574E] leading-relaxed">
                We select plump California almonds, rich whole cashews, imported Turkish hazelnuts, and juicy sundried raisins.
              </p>
            </div>

            <div className="bg-white border border-[#E6DEC8] rounded-xl p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#C59B3F]/30 flex items-center justify-center text-[#C59B3F]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#1A1412]">
                2. Roasted to Order
              </h3>
              <p className="text-xs text-[#63574E] leading-relaxed">
                Products are never sitting stale on distant shelves. They are prepared to order, preserving aromatic oils and crisp bite.
              </p>
            </div>

            <div className="bg-white border border-[#E6DEC8] rounded-xl p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#C59B3F]/30 flex items-center justify-center text-[#C59B3F]">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#1A1412]">
                3. Artisanal Flavours
              </h3>
              <p className="text-xs text-[#63574E] leading-relaxed">
                From fragrant saffron and rose petals to savoury cheese herb dusting, our recipes balance Indian tradition with modern indulgence.
              </p>
            </div>

            <div className="bg-white border border-[#E6DEC8] rounded-xl p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#C59B3F]/30 flex items-center justify-center text-[#C59B3F]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#1A1412]">
                4. Gift-Worthy Art
              </h3>
              <p className="text-xs text-[#63574E] leading-relaxed">
                Every box is engineered to communicate prestige, gratitude, and care — ideal for corporate milestones and family occasions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Official Company Information Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E6DEC8] rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C59B3F]">
              Registered Information
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#1A1412]">
              HariPrasadam Pvt. Ltd.
            </h3>
            <p className="text-xs text-[#7A6D63] uppercase tracking-wider">
              Premium Dry Fruits • Flavoured Nuts • Gift Packaging
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#F2ECE1] text-xs text-[#4A3E37]">
            <div className="space-y-1">
              <span className="font-bold text-[#1A1412] uppercase tracking-wider block">
                Facility & Office
              </span>
              <p className="leading-relaxed">
                286 Nagariyo Mohallo, Adajan – Hazira Road, Surat, Gujarat
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-[#1A1412] uppercase tracking-wider block">
                Direct Contact
              </span>
              <p>Phone: +91 9909 799369</p>
              <p>Email: info@hariprasadam.com</p>
              <p>Web: www.hariprasadam.com</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-[#1A1412] uppercase tracking-wider block">
                Capabilities
              </span>
              <p>• Bulk Orders Across India</p>
              <p>• Corporate Gifting Programmes</p>
              <p>• Custom Packaging Available</p>
            </div>
          </div>

          <div className="pt-4 text-center">
            <WhatsAppButton
              type="general"
              label="Connect with HariPrasadam on WhatsApp"
              variant="primary"
              size="lg"
              className="font-semibold shadow-sm"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
