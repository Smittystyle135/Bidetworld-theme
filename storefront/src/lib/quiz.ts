export type QuizOption = { id: string; label: string; description?: string };
export type QuizQuestion = {
  id: "who" | "setup" | "power" | "features" | "budget";
  title: string;
  subtitle?: string;
  multi?: boolean;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "who",
    title: "Who is this bidet for?",
    options: [
      { id: "me", label: "Me or my family", description: "Everyday use at home" },
      { id: "mobility", label: "Someone with limited mobility", description: "Help sitting down and standing up safely" },
      { id: "travel", label: "Travel and on the go", description: "Portable, nothing to install" },
    ],
  },
  {
    id: "setup",
    title: "What's your bathroom setup?",
    options: [
      { id: "keep", label: "Keep my current toilet", description: "Add a seat or attachment to it" },
      { id: "replace", label: "Replace the whole toilet", description: "All-in-one smart bidet toilet" },
      { id: "unsure", label: "Not sure yet", description: "Show me what fits" },
    ],
  },
  {
    id: "power",
    title: "Is there a power outlet within reach of your toilet?",
    subtitle: "Electric bidets need one for warm water, heated seats and dryers. Non-electric ones don't.",
    options: [
      { id: "yes", label: "Yes, there's an outlet nearby" },
      { id: "no", label: "No outlet nearby" },
      { id: "can-add", label: "No, but I could add one" },
    ],
  },
  {
    id: "features",
    title: "What matters most to you?",
    subtitle: "Pick everything that applies.",
    multi: true,
    options: [
      { id: "warm-water", label: "Warm water wash" },
      { id: "heated-seat", label: "Heated seat" },
      { id: "dryer", label: "Warm air dryer" },
      { id: "remote", label: "Remote control" },
      { id: "simple", label: "Simple 15-minute install" },
      { id: "lowest-price", label: "Lowest price" },
    ],
  },
  {
    id: "budget",
    title: "What's your budget?",
    options: [
      { id: "under-100", label: "Under $100" },
      { id: "100-500", label: "$100 – $500" },
      { id: "500-1000", label: "$500 – $1,000" },
      { id: "1000-plus", label: "$1,000 and up" },
    ],
  },
];

export type QuizAnswers = Partial<Record<QuizQuestion["id"], string[]>>;

export type Recommendation = {
  key: string;
  title: string;
  reason: string;
  collectionHandle: string;
  collectionTitle: string;
  tips: string[];
  minPrice?: number;
  maxPrice?: number;
  alsoConsider?: { title: string; href: string; why: string };
};

const budgetRanges: Record<string, { minPrice?: number; maxPrice?: number }> = {
  "under-100": { maxPrice: 100 },
  "100-500": { minPrice: 100, maxPrice: 500 },
  "500-1000": { minPrice: 500, maxPrice: 1000 },
  "1000-plus": { minPrice: 1000 },
};

const ELECTRIC_FEATURES = new Set(["warm-water", "heated-seat", "dryer", "remote"]);

