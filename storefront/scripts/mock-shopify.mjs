// Local stand-in for the Shopify Storefront API, driven by ../data/products.json and
// ../data/collections.json (refresh those with the curl commands in the root CLAUDE.md).
// Run: npm run mock   (then, in another terminal) npm run dev:mock
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.MOCK_PORT ?? 4000);
const BASE = `http://localhost:${PORT}`;
const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "../../data");

const rawProducts = JSON.parse(readFileSync(path.join(dataDir, "products.json"), "utf8")).products;
const rawCollections = JSON.parse(readFileSync(path.join(dataDir, "collections.json"), "utf8")).collections;

const money = (amount) => ({ amount: Number(amount || 0).toFixed(2), currencyCode: "USD" });
const placeholder = (label, w = 800, h = 800) => ({
  url: `${BASE}/img/${encodeURIComponent(label.slice(0, 40))}.svg`,
  altText: label,
  width: w,
  height: h,
});
const stripHtml = (s) => (s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function toVariant(p, v) {
  const selectedOptions = p.options
    .map((o, i) => ({ name: o.name, value: v[`option${i + 1}`] }))
    .filter((o) => o.value != null);
  return {
    id: `gid://shopify/ProductVariant/${v.id}`,
    title: v.title,
    availableForSale: v.available !== false,
    selectedOptions,
    price: money(v.price),
    compareAtPrice: v.compare_at_price && Number(v.compare_at_price) > Number(v.price) ? money(v.compare_at_price) : null,
    image: placeholder(`${p.title} – ${v.title}`),
  };
}

function toCard(p) {
  const prices = p.variants.map((v) => Number(v.price));
  const compare = p.variants.map((v) => Number(v.compare_at_price || 0));
  return {
    id: `gid://shopify/Product/${p.id}`,
    handle: p.handle,
    title: p.title,
    vendor: p.vendor,
    availableForSale: p.variants.some((v) => v.available !== false),
    featuredImage: placeholder(p.title),
    priceRange: { minVariantPrice: money(Math.min(...prices)), maxVariantPrice: money(Math.max(...prices)) },
    compareAtPriceRange: { minVariantPrice: money(Math.min(...compare)), maxVariantPrice: money(Math.max(...compare)) },
  };
}

function toProduct(p) {
  return {
    ...toCard(p),
    description: stripHtml(p.body_html).slice(0, 400),
    descriptionHtml: p.body_html || "",
    tags: p.tags || [],
    options: p.options.map((o) => ({ name: o.name, optionValues: o.values.map((name) => ({ name })) })),
    images: { nodes: (p.images.length ? p.images : [null]).map((im, i) => placeholder(`${p.title} ${i + 1}`)) },
    variants: { nodes: p.variants.map((v) => toVariant(p, v)) },
    seo: { title: null, description: null },
  };
}

// Real membership is defined in Shopify admin; this approximates it from product_type + tags + title.
const hay = (p) => [p.product_type, ...(p.tags || []), p.title, p.vendor].join(" ");
const membership = {
  "smart-bidet-seats": (p) => /Nova|Saniwise|Galaxy|Clean Sense|Blooming|Cascade|Aura/.test(hay(p)),
  "non-electric-bidet-attachments": (p) => /Bidet Attachments/.test(hay(p)) || (p.vendor === "TUSHY" && !/Aura/.test(p.title)),
  "bidet-toilets": (p) => (p.tags || []).includes("Bidets"),
  "dignity-lifts": (p) => /Assisted Lifts/.test(hay(p)),
  "bidet-handhelds": (p) => /Bidet Sprayers/.test(hay(p)),
  "handheld-bidets": (p) => /Travel Bidets/.test(hay(p)),
  "handheld-bidets-1": (p) => /Bidet Sprayers|Travel Bidets/.test(hay(p)),
  accessories: (p) => /Accessories/.test(hay(p)),
  "all-bidets-1": (p) => !/Accessories|Assisted Lifts/.test(hay(p)),
  "all-bidets": () => true,
  "assisted-bidet": (p) => /WL1/.test(p.title),
  "blooming-clean-sense": (p) => /Blooming|Clean Sense/.test(hay(p)),
};
function collectionProducts(handle) {
  const test = membership[handle] ?? ((p) => new RegExp(handle.split("-")[0], "i").test(hay(p)));
  return rawProducts.filter(test);
}
function toCollection(c) {
  return {
    id: `gid://shopify/Collection/${c.id}`,
    handle: c.handle,
    title: c.title,
    description: stripHtml(c.description),
    descriptionHtml: c.description || "",
    image: c.image ? placeholder(c.title, 1200, 900) : null,
  };
}

function sortProducts(list, sortKey, reverse) {
  const out = [...list];
  if (sortKey === "PRICE") out.sort((a, b) => Math.min(...a.variants.map((v) => +v.price)) - Math.min(...b.variants.map((v) => +v.price)));
  else if (sortKey === "TITLE") out.sort((a, b) => a.title.localeCompare(b.title));
  else if (sortKey === "CREATED") out.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  return reverse ? out.reverse() : out;
}

const abs = (p) => `https://bidetworld.com${p}`;
const menu = {
  items: [
    {
      title: "Bidets",
      url: abs("/collections/all-bidets-1"),
      items: ["smart-bidet-seats", "non-electric-bidet-attachments", "bidet-toilets", "bidet-handhelds", "handheld-bidets"].map((h) => {
        const c = rawCollections.find((x) => x.handle === h);
        return { title: c?.title ?? h, url: abs(`/collections/${h}`), items: [] };
      }),
    },
    {
      title: "Assisted Toilet Lifts",
      url: abs("/collections/dignity-lifts"),
      items: rawProducts.filter((p) => p.product_type === "Assisted Lifts").map((p) => ({ title: p.title.replace("Dignity Lifts ", ""), url: abs(`/products/${p.handle}`), items: [] })),
    },
    { title: "Accessories", url: abs("/collections/accessories"), items: [] },
    { title: "Sales", url: abs("/pages/sales-offers"), items: [] },
    { title: "Support", url: abs("/pages/support"), items: [] },
    { title: "About", url: abs("/pages/about-us"), items: [] },
    { title: "Bidet Quiz", url: abs("/pages/bidet-quiz"), items: [] },
  ],
};

const pages = {
  support: { title: "Support", body: "<h2>We're here to help</h2><p>Call <a href='tel:+12698734157'>269-873-4157</a> or email <a href='mailto:support@bidetworld.com'>support@bidetworld.com</a>.</p><h3>Shipping</h3><p>Free shipping on orders over $100.</p><h3>Returns</h3><p>30-day returns on unused products.</p>" },
  "about-us": { title: "About Us", body: "<p>At Bidet World, we're redefining bathroom comfort and hygiene. Our carefully selected range of bidet solutions – from simple attachments to luxurious smart seats – brings modern convenience, cleanliness, and eco-friendly living straight to your home.</p>" },
  "sales-offers": { title: "Sales & Offers", body: "<p>Up to 15% off select brands. New customers save 10% with code <strong>NEWCUSTOMER</strong>.</p>" },
  brands: { title: "Brands", body: "<ul><li>Nova</li><li>Blooming</li><li>Clean Sense</li><li>Cascade</li><li>Galaxy</li><li>TUSHY</li><li>Dignity Lifts</li></ul>" },
};

const articles = [
  "How Muscles of Habit Change: Switching to a Bidet",
  "Bidet Seat vs Attachment: Which Is Right for You?",
  "Do Bidets Really Save Money? A 12-Month Breakdown",
  "Installing a Bidet Attachment in 15 Minutes",
  "Toilet Lifts Explained: Independence at Home",
].map((title, i) => ({
  id: `gid://shopify/Article/${i + 1}`,
  handle: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  title,
  excerpt: "A quick, practical guide from the Bidet World team.",
  publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
  tags: ["Guides"],
  image: placeholder(title, 1200, 800),
  authorV2: { name: "Bidet World" },
  contentHtml: `<p>${title}. This is mock article content so the blog templates can be developed without the live store.</p><h2>Key takeaways</h2><ul><li>Water cleans better than paper.</li><li>Most attachments install in minutes.</li><li>Take the quiz to find your fit.</li></ul>`,
  seo: { title: null, description: null },
}));

// ---- cart ----
const carts = new Map();
const variantIndex = new Map();
for (const p of rawProducts) for (const v of p.variants) variantIndex.set(`gid://shopify/ProductVariant/${v.id}`, { p, v });

function cartView(cart) {
  const lines = cart.lines.map((l) => {
    const { p, v } = variantIndex.get(l.merchandiseId);
    const variant = toVariant(p, v);
    return {
      id: l.id,
      quantity: l.quantity,
      cost: { totalAmount: money(Number(v.price) * l.quantity) },
      merchandise: { ...variant, product: { title: p.title, handle: p.handle } },
    };
  });
  const subtotal = lines.reduce((s, l) => s + Number(l.cost.totalAmount.amount), 0);
  return {
    id: cart.id,
    checkoutUrl: `${BASE}/checkout/${encodeURIComponent(cart.id)}`,
    totalQuantity: lines.reduce((s, l) => s + l.quantity, 0),
    cost: { subtotalAmount: money(subtotal), totalAmount: money(subtotal), totalTaxAmount: null },
    lines: { nodes: lines },
  };
}
function addLines(cart, lines) {
  for (const { merchandiseId, quantity } of lines) {
    if (!variantIndex.has(merchandiseId)) throw new Error(`Unknown variant ${merchandiseId}`);
    const existing = cart.lines.find((l) => l.merchandiseId === merchandiseId);
    if (existing) existing.quantity += quantity;
    else cart.lines.push({ id: `gid://shopify/CartLine/${Math.random().toString(36).slice(2)}`, merchandiseId, quantity });
  }
}

function resolve(opName, vars) {
  switch (opName) {
    case "Menu":
      return { menu };
    case "Collections":
      return { collections: { nodes: rawCollections.map(toCollection) } };
    case "Collection": {
      const c = rawCollections.find((x) => x.handle === vars.handle);
      if (!c) return { collection: null };
      return { collection: { ...toCollection(c), products: { nodes: sortProducts(collectionProducts(c.handle), vars.sortKey, vars.reverse).map(toCard) } } };
    }
    case "Products": {
      let list = rawProducts;
      if (vars.query) {
        const q = vars.query.replace(/\*/g, "").toLowerCase().trim();
        list = list.filter((p) => `${p.title} ${p.vendor} ${p.product_type} ${(p.tags || []).join(" ")}`.toLowerCase().includes(q));
      }
      return { products: { nodes: sortProducts(list, vars.sortKey, vars.reverse).slice(0, vars.first ?? 24).map(toCard) } };
    }
    case "Product": {
      const p = rawProducts.find((x) => x.handle === vars.handle);
      return { product: p ? toProduct(p) : null };
    }
    case "ProductRecommendations": {
      const p = rawProducts.find((x) => `gid://shopify/Product/${x.id}` === vars.productId);
      const same = rawProducts.filter((x) => x !== p && x.product_type === p?.product_type);
      const rest = rawProducts.filter((x) => x !== p && !same.includes(x));
      return { productRecommendations: [...same, ...rest].slice(0, 4).map(toCard) };
    }
    case "Page": {
      const pg = pages[vars.handle];
      return { page: pg ? { ...pg, handle: vars.handle, seo: { title: null, description: null } } : null };
    }
    case "Blog":
      return vars.handle === "news" ? { blog: { title: "News", handle: "news", articles: { nodes: articles.slice(0, vars.first ?? 24) } } } : { blog: null };
    case "Article": {
      const a = articles.find((x) => x.handle === vars.handle);
      return { blog: vars.blog === "news" ? { title: "News", handle: "news", articleByHandle: a ?? null } : null };
    }
    case "AllHandles":
      return {
        products: { nodes: rawProducts.map((p) => ({ handle: p.handle, updatedAt: p.updated_at })) },
        collections: { nodes: rawCollections.map((c) => ({ handle: c.handle, updatedAt: c.updated_at })) },
        blog: { articles: { nodes: articles.map((a) => ({ handle: a.handle, publishedAt: a.publishedAt })) } },
      };
    case "Cart": {
      const cart = carts.get(vars.id);
      return { cart: cart ? cartView(cart) : null };
    }
    case "CartCreate": {
      const cart = { id: `gid://shopify/Cart/${Math.random().toString(36).slice(2)}`, lines: [] };
      addLines(cart, vars.lines ?? []);
      carts.set(cart.id, cart);
      return { cartCreate: { cart: cartView(cart), userErrors: [] } };
    }
    case "CartLinesAdd": {
      const cart = carts.get(vars.cartId);
      if (!cart) return { cartLinesAdd: { cart: null, userErrors: [{ message: "Cart not found" }] } };
      addLines(cart, vars.lines);
      return { cartLinesAdd: { cart: cartView(cart), userErrors: [] } };
    }
    case "CartLinesUpdate": {
      const cart = carts.get(vars.cartId);
      if (!cart) return { cartLinesUpdate: { cart: null, userErrors: [{ message: "Cart not found" }] } };
      for (const { id, quantity } of vars.lines) {
        const line = cart.lines.find((l) => l.id === id);
        if (line) line.quantity = quantity;
      }
      cart.lines = cart.lines.filter((l) => l.quantity > 0);
      return { cartLinesUpdate: { cart: cartView(cart), userErrors: [] } };
    }
    case "CartLinesRemove": {
      const cart = carts.get(vars.cartId);
      if (!cart) return { cartLinesRemove: { cart: null, userErrors: [{ message: "Cart not found" }] } };
      cart.lines = cart.lines.filter((l) => !vars.lineIds.includes(l.id));
      return { cartLinesRemove: { cart: cartView(cart), userErrors: [] } };
    }
    case "NewsletterSignup": {
      const taken = /taken/i.test(vars.input?.email ?? "");
      return { customerCreate: { customer: taken ? null : { id: "gid://shopify/Customer/1" }, customerUserErrors: taken ? [{ code: "TAKEN", message: "Email has already been taken" }] : [] } };
    }
    default:
      throw new Error(`Mock does not implement operation "${opName}"`);
  }
}

function svgPlaceholder(label) {
  const safe = label.replace(/[<>&"]/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e7f7f5"/><stop offset="1" stop-color="#ffe9d6"/></linearGradient></defs>
<rect width="800" height="800" fill="url(#g)"/>
<ellipse cx="400" cy="430" rx="230" ry="150" fill="#fff" stroke="#c9d3d9" stroke-width="10"/>
<ellipse cx="400" cy="430" rx="150" ry="95" fill="#f2f6f8" stroke="#c9d3d9" stroke-width="8"/>
<rect x="290" y="200" width="220" height="130" rx="40" fill="#fff" stroke="#c9d3d9" stroke-width="10"/>
<text x="400" y="700" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="30" fill="#5b6770">${safe}</text>
</svg>`;
}

createServer((req, res) => {
  const url = new URL(req.url, BASE);
  if (req.method === "GET" && url.pathname.startsWith("/img/")) {
    res.writeHead(200, { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600" });
    res.end(svgPlaceholder(decodeURIComponent(url.pathname.slice(5).replace(/\.svg$/, ""))));
    return;
  }
  if (req.method === "GET" && url.pathname.startsWith("/checkout/")) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<h1>Mock checkout</h1><p>In production this is Shopify's hosted checkout for cart ${url.pathname.slice(10)}.</p>`);
    return;
  }
  if (req.method !== "POST" || url.pathname !== "/graphql") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  let body = "";
  req.on("data", (d) => (body += d));
  req.on("end", () => {
    try {
      const { query, variables = {} } = JSON.parse(body);
      const opName = /(?:query|mutation)\s+(\w+)/.exec(query)?.[1];
      const data = resolve(opName, variables);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ data }));
    } catch (e) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ errors: [{ message: e.message }] }));
    }
  });
}).listen(PORT, () => console.log(`Mock Shopify Storefront API on ${BASE}/graphql (${rawProducts.length} products, ${rawCollections.length} collections)`));
