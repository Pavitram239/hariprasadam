import React from 'react';
import { getProducts, getCategories, getGiftCollections, getCombos } from '@/lib/cmsStorage';
import HomePageClient from '@/components/HomePageClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, categories, giftBoxes, combos] = await Promise.all([
    getProducts({ status: 'published' }),
    getCategories(),
    getGiftCollections({ status: 'published' }),
    getCombos({ status: 'published' }),
  ]);

  return (
    <HomePageClient
      products={products}
      categories={categories}
      giftBoxes={giftBoxes}
      combos={combos}
    />
  );
}
