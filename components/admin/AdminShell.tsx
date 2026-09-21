'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Gift,
  Boxes,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Gift Collections', href: '/admin/gifting', icon: Gift },
  { name: 'Signature Combos', href: '/admin/combos', icon: Boxes },
  { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

function getSectionName(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard';
  if (pathname.startsWith('/admin/products/new')) return 'Products / New Product';
  if (pathname.startsWith('/admin/products/')) return 'Products / Edit Product';
  if (pathname.startsWith('/admin/products')) return 'Products Catalogue';
  if (pathname.startsWith('/admin/categories')) return 'Categories';
  if (pathname.startsWith('/admin/gifting')) return 'Gift Collections';
  if (pathname.startsWith('/admin/combos')) return 'Signature Combos';
  if (pathname.startsWith('/admin/media')) return 'Media Library';
  if (pathname.startsWith('/admin/settings')) return 'Settings';
  return 'Admin';
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, render clean login shell without admin sidebar or admin topbar
  if (pathname?.startsWith('/admin/login')) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center text-[#1A1412]">
        {children}
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      router.push('/admin/login');
    }
  };

  const sectionName = getSectionName(pathname);

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1A1412] flex flex-col antialiased">
      {/* ========================================================= */}
      {/* MOBILE DRAWER BACKDROP & SIDEBAR */}
      {/* ========================================================= */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close admin menu overlay"
        />
      )}

      {/* ========================================================= */}
      {/* DEDICATED ADMIN SIDEBAR (Fixed on desktop, Drawer on mobile) */}
      {/* ========================================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#140F0E] text-[#FAF8F5] border-r border-[#C59B3F]/20 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Top Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-white p-1 flex items-center justify-center border border-[#C59B3F]/40 shadow-sm shrink-0">
                <Image
                  src="/images/branding/logo.png"
                  alt="HariPrasadam Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <span className="font-serif text-base font-bold tracking-tight text-white block truncate">
                  HariPrasadam
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#C59B3F] font-bold block">
                  Management CMS
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-md cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links (Natural scroll if screen is short) */}
          <nav className="p-3.5 space-y-1 overflow-y-auto flex-1">
            <span className="px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold text-[#8A7E75] block">
              Navigation
            </span>
            {ADMIN_NAV.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    isActive
                      ? 'bg-[#C59B3F] text-[#140F0E] shadow-xs'
                      : 'text-[#C8BDB4] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#140F0E]' : 'text-[#C59B3F]'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View Public Website & Sign Out */}
        <div className="p-3.5 border-t border-white/10 space-y-1.5 bg-[#0E0B0A] shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-[#C8BDB4] hover:text-white hover:bg-white/5 transition-colors group cursor-pointer"
            title="Open HariPrasadam public website in a new tab"
          >
            <span className="font-medium">View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C59B3F] group-hover:translate-x-0.5 transition-transform" />
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN ADMIN AREA (Offset by lg:pl-64 on desktop) */}
      {/* ========================================================= */}
      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        {/* Simple Minimal Admin Top Area */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E6DEC8] px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-1.5 text-[#4A3E37] hover:text-[#1A1412] hover:bg-[#FAF8F5] rounded-md transition-colors cursor-pointer"
              aria-label="Open admin navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Contextual Breadcrumb */}
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-xs font-semibold text-[#8A7E75] hidden sm:inline">
                HariPrasadam CMS
              </span>
              <span className="text-xs text-[#C59B3F] hidden sm:inline">/</span>
              <span className="font-serif text-sm sm:text-base font-bold text-[#1A1412] truncate">
                {sectionName}
              </span>
            </div>
          </div>

          {/* Right Top Area Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Quick Public Site Link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-[#4A3E37] hover:text-[#1A1412] bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#DDD4C3] rounded-md transition-colors cursor-pointer"
              title="Open public website"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3 text-[#C59B3F]" />
            </a>

            {/* Admin Badge */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Admin Active</span>
              <span className="sm:hidden">Admin</span>
            </div>

            {/* Quick Sign Out Icon */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-[#8A7E75] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Body - Natural Scroll, Full Available Width */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
