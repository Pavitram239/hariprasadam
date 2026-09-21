import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1412]">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
