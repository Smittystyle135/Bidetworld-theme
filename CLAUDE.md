# CLAUDE.md — BidetWorld Shopify Theme Knowledge Base

> **Read this file completely at the start of every session before touching code.**
> Update it at the end of every session with anything learned. This file is the
> project's memory. If it is not written here, it did not happen.

---

## 0. Session Start Ritual (do this every time, in order)

1. Read this whole file.
2. Run `git status`, `git branch --show-current`, `git log --oneline -10`.
3. Read **§9 Current Focus** and tell Jeff in one line what we were working on last time.
4. Confirm the task for this session in one sentence. If Jeff drifts off task, gently
   pull him back to §9 and offer to park the new idea in **§10 Idea Parking Lot**.
5. Before editing any file, read it and grep for everything that references it.
6. At the end of the session: update §9, §11, §12, and §13, then commit and push.

---

## 1. Who I Am Working With

- **Jeff Smith**, entrepreneur, Middleville/Otsego, Michigan. Owner of BidetWorld.com.
- Jeff is ADHD. **Be direct, concise, step by step. One recommendation, not a menu of
  options. Simple language, not technical jargon. Celebrate wins.**
- Highest-revenue-impact work comes first. If a task is low impact, say so and suggest
  the higher-impact one.
- Goal: 10 businesses in 2 years, fully autonomous income streams. BidetWorld grows
  through SEO and social media. This theme is the storefront that converts that traffic.

---

## 2. Who I Am On This Project

I act as a senior full-stack developer with 30 years of experience. Careful and
methodical. These rules are not optional:

1. **Never break one thing to fix another.** Before changing any file, find every
   place that uses it (`grep -rn "snippet-name"`, `grep -rn "section-name"`,
   `grep -rn "class-name"`). A change to a snippet, CSS class, or JS function
   affects every template that includes it.
2. **Cross-reference before building.** Every new feature is checked against existing
   sections, snippets, settings, and CSS so we reuse instead of duplicate.
3. **Debug during the build, not after.** Run `shopify theme check` after every
   meaningful change. Render the affected page with `shopify theme dev` when
   possible. Never claim something works without checking it.
4. **Smallest change that solves the problem.** No drive-by refactors, no reformatting
   files I did not need to touch, no "while I'm here" edits.
5. **Frontend design standards apply to every UI change** (see §6).
6. **Report faithfully.** If a check fails or was skipped, say so plainly.
7. **Log what I learn** in §12 and §13 before ending the session.

---

## 3. Repo Snapshot

| Item | Value |
|---|---|
| Repo | `smittystyle135/bidetworld-theme` |
| Default branch | `main` |
| Working branch | `claude/claude-md-knowledge-base-wf8xrn` |
| Store platform | Shopify, Basic plan |
| Store address | `b5c390-92.myshopify.com` (admin: `admin.shopify.com/store/b5c390-92`) |
| Build step | Theme: none. `storefront/`: Next.js app (`npm run build`), deployed by Vercel with Root Directory = `storefront`. |

### Current state (2026-09-06, evening)

The live theme is in the repo (commit `2f07b63`, 364 files, pulled from Shopify theme
ID `138285350996`, named "Updated copy of 3.1.0 - Current Store"). Also in the repo:
`data/products.json` and `data/collections.json` (catalog snapshot) and `.gitignore`.

Shopify also holds five unpublished backup themes: "Free Version", "1st Paid Version",
"2nd Paid Version", "3rd Paid Version", and "3.1.0 - Current Store". Leave them alone.

---

## 4. Expected Shopify Theme Anatomy

Once the theme is pulled, this is the layout Shopify enforces. Keep it exactly.

```
assets/          CSS, JS, images, fonts. Referenced via {{ 'file.css' | asset_url }}
config/
  settings_schema.json   Theme-wide settings shown in the Theme Editor
  settings_data.json     Saved values of those settings (merchant data, edit with care)
layout/
  theme.liquid           Wraps every page. <head>, header, footer live here
locales/
  en.default.json        All customer-facing strings. Never hardcode text in Liquid
  en.default.schema.json Labels for the Theme Editor
sections/        Reusable page blocks with a {% schema %} tag. Merchant can add/reorder
  *-group.json   Section groups: header-group, footer-group, overlay-group render on every page
blocks/          Theme blocks (Concept ships 20: heading, image, button, accordion, map, etc.)
snippets/        Small Liquid partials, included with {% render 'name' %}
templates/
  *.json          Online Store 2.0 templates: list of sections + their settings
  *.liquid        Legacy templates (avoid creating new ones)
  customers/      Account pages
```

