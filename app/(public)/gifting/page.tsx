import React from 'react';
import { getGiftCollections } from '@/lib/cmsStorage';
import GiftingPageClient from '@/components/GiftingPageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '2026 Gifting Collection | HariPrasadam Surat',
  description:
    'Curated premium dry fruit gift boxes with airtight glass jars, gold-embossed presentation boxes, and corporate customisation.',
};

export default async function GiftingPage() {
  const giftBoxes = await getGiftCollections({ status: 'published' });

  return <GiftingPageClient giftBoxes={giftBoxes} />;
}
