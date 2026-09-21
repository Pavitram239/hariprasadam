'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import { useEnquiry } from './EnquiryContext';
import WhatsAppButton from './WhatsAppButton';

export default function Footer() {
  const { openEnquiryModal } = useEnquiry();

  return (
    <footer className="bg-[#140F0E] text-[#FAF8F5] border-t border-[#C59B3F]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full p-1 border border-[#C59B3F]/50 flex items-center justify-center">
                <Image
                  src="/images/branding/logo.png"
                  alt="HariPrasadam Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#FAF8F5]">
                  HariPrasadam
                </span>
                <span className="block text-[11px] uppercase tracking-[0.25em] text-[#C59B3F] font-semibold">
                  Pvt. Ltd. • Surat
                </span>
              </div>
            </div>

            <p className="text-[#C8BDB4] text-sm leading-relaxed max-w-sm">
              Pure Fruit. Pure Health. Premium Dry Fruits • Artisanal Nuts • Signature Flavoured Treats • Thoughtfully Curated Gifting Collections.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openEnquiryModal({ enquiryType: 'Corporate Gifting' })}
                className="inline-flex items-center px-4 py-2 bg-[#C59B3F] hover:bg-[#b58c35] text-[#140F0E] font-semibold text-xs tracking-wider uppercase rounded transition-colors"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>

              <WhatsAppButton variant="outline" label="WhatsApp" className="text-xs py-2 px-3.5" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold tracking-wider text-[#FAF8F5] uppercase border-b border-[#C59B3F]/30 pb-2 inline-block">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#C8BDB4]">
              <li>
                <Link href="/" className="hover:text-[#C59B3F] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#C59B3F] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/gifting" className="hover:text-[#C59B3F] transition-colors">
                  2026 Gift Collections
                </Link>
              </li>
              <li>
                <Link href="/corporate" className="hover:text-[#C59B3F] transition-colors">
                  Corporate Gifting
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C59B3F] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C59B3F] transition-colors">
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold tracking-wider text-[#FAF8F5] uppercase border-b border-[#C59B3F]/30 pb-2 inline-block">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-[#C8BDB4]">
              <li>
                <Link href="/products?category=Almond" className="hover:text-[#C59B3F] transition-colors">
                  Almond Selection
                </Link>
              </li>
              <li>
                <Link href="/products?category=Cashew" className="hover:text-[#C59B3F] transition-colors">
                  Creamy Cashews
                </Link>
              </li>
              <li>
                <Link href="/products?category=Dates" className="hover:text-[#C59B3F] transition-colors">
                  Kunafa & Choco Dates
                </Link>
              </li>
              <li>
                <Link href="/products?category=Raisin" className="hover:text-[#C59B3F] transition-colors">
                  Sundried & Sahi Paan
                </Link>
              </li>
              <li>
                <Link href="/products?category=Hazelnut" className="hover:text-[#C59B3F] transition-colors">
                  Malai Rose Hazelnuts
                </Link>
              </li>
              <li>
                <Link href="/products?category=Mixes%20%26%20Blends" className="hover:text-[#C59B3F] transition-colors">
                  Wholesome Mixes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold tracking-wider text-[#FAF8F5] uppercase border-b border-[#C59B3F]/30 pb-2 inline-block">
              Contact & Address
            </h4>
            <div className="space-y-3 text-sm text-[#C8BDB4]">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#C59B3F] mt-1 shrink-0" />
                <span className="leading-snug">
                  286 Nagariyo Mohallo, Adajan – Hazira Road, Surat, Gujarat
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#C59B3F] shrink-0" />
                <a href="tel:+919909799369" className="hover:text-[#FAF8F5] transition-colors">
                  +91 9909 799369
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#C59B3F] shrink-0" />
                <a href="mailto:info@hariprasadam.com" className="hover:text-[#FAF8F5] transition-colors">
                  info@hariprasadam.com
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Globe className="w-4 h-4 text-[#C59B3F] shrink-0" />
                <a href="https://www.hariprasadam.com" className="hover:text-[#FAF8F5] transition-colors">
                  www.hariprasadam.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E8278] space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} HariPrasadam Pvt. Ltd. All rights reserved. Bulk Orders • Corporate Gifting • Customization Available.
          </div>
          <div className="flex items-center space-x-4">
            <span>Surat, Gujarat</span>
            <span>•</span>
            <Link href="/admin/enquiries" className="hover:text-[#C59B3F] transition-colors flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
