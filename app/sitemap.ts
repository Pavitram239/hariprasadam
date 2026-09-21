import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/cmsStorage';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  try {
    const products = await getProducts({ status: 'published' });
    const productPages = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...productPages];
  } catch (err) {
    console.error('Error generating sitemap:', err);
    return staticPages;
  }
}
