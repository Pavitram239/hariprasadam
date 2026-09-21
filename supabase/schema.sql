-- ============================================================
-- HariPrasadam Pvt. Ltd. - Complete Database Schema & RLS
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Categories Table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  tagline text,
  description text,
  image text,
  display_order integer default 0,
  status text not null default 'published' check (status in ('published', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Products Table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id uuid references public.categories(id) on delete set null,
  category_name text not null,
  flavour text not null,
  image text not null,
  additional_images jsonb default '[]'::jsonb,
  tagline text,
  description text not null,
  is_jain boolean default false,
  is_featured boolean default false,
  taste_profile text[] default '{}',
  features text[] default '{}',
  pairing_suggestions text[] default '{}',
  ideal_for text[] default '{}',
  packaging_options text[] default '{}',
  status text not null default 'published' check (status in ('published', 'draft', 'archived')),
  display_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Gift Collections Table
create table if not exists public.gift_collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  code text,
  title text not null,
  subtitle text,
  jars_count integer default 5,
  jar_weight text default '175–200 g each',
  price numeric not null,
  image text not null,
  additional_images jsonb default '[]'::jsonb,
  presentation text[] default '{}',
  curated_items text[] default '{}',
  gifting_note text[] default '{}',
  ideal_for text[] default '{}',
  badge text,
  status text not null default 'published' check (status in ('published', 'draft', 'archived')),
  display_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Signature Combos Table
create table if not exists public.combos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text,
  tagline text,
  description text,
  occasion text,
  products jsonb not null default '[]'::jsonb,
  image text,
  status text not null default 'published' check (status in ('published', 'draft', 'archived')),
  display_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Media Assets Table
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  url text not null,
  size integer,
  mime_type text,
  created_at timestamptz not null default now()
);

-- 6. Enquiries Table
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  company text,
  enquiry_type text not null check (
    enquiry_type in (
      'Corporate Gifting',
      'Bulk Order',
      'Festive Gifting',
      'Customization',
      'Retail',
      'Product Enquiry',
      'Other'
    )
  ),
  quantity text,
  message text not null,
  source_page text not null default '/',
  product_name text,
  status text not null default 'New' check (
    status in ('New', 'Contacted', 'Quoted', 'Closed')
  )
);

-- ============================================================
-- INDICES FOR PERFORMANCE
-- ============================================================
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_category on public.products(category_name);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_gift_collections_status on public.gift_collections(status);
create index if not exists idx_combos_status on public.combos(status);
create index if not exists idx_enquiries_status on public.enquiries(status);
create index if not exists idx_enquiries_created_at on public.enquiries(created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.gift_collections enable row level security;
alter table public.combos enable row level security;
alter table public.media enable row level security;
alter table public.enquiries enable row level security;

-- Public can read ONLY published content
create policy "Public can read published categories"
  on public.categories for select to anon, authenticated
  using (status = 'published');

create policy "Public can read published products"
  on public.products for select to anon, authenticated
  using (status = 'published');

create policy "Public can read published gift collections"
  on public.gift_collections for select to anon, authenticated
  using (status = 'published');

create policy "Public can read published combos"
  on public.combos for select to anon, authenticated
  using (status = 'published');

create policy "Public can read media"
  on public.media for select to anon, authenticated
  using (true);

-- Public can submit enquiries
create policy "Public can submit enquiries"
  on public.enquiries for insert to anon, authenticated
  with check (true);

-- Authenticated Admin Full CRUD Access
create policy "Admins have full access to categories"
  on public.categories for all to authenticated
  using (true) with check (true);

create policy "Admins have full access to products"
  on public.products for all to authenticated
  using (true) with check (true);

create policy "Admins have full access to gift collections"
  on public.gift_collections for all to authenticated
  using (true) with check (true);

create policy "Admins have full access to combos"
  on public.combos for all to authenticated
  using (true) with check (true);

create policy "Admins have full access to media"
  on public.media for all to authenticated
  using (true) with check (true);

create policy "Admins have full access to enquiries"
  on public.enquiries for all to authenticated
  using (true) with check (true);

-- Service role bypasses RLS
create policy "Service role full access categories" on public.categories for all to service_role using (true) with check (true);
create policy "Service role full access products" on public.products for all to service_role using (true) with check (true);
create policy "Service role full access gift_collections" on public.gift_collections for all to service_role using (true) with check (true);
create policy "Service role full access combos" on public.combos for all to service_role using (true) with check (true);
create policy "Service role full access media" on public.media for all to service_role using (true) with check (true);
create policy "Service role full access enquiries" on public.enquiries for all to service_role using (true) with check (true);

-- Storage bucket creation for media
insert into storage.buckets (id, name, public)
values ('hariprasadam-media', 'hariprasadam-media', true)
on conflict (id) do nothing;

create policy "Public Access to media bucket"
  on storage.objects for select to public
  using (bucket_id = 'hariprasadam-media');

create policy "Admin upload to media bucket"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'hariprasadam-media');

create policy "Admin delete from media bucket"
  on storage.objects for delete to authenticated
  using (bucket_id = 'hariprasadam-media');
