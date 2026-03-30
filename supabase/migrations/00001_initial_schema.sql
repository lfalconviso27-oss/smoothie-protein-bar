-- ============================================================
-- Smoothie Protein Bar - Initial Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  phone text,
  fitness_goal text check (fitness_goal in ('bulk', 'cut', 'maintain', 'energy')),
  daily_calorie_target integer,
  daily_protein_target integer,
  daily_carb_target integer,
  daily_fat_target integer,
  loyalty_points integer not null default 0,
  loyalty_tier text not null default 'bronze' check (loyalty_tier in ('bronze', 'silver', 'gold', 'platinum')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- CATEGORIES
-- ============================================================
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Categories are publicly readable"
  on public.categories for select
  using (true);

-- ============================================================
-- INGREDIENTS
-- ============================================================
create table public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  type text not null check (type in ('base', 'protein', 'fruit', 'vegetable', 'liquid', 'addon', 'topping', 'sweetener')),
  calories_per_unit numeric(6,2) not null default 0,
  protein_per_unit numeric(6,2) not null default 0,
  carbs_per_unit numeric(6,2) not null default 0,
  fat_per_unit numeric(6,2) not null default 0,
  fiber_per_unit numeric(6,2) not null default 0,
  sugar_per_unit numeric(6,2) not null default 0,
  unit text not null default 'g' check (unit in ('g', 'ml', 'scoop', 'piece', 'oz')),
  default_amount numeric(6,2) not null default 0,
  price_modifier integer not null default 0,
  available boolean not null default true,
  allergens text[] not null default '{}',
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.ingredients enable row level security;

create policy "Ingredients are publicly readable"
  on public.ingredients for select
  using (true);

-- ============================================================
-- SMOOTHIES
-- ============================================================
create table public.smoothies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid references public.categories(id),
  base_price integer not null,
  image_url text,
  tags text[] not null default '{}',
  calories integer not null default 0,
  protein numeric(6,2) not null default 0,
  carbs numeric(6,2) not null default 0,
  fat numeric(6,2) not null default 0,
  fiber numeric(6,2) not null default 0,
  sugar numeric(6,2) not null default 0,
  customizable boolean not null default true,
  available boolean not null default true,
  featured boolean not null default false,
  seasonal boolean not null default false,
  fitness_goals text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.smoothies enable row level security;

create policy "Smoothies are publicly readable"
  on public.smoothies for select
  using (true);

-- ============================================================
-- SMOOTHIE_INGREDIENTS (junction)
-- ============================================================
create table public.smoothie_ingredients (
  id uuid primary key default gen_random_uuid(),
  smoothie_id uuid not null references public.smoothies(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id),
  amount numeric(6,2) not null,
  is_removable boolean not null default true,
  is_default boolean not null default true,
  sort_order integer not null default 0,
  unique (smoothie_id, ingredient_id)
);

alter table public.smoothie_ingredients enable row level security;

create policy "Smoothie ingredients are publicly readable"
  on public.smoothie_ingredients for select
  using (true);

-- ============================================================
-- CUSTOMIZATION_OPTIONS
-- ============================================================
create table public.customization_options (
  id uuid primary key default gen_random_uuid(),
  "group" text not null check ("group" in ('size', 'milk_base', 'protein_type', 'sweetness', 'addon')),
  name text not null,
  label text not null,
  price_modifier integer not null default 0,
  calories_modifier integer not null default 0,
  protein_modifier numeric(6,2) not null default 0,
  carbs_modifier numeric(6,2) not null default 0,
  fat_modifier numeric(6,2) not null default 0,
  sort_order integer not null default 0,
  available boolean not null default true
);

alter table public.customization_options enable row level security;

create policy "Customization options are publicly readable"
  on public.customization_options for select
  using (true);

-- ============================================================
-- ORDERS
-- ============================================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  order_number text not null unique,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')),
  order_type text not null check (order_type in ('pickup', 'delivery', 'scheduled')),
  subtotal integer not null,
  tax integer not null,
  delivery_fee integer not null default 0,
  discount integer not null default 0,
  total integer not null,
  loyalty_points_earned integer not null default 0,
  loyalty_points_redeemed integer not null default 0,
  stripe_payment_intent_id text,
  stripe_payment_status text,
  delivery_address jsonb,
  scheduled_at timestamptz,
  estimated_ready_at timestamptz,
  completed_at timestamptz,
  notes text,
  promo_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Service role can insert orders"
  on public.orders for insert
  with check (true);

create policy "Service role can update orders"
  on public.orders for update
  using (true);

-- ============================================================
-- ORDER_ITEMS
-- ============================================================
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  smoothie_id uuid not null references public.smoothies(id),
  name text not null,
  quantity integer not null default 1,
  unit_price integer not null,
  total_price integer not null,
  customizations jsonb not null default '{}',
  nutrition_snapshot jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Service role can insert order items"
  on public.order_items for insert
  with check (true);

-- ============================================================
-- ORDER_STATUS_EVENTS
-- ============================================================
create table public.order_status_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  message text,
  created_at timestamptz not null default now()
);

alter table public.order_status_events enable row level security;

create policy "Users can view own order status events"
  on public.order_status_events for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_status_events.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Service role can insert order status events"
  on public.order_status_events for insert
  with check (true);

-- ============================================================
-- FAVORITES
-- ============================================================
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  smoothie_id uuid not null references public.smoothies(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, smoothie_id)
);

alter table public.favorites enable row level security;

create policy "Users can view own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can add own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ============================================================
-- LOYALTY_TRANSACTIONS
-- ============================================================
create table public.loyalty_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id),
  points integer not null,
  type text not null check (type in ('earned', 'redeemed', 'bonus', 'expired')),
  description text,
  created_at timestamptz not null default now()
);

alter table public.loyalty_transactions enable row level security;

create policy "Users can view own loyalty transactions"
  on public.loyalty_transactions for select
  using (auth.uid() = user_id);

create policy "Service role can insert loyalty transactions"
  on public.loyalty_transactions for insert
  with check (true);

-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger smoothies_updated_at
  before update on public.smoothies
  for each row execute function public.update_updated_at();

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.update_updated_at();

-- Auto-update loyalty points & tier
create or replace function public.update_loyalty_points()
returns trigger
language plpgsql
security definer
as $$
declare
  new_total integer;
  new_tier text;
begin
  select coalesce(sum(points), 0) into new_total
  from public.loyalty_transactions
  where user_id = new.user_id;

  if new_total >= 5000 then
    new_tier := 'platinum';
  elsif new_total >= 2000 then
    new_tier := 'gold';
  elsif new_total >= 500 then
    new_tier := 'silver';
  else
    new_tier := 'bronze';
  end if;

  update public.profiles
  set loyalty_points = new_total, loyalty_tier = new_tier
  where id = new.user_id;

  return new;
end;
$$;

create trigger on_loyalty_transaction
  after insert on public.loyalty_transactions
  for each row execute function public.update_loyalty_points();

-- Enable realtime for order tracking
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_status_events;