### Conventions we follow

- **Online Store 2.0 only.** New pages are JSON templates built from sections.
- **Sections own their CSS and JS.** Put section-specific styles in
  `{% stylesheet %}` or a dedicated `assets/section-name.css` loaded only by that
  section. Global styles go in the theme's base stylesheet only when truly global.
- **Snippets are pure.** A snippet receives its data as `{% render 'name', var: value %}`
  parameters. It never relies on outer-scope variables.
- **Text goes in `locales/en.default.json`.** Use `{{ 'key.path' | t }}`.
- **Settings over hardcoding.** If Jeff might want to change it (colors, headings,
  toggles), it belongs in a section schema setting, not in the code.
- **`settings_data.json` and `templates/*.json` are merchant data.** The Theme Editor
  writes to them. Pull before editing, keep diffs minimal, never hand-format them.
- **Never delete a section or snippet without grepping every template and section
  for its name.** JSON templates reference sections by filename.
- **Images:** use `image_url` with explicit `width`, plus `image_tag` with `loading:
  'lazy'` below the fold. Always set `alt`.
- **No jQuery, no heavy frameworks.** Vanilla JS, small, deferred.
- **Accessibility is not optional:** focus states, ARIA on custom controls,
  color contrast at least 4.5:1, keyboard-operable menus and drawers.

---

## 5. Dev Workflow

### Tools

- Shopify CLI (`shopify theme ...`). Install: `npm install -g @shopify/cli`.
- Theme Check runs inside the CLI: `shopify theme check`.

### Common commands

```bash
# Pull the live theme into this repo (first-time setup and before big changes)
shopify theme pull --store b5c390-92.myshopify.com

# Local preview with hot reload (does not touch the live theme)
shopify theme dev --store b5c390-92.myshopify.com

# Refresh the catalog snapshot in data/ (public endpoints, no token needed)
curl -sS "https://b5c390-92.myshopify.com/products.json?limit=250" -o data/products.json
curl -sS "https://b5c390-92.myshopify.com/collections.json?limit=250" -o data/collections.json

# Lint Liquid, JSON, and theme conventions
shopify theme check

# Push to an UNPUBLISHED theme for review. Never push straight to the live theme.
shopify theme push --unpublished --theme "Dev - <short description>"
```

### Git rules

- Develop on the working branch listed in §3. Never push to another branch.
- One logical change per commit. Message format: `area: what changed and why`.
  Example: `sections/product: add trust badges block under add-to-cart`.
- Commit `CLAUDE.md` updates in the same push as the code they describe.
- Do not commit: `node_modules/`, `.shopify/`, `*.log`, OS junk, API keys, `.env`.
  `.gitignore` covers these already.

### Definition of done for any change

1. `shopify theme check` passes with no new errors.
2. Affected page rendered and looked at (desktop and mobile width).
3. Every file that references the changed code was reviewed.
4. §12 or §13 updated if anything was learned.
5. Committed and pushed.

---

## 6. Frontend Design Standards (BidetWorld)

Brand palette and fonts are confirmed in §8: near-black text on white, Inter for
everything, fully rounded black buttons, peach `#ffddbf` highlight, mint `#a8e8e2`
shadow, amber stars. The headless clone must reproduce this look exactly before it
improves on it. These rules also stand:

- **Conversion first.** Every product page change must protect: clear price, visible
  add-to-cart above the fold on mobile, trust signals (reviews, shipping, returns,
  warranty) near the buy button.
- **Mobile is the primary layout.** Design at 375px first, then widen.
- **Clean, clinical, trustworthy look.** Bidets are a bathroom-health product. Lots of
  white space, calm colors, sharp product photography, no visual clutter.
- **Consistency over novelty.** Reuse the theme's existing spacing, radius, shadow,
  and type scale. Do not introduce a new value when an existing one is close.
- **Performance is a feature.** No render-blocking scripts, images sized correctly,
  fonts preloaded, target Lighthouse mobile performance of 70+ on product pages.
- **SEO hygiene.** One `<h1>` per page, semantic headings, product JSON-LD present,
  descriptive alt text, canonical tags intact. Jeff's traffic strategy is SEO, so
  never remove structured data or meta tags without a replacement.
- **Blog matters.** Daily automated blog posts land on this theme. Article and blog
  templates must look polished and load fast.

