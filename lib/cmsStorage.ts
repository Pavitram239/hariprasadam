import fs from 'fs';
import path from 'path';
import { supabase } from './supabaseClient';
import { Product, Category, GiftBox, ComboItem, MediaItem, ContentStatus } from './types';
import { PRODUCTS as SEED_PRODUCTS, CATEGORIES_DATA as SEED_CATEGORIES, SIGNATURE_COMBOS as SEED_COMBOS } from './productsData';
import { GIFT_BOXES_2026 as SEED_GIFT_BOXES, CATALOGUE_PACKAGING as SEED_PACKAGING } from './giftingData';

const dataDir = path.join(process.cwd(), 'data');

function getFilePath(filename: string): string {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, filename);
}

function readJsonFile<T>(filename: string, defaultData: T): T {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}, resetting to default:`, err);
    return defaultData;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  const filePath = getFilePath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ============================================================
// INITIAL SEEDING HELPERS
// ============================================================
function getInitialProducts(): Product[] {
  return SEED_PRODUCTS.map((p, idx) => ({
    ...p,
    status: 'published' as ContentStatus,
    isFeatured: idx < 6,
    additionalImages: [],
    display_order: idx + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

function getInitialCategories(): Category[] {
  return SEED_CATEGORIES.map((c, idx) => ({
    id: `cat-${c.slug}`,
    name: c.name,
    slug: c.slug,
    tagline: c.tagline,
    description: c.description,
    image: c.image,
    display_order: idx + 1,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

function getInitialGifting(): GiftBox[] {
  return SEED_GIFT_BOXES.map((g, idx) => ({
    ...g,
    status: 'published' as ContentStatus,
    display_order: idx + 1,
    additionalImages: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

function getInitialCombos(): ComboItem[] {
  return SEED_COMBOS.map((c, idx) => ({
    ...c,
    status: 'published' as ContentStatus,
    display_order: idx + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

// ============================================================
// PRODUCTS API
// ============================================================
export async function getProducts(options?: {
  status?: ContentStatus;
  category?: string;
  search?: string;
  includeArchived?: boolean;
}): Promise<Product[]> {
  // If Supabase is available, attempt query
  if (supabase) {
    try {
      let query = supabase.from('products').select('*').order('display_order', { ascending: true });
      if (options?.status) {
        query = query.eq('status', options.status);
      } else if (!options?.includeArchived) {
        query = query.neq('status', 'archived');
      }
      if (options?.category && options.category !== 'All') {
        query = query.eq('category_name', options.category);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch (err) {
      console.warn('Supabase getProducts failed, falling back to local store:', err);
    }
  }

  // Local fallback
  let list = readJsonFile<Product[]>('products.json', getInitialProducts());
  if (options?.status) {
    list = list.filter((p) => (p.status || 'published') === options.status);
  } else if (!options?.includeArchived) {
    list = list.filter((p) => p.status !== 'archived');
  }

  if (options?.category && options.category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === options.category!.toLowerCase());
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.flavour.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getProductBySlug(slug: string, allowDraft = false): Promise<Product | null> {
  const products = await getProducts({ includeArchived: allowDraft });
  const found = products.find((p) => p.slug === slug);
  if (!found) return null;
  if (!allowDraft && found.status !== 'published') return null;
  return found;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts({ includeArchived: true });
  return products.find((p) => p.id === id) || null;
}

export async function createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  const newProduct: Product = {
    ...productData,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'prod-' + Date.now(),
    status: productData.status || 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
      if (!error && data) {
        // Also update local copy
        const current = readJsonFile<Product[]>('products.json', getInitialProducts());
        writeJsonFile('products.json', [data, ...current]);
        return data as Product;
      }
    } catch (err) {
      console.warn('Supabase createProduct failed, saving locally:', err);
    }
  }

  const current = readJsonFile<Product[]>('products.json', getInitialProducts());
  const updated = [newProduct, ...current];
  writeJsonFile('products.json', updated);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const current = readJsonFile<Product[]>('products.json', getInitialProducts());
  const idx = current.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const updatedProduct: Product = {
    ...current[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('products').update(updatedProduct).eq('id', id);
    } catch (err) {
      console.warn('Supabase updateProduct failed:', err);
    }
  }

  current[idx] = updatedProduct;
  writeJsonFile('products.json', current);
  return updatedProduct;
}

export async function archiveProduct(id: string): Promise<boolean> {
  const res = await updateProduct(id, { status: 'archived' });
  return res !== null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  // Rather than permanent hard deletion, set archived to preserve integrity
  return archiveProduct(id);
}

// ============================================================
// CATEGORIES API
// ============================================================
export async function getCategories(): Promise<Category[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as Category[];
    } catch (err) {
      console.warn('Supabase getCategories failed, reading local store:', err);
    }
  }
  return readJsonFile<Category[]>('categories.json', getInitialCategories());
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  const categories = readJsonFile<Category[]>('categories.json', getInitialCategories());
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  const updated: Category = {
    ...categories[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('categories').update(updated).eq('id', id);
    } catch (err) {
      console.warn('Supabase updateCategory failed:', err);
    }
  }

  categories[idx] = updated;
  writeJsonFile('categories.json', categories);
  return updated;
}

// ============================================================
// GIFTING API
// ============================================================
export async function getGiftCollections(options?: { status?: ContentStatus }): Promise<GiftBox[]> {
  if (supabase) {
    try {
      let query = supabase.from('gift_collections').select('*').order('display_order', { ascending: true });
      if (options?.status) query = query.eq('status', options.status);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as GiftBox[];
    } catch (err) {
      console.warn('Supabase getGiftCollections failed, reading local store:', err);
    }
  }

  let list = readJsonFile<GiftBox[]>('gifting.json', getInitialGifting());
  if (options?.status) {
    list = list.filter((g) => (g.status || 'published') === options.status);
  }
  return list;
}

export async function updateGiftCollection(id: string, updates: Partial<GiftBox>): Promise<GiftBox | null> {
  const collections = readJsonFile<GiftBox[]>('gifting.json', getInitialGifting());
  const idx = collections.findIndex((g) => g.id === id);
  if (idx === -1) return null;

  const updated: GiftBox = {
    ...collections[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('gift_collections').update(updated).eq('id', id);
    } catch (err) {
      console.warn('Supabase updateGiftCollection failed:', err);
    }
  }

  collections[idx] = updated;
  writeJsonFile('gifting.json', collections);
  return updated;
}

// ============================================================
// COMBOS API
// ============================================================
export async function getCombos(options?: { status?: ContentStatus }): Promise<ComboItem[]> {
  if (supabase) {
    try {
      let query = supabase.from('combos').select('*').order('display_order', { ascending: true });
      if (options?.status) query = query.eq('status', options.status);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as ComboItem[];
    } catch (err) {
      console.warn('Supabase getCombos failed, reading local store:', err);
    }
  }

  let list = readJsonFile<ComboItem[]>('combos.json', getInitialCombos());
  if (options?.status) {
    list = list.filter((c) => (c.status || 'published') === options.status);
  }
  return list;
}

export async function updateCombo(id: string, updates: Partial<ComboItem>): Promise<ComboItem | null> {
  const combos = readJsonFile<ComboItem[]>('combos.json', getInitialCombos());
  const idx = combos.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  const updated: ComboItem = {
    ...combos[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('combos').update(updated).eq('id', id);
    } catch (err) {
      console.warn('Supabase updateCombo failed:', err);
    }
  }

  combos[idx] = updated;
  writeJsonFile('combos.json', combos);
  return updated;
}

// ============================================================
// MEDIA API
// ============================================================
export async function getMediaItems(): Promise<MediaItem[]> {
  return readJsonFile<MediaItem[]>('media.json', []);
}

export async function addMediaItem(item: Omit<MediaItem, 'id' | 'created_at'>): Promise<MediaItem> {
  const newItem: MediaItem = {
    ...item,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'media-' + Date.now(),
    created_at: new Date().toISOString(),
  };
  const list = readJsonFile<MediaItem[]>('media.json', []);
  const updated = [newItem, ...list];
  writeJsonFile('media.json', updated);
  return newItem;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  const list = readJsonFile<MediaItem[]>('media.json', []);
  const updated = list.filter((m) => m.id !== id);
  writeJsonFile('media.json', updated);
  return true;
}

// ============================================================
// RE-SEED FUNCTION
// ============================================================
export async function reseedCatalogueData(): Promise<{ success: boolean; message: string }> {
  writeJsonFile('products.json', getInitialProducts());
  writeJsonFile('categories.json', getInitialCategories());
  writeJsonFile('gifting.json', getInitialGifting());
  writeJsonFile('combos.json', getInitialCombos());
  return { success: true, message: 'All catalogue data re-seeded successfully from authentic source files.' };
}
