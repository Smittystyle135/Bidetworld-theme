const steps = [
  {
    title: "Create a Storefront API token in Shopify",
    body: "Shopify admin → Settings → Apps and sales channels → Develop apps → Create app (name it “Headless storefront”) → Configure Storefront API scopes → enable unauthenticated_read_product_listings, unauthenticated_read_content, unauthenticated_read_checkouts, unauthenticated_write_checkouts, unauthenticated_write_customers → Install app → copy the Storefront API access token.",
  },
  {
    title: "Add the environment variables",
    body: "Locally: copy .env.example to .env.local and fill it in. On Vercel: Project → Settings → Environment Variables.",
  },
  {
    title: "Restart",
    body: "Restart the dev server (or redeploy) and this page becomes your storefront.",
  },
];

export function SetupRequired() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Bidet World storefront</p>
      <h1 className="mt-3 text-4xl font-bold">Connect your Shopify store</h1>
      <p className="mt-4 text-neutral-600">
        The site is built, but it can&apos;t load products until it knows which Shopify store to talk to. Three steps:
      </p>
      <ol className="mt-8 space-y-6">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">{i + 1}</span>
            <div>
              <h2 className="font-semibold">{s.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <pre className="mt-8 overflow-x-auto rounded-2xl bg-ink p-5 text-sm text-neutral-100">
        {`SHOPIFY_STORE_DOMAIN=b5c390-92.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=paste-token-here
NEXT_PUBLIC_SITE_URL=https://www.bidetworld.com`}
      </pre>
    </main>
  );
}
