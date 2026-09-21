import { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/productsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.hariprasadam.com';

  const staticPages = [
    '',
    '/products',
    '/gifting',
    '/corporate',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const productPages = PRODUCTS.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