---

## 7. Business Context That Affects the Theme

- **Automation stack:** Zapier (all automations), Buffer (Facebook and TikTok posts),
  AI by Zapier (social copy), OpenAI DALL-E (blog images), Klaviyo (email).
- **Daily schedule:** 6am blog post, 7am briefing email, 9am/11am/4pm social posts.
- **Implication:** blog posts are created by automation, so the article template must
  handle AI-generated content gracefully (long paragraphs, generated hero image,
  possible missing excerpt). Klaviyo signup forms and tracking live in the theme.
  Do not remove third-party scripts without checking what automation depends on them.
- **Social links on site:** Facebook (BidetWorld), TikTok (BidetWorld business account).
- **Email:** Outlook.
- **Other ventures (not this repo):** N-Able Health sales rep, Traverse City Exteriors
  site (Netlify + Namecheap), rental triplex, APEX Python agent, Alpaca trading bot.
  If Jeff brings these up mid-session, park them in §10 and refocus.

---

## 8. Confirmed Theme Facts

Fill in as verified. Do not guess.

| Fact | Value | Verified on |
|---|---|---|
| Base theme | **Concept by RoarTheme** (paid). Docs: roartheme.co/blogs/concept. Support: haloroar.ticksy.com | 2026-09-06 |
| Theme version | 5.1.0 (Shopify calls the live copy "Updated copy of 3.1.0 - Current Store", ID 138285350996) | 2026-09-06 |
| File counts | 101 sections, 96 snippets, 20 blocks, 62 templates, 43 assets, 38 locales | 2026-09-06 |
| Text color | `#171717` (near-black) | 2026-09-06 |
| Background | `#ffffff`, image background `#fafafa` | 2026-09-06 |
| Accent / highlight | `#ffddbf` (peach highlight), shadow `#a8e8e2` (mint) | 2026-09-06 |
| Buttons | black `#171717` bg, white text, fully rounded ("round"), 2px border | 2026-09-06 |
| Sale / error red | `#e11d48` sale, `#be123c` error text | 2026-09-06 |
| Rating stars | `#f59e0b` (amber) | 2026-09-06 |
| Focus ring | `#0b61cd` | 2026-09-06 |
| Heading font | Inter Bold (`inter_n7`), line-height 1, letter-spacing -30 | 2026-09-06 |
| Body font | Inter Regular (`inter_n4`), 16px, line-height 1.2 | 2026-09-06 |
| Nav / button / product fonts | body font, weight 500, 16px | 2026-09-06 |
| Page max width | 1900px | 2026-09-06 |
| Logo | `Remove_background_project_1.png`, 110px desktop / 100px mobile | 2026-09-06 |
| CSS / JS entry | `assets/theme.css` (340KB), `assets/theme.js` (246KB), `assets/vendor.js` (90KB), all built by RoarTheme, no source maps | 2026-09-06 |
| Review app | **Judge.me** via app embed (`judgeme_core`, enabled). No review markup in theme files. | 2026-09-06 |
| Quiz app | **Octane AI Advanced Quiz Maker**, app embed enabled + `apps` section in footer group | 2026-09-06 |
| Klaviyo | **Not found anywhere in theme code.** Either installed as an app with no theme embed, or not installed. Verify in Shopify admin before building signup forms. | 2026-09-06 |
| Analytics pixels | None hardcoded (no gtag, fbq, GTM in theme). Any tracking runs through Shopify's pixel manager or apps. | 2026-09-06 |
| Custom sections | None found. All 101 sections are stock Concept. Customization lives in template JSON and settings. | 2026-09-06 |
| Catalog size | 33 products, 108 variants, 447 images, 25 collections | 2026-09-06 |
| Price range | $3 accessories to $2,999 Dignity Lifts toilet lift | 2026-09-06 |
| Vendors | Bidet World (14), Hygiene For Health (10), Dignity Lifts (6), TUSHY (3) | 2026-09-06 |
| Main categories | Bidet seats, bidet attachments, handheld sprayers, travel bidets, bidet toilets, assisted toilet lifts, accessories | 2026-09-06 |
| Raw catalog snapshot | `data/products.json`, `data/collections.json` (public storefront JSON, refresh with the curl in §5) | 2026-09-06 |

### Page layouts as of 2026-09-06 (section order, top to bottom)

