-- ============================================================
-- Smoothie Protein Bar - Seed Data
-- Full menu: types, flavors, boosters, enhancers, hydration,
-- snacks, bowls, daily specials
-- ============================================================

-- Smoothie Types
insert into public.smoothie_types (name, slug, description, protein, calories, base_price, sort_order) values
  ('Basic',  'basic',  'Light and refreshing. Perfect for everyday.',  24, 200, 799, 1),
  ('Fit',    'fit',    'Lean and clean. Built for your goals.',        32, 250, 899, 2),
  ('Power',  'power',  'Maximum fuel. Go harder, go longer.',          36, 290, 999, 3),
  ('Vegan',  'vegan',  'Plant-powered protein. No compromises.',       25, 250, 899, 4);

-- Flavor Categories
insert into public.flavor_categories (name, slug, color, icon, sort_order) values
  ('Fruits',    'fruits',    '#FF6B6B', '🍓', 1),
  ('Chocolate', 'chocolate', '#5C3317', '🍫', 2),
  ('Specialty', 'specialty', '#9B59B6', '✨', 3);

-- Fruit Flavors (5)
insert into public.flavors (name, slug, category_id, sort_order)
select f.name, f.slug, fc.id, f.sort_order
from (values
  ('Strawberry',  'strawberry',  1),
  ('Banana',      'banana',      2),
  ('Mango',       'mango',       3),
  ('Blueberry',   'blueberry',   4),
  ('Pineapple',   'pineapple',   5)
) as f(name, slug, sort_order)
cross join public.flavor_categories fc
where fc.slug = 'fruits';

-- Chocolate Flavors (3)
insert into public.flavors (name, slug, category_id, sort_order)
select f.name, f.slug, fc.id, f.sort_order
from (values
  ('Milk Chocolate',  'milk-chocolate',  1),
  ('Dark Chocolate',  'dark-chocolate',  2),
  ('White Chocolate', 'white-chocolate', 3)
) as f(name, slug, sort_order)
cross join public.flavor_categories fc
where fc.slug = 'chocolate';

-- Specialty Flavors (3)
insert into public.flavors (name, slug, category_id, sort_order)
select f.name, f.slug, fc.id, f.sort_order
from (values
  ('Cookies & Cream', 'cookies-and-cream', 1),
  ('Peanut Butter',   'peanut-butter',     2),
  ('Matcha',          'matcha',            3)
) as f(name, slug, sort_order)
cross join public.flavor_categories fc
where fc.slug = 'specialty';

-- Boosters (4)
insert into public.boosters (name, slug, grams, price, sort_order) values
  ('Extra Protein', 'extra-protein', 10, 199, 1),
  ('Creatine',      'creatine',       5, 199, 2),
  ('Collagen',      'collagen',      null, 199, 3),
  ('BCAAs',         'bcaas',         null, 249, 4);

-- Enhancers (4)
insert into public.enhancers (name, slug, benefits, price, sort_order) values
  ('Chia Seeds',  'chia-seeds',  '{"omega-3","fiber","antioxidants"}', 149, 1),
  ('Flax Seeds',  'flax-seeds',  '{"omega-3","fiber","lignans"}',     149, 2),
  ('Honey',       'honey',       '{"natural energy","antioxidants"}', 99,  3),
  ('Granola',     'granola',     '{"fiber","crunch","complex carbs"}', 149, 4);

-- Hydration Items (4)
insert into public.hydration_items (name, slug, hydration_type, calories, sugar, price, sort_order) values
  ('Coconut Water', 'coconut-water', 'base', 45, 6, 199, 1),
  ('Almond Milk',   'almond-milk',   'base', 30, 0, 149, 2),
  ('Oat Milk',      'oat-milk',      'base', 60, 4, 149, 3),
  ('Water',         'water',         'base',  0, 0,   0, 4);

-- Snacks (3)
insert into public.snacks (name, slug, protein, calories, price, sort_order) values
  ('Protein Bar',   'protein-bar',   20, 230, 499, 1),
  ('Acai Bowl',     'acai-bowl',     8,  310, 899, 2),
  ('Greek Yogurt',  'greek-yogurt',  15, 150, 449, 3);

-- Bowls (3)
insert into public.bowls (name, slug, protein, calories, base_price, sort_order) values
  ('Acai Bowl',   'acai-bowl',   10, 340, 1099, 1),
  ('Pitaya Bowl', 'pitaya-bowl', 8,  290, 1099, 2),
  ('Green Bowl',  'green-bowl',  12, 280, 999,  3);

-- Daily Specials (Mon=1 .. Sun=7)
insert into public.daily_specials (day_of_week, day_name, item_name, description) values
  (1, 'Monday',    'Power Smoothie',       'Start strong with 36g protein Power smoothies at a special price'),
  (2, 'Tuesday',   'Berry Blast',          'All berry flavors with a free booster'),
  (3, 'Wednesday', 'Bowl Day',             'All bowls $2 off — Acai, Pitaya, or Green'),
  (4, 'Thursday',  'Tropical Thursday',    'Mango & Pineapple smoothies with free coconut water'),
  (5, 'Friday',    'Protein Party',        'Double boosters for the price of one'),
  (6, 'Saturday',  'Weekend Warrior',      'Any Power or Fit smoothie with a free protein bar'),
  (7, 'Sunday',    'Sunday Reset',         'Vegan smoothies with free chia seeds');
