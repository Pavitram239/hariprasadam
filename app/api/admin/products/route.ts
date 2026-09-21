import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { getProducts, createProduct } from '@/lib/cmsStorage';
import { ContentStatus } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const isAuthed = await verifyAdminRequest(req);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as ContentStatus | null;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const includeArchived = searchParams.get('includeArchived') === 'true';

    const products = await getProducts({
      status: status || undefined,
      category,
      search,
      includeArchived,
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await verifyAdminRequest(req);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.name || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Product name and category are required' },
        { status: 400 }
      );
    }

    // Auto-generate slug if not specified
    const slug = (body.slug || body.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const newProduct = await createProduct({
      name: body.name.trim(),
      slug,
      category: body.category,
      flavour: body.flavour || 'Plain',
      image: body.image || '/images/products/almond-plain.jpg',
      additionalImages: body.additionalImages || [],
      tagline: body.tagline || '',
      description: body.description || '',
      isJain: !!body.isJain,
      isFeatured: !!body.isFeatured,
      tasteProfile: Array.isArray(body.tasteProfile) ? body.tasteProfile : [],
      features: Array.isArray(body.features) ? body.features : [],
      pairingSuggestions: Array.isArray(body.pairingSuggestions) ? body.pairingSuggestions : [],
      idealFor: Array.isArray(body.idealFor) ? body.idealFor : [],
      packagingOptions: Array.isArray(body.packagingOptions) ? body.packagingOptions : ['Glass Jars (175g–200g)', 'Gift Box Compartments'],
      status: body.status || 'draft',
      display_order: body.display_order || 99,
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
