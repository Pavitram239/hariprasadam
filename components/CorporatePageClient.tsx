'use client';

import React from 'react';
import Image from 'next/image';
import { Building2, Briefcase, Users, Award, Palette } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import WhatsAppButton from '@/components/WhatsAppButton';
import { GiftBox } from '@/lib/types';
import GiftCard from '@/components/GiftCard';

const CORPORATE_PILLARS = [
  {
    icon: Briefcase,
    title: 'Client Appreciation',
    description: 'Distinguish your brand with executive-grade dry fruit presentation hampers that leave a lasting mark of sophistication.',
  },
  {
    icon: Users,
    title: 'Employee Recognition',
    description: 'Celebrate work anniversaries, festive bonuses, and milestones with nutritious, wholesome gourmet snack suites.',
  },
  {
    icon: Award,
    title: 'Annual Festive Gifting',
    description: 'Diwali, New Year, and festival hampers curated at scale with consistent luxury finishing and premium seal.',
  },
  {
    icon: Palette,
    title: 'Bespoke Customization',
    description: 'Branded jute packaging, custom logo ribbons, company greeting inserts, and tailored jar flavour combinations.',
  },
];

const FOUR_STEP_PROCESS = [
  {
    step: '01',
    title: 'Share your requirement',
    description: 'Tell us your approximate box count, budget tier, preferred flavours, and occasion.',
  },
  {
    step: '02',
    title: 'Choose your collection',
    description: 'Select between our 5-jar or 6-jar luxury gift boxes, artisan floral boxes, or branded jute packaging.',
  },
  {
    step: '03',
    title: 'Customize your gifting',
    description: 'Incorporate corporate logo ribbons, custom greeting cards, and specify pure Jain (J) allocations.',
  },
  {
    step: '04',
    title: 'Confirm your order',
    description: 'Finalize packing schedules and dispatch coordinates directly from our Surat facility.',
  },
];

interface CorporatePageClientProps {
  giftBoxes: GiftBox[];
}

export default function CorporatePageClient({ giftBoxes }: CorporatePageClientProps) {
  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      {/* Hero */}
      <section className="bg-[#140F0E] text-[#FAF8F5] pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#C59B3F]/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
              <Building2 className="w-3.5 h-3.5 text-[#C59B3F]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C59B3F]">
                Corporate Solutions
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
              Bespoke Corporate Gifting.{' '}
              <span className="italic font-normal text-[#C59B3F]">
                Refined & Memorable.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#C8BDB4] max-w-xl leading-relaxed">
              Empower your professional relationships with HariPrasadam&apos;s executive dry-fruit collections. Handcrafted in Surat, Gujarat with premium nuts, signature flavours, and complete branding customization.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <WhatsAppButton
                type="corporate"
                label="Discuss Your Requirement"
                variant="gold"
                size="lg"
              />

              <WhatsAppButton
                variant="secondary"
                label="WhatsApp Corporate Desk"
                message="Hello HariPrasadam, I would like to discuss corporate gifting for our organization."
                size="lg"
              />
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#C59B3F]/30 shadow-2xl bg-[#1D1715]">
              <Image
                src="/images/gifting/gift-box-03.jpg"
                alt="HariPrasadam Corporate Gift Hamper"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Tailored Solutions"
          title="Designed for Business Excellence"
          subtitle="From small boutique enterprise orders to large-scale festive shipments, we deliver precision and prestige."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORPORATE_PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E6DEC8] rounded-xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#C59B3F]/40 flex items-center justify-center text-[#C59B3F]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#1A1412]">
                  {p.title}
                </h3>
                <p className="text-xs text-[#63574E] leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="bg-[#FAF8F5] py-16 lg:py-24 border-y border-[#E6DEC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Seamless Process"
            title="How We Execute Your Corporate Gifting"
            subtitle="A transparent, collaborative path from initial enquiry to final presentation."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FOUR_STEP_PROCESS.map((st) => (
              <div
                key={st.step}
                className="bg-white border border-[#E6DEC8] rounded-xl p-6 relative shadow-sm"
              >
                <span className="font-serif text-4xl font-bold text-[#C59B3F]/30 block mb-2">
                  {st.step}
                </span>
                <h4 className="font-serif text-lg font-semibold text-[#1A1412] mb-2">
                  {st.title}
                </h4>
                <p className="text-xs text-[#63574E] leading-relaxed">
                  {st.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <WhatsAppButton
              type="corporate"
              label="Discuss Your Requirement on WhatsApp"
              variant="secondary"
              size="lg"
              className="font-semibold shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Recommended Corporate Gift Boxes Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Executive Selection"
          title="Recommended Corporate Collections"
          subtitle="Explore the most sought-after boxes for corporate orders from our 2026 Gifting Collection."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {giftBoxes.slice(0, 3).map((box) => (
            <GiftCard key={box.id} giftBox={box} />
          ))}
        </div>
      </section>

      {/* Direct Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1412] text-[#FAF8F5] rounded-2xl p-8 sm:p-12 border border-[#C59B3F]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C59B3F]">
              Direct Corporate Support
            </span>
            <h3 className="font-serif text-3xl font-medium tracking-tight text-white">
              Speak with our Gifting Specialist
            </h3>
            <p className="text-xs text-[#C8BDB4]">
              Phone: +91 9909 799369 • Email: info@hariprasadam.com • Surat, Gujarat
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <WhatsAppButton
              type="corporate"
              label="Discuss Your Requirement"
              variant="gold"
              size="md"
            />
            <WhatsAppButton
              variant="outline"
              label="WhatsApp Us"
              size="md"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
