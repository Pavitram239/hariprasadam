import React from 'react';
import { getProducts, getCategories } from '@/lib/cmsStorage';
import ProductsCatalogClient from '@/components/ProductsCatalogClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Artisanal Products Catalogue | HariPrasadam Surat',
  description:
    'Explore 27 handcrafted dry fruit flavours across Almonds, Cashews, Dates, Raisins, Hazelnuts and Signature Mixes.',
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts({ status: 'published' }),
    getCategories(),
  ]);

  return <ProductsCatalogClient initialProducts={products} categories={categories} />;
}
