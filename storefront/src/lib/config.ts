export const site = {
  name: "Bidet World",
  tagline: "Find your perfect bidet.",
  description:
    "Bidet seats, attachments, smart bidet toilets, handheld sprayers, travel bidets and Dignity Lifts assisted toilet lifts. Take the 60-second Bidet Quiz to find the right fit for your bathroom.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "269-873-4157",
  phoneHref: "tel:+12698734157",
  email: "support@bidetworld.com",
  newCustomerCode: "NEWCUSTOMER",
  newCustomerDiscount: "10% off",
  newCustomerExclusion: "Does not apply to Dignity Lift products",
};

export const announcements: { icon: "truck" | "gift" | "mail"; text: string; href: string }[] = [
  { icon: "truck", text: "Free shipping and returns", href: "/pages/support" },
  { icon: "gift", text: "Up to 15% off select brands", href: "/pages/sales-offers" },
  { icon: "mail", text: "A question? Visit our contact page", href: "/pages/support" },
];

// Set url to "" to hide an icon.
export const socialLinks: { name: "facebook" | "x" | "instagram" | "youtube" | "tiktok" | "snapchat"; url: string }[] = [
  { name: "facebook", url: "" },
  { name: "x", url: "" },
  { name: "instagram", url: "" },
  { name: "youtube", url: "" },
  { name: "tiktok", url: "" },
  { name: "snapchat", url: "" },
];

// Used when the Shopify "main-menu" can't be loaded.
export const fallbackNav = [
  { title: "Bidets", url: "/collections/all-bidets-1" },
  { title: "Assisted Toilet Lifts", url: "/collections/dignity-lifts" },
  { title: "Accessories", url: "/collections/accessories" },
  { title: "Sales", url: "/pages/sales-offers" },
  { title: "Support", url: "/pages/support" },
  { title: "About", url: "/pages/about-us" },
  { title: "Bidet Quiz", url: "/quiz" },
];

export const footerNav = {
  Shop: [
    { title: "All Bidets", url: "/collections/all-bidets-1" },
    { title: "Bidet Seats", url: "/collections/smart-bidet-seats" },
    { title: "Bidet Attachments", url: "/collections/non-electric-bidet-attachments" },
    { title: "Bidet Toilets", url: "/collections/bidet-toilets" },
    { title: "Handheld Sprayers", url: "/collections/bidet-handhelds" },
    { title: "Travel Bidets", url: "/collections/handheld-bidets" },
    { title: "Assisted Toilet Lifts", url: "/collections/dignity-lifts" },
    { title: "Accessories", url: "/collections/accessories" },
  ],
  Help: [
    { title: "Bidet Quiz", url: "/quiz" },
    { title: "Support", url: "/pages/support" },
    { title: "Sales & Offers", url: "/pages/sales-offers" },
    { title: "Brands", url: "/pages/brands" },
    { title: "Shipping Policy", url: "/pages/shipping-policy" },
    { title: "Refund Policy", url: "/pages/refund-policy" },
  ],
  Company: [
    { title: "About Us", url: "/pages/about-us" },
    { title: "Privacy Policy", url: "/pages/privacy-policy" },
    { title: "Terms of Service", url: "/pages/terms-of-service" },
  ],
};

export const trustPoints = [
  { icon: "wallet", heading: "100% Price Match", text: "We'll match any advertised price. Shop with confidence." },
  { icon: "box", heading: "Fast Free Shipping", text: "Free shipping on orders of $100 or more." },
  { icon: "support", heading: "Real Customer Service", text: "Fast, reliable support for every purchase." },
  { icon: "shield", heading: "Secure Payment", text: "Your payment information is processed securely by Shopify." },
] as const;

// Home page category tiles. Handles match the live Shopify collections.
export const homeCategories = [
  { title: "Bidet Seats", handle: "smart-bidet-seats", blurb: "Easy install with heated seats, warm water and remotes." },
  { title: "Bidet Attachments", handle: "non-electric-bidet-attachments", blurb: "Non-electric, budget friendly, fits your toilet." },
  { title: "Bidet Toilets", handle: "bidet-toilets", blurb: "Standalone smart toilets with the bidet built in." },
  { title: "Handheld Sprayers", handle: "bidet-handhelds", blurb: "Multipurpose sprayers, simple to add." },
  { title: "Travel Bidets", handle: "handheld-bidets", blurb: "Easy to use on the go." },
  { title: "Assisted Toilet Lifts", handle: "dignity-lifts", blurb: "Electric-assisted lifts for safer toileting." },
  { title: "Accessories", handle: "accessories", blurb: "Filters, valves and bidet essentials." },
];

export const heroSlides = [
  {
    eyebrow: "Bidet World",
    heading: "Precision clean at your fingertips",
    text: "Bidet seats, attachments and smart toilets for every bathroom and budget. Not sure where to start? Our 60-second quiz will point you to the right one.",
    cta: { label: "Take the Bidet Quiz", href: "/quiz" },
    secondary: { label: "Shop all bidets", href: "/collections/all-bidets-1" },
  },
  {
    eyebrow: "Bidet Toilets",
    heading: "All-in-one comfort",
    text: "Elevate your bathroom with a smart toilet that has the bidet, heated seat and dryer built right in.",
    cta: { label: "Shop Bidet Toilets", href: "/collections/bidet-toilets" },
    secondary: { label: "Take the quiz", href: "/quiz" },
  },
  {
    eyebrow: "Dignity Lifts",
    heading: "Safer, independent toileting",
    text: "Electric-assisted toilet lifts that help you sit and stand with confidence, with an integrated bidet option.",
    cta: { label: "Shop Assisted Toilet Lifts", href: "/collections/dignity-lifts" },
    secondary: { label: "Talk to us", href: "/pages/support" },
  },
];

export const brandLogos = ["Nova", "Blooming", "Clean Sense", "Cascade", "Galaxy", "TUSHY", "Dignity Lifts", "Olympia", "Saniwise"];
