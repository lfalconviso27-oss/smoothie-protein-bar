---
name: Smoothie Protein Bar Platform
description: Architecture and implementation decisions for the ordering platform
type: project
---

Full production-ready smoothie/protein bar ordering platform built with Next.js 16.2.1, Tailwind CSS 4, Zustand, Framer Motion, Supabase, Stripe.

**Why:** User requested complete platform with exact menu data, specific purple design (#7B5CF0), and both website + mobile app interface.

**Key decisions:**
- Static fallback data in `src/lib/menu-data.ts` — all menu actions try Supabase first, fall back to static data so app works without a configured database
- Builder step order changed to: Hydrant+Aloe → Type → Boosters → Flavor (matches physical menu)
- Builder store has `hydrantFlavor` and `aloeFlavor` (separate fields) instead of single `hydration`
- Primary color updated from #8E7AB5 to #7B5CF0 (more vibrant purple)
- Home page at `/` has its own inline header + bottom nav (not in main layout group)
- Menu tabs: Smoothies, Snacks, Specials, Enhancers (not Bowls/Hydration as separate tabs)
- Bottom nav: Home/Menu/Orders/Profile (was Menu/Build/Cart/Profile)
- Desktop nav: Menu, Order, About (was Menu, Build)

**Static data covers:**
- 4 smoothie types (Basic/Fit/Power/Vegan)
- 58 flavors across 4 categories (Vanilla 16, Fruity 26, Coffee 8, Chocolate 8)
- 8 boosters (Energy, Collagen, Guarana, Probiotic, Fiber, Protein, Healthy Heart, Immune System)
- 4 enhancers (Beta Power, Super Power, Tequila Sunrise, Beauty Booster)
- 5 hydration items (3 Hydrant + 2 Aloe, all free)
- 8 snacks with protein/calorie data
- 5 daily specials (Mon-Fri)

**How to apply:** When modifying menu data, update `src/lib/menu-data.ts`. When modifying builder flow, update `src/lib/store/builder-store.ts` and `src/app/(main)/build/builder-client.tsx`.
