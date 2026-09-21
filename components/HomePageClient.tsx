'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gift,
  Building2,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { useEnquiry } from '@/components/EnquiryContext';
import { Product, Category, GiftBox, ComboItem } from '@/lib/types';
import SectionHeading from '@/components/SectionHeading';
import GiftCard from '@/components/GiftCard';
import ComboCard from '@/components/ComboCard';
import WhatsAppButton from '@/components/WhatsAppButton';

const SIGNATURE_FLAVOURS_NAMES = [
  'Honey Rose',
  'Cheese & Herbs',
  'Kunafa',
  'Dark Choco',
  'Lemon Chilly',
  'Thandai Kesar',
  'Sahi Paan',
  'Oreo',
  'Malai Rose',
];

interface HomePageClientProps {
  products: Product[];
  categories: Category[];
  giftBoxes: GiftBox[];
  combos: ComboItem[];
}

export default function HomePageClient({
  products,
  categories,
  giftBoxes,
  combos,
}: HomePageClientProps) {
  const { openEnquiryModal } = useEnquiry();
  const [activeFlavourTab, setActiveFlavourTab] = useState('Honey Rose');

  const signatureProducts = products.filter((p) =>
    SIGNATURE_FLAVOURS_NAMES.some((name) => p.flavour.toLowerCase().includes(name.toLowerCase()))
  );

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      {/* ========================================================= */}
      {/* SECTION 1: HERO */}
      {/* ========================================================= */}
      <section className="relative pt-8 sm:pt-14 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Editorial Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-[#F2ECE1] border border-[#E0D5C1] px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B3F]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1412]">
                Pure Fruit. Pure Health.
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1A1412] leading-[1.12]">
              Premium Dry Fruits.{' '}
              <span className="block italic text-[#A85A2A] font-normal">
                Made to Be Remembered.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5C5047] max-w-xl leading-relaxed">
              Crafted in Surat, Gujarat. Discover whole select nuts, slow-roasted dry fruits, and an iconic {products.length || 27}-flavour collection — thoughtfully presented for celebratory milestones and bespoke corporate gifting.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/products"
                className="px-7 py-3.5 bg-[#1A1412] hover:bg-[#2C221E] text-[#FAF8F5] text-sm font-semibold rounded-md shadow-sm transition-all duration-200 flex items-center justify-center space-x-2 border border-[#C59B3F]/40 cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 text-[#C59B3F]" />
              </Link>

              <button
                onClick={() =>
                  openEnquiryModal({
                    enquiryType: 'Corporate Gifting',
                    sourcePage: '/',
                  })
                }
                className="px-7 py-3.5 bg-white hover:bg-[#FAF8F5] text-[#1A1412] text-sm font-semibold rounded-md border border-[#DDD4C3] shadow-sm transition-all duration-200 flex items-center justify-center cursor-pointer"
              >
                <span>Enquire Now</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 border-t border-[#E6DEC8] grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1412] block">
                  {products.length || 27}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-[#8A7E75]">
                  Signatures
                </span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1412] block">
                  {categories.length || 6}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-[#8A7E75]">
                  Categories
                </span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1412] block">
                  100%
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-[#8A7E75]">
                  Fresh Roasted
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual from 2026 Collection */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-[#F7F4EE]">
              <Image
                src="/images/gifting/gifting-spread.jpg"
                alt="HariPrasadam Premium Dry Fruits & Gifting Collection"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140F0E]/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C59B3F] block">
                    2026 Gifting Collection
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold mt-0.5">
                    Thoughtfully Curated Gift Boxes
                  </h3>
                </div>
                <Link
                  href="/gifting"
                  className="shrink-0 bg-white/90 hover:bg-white text-[#1A1412] text-xs font-semibold px-4 py-2 rounded-md backdrop-blur-sm transition-colors"
                >
                  View Boxes
                </Link>
              </div>
            </div>

            {/* Floating Luxury Accent Badge */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white border border-[#E6DEC8] p-4 rounded-xl shadow-lg items-center space-x-3.5 max-w-xs">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#C59B3F]/40 flex items-center justify-center text-[#C59B3F] shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1A1412] block">
                  Bespoke Corporate Gifting
                </span>
                <span className="text-[11px] text-[#70645A]">
                  Custom logo ribbons, luxury jars & branded packaging
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: BRAND INTRODUCTION */}
      {/* ========================================================= */}
      <section className="bg-[#FAF8F5] border-y border-[#E6DEC8] py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#C59B3F]">
            The Complete Flavour Collection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1A1412] max-w-3xl mx-auto leading-tight">
            &ldquo;Premium Nuts & Dry Fruits, Every Way You Love Them&rdquo;
          </h2>
          <p className="text-base sm:text-lg text-[#5C5047] max-w-2xl mx-auto leading-relaxed">
            From classic, unblemished Plain roasted kernels to Honey Rose, Cheese & Herbs, Middle Eastern Kunafa, and beyond — every flavour is meticulously roasted and coated to order. Whether for wellness, family enjoyment, or memorable corporate gifts, HariPrasadam brings uncompromising refinement.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#63574E] font-medium">
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-[#C59B3F] mr-1.5" />
              100% Fresh Roasted to Order
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-[#C59B3F] mr-1.5" />
              Jain Friendly (J) Options Available
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-[#C59B3F] mr-1.5" />
              Bulk & Corporate Customization
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-[#C59B3F] mr-1.5" />
              Dispatch from Surat, Gujarat
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: PRODUCT CATEGORIES */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Explore Our Range"
          title="Curated Product Categories"
          subtitle="Explore the core pillars of our artisanal range, each roasted and flavoured to perfection."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => {
            const count = products.filter((p) => p.category.toLowerCase() === category.name.toLowerCase()).length;
            return (
              <Link
                key={category.id || category.name}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group bg-white border border-[#E6DEC8] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-[#F7F4EE] overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C59B3F] block">
                        {count > 0 ? `${count} Flavours` : 'Artisanal Selection'}
                      </span>
                      <h3 className="font-serif text-2xl font-semibold">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A85A2A] block mb-1.5">
                      {category.tagline}
                    </span>
                    <p className="text-xs text-[#63574E] leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-semibold text-[#1A1412] group-hover:text-[#A85A2A] transition-colors">
                  <span>Explore {category.name} Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: SIGNATURE FLAVOURS */}
      {/* ========================================================= */}
      <section className="bg-[#140F0E] text-[#FAF8F5] py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C59B3F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="Artisanal Profiles"
            title="Signature Flavours"
            subtitle="Explore our catalogue's most acclaimed creations, roasted and coated to order in Surat."
            light
          />

          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {SIGNATURE_FLAVOURS_NAMES.map((flavour) => {
              const isActive = activeFlavourTab === flavour;
              return (
                <button
                  key={flavour}
                  onClick={() => setActiveFlavourTab(flavour)}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C59B3F] text-[#140F0E] font-semibold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-[#C8BDB4] border border-white/10'
                  }`}
                >
                  {flavour}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {signatureProducts
              .filter((p) => p.flavour.toLowerCase().includes(activeFlavourTab.toLowerCase()))
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-[#1D1715] border border-[#C59B3F]/20 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[4/3] bg-[#241E1C] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.isJain && (
                        <div className="absolute top-3 right-3 bg-[#2D4A27] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase">
                          Jain (J)
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-black/70 text-[#C59B3F] text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded uppercase">
                        {product.category}
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <span className="text-xs text-[#C59B3F] font-semibold uppercase tracking-wider block">
                        {product.flavour}
                      </span>
                      <h3 className="font-serif text-xl font-semibold text-[#FAF8F5]">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#C8BDB4] leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-2 border-t border-white/10 flex items-center justify-between">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs text-[#C8BDB4] hover:text-[#C59B3F] transition-colors flex items-center font-medium"
                    >
                      <span>Explore Flavour</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>

                    <button
                      onClick={() =>
                        openEnquiryModal({
                          enquiryType: 'Product Enquiry',
                          productName: product.name,
                          sourcePage: '/',
                          initialMessage: `I am enquiring about ${product.name} (${product.flavour}). Please provide details regarding bulk quantities and packaging.`,
                        })
                      }
                      className="px-3 py-1.5 bg-[#C59B3F] hover:bg-[#b88c32] text-[#140F0E] text-xs font-semibold rounded transition-colors"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-[#C59B3F] hover:text-[#e4b550] transition-colors border-b border-[#C59B3F]/40 pb-1"
            >
              <span>Browse All {products.length || 27} Flavours in Complete Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: PREMIUM GIFTING 2026 COLLECTION */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 mb-3">
              <span className="h-[1px] w-6 bg-[#C59B3F]" />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#C59B3F]">
                2026 Collection
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1A1412]">
              Premium Gifting, Thoughtfully Curated.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#63574E] max-w-xl">
              Refined boxes. Signature flavours. A presentation designed to be remembered. Each gift box contains 5 or 6 airtight jars (175–200g each).
            </p>
          </div>

          <Link
            href="/gifting"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-[#1A1412] hover:text-[#A85A2A] transition-colors shrink-0"
          >
            <span>View All Packaging Options</span>
            <ArrowRight className="w-4 h-4 text-[#C59B3F]" />
          </Link>
        </div>

        {/* 5 Gift Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {giftBoxes.map((giftBox) => (
            <GiftCard key={giftBox.id} giftBox={giftBox} />
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: SIGNATURE COMBOS */}
      {/* ========================================================= */}
      <section className="bg-[#FAF8F5] py-16 lg:py-24 border-y border-[#E6DEC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Catalogue Selections"
            title="Curated Signature Combos"
            subtitle="Tailored combinations thoughtfully engineered for festive occasions, chocolate indulgence, Indian palates, and everyday wellness."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {combos.map((combo) => (
              <ComboCard key={combo.id} combo={combo} />
            ))}
          </div>

          <div className="mt-10 p-4 bg-white border border-[#E6DEC8] rounded-lg text-center max-w-2xl mx-auto text-xs text-[#63574E]">
            <span className="font-semibold text-[#1A1412]">Dietary Notice:</span> Products marked with{' '}
            <span className="font-bold text-[#2D4A27] bg-[#2D4A27]/10 px-1.5 py-0.5 rounded">
              (J)
            </span>{' '}
            indicate pure Jain preparation. Custom combinations available on request.
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 7: GIFTING OCCASIONS */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Built Around Occasions"
          title="Thoughtful Gifting for Every Moment"
          subtitle="Whether celebrating family festivals or expressing gratitude to valued business clients, HariPrasadam delivers an exquisite experience."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Festive */}
          <div className="bg-white border border-[#E6DEC8] rounded-xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#C59B3F]/40 flex items-center justify-center text-[#C59B3F] mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A85A2A] block mb-1">
                Occasion 01
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#1A1412]">
                Festive Celebrations
              </h3>
              <p className="text-xs text-[#5C5047] font-medium mt-1">
                Diwali, weddings, celebrations & family occasions
              </p>
              <p className="text-xs text-[#63574E] mt-3 leading-relaxed">
                Elevate traditional festivities with regal thandai kesar almonds, honey rose treats, and exquisite dried fruits packaged in golden presentation boxes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2ECE1]">
              <button
                onClick={() =>
                  openEnquiryModal({
                    enquiryType: 'Festive Gifting',
                    sourcePage: '/',
                    initialMessage: 'I would like to enquire about festive dry fruit gift hampers.',
                  })
                }
                className="text-xs font-semibold text-[#1A1412] hover:text-[#C59B3F] transition-colors flex items-center"
              >
                <span>Enquire Festive Hampers</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>

          {/* Corporate */}
          <div className="bg-white border border-[#E6DEC8] rounded-xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#C59B3F]/40 flex items-center justify-center text-[#C59B3F] mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A85A2A] block mb-1">
                Occasion 02
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#1A1412]">
                Corporate Gifting
              </h3>
              <p className="text-xs text-[#5C5047] font-medium mt-1">
                Client gifts, employee gifting & business milestones
              </p>
              <p className="text-xs text-[#63574E] mt-3 leading-relaxed">
                Refined corporate presentation boxes with option for branded sleeves, custom greeting inserts, and customized jar selections tailored to your organization.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2ECE1]">
              <Link
                href="/corporate"
                className="text-xs font-semibold text-[#1A1412] hover:text-[#C59B3F] transition-colors flex items-center"
              >
                <span>Explore Corporate Solutions</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Premium Personal */}
          <div className="bg-white border border-[#E6DEC8] rounded-xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#C59B3F]/40 flex items-center justify-center text-[#C59B3F] mb-6">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A85A2A] block mb-1">
                Occasion 03
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#1A1412]">
                Premium Personal
              </h3>
              <p className="text-xs text-[#5C5047] font-medium mt-1">
                A polished alternative to standard dry-fruit boxes
              </p>
              <p className="text-xs text-[#63574E] mt-3 leading-relaxed">
                When sending standard generic boxes will not suffice. Delight discerning recipients with handcrafted flavours, airtight glass jars, and memorable elegance.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2ECE1]">
              <button
                onClick={() =>
                  openEnquiryModal({
                    enquiryType: 'Customization',
                    sourcePage: '/',
                    initialMessage: 'I am looking for personalized premium dry fruit boxes for personal gifting.',
                  })
                }
                className="text-xs font-semibold text-[#1A1412] hover:text-[#C59B3F] transition-colors flex items-center"
              >
                <span>Request Personal Curation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 8: BULK & CUSTOMIZATION CTA BANNER */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1412] text-[#FAF8F5] rounded-2xl p-8 sm:p-12 lg:p-16 relative overflow-hidden border border-[#C59B3F]/30 shadow-2xl">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 text-[#C59B3F] text-xs font-semibold uppercase tracking-[0.2em]">
              <ShieldCheck className="w-4 h-4" />
              <span>HariPrasadam Pvt. Ltd. • Surat, Gujarat</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-tight">
              Bulk Orders • Corporate Gifting • Customization Available
            </h2>

            <p className="text-sm sm:text-base text-[#C8BDB4] leading-relaxed">
              We work directly with corporate gifting managers, event planners, and families across Gujarat and India to curate tailored dry fruit hampers, custom weight jars, and personalized packaging.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() =>
                  openEnquiryModal({
                    enquiryType: 'Corporate Gifting',
                    sourcePage: '/',
                    initialMessage: 'I would like to discuss a bulk/corporate order requirement with HariPrasadam.',
                  })
                }
                className="px-7 py-3.5 bg-[#C59B3F] hover:bg-[#b88c32] text-[#140F0E] text-sm font-semibold rounded-md shadow transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Discuss Your Requirement</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <WhatsAppButton
                variant="outline"
                label="Quick WhatsApp Enquiry"
                message="Hello HariPrasadam, I am interested in placing a bulk order / corporate enquiry."
                className="py-3.5 px-6 text-sm"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
