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
| Build step | None expected. Shopify themes ship raw Liquid, CSS, and JS. |

### Current state (2026-09-06)

The repo contains only `README.md` and this file. **The theme code has not been
pushed yet.** Nothing about the live theme's sections, settings, or styling has been
verified. Do not assume anything about the theme until the code is in the repo.

**First real task:** get the live theme into git (see §9).

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
shopify theme pull --store bidetworld.myshopify.com

# Local preview with hot reload (does not touch the live theme)
shopify theme dev --store bidetworld.myshopify.com

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

### Definition of done for any change

1. `shopify theme check` passes with no new errors.
2. Affected page rendered and looked at (desktop and mobile width).
3. Every file that references the changed code was reviewed.
4. §12 or §13 updated if anything was learned.
5. Committed and pushed.

---

## 6. Frontend Design Standards (BidetWorld)

Brand palette, fonts, and spacing scale are **unknown until the theme is pulled**.
Record them in §8 the moment they are confirmed. Until then, these rules stand:

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
| Base theme (Dawn? other?) | unknown | |
| Theme version | unknown | |
| Primary brand color | unknown | |
| Heading font / body font | unknown | |
| Installed apps injecting code | unknown | |
| Klaviyo integration method | unknown | |
| Review app | unknown | |
| Custom sections already built | unknown | |

---

## 9. Current Focus

**Last session (2026-09-06):** Created this CLAUDE.md knowledge base. Audit of
bidetworld.com from this environment showed a GoDaddy parking page, but Jeff says the
site is live for him. See §12. Jeff's new goal: **clone the Shopify store into a custom
headless storefront** (Next.js on Vercel, Shopify Storefront API for commerce, Supabase
for content and extras, GitHub for code).

**Next task:** Get the store data into this repo so cloning can start. Jeff needs to:
1. Run `shopify theme pull` on his computer and push the theme to this repo.
2. Send the store's `*.myshopify.com` address.
3. Create a read-only Storefront API token and store it as a Vercel env var.
4. Export products CSV into `data/`.
5. Create Vercel and Supabase projects and connect Vercel to this repo.

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

**Then:** Get the live theme into this repo.

Step-by-step for Jeff:
1. On your computer, open a terminal in the `Bidetworld-theme` folder.
2. Run `npm install -g @shopify/cli` (one time only).
3. Run `shopify theme pull --store bidetworld.myshopify.com` and log in when asked.
4. Run `git add -A && git commit -m "theme: initial pull of live theme" && git push`.
5. Tell Claude "theme is pushed" and we fill in §8 together.

**After that:** audit the product page and homepage for conversion and SEO wins,
ranked by revenue impact.

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

---

## 12. Lessons Learned Log

Add a dated entry every time something surprises us, breaks, or turns out to work
differently than expected. Newest first.

- **2026-09-06: bidetworld.com is down, serving a GoDaddy parking page.** Evidence:
  root URL returns a 114-byte HTML page that JS-redirects to `/lander`; `/lander` is
  the GoDaddy parking app (`img1.wsimg.com/parking-lander`, `_trfd ap:"parking"`);
  `sitemap.xml` lists only `/lander`; every Shopify path (`/products.json`,
  `/collections`, `/cart`, `/blogs/news`) returns the same redirect; DNS for both
  `bidetworld.com` and `www` resolves to `13.248.213.45` and `76.223.67.189`, which are
  GoDaddy parking IPs, not Shopify's `23.227.38.65`. Google still indexes the site as
  "Bidet World - Bidets & Toilet Lifts", so the outage is recent. Every automated
  blog and social post is currently sending traffic to a parking page.
  `bidetworld.myshopify.com` returns 404, so the store's myshopify handle is something
  else. Jeff needs to supply it.
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