**Every page, from `sections/header-group.json`:**
slideshow-hero (homepage only) → rich-text "Not sure what bidet? Take the quiz!" (ALL
pages, no homepage-only setting) → announcement-bar (3 messages) → header (2 mega menus).
Disabled: an Octane quiz `apps` section.

**Every page, from `sections/footer-group.json`:**
multicolumn-with-icons (4 columns) → apps (Octane quiz) → footer (link list + brand
info) → footer-copyright.

**Homepage `templates/index.json`:**
collection-list "Product Collections" (7) → featured-collections "Best Sellers" (6
collections) → video-with-text-overlay → rich-text → scrolling-text (6 logos) →
blog-posts-collage "Bidet World Blogs". Disabled: welcome rich-text, featured-product.

**Product `templates/product.json`:**
main-product (breadcrumb, text, title, price, description, 2 text, countdown,
variant_picker, inventory, buy_buttons, pickup_availability) → help-drawer "Need help?"
→ product-details (4 collapsible tabs) → scrolling-text → product-recommendations
"You may also like". Disabled: faq, recently-viewed.

**Collection `templates/collection.json`:**
main-collection-banner → main-collection (subcollections block) → rich-text →
recently-viewed. Custom collection templates exist for assisted bidets, bidet toilets,
and Dignity Lifts.

**Article `templates/article.json`:**
main-article-banner → main-article-overlay (share, next/prev, comments) → blog-posts
"Latest Stories".

**Custom page templates (28):** about, FAQ, contact (3 map variants), bidet quiz,
documentation, troubleshooting, video tutorials, brands, bundle, reviews, sales,
services, social media, store policies, returns, support, who we are, story, portfolio.
Many are likely unused. Check which pages actually use them before deleting any.
| Catalog size | 33 products, 108 variants, 447 images, 25 collections | 2026-09-06 |
| Price range | $3 accessories to $2,999 Dignity Lifts toilet lift | 2026-09-06 |
| Vendors | Bidet World (14), Hygiene For Health (10), Dignity Lifts (6), TUSHY (3) | 2026-09-06 |
| Main categories | Bidet seats, bidet attachments, handheld sprayers, travel bidets, bidet toilets, assisted toilet lifts, accessories | 2026-09-06 |
| Raw catalog snapshot | ,  (public storefront JSON, refresh with the curl in §5) | 2026-09-06 |

---

## 9. Current Focus

**Last session (2026-09-07):** Built the headless storefront v1 in `storefront/`
(Next.js 16, Tailwind 4, Storefront API). It has: home, collections with sort, product
page with variants + add to cart, cart drawer + cart page → Shopify checkout, search,
Shopify pages, blog list + article (same `/blogs/news/...` URLs as Shopify), sitemap,
robots, JSON-LD, newsletter signup (Storefront `customerCreate`), the NEWCUSTOMER
popup, and a **rebuilt Bidet Quiz at `/quiz`** (replaces the unpaid Octane AI app).
Nav is read from the Shopify `main-menu`. `npm run build`, `lint`, `typecheck` all
pass. A mock Storefront API (`storefront/scripts/mock-shopify.mjs`, fed by `data/`)
lets us develop and screenshot without the live store. Full docs: `storefront/README.md`.

**Next task (Jeff, ~15 minutes):**
1. Create the Storefront API token (steps in `storefront/README.md` §1).
2. Create a Vercel project from this repo, **Root Directory = `storefront`**, add the
   three env vars, deploy, and send Claude the preview URL.

**Then Claude:** review the preview against the live store, fix anything off, add the
real logo (`storefront/public/logo.png`) and hero media, then plan the DNS cutover
(README §3). Supabase is not needed for v1; add it only when a feature needs it.

**Domain (Jeff is renewing now):** after renewal, confirm DNS still points at Shopify.
Checklist:
1. Confirm the domain has not expired (registrar dashboard). Renew if it has.
2. In Shopify admin: Settings > Domains. Confirm bidetworld.com is listed and set as
   primary. If missing, add it.
3. At the registrar: A record for `@` must be `23.227.38.65`, CNAME for `www` must be
   `shops.myshopify.com`. Remove any GoDaddy parking / forwarding records.
4. Wait for DNS, then re-run the checks in §12 (curl root, check for Shopify headers).
5. Pause the Zapier/Buffer social posts that link to the site until it is back up,
   or leave them if the fix is same-day.

**After that:** audit the product page and homepage for conversion and SEO wins,
ranked by revenue impact, and carry the winners into the clone.

---

## 10. Idea Parking Lot

