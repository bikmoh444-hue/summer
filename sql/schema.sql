create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists public.landing_settings (
  id uuid primary key default gen_random_uuid(),
  logo_text_ar text not null default '',
  logo_text_fr text not null default 'Cosmitiq Summer',
  logo_image_url text,
  hero_title_ar text not null default '',
  hero_title_fr text not null default '',
  hero_subtitle_ar text not null default '',
  hero_subtitle_fr text not null default '',
  background_image_url text not null default '/beach-summer.png',
  primary_color text not null default '#0e9fb8',
  secondary_color text not null default '#ff6f61',
  promo_text_ar text not null default '',
  promo_text_fr text not null default '',
  footer_text_ar text not null default '',
  footer_text_fr text not null default '',
  whatsapp_number text not null default '',
  content_ar jsonb not null default '{}'::jsonb,
  content_fr jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_fr text not null,
  description_ar text not null default '',
  description_fr text not null default '',
  details_ar text not null default '',
  details_fr text not null default '',
  image_url text not null default '',
  gallery_urls text[] not null default '{}',
  price numeric(12,2) not null check (price >= 0),
  promo_price numeric(12,2) null check (promo_price is null or promo_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.packs (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_fr text not null,
  description_ar text not null default '',
  description_fr text not null default '',
  details_ar text not null default '',
  details_fr text not null default '',
  image_url text not null default '',
  gallery_urls text[] not null default '{}',
  promo_price numeric(12,2) null check (promo_price is null or promo_price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.pack_products (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  unique (pack_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('CM-' || upper(substr(gen_random_uuid()::text, 1, 8))),
  full_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  delivery_fee numeric(12,2) not null default 45 check (delivery_fee >= 0),
  total numeric(12,2) not null check (total >= 0),
  status text not null default 'pending' check (status in ('pending','in_progress','delivered','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  item_type text not null check (item_type in ('product', 'pack')),
  product_id uuid null references public.products(id) on delete set null,
  pack_id uuid null references public.packs(id) on delete set null,
  name_snapshot text not null,
  image_snapshot text null,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  total_price numeric(12,2) not null check (total_price >= 0),
  check (
    (item_type = 'product' and product_id is not null and pack_id is null)
    or
    (item_type = 'pack' and pack_id is not null and product_id is null)
  )
);

alter table public.landing_settings add column if not exists logo_text_ar text not null default '';
alter table public.landing_settings add column if not exists logo_text_fr text not null default 'Cosmitiq Summer';
alter table public.landing_settings add column if not exists logo_image_url text;
alter table public.landing_settings add column if not exists promo_text_ar text not null default '';
alter table public.landing_settings add column if not exists promo_text_fr text not null default '';
alter table public.landing_settings add column if not exists footer_text_ar text not null default '';
alter table public.landing_settings add column if not exists footer_text_fr text not null default '';
alter table public.products add column if not exists gallery_urls text[] not null default '{}';
alter table public.packs add column if not exists gallery_urls text[] not null default '{}';
alter table public.orders add column if not exists order_number text unique default ('CM-' || upper(substr(gen_random_uuid()::text, 1, 8)));
alter table public.orders add column if not exists full_name text;
alter table public.orders add column if not exists phone text;
alter table public.orders add column if not exists address text;
alter table public.orders add column if not exists city text;
alter table public.orders add column if not exists subtotal numeric(12,2);
alter table public.orders add column if not exists total numeric(12,2);

do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'customer_name') then
    alter table public.orders alter column customer_name drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'customer_phone') then
    alter table public.orders alter column customer_phone drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'customer_address') then
    alter table public.orders alter column customer_address drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'items') then
    alter table public.orders alter column items drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'total_amount') then
    alter table public.orders alter column total_amount drop not null;
  end if;
end $$;

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (status in ('pending','in_progress','delivered','cancelled'));

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists landing_settings_set_updated_at on public.landing_settings;
create trigger landing_settings_set_updated_at before update on public.landing_settings for each row execute function public.set_updated_at();

create index if not exists products_active_idx on public.products(active, created_at desc);
create index if not exists packs_active_idx on public.packs(active, created_at desc);
create index if not exists pack_products_pack_idx on public.pack_products(pack_id);
create index if not exists orders_created_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists order_items_order_idx on public.order_items(order_id);

alter table public.products enable row level security;
alter table public.packs enable row level security;
alter table public.pack_products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.landing_settings enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Admins read themselves" on public.admin_users;
create policy "Admins read themselves" on public.admin_users for select to authenticated using (id = auth.uid());

drop policy if exists "Public read active products" on public.products;
create policy "Public read active products" on public.products for select using (active = true or auth.role() = 'authenticated');
drop policy if exists "Public read active packs" on public.packs;
create policy "Public read active packs" on public.packs for select using (active = true or auth.role() = 'authenticated');
drop policy if exists "Public read pack products" on public.pack_products;
create policy "Public read pack products" on public.pack_products for select using (true);
drop policy if exists "Public read landing settings" on public.landing_settings;
create policy "Public read landing settings" on public.landing_settings for select using (true);
drop policy if exists "Public create orders" on public.orders;
create policy "Public create orders" on public.orders for insert with check (true);
drop policy if exists "Public create order items" on public.order_items;
create policy "Public create order items" on public.order_items for insert with check (true);
drop policy if exists "Public read own receipt order" on public.orders;
create policy "Public read own receipt order" on public.orders for select using (true);
drop policy if exists "Public read own receipt items" on public.order_items;
create policy "Public read own receipt items" on public.order_items for select using (true);

drop policy if exists "Admin manage products" on public.products;
create policy "Admin manage products" on public.products for all to authenticated using (true) with check (true);
drop policy if exists "Admin manage packs" on public.packs;
create policy "Admin manage packs" on public.packs for all to authenticated using (true) with check (true);
drop policy if exists "Admin manage pack products" on public.pack_products;
create policy "Admin manage pack products" on public.pack_products for all to authenticated using (true) with check (true);
drop policy if exists "Admin manage landing settings" on public.landing_settings;
create policy "Admin manage landing settings" on public.landing_settings for all to authenticated using (true) with check (true);
drop policy if exists "Admin manage orders" on public.orders;
create policy "Admin manage orders" on public.orders for all to authenticated using (true) with check (true);
drop policy if exists "Admin manage order items" on public.order_items;
create policy "Admin manage order items" on public.order_items for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true), ('products', 'products', true), ('packs', 'packs', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read site assets" on storage.objects;
create policy "Public read site assets" on storage.objects for select using (bucket_id in ('site-assets', 'products', 'packs'));
drop policy if exists "Admin upload site images" on storage.objects;
create policy "Admin upload site images" on storage.objects for insert to authenticated with check (bucket_id in ('site-assets', 'products', 'packs'));
drop policy if exists "Admin update site images" on storage.objects;
create policy "Admin update site images" on storage.objects for update to authenticated using (bucket_id in ('site-assets', 'products', 'packs')) with check (bucket_id in ('site-assets', 'products', 'packs'));
drop policy if exists "Admin delete site images" on storage.objects;
create policy "Admin delete site images" on storage.objects for delete to authenticated using (bucket_id in ('site-assets', 'products', 'packs'));
