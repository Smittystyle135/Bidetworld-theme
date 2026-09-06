# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

It is a **living knowledge base**. Claude Code loads it automatically at the start of every session. Read it fully before touching code, and update it before ending a session (see "Session protocol").

## What this repo is

The Shopify storefront theme for **BidetWorld.com** (Shopify Basic plan). Owner: Jeff Smith. Direction is set by Jeff; execution is done here.

## Repo status (keep this current)

- **2026-09-06:** Repo is a placeholder. Only `README.md` exists. No theme code has been committed yet.
- **First real task:** pull the live theme from the Shopify store into this repo (see "Getting the theme into git"). Until that happens, everything under "Theme layout" and "Commands" describes standard Shopify theme conventions, not verified facts about this codebase. Verify and correct once code lands.

## Session protocol

1. **Start:** read this whole file. Check "Repo status", "Known gotchas", and "Open items" first.
2. **During:** cross-reference every change against the existing code before making it. Search for other uses of any section, snippet, setting, CSS class, or JS hook you touch. Do not fix one thing by breaking another.
3. **Build and debug together:** run Theme Check and a dev preview while building, not after. If a check cannot be run in this environment, say so explicitly in the final message.
4. **End:** append what was learned to "Lessons learned" (dated), update "Repo status" and "Open items", and commit `CLAUDE.md` with the code change it belongs to.

## Working rules

- Careful and methodical over fast. Small, reviewable commits. One concern per commit.
- Never edit `config/settings_data.json` by hand unless the task is specifically about it. It is written by the Shopify Theme Editor and hand edits get clobbered or clobber merchant settings.
- Never hand-edit generated or minified assets. Change the source and rebuild.
- UI work uses proper front-end design discipline: consistent spacing scale, typography, color tokens from `config/settings_schema.json`, responsive at mobile first, accessible (labels, focus states, contrast). Keep the store's existing look unless asked to change it.
- Liquid changes must keep the Theme Editor working: every new section needs a valid `{% schema %}` block, and settings referenced in Liquid must exist in the schema.
- Do not add third-party scripts to `layout/theme.liquid` without a note in "Integrations" below.

## Getting the theme into git

Shopify CLI is **not** installed in the remote environment. Node 22 and npm are.

```bash
npm install -g @shopify/cli @shopify/theme   # one time
shopify theme pull --store bidetworld.myshopify.com   # confirm the exact .myshopify.com handle first
```

`shopify theme pull` writes the live theme's files into the working directory. Commit the result as the baseline before making any changes.

## Commands (standard Shopify CLI, verify after theme lands)

```bash
shopify theme dev --store <store>.myshopify.com   # local preview with hot reload
shopify theme check                               # Theme Check linter (Liquid, JSON, a11y, performance)
shopify theme check -o json                       # machine-readable output
shopify theme push --unpublished --theme "<name>" # push to a new unpublished theme for review
shopify theme push --development                  # push to the dev theme only
shopify theme list                                # see theme IDs and which one is live
```

Rules for pushing:

- Never `shopify theme push` to the **live** theme directly. Push to an unpublished or development theme, preview it, then publish from the Shopify admin.
- Never push `config/settings_data.json` from git over the live store without an explicit decision. Use `--nodelete` and `--ignore config/settings_data.json` when in doubt.

There is no test runner. Theme Check plus a real preview is the verification step.

## Theme layout (standard Shopify structure)

```
layout/      theme.liquid wraps every page; password.liquid for the locked storefront
templates/   one JSON (or .liquid) file per page type: index, product, collection, blog, article, cart, page.*
sections/    reusable blocks with {% schema %}; templates/*.json reference these by type
snippets/    partials rendered with {% render %}; no schema, take explicit parameters
assets/      CSS, JS, images, fonts; referenced with {{ 'file' | asset_url }}
config/      settings_schema.json (theme settings UI) and settings_data.json (saved values)
locales/     translation strings; en.default.json is the source of truth
```

How pages get built: a `templates/*.json` file lists sections by type and order, each section is a file in `sections/`, sections render snippets. To change what a page shows, start from the template JSON, not from `layout/theme.liquid`.

## Integrations that touch the theme

Recorded here so theme changes do not silently break the automation stack that runs the business.

- **Klaviyo** (email). Expect a Klaviyo onsite script and signup form embeds. Do not remove unknown `klaviyo` or `_learnq` references. Confirm before changing any form that could be a Klaviyo list signup.
- **Blog automation** (Zapier + OpenAI, one post per day at 6am, DALL-E images). The blog and article templates get heavy automated use. Keep `templates/blog.json` and `templates/article.json` robust to long titles, missing excerpts, and large generated images (constrain image width, use responsive `image_url` sizes, and always output alt text).
- **Social posting** (Buffer to Facebook and TikTok, 9am / 11am / 4pm) links back to product and blog URLs. Do not change URL handles or rename collections without checking what the automations link to.

## Known gotchas

- **2026-09-06: bidetworld.com is unreachable from the remote Claude Code environment.** The network egress proxy returns 403 for the domain, so the live site cannot be fetched or screenshotted from here. Fix options: allow `bidetworld.com` (and `*.myshopify.com`, `cdn.shopify.com`) in the environment's network policy at claude.ai/code, or run Claude Code locally on Jeff's PC where the network is open. Until then, the only way to see the theme is to get its code into this repo.

## Open items

- [ ] Pull the live theme into this repo and commit it as the baseline.
- [ ] Confirm the store's `.myshopify.com` handle and which theme ID is live.
- [ ] Identify the base theme (Dawn, another Shopify theme, or a paid theme) and its version, and record it here. This determines how updates are applied.
- [ ] Record which apps inject code into the theme (Klaviyo and any others) once the code is visible.

## Lessons learned

Append-only. Newest at the bottom. Date each entry.

- **2026-09-06:** Repo created empty. Remote Claude Code environment has Node 22 and Ruby but no Shopify CLI, and cannot reach bidetworld.com (see "Known gotchas"). Jeff's standing instructions for all work here: careful and methodical, cross-reference the codebase before every change, debug during the build, no collateral breakage, use real front-end design skills for UI.
