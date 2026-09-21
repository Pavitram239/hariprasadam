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
  Inbox,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Gift Collections', href: '/admin/gifting', icon: Gift },
  { name: 'Signature Combos', href: '/admin/combos', icon: Boxes },
  { name: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
  { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, don't show admin sidebar
  if (pathname === '/admin/login') {
    return null;
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

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#1A1412] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 border-b border-[#C59B3F]/30">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-white p-0.5 flex items-center justify-center">
            <Image src="/images/branding/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <span className="font-serif font-bold text-sm leading-tight block">HariPrasadam</span>
            <span className="text-[10px] text-[#C59B3F] uppercase tracking-wider block">Admin CMS</span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-white/80 hover:text-white rounded-md"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#140F0E] text-[#FAF8F5] border-r border-[#C59B3F]/20 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/10 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center border border-[#C59B3F]/40 shadow-sm shrink-0">
              <Image src="/images/branding/logo.png" alt="HariPrasadam Logo" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-white block">
                HariPrasadam
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C59B3F] font-semibold block">
                Management CMS
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#C59B3F] text-[#140F0E] shadow-sm'
                      : 'text-[#C8BDB4] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#140F0E]' : 'text-[#C59B3F]'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#0E0B0A]">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-md text-xs text-[#C8BDB4] hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C59B3F]" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
