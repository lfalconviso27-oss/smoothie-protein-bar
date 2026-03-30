-- ============================================================
-- Migration: Restructure menu to modular builder system
-- Replaces static smoothie model with build-your-own system:
--   hydration, smoothie types, flavors, boosters, enhancers,
--   snacks, bowls, daily specials, saved builds
-- ============================================================

-- Step 1: Drop old menu tables (order matters due to FKs)
drop trigger if exists smoothies_updated_at on public.smoothies;
drop table if exists public.favorites cascade;
drop table if exists public.smoothie_ingredients cascade;
drop table if exists public.customization_options cascade;
drop table if exists public.ingredients cascade;
drop table if exists public.smoothies cascade;
drop table if exists public.categories cascade;

-- Step 2: Modify order_items for product-type agnostic model
alter table public.order_items drop column if exists smoothie_id;
alter table public.order_items add column product_type text not null default 'smoothie';
alter table public.order_items add column build_details jsonb;

-- ============================================================
-- SMOOTHIE TYPES (Basic, Fit, Power, Vegan)
-- ============================================================
create table public.smoothie_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  protein integer not null,
  calories integer not null,
  base_price integer not null, -- cents
  available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.smoothie_types enable row level security;
create policy "Public read smoothie_types" on public.smoothie_types for select using (true);

-- ============================================================
-- FLAVOR CATEGORIES (vanilla, fruity, coffee, chocolate)
-- ============================================================
create table public.flavor_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  color text, -- hex color for UI theming
  icon text,  -- emoji
  sort_order integer not null default 0
);

alter table public.flavor_categories enable row level security;
create policy "Public read flavor_categories" on public.flavor_categories for select using (true);

-- ============================================================
-- FLAVORS
-- ============================================================
create table public.flavors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid not null references public.flavor_categories(id) on delete cascade,
  available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.flavors enable row level security;
create policy "Public read flavors" on public.flavors for select using (true);

-- ============================================================
-- BOOSTERS
-- ============================================================
create table public.boosters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  grams integer, -- optional (e.g. Fiber: 5g, Protein: 7g)
  price integer not null default 150, -- cents
  available boolean not null default true,
  sort_order integer not null default 0
);

alter table public.boosters enable row level security;
create policy "Public read boosters" on public.boosters for select using (true);

-- ============================================================
-- ENHANCERS (premium add-ons with benefits)
-- ============================================================
create table public.enhancers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  benefits text[] not null default '{}',
  price integer not null default 399, -- cents
  available boolean not null default true,
  sort_order integer not null default 0
);

alter table public.enhancers enable row level security;
create policy "Public read enhancers" on public.enhancers for select using (true);

-- ============================================================
-- HYDRATION ITEMS
-- ============================================================
create table public.hydration_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  hydration_type text not null check (hydration_type in ('hydrant', 'aloe')),
  calories integer not null default 0,
  sugar integer not null default 0,
  price integer not null default 399, -- cents
  available boolean not null default true,
  sort_order integer not null default 0
);

alter table public.hydration_items enable row level security;
create policy "Public read hydration_items" on public.hydration_items for select using (true);

-- ============================================================
-- SNACKS
-- ============================================================
create table public.snacks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  protein integer not null default 0,
  calories integer not null default 0,
  price integer not null default 399, -- cents
  available boolean not null default true,
  sort_order integer not null default 0
);

alter table public.snacks enable row level security;
create policy "Public read snacks" on public.snacks for select using (true);

-- ============================================================
-- BOWLS
-- ============================================================
create table public.bowls (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  protein integer not null,
  calories integer not null,
  base_price integer not null, -- cents
  available boolean not null default true,
  sort_order integer not null default 0
);

alter table public.bowls enable row level security;
create policy "Public read bowls" on public.bowls for select using (true);

-- ============================================================
-- DAILY SPECIALS
-- ============================================================
create table public.daily_specials (
  id uuid primary key default gen_random_uuid(),
  day_of_week integer not null check (day_of_week between 1 and 7), -- 1=Monday..7=Sunday
  day_name text not null,
  item_name text not null,
  description text
);

alter table public.daily_specials enable row level security;
create policy "Public read daily_specials" on public.daily_specials for select using (true);

-- ============================================================
-- SAVED BUILDS (replaces favorites)
-- ============================================================
create table public.saved_builds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  smoothie_type_id uuid references public.smoothie_types(id),
  flavor_id uuid references public.flavors(id),
  booster_ids uuid[] not null default '{}',
  hydration_id uuid references public.hydration_items(id),
  total_protein integer not null default 0,
  total_calories integer not null default 0,
  total_price integer not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id, name)
);

alter table public.saved_builds enable row level security;
create policy "Users read own builds" on public.saved_builds for select using (auth.uid() = user_id);
create policy "Users insert own builds" on public.saved_builds for insert with check (auth.uid() = user_id);
create policy "Users delete own builds" on public.saved_builds for delete using (auth.uid() = user_id);
