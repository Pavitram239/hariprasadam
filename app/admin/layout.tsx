import React from 'react';
import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin CMS | HariPrasadam Pvt. Ltd.',
  description: 'HariPrasadam Management CMS & Catalogue Portal',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
