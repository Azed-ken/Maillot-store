-- =========================================================
-- MAILLOT STORE — SCHEMA INITIAL
-- =========================================================
-- Convention : les visiteurs (rôle "anon") ont uniquement un accès
-- en LECTURE aux données publiques (produits, catégories, réglages).
-- Toute écriture (produits, catégories, statut de commande, réglages)
-- exige le rôle "authenticated" ET une entrée dans "admins".
-- La table "orders"/"order_items" peut être créée par n'importe qui
-- (checkout sans compte) mais jamais lue/modifiée par un visiteur.
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- ADMINS
-- Liste blanche des utilisateurs Supabase Auth autorisés
-- à administrer la boutique.
-- ---------------------------------------------------------
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from admins where user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------
-- STORE SETTINGS (ligne unique, id fixe)
-- ---------------------------------------------------------
create table if not exists store_settings (
  id boolean primary key default true,
  store_name text not null default 'Maillot Store',
  slogan text not null default 'Le maillot de vos couleurs.',
  description text not null default '',
  logo_url text,
  whatsapp_number text not null default '22900000000',
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  footer_text text not null default '',
  updated_at timestamptz not null default now(),
  constraint store_settings_single_row check (id)
);

insert into store_settings (id) values (true)
on conflict (id) do nothing;

-- ---------------------------------------------------------
-- CATEGORIES
-- type = regroupement (club / selection), kind = domicile/exterieur/third
-- ---------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type text not null check (type in ('club', 'selection')),
  country_flag text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_categories_type on categories(type);

-- ---------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(12,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  category_id uuid references categories(id) on delete set null,
  kind text not null check (kind in ('domicile', 'exterieur', 'third')),
  sizes text[] not null default '{}',
  photos text[] not null default '{}',
  is_new boolean not null default false,
  is_popular boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_kind on products(kind);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_name on products using gin (to_tsvector('french', name));

-- ---------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'nouvelle'
    check (status in ('nouvelle', 'confirmee', 'livree', 'annulee')),
  total numeric(12,2) not null check (total >= 0),
  customer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created on orders(created_at desc);

-- ---------------------------------------------------------
-- ORDER ITEMS
-- prix figé au moment de la commande (product_price, product_name)
-- ---------------------------------------------------------
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  product_price numeric(12,2) not null check (product_price >= 0),
  size text,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order on order_items(order_id);

-- ---------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated on products;
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_orders_updated on orders;
create trigger trg_orders_updated before update on orders
  for each row execute function set_updated_at();

drop trigger if exists trg_settings_updated on store_settings;
create trigger trg_settings_updated before update on store_settings
  for each row execute function set_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table admins enable row level security;
alter table store_settings enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- ADMINS : un utilisateur connecté peut seulement vérifier SA PROPRE ligne
-- (utile pour l'UI admin). Aucune écriture via l'API publique (géré en SQL / dashboard).
create policy "admins_self_read" on admins
  for select using (user_id = auth.uid());
create policy "admins_no_public_write" on admins
  for insert with check (false);
create policy "admins_no_public_update" on admins
  for update using (false);
create policy "admins_no_public_delete" on admins
  for delete using (false);

-- STORE SETTINGS : lecture publique, écriture admin uniquement
create policy "settings_public_read" on store_settings
  for select using (true);
create policy "settings_admin_write" on store_settings
  for update using (is_admin()) with check (is_admin());

-- CATEGORIES : lecture publique, écriture admin uniquement
create policy "categories_public_read" on categories
  for select using (true);
create policy "categories_admin_insert" on categories
  for insert with check (is_admin());
create policy "categories_admin_update" on categories
  for update using (is_admin()) with check (is_admin());
create policy "categories_admin_delete" on categories
  for delete using (is_admin());

-- PRODUCTS : lecture publique des produits actifs, écriture admin uniquement
create policy "products_public_read" on products
  for select using (is_active = true or is_admin());
create policy "products_admin_insert" on products
  for insert with check (is_admin());
create policy "products_admin_update" on products
  for update using (is_admin()) with check (is_admin());
create policy "products_admin_delete" on products
  for delete using (is_admin());

-- ORDERS : un visiteur peut CRÉER une commande (checkout sans compte),
-- mais ne peut jamais la lire ni la modifier. Seul l'admin peut lire/modifier.
create policy "orders_public_insert" on orders
  for insert with check (true);
create policy "orders_admin_read" on orders
  for select using (is_admin());
create policy "orders_admin_update" on orders
  for update using (is_admin()) with check (is_admin());

-- ORDER ITEMS : idem, création publique liée à une commande fraîchement créée,
-- lecture/modification réservées à l'admin.
create policy "order_items_public_insert" on order_items
  for insert with check (true);
create policy "order_items_admin_read" on order_items
  for select using (is_admin());
