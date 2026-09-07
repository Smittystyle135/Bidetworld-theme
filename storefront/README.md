# Bidet World – headless storefront

Custom Next.js storefront for bidetworld.com. Shopify stays the backend (products,
collections, pages, blog, cart, checkout, orders, customers); this app is the frontend.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Shopify Storefront API.

## What's in it

| Route | What it does |
|---|---|
| `/` | Hero, quiz CTA, category grid, best sellers, seats, attachments, lifts, blog, why-bidet |
| `/quiz` | **Bidet Quiz** – 5 questions → recommendation + real products from the matching collection (replaces the Octane AI app) |
| `/collections/[handle]` | Collection page with sort. `all-bidets-1` also shows the category tiles |
| `/products/[handle]` | Gallery, variant picker, add to cart, trust bullets, description, recommendations, Product JSON-LD |
| `/search?q=` | Product search |
| `/cart` | Full cart page. Cart drawer opens from the header on every page |
| `/pages/[handle]` | Shopify pages (support, about-us, sales-offers, brands, policies…) |
| `/blogs/news`, `/blogs/news/[article]` | Blog list + article, Article JSON-LD. Same URLs as Shopify so SEO carries over |
| `/sitemap.xml`, `/robots.txt` | Generated from the live catalog |

Checkout hands off to Shopify's hosted checkout (`cart.checkoutUrl`), so payments, tax,
shipping, discount codes and order emails all work exactly as today.

The main navigation is read from the Shopify **main-menu**, so editing the menu in
Shopify admin updates the site. Footer links, announcements, hero copy, home categories
and the quiz live in `src/lib/config.ts` and `src/lib/quiz.ts`.

## 1. Connect to Shopify (one-time)

1. Shopify admin → **Settings → Apps and sales channels → Develop apps → Create app**.
   Name it "Headless storefront".
2. **Configure Storefront API scopes** and enable:
   `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`,
   `unauthenticated_read_content`, `unauthenticated_read_checkouts`,
   `unauthenticated_write_checkouts`, `unauthenticated_write_customers`
   (the last one powers the newsletter signup).
3. **Install app** → copy the **Storefront API access token**.
4. Copy `.env.example` to `.env.local` and fill in:

```
SHOPIFY_STORE_DOMAIN=b5c390-92.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=<token>
NEXT_PUBLIC_SITE_URL=https://www.bidetworld.com
```

Until these are set the site shows a "Connect your Shopify store" page instead of erroring.

## 2. Run locally

```bash
cd storefront
npm install
npm run dev          # http://localhost:3000 against the live store (needs .env.local)
```

No token yet? Use the mock API, which serves the catalog snapshot from `../data/`:

```bash
npm run mock         # terminal 1 – mock Storefront API on :4000
npm run dev:mock     # terminal 2 – site on :3000 using the mock
```

Checks: `npm run lint`, `npm run typecheck`, `npm run build`.

## 3. Deploy to Vercel

1. vercel.com → **Add New Project** → import the `bidetworld-theme` GitHub repo.
2. **Root Directory:** `storefront` (important – the repo root is the Shopify theme).
3. Framework preset: Next.js (auto-detected).
4. Environment variables: the three from step 1.
5. Deploy. You get a `*.vercel.app` URL to review.

### Point bidetworld.com at it (only when you're happy with it)

1. Vercel → Project → Settings → Domains → add `bidetworld.com` and `www.bidetworld.com`.
2. At GoDaddy, change DNS to what Vercel shows (A record `76.76.21.21` for `@`, CNAME
   `cname.vercel-dns.com` for `www`) – replacing the Shopify records.
3. In Shopify admin → Settings → Domains, keep `bidetworld.com` listed so checkout
   still shows your brand, but the Shopify online store is no longer the front door.

Rolling back is just switching DNS back to Shopify's records.

## 4. Things to finish before going live

- **Logo:** save your logo as `public/logo.png`, then in `src/components/Logo.tsx`
  replace the SVG with `<Image src="/logo.png" alt="Bidet World" width={110} height={110} priority />`.
- **Social links:** fill in the URLs in `src/lib/config.ts` (`socialLinks`). Empty ones are hidden.
- **Reviews:** Judge.me reviews are not shown yet. Judge.me has a public API/widget that can
  be added to the product page later.
- **Newsletter:** signups create a Shopify customer with marketing consent. If you'd rather
  push straight to Klaviyo, swap `src/lib/newsletter/actions.ts` for Klaviyo's client API.
- **Hero media:** the hero currently uses text on a dark gradient. Add the bathroom
  photo/video to `public/` and drop it into `src/components/home/Hero.tsx`.
- **Redirects:** Shopify URL redirects (admin → Navigation → URL redirects) don't carry
  over. Add any you rely on to `next.config.ts` → `redirects()`.
- **Customer accounts:** the account icon links to `<store>.myshopify.com/account`
  (Shopify's hosted account pages). Fine to ship; can be embedded later.

## 5. Where things live

```
src/app/                 routes (App Router)
src/components/          UI (layout/, cart/, product/, home/, quiz/, blog/)
src/lib/config.ts        site copy, nav fallback, footer, categories, announcements
src/lib/quiz.ts          quiz questions + recommendation logic
src/lib/shopify/         Storefront API client, GraphQL queries, types
src/lib/cart/actions.ts  server actions for the cart (cart id in an httpOnly cookie)
scripts/mock-shopify.mjs local mock of the Storefront API
```
