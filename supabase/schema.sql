-- ============================================================
-- HariPrasadam Pvt. Ltd. - Enquiries Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create Enquiries Table
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

-- 2. Create Index for fast sorting and searching
create index if not exists idx_enquiries_created_at on public.enquiries (created_at desc);
create index if not exists idx_enquiries_status on public.enquiries (status);
create index if not exists idx_enquiries_type on public.enquiries (enquiry_type);

-- 3. Row Level Security (RLS) Policies
alter table public.enquiries enable row level security;

-- Allow anonymous and public users to submit enquiries
create policy "Allow public enquiry submission"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (true);

-- Allow service role to read and update all enquiries
create policy "Allow service role full access"
  on public.enquiries
  for all
  to service_role
  using (true)
  with check (true);

-- Optional: If authenticated admins exist in Supabase auth
create policy "Allow authenticated users to read and update"
  on public.enquiries
  for select
  to authenticated
  using (true);

create policy "Allow authenticated users to update status"
  on public.enquiries
  for update
  to authenticated
  using (true);
