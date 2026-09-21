import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductBySlug, getProducts } from '@/lib/cmsStorage';
import ProductDetailClient from '@/components/ProductDetailClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';
  const product = await getProductBySlug(slug, isPreview);

  if (!product) {
    return {
      title: 'Product Not Found | HariPrasadam',
    };
  }

  return {
    title: `${product.name} - ${product.flavour} | HariPrasadam Surat`,
    description: product.description,
    openGraph: {
      title: `${product.name} (${product.flavour}) | HariPrasadam`,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

  const product = await getProductBySlug(slug, isPreview);

  if (!product) {
    notFound();
  }

  const allPublished = await getProducts({ status: 'published' });
  const relatedProducts = allPublished
    .filter((p) => p.category.toLowerCase() === product.category.toLowerCase() && p.id !== product.id)
    .slice(0, 3);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
