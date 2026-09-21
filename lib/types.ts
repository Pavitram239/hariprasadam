export type ProductCategory = 
  | 'Almond'
  | 'Cashew'
  | 'Dates'
  | 'Raisin'
  | 'Hazelnut'
  | 'Mixes & Blends'
  | string;

export type ContentStatus = 'published' | 'draft' | 'archived';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  flavour: string;
  image: string;
  additionalImages?: string[];
  tagline: string;
  description: string;
  isJain?: boolean;
  isFeatured?: boolean;
  tasteProfile: string[];
  features: string[];
  pairingSuggestions?: string[];
  idealFor: string[];
  packagingOptions: string[];
  status?: ContentStatus;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  display_order: number;
  status: 'published' | 'draft';
  created_at?: string;
  updated_at?: string;
}

export interface ComboItem {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  products: {
    name: string;
    isJain?: boolean;
  }[];
  occasion: string;
  image?: string;
  status?: ContentStatus;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GiftBox {
  id: string;
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  jarsCount: number;
  jarWeight: string;
  price: number; // in INR
  image: string;
  additionalImages?: string[];
  presentation: string[];
  curatedItems: string[];
  giftingNote: string[];
  idealFor: string[];
  badge?: string;
  status?: ContentStatus;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PackagingOption {
  id: string;
  title: string;
  type: 'gift-box' | 'branded-jute' | 'plain-jute' | 'pocket-mix';
  price: number;
  image: string;
  weight: string;
  items: string[];
  tag?: string;
  status?: ContentStatus;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  created_at: string;
}

export type EnquiryType =
  | 'Corporate Gifting'
  | 'Bulk Order'
  | 'Festive Gifting'
  | 'Customization'
  | 'Retail'
  | 'Product Enquiry'
  | 'Other';

export type EnquiryStatus = 'New' | 'Contacted' | 'Quoted' | 'Closed';

export interface Enquiry {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  enquiry_type: EnquiryType;
  quantity?: string;
  message: string;
  source_page: string;
  product_name?: string;
  status: EnquiryStatus;
}
