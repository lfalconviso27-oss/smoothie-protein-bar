-- ============================================================
-- Migration: Update hydration_type constraint to support 'base'
-- The new hydration items (Coconut Water, Almond Milk, etc.)
-- use 'base' type instead of 'hydrant'/'aloe'
-- ============================================================

-- Remove the old constraint and add a new one
alter table public.hydration_items drop constraint if exists hydration_items_hydration_type_check;
alter table public.hydration_items add constraint hydration_items_hydration_type_check
  check (hydration_type in ('hydrant', 'aloe', 'base'));