export function recommend(answers: QuizAnswers): Recommendation {
  const who = answers.who?.[0];
  const setup = answers.setup?.[0];
  const power = answers.power?.[0];
  const features = new Set(answers.features ?? []);
  const budget = answers.budget?.[0] ?? "";
  const range = budgetRanges[budget] ?? {};

  const wantsElectric = [...features].some((f) => ELECTRIC_FEATURES.has(f));
  const hasPower = power === "yes" || power === "can-add";

  if (who === "travel") {
    return {
      key: "travel",
      title: "A travel bidet",
      reason: "You want clean on the go, so a portable bidet with nothing to install is the right fit.",
      collectionHandle: "handheld-bidets",
      collectionTitle: "Travel Bidets",
      tips: ["Fill with warm tap water for a comfortable wash anywhere.", "Rechargeable models give steadier pressure than squeeze bottles."],
      ...range,
    };
  }

  if (who === "mobility") {
    return {
      key: "mobility",
      title: "An assisted toilet lift",
      reason: "Dignity Lifts raise and lower the whole seat so sitting down and standing up is safe and independent — no grab bars or lifting help needed.",
      collectionHandle: "dignity-lifts",
      collectionTitle: "Assisted Toilet Lifts",
      tips: [
        "The WL1 model has an integrated bidet, so you get washing and lifting in one unit.",
        "Measure the space beside your toilet before ordering; lifts need a standard outlet.",
        `Call us at 269-873-4157 for help choosing a lift — we'll walk you through it.`,
      ],
      alsoConsider: {
        title: "Bidet Toilets",
        href: "/collections/bidet-toilets",
        why: "If lifting isn't needed, a smart toilet with auto-open lid and hands-free washing also reduces bending and reaching.",
      },
    };
  }

  if (setup === "replace") {
    return {
      key: "toilet",
      title: "A smart bidet toilet",
      reason: "You're replacing the toilet anyway, so an all-in-one smart toilet gives you the cleanest look and the most features — heated seat, warm water, dryer and auto flush built in.",
      collectionHandle: "bidet-toilets",
      collectionTitle: "Bidet Toilets",
      tips: ["Confirm you have a GFCI outlet within reach of the toilet.", "Check your rough-in distance (usually 12\") before ordering."],
      ...range,
      alsoConsider: {
        title: "Bidet Seats",
        href: "/collections/smart-bidet-seats",
        why: "Same comfort features on your existing toilet, at a fraction of the cost and no plumber.",
      },
    };
  }

  if (!hasPower) {
    return {
      key: "attachment-no-power",
      title: "A non-electric bidet attachment",
      reason: wantsElectric
        ? "Without an outlet, electric features like heated seats aren't an option yet — but a non-electric attachment gives you a great wash today, and you can upgrade later."
        : "No outlet needed: a non-electric attachment slips under your existing seat and installs in about 15 minutes.",
      collectionHandle: "non-electric-bidet-attachments",
      collectionTitle: "Bidet Attachments",
      tips: [
        "Some attachments connect to your sink's hot line for warm water — no electricity required.",
        "Attachments fit almost any standard two-piece toilet.",
        ...(wantsElectric ? ["Want heated seats later? An electrician can add a GFCI outlet, then a bidet seat drops right in."] : []),
      ],
      ...range,
      alsoConsider: {
        title: "Handheld Sprayers",
        href: "/collections/bidet-handhelds",
        why: "The simplest option: a sprayer beside the toilet that doubles for cleaning and cloth diapers.",
      },
    };
  }

  const lowBudget = budget === "under-100";
  if (lowBudget || (features.has("lowest-price") && !wantsElectric)) {
    return {
      key: "attachment-budget",
      title: "A bidet attachment",
      reason: "You'll get the biggest hygiene upgrade for the least money with a non-electric attachment — most are well under $100 and install in minutes.",
      collectionHandle: "non-electric-bidet-attachments",
      collectionTitle: "Bidet Attachments",
      tips: ["Look for dual nozzles (rear and front wash) and a self-cleaning setting.", "Ultra-slim models keep your seat sitting flat."],
      ...range,
      alsoConsider: {
        title: "Bidet Seats",
        href: "/collections/smart-bidet-seats",
        why: "Entry-level electric seats start around $100 and add warm water and a heated seat.",
      },
    };
  }

  return {
    key: "seat",
    title: "An electric bidet seat",
    reason: "You have power nearby and want comfort features, so a bidet seat is the sweet spot: it replaces your current seat and adds warm water, heated seating and a dryer without changing the toilet.",
    collectionHandle: "smart-bidet-seats",
    collectionTitle: "Bidet Seats",
    tips: [
      "Check whether your toilet is round or elongated — most seats come in both.",
      features.has("remote") ? "Remote-control models are easier to use than side panels, especially for guests." : "Side-control models cost less; remotes add convenience.",
      "Tankless (instant) heaters give unlimited warm water; tank models cost less.",
    ],
    ...range,
    alsoConsider: {
      title: "Bidet Toilets",
      href: "/collections/bidet-toilets",
      why: "Renovating? A smart toilet builds everything in for the cleanest look.",
    },
  };
}