Ideas Jeff mentioned that are not the current task. Review when §9 is done.

- (empty)

---

## 11. Decisions Log

Why we chose what we chose, so we do not re-argue it.

| Date | Decision | Reason |
|---|---|---|
| 2026-09-06 | Keep this repo as a plain Shopify theme with no build tooling | Shopify Basic plan, no dev team, simplest thing that ships. Revisit only if a real need appears. |
| 2026-09-06 | Push to unpublished themes only, never directly to live | Protects revenue. Jeff publishes from the Shopify admin after review. |
| 2026-09-06 | Headless clone keeps Shopify as the commerce backend (Storefront API), Next.js on Vercel as the frontend, Supabase for content and extras | Rebuilding checkout, payments, and tax is months of work and legal risk for no extra revenue. |
| 2026-09-06 | Clone lives in a `storefront/` folder of this same repo | One repo, one CLAUDE.md, one place to look. Vercel can deploy a subfolder. |
| 2026-09-07 | Storefront stack: Next.js 16 App Router + Tailwind 4, no UI library, no Hydrogen | Most widely known stack, deploys anywhere (Vercel/Netlify/Cloudflare), and the Storefront API is plain GraphQL over fetch. |
| 2026-09-07 | Quiz logic lives in code (`storefront/src/lib/quiz.ts`), not a paid app | Octane AI is no longer paid for. Code is free, fully ours, and the recommendation rules are readable in one file. |
| 2026-09-07 | Blog routes keep Shopify's URL shape (`/blogs/news/<handle>`) | Daily automated posts are the SEO engine; changing URLs would lose rankings. |
| 2026-09-07 | Cart uses Storefront Cart API with the cart id in an httpOnly cookie; checkout is Shopify hosted | Shopify keeps handling payments, tax, shipping and discounts. Nothing to re-certify. |
| 2026-09-07 | Newsletter signup = Storefront `customerCreate` with marketing consent | Works with zero extra services; can be swapped for Klaviyo's API later without touching the UI. |

---

## 12. Lessons Learned Log

Add a dated entry every time something surprises us, breaks, or turns out to work
differently than expected. Newest first.

- **2026-09-07: Tailwind 4 `@apply` cannot reference a class defined in the same
  `@layer components` block** (build error "Cannot apply unknown utility class"). Write
  the utilities out instead of composing custom classes.
- **2026-09-07: Next 16's React Compiler lint (`react-hooks/set-state-in-effect`) is an
  error, not a warning.** Derive state instead of syncing it in `useEffect`, or reset a
  component with a `key`.
- **2026-09-07: `cdn.shopify.com` and `b5c390-92.myshopify.com` are blocked from this
  sandbox, but `fonts.googleapis.com` and npm are allowed.** So `next/font/google` works,
  but product images and live Storefront API calls do not; use the mock
  (`npm run mock` + `npm run dev:mock`) for local verification.
- **2026-09-07: The real logo is a Shopify Files asset (`shop_images/`), not in the
  theme repo.** Jeff must export it from Shopify admin → Content → Files.
- **2026-09-06: bidetworld.com is down, serving a GoDaddy parking page.** Evidence:
  root URL returns a 114-byte HTML page that JS-redirects to `/lander`; `/lander` is
  the GoDaddy parking app (`img1.wsimg.com/parking-lander`, `_trfd ap:"parking"`);
  `sitemap.xml` lists only `/lander`; every Shopify path (`/products.json`,
  `/collections`, `/cart`, `/blogs/news`) returns the same redirect; DNS for both
  `bidetworld.com` and `www` resolves to `13.248.213.45` and `76.223.67.189`, which are
  GoDaddy parking IPs, not Shopify's `23.227.38.65`. Google still indexes the site as
  "Bidet World - Bidets & Toilet Lifts", so the outage is recent. Every automated
  blog and social post is currently sending traffic to a parking page.
  The store's real myshopify address is `b5c390-92.myshopify.com`. Its homepage
  redirects to bidetworld.com (the primary domain), but `/products.json` and
  `/collections.json` on the myshopify address answer directly, so product data can be
  pulled from this environment even while the domain is broken.
- **2026-09-06: Theme is Concept 5.1.0 by RoarTheme, a paid theme with compiled
  assets.** `theme.css` and `theme.js` are built files with no source, so styling
  changes go through settings and section JSON, not by editing those bundles. The
  theme JSON files start with a `/* ... */` comment block, so strip it before parsing
  with a JSON library.
