import React from 'react';
import { getGiftCollections } from '@/lib/cmsStorage';
import CorporatePageClient from '@/components/CorporatePageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Corporate Gifting Solutions | HariPrasadam Surat',
  description:
    'Distinguished executive dry-fruit gifting suites with custom branding, corporate logo ribbons, and prompt dispatch from Surat, Gujarat.',
};

export default async function CorporateGiftingPage() {
  const giftBoxes = await getGiftCollections({ status: 'published' });

  return <CorporatePageClient giftBoxes={giftBoxes} />;
}
