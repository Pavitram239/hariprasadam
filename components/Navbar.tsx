'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { getGeneralWhatsAppUrl } from '@/lib/whatsapp';
import WhatsAppButton from '@/components/WhatsAppButton';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Gifting', href: '/gifting' },
  { name: 'Corporate', href: '/corporate' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="bg-[#140F0E] text-[#F3ECE2] text-xs py-1.5 px-4 text-center tracking-wider border-b border-[#C59B3F]/20 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline-block text-[#C59B3F]">
            Pure Fruit. Pure Health. • Surat, Gujarat
          </span>
          <div className="mx-auto sm:mx-0 flex items-center space-x-4">
            <span className="opacity-80">Bulk Orders & Corporate Gifting Available</span>
            <span className="text-[#C59B3F]">•</span>
            <a
              href="tel:+919909799369"
              className="inline-flex items-center hover:text-[#C59B3F] transition-colors"
            >
              <Phone className="w-3 h-3 mr-1 text-[#C59B3F]" />
              <span>+91 9909 799369</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#E6DEC8]'
            : 'bg-[#FAF8F5] border-b border-[#E6DEC8]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 bg-white rounded-full p-1 border border-[#C59B3F]/40 shadow-sm flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/branding/logo.png"
                  alt="HariPrasadam Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#1A1412] leading-none group-hover:text-[#A85A2A] transition-colors">
                  HariPrasadam
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#C59B3F] font-semibold mt-1">
                  Pvt. Ltd. • Surat
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-all relative py-1 ${
                      isActive
                        ? 'text-[#1A1412] font-semibold'
                        : 'text-[#5C5047] hover:text-[#1A1412]'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C59B3F] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center space-x-3">
              <WhatsAppButton
                label="WhatsApp Us"
                variant="primary"
                type="general"
                className="px-5 py-2.5 text-sm font-semibold"
              />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 lg:hidden">
              <WhatsAppButton
                label="WhatsApp"
                variant="primary"
                type="general"
                size="sm"
                className="font-semibold text-xs"
              />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1A1412] hover:text-[#A85A2A] rounded-md transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E6DEC8] px-4 pt-3 pb-6 space-y-4 shadow-xl">
            <div className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EFE8DC] text-[#1A1412] font-semibold'
                        : 'text-[#5C5047] hover:bg-[#F2ECE1] hover:text-[#1A1412]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#E6DEC8] flex flex-col space-y-2.5">
              <WhatsAppButton
                label="WhatsApp Us (+91 9909 799369)"
                variant="primary"
                type="general"
                className="w-full py-3 text-sm font-semibold shadow"
              />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