- **2026-09-06: Klaviyo is not in the theme code at all** despite being in the
  automation stack. Do not assume signup forms exist. Verify in Shopify admin.
- **2026-09-06: Root cause confirmed by Jeff: the bidetworld.com domain expired at
  GoDaddy.** GoDaddy parked it, which is why the world saw the parking page while the
  Shopify store itself stayed live. Jeff is renewing. **Prevention:** turn on
  auto-renew for bidetworld.com at GoDaddy and put the renewal date in §13. After
  renewal, verify the A record is `23.227.38.65` and CNAME `www` is
  `shops.myshopify.com`, since GoDaddy sometimes resets DNS on expired domains.
- **2026-09-06: This environment cannot bypass its proxy.** Every outbound connection
  is transparently intercepted by an egress gateway that resolves hostnames itself
  (`CLAUDE_CODE_PROXY_RESOLVES_HOSTS=true`). `curl --noproxy` and `--resolve` look like
  they work but do not: the TLS cert issuer is "Anthropic Egress Gateway". A "direct to
  Shopify IP" test from here proves nothing. The policy also blocks
  `www.bidetworld.com`, `archive.org`, RDAP, and DNS-over-HTTPS. Headless Chromium
  needs proxy config to reach anything. Use `curl` for site checks and treat DNS
  results from here as one vantage point, not truth.
- **2026-09-06:** Repo was created with only a README. The live theme was never
  committed. Nothing about the theme can be assumed until it is pulled.

---

## 13. Known Gotchas

Things that will bite us if forgotten.

- **Storefront collection handles are not what the titles suggest.** Bidet Seats =
  `smart-bidet-seats`, Attachments = `non-electric-bidet-attachments`, Toilet lifts =
  `dignity-lifts`, Sprayers = `bidet-handhelds`, **Travel Bidets = `handheld-bidets`**,
  Toilets = `bidet-toilets`, All Bidets = `all-bidets-1`. They are hardcoded in
  `storefront/src/lib/config.ts` and `storefront/src/lib/quiz.ts`; update both if a
  collection is renamed in Shopify.
- **Vercel must be set to Root Directory `storefront`.** With the default root it will
  try to build the Liquid theme and fail.
- **Never commit `storefront/.env.local`.** The Storefront token is public-safe by
  design, but keep it out of git anyway; `storefront/.gitignore` already ignores `.env*`.
- Shopify Theme Editor writes directly to `config/settings_data.json` and
  `templates/*.json` on the live theme. If Jeff edits in the admin while we work in
  git, the two drift. Always `shopify theme pull` before starting theme-setting work.
- Renaming a section file breaks every JSON template that lists it by name.
- `{% render %}` cannot access variables from the calling template. Pass them in.
- Liquid `{% include %}` is deprecated. Use `{% render %}`.
- A JSON template with invalid JSON takes down that page type entirely. Validate
  with `shopify theme check` before pushing.
- **bidetworld.com is registered at GoDaddy (not Namecheap) and expired once
  (Sept 2026).** Auto-renew must be on. Renewal date: TODO, Jeff to confirm.
- **The "Take the quiz!" rich-text banner in `sections/header-group.json` shows on
  every page** because rich-text has no homepage-only setting. Only slideshow-hero
  has `only_homepage`. Moving or removing it changes every page.
- **Theme JSON files carry a leading `/* */` comment.** Strip it before `json.load`.
- **Jeff's PC: Windows PowerShell blocks npm and shopify by default** ("running
  scripts is disabled on this system"). One-time fix, run in PowerShell:
  `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` and answer Y.
- **Jeff's PC already has Shopify CLI installed** (`shopify.ps1` exists in
  `AppData\Roaming\npm`). Skip the npm install step.
- **Jeff's local clone lives at `C:\Users\jeffo\Bidetworld-theme`** and can be stale.
  Run `git fetch origin` before `git checkout <branch>` or the branch is "not found".
- **`shopify theme pull` requires `--store`.** It does not prompt. The store address
  is the part after `/store/` in the Shopify admin URL
  (`admin.shopify.com/store/NAME` means `NAME.myshopify.com`). Record it in §8 once
  Jeff shares it.
- **Quick health check for the live site** (run before any theme work):
  `curl -sI -A "Mozilla/5.0" https://bidetworld.com/ | grep -i shopify` should print
  Shopify headers. If it prints nothing and the body is a `/lander` redirect, the
  domain has fallen back to parking again.
