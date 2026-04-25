const RETAILER_BY_HOST: Record<string, string> = {
  "amazon.com": "Amazon",
  "amzn.to": "Amazon",
  "amazon.in": "Amazon India",
  "amazon.co.uk": "Amazon UK",
  "boots.com": "Boots",
  "lookfantastic.com": "LookFantastic",
  "cultbeauty.co.uk": "Cult Beauty",
  "spacenk.com": "Space NK",
  "feelunique.com": "LookFantastic",
  "hollandandbarrett.com": "Holland & Barrett",
  "nykaa.com": "Nykaa",
  "myntra.com": "Myntra",
  "flipkart.com": "Flipkart",
  "ajio.com": "Ajio",
  "naturaltein.in": "Naturaltein",
  "earthful.me": "Earthful",
  "distausa.com": "DistaUSA",
  "drsheths.com": "Dr. Sheth's",
  "thewholetruthfoods.com": "The Whole Truth",
  "myprotein.com": "Myprotein",
  "myprotein.co.in": "Myprotein",
  "myprotein.co.uk": "Myprotein",
  "thorne.com": "Thorne",
  "healthkart.com": "HealthKart",
  "target.com": "Target",
  "walmart.com": "Walmart",
  "sephora.com": "Sephora",
  "sephora.in": "Sephora",
  "ulta.com": "Ulta",
};

export function retailerForUrl(url: string): string {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    if (RETAILER_BY_HOST[host]) return RETAILER_BY_HOST[host];
    for (const [base, name] of Object.entries(RETAILER_BY_HOST)) {
      if (host.endsWith(`.${base}`) || host === base) return name;
    }
    return host
      .split(".")[0]
      .replace(/^./, (c) => c.toUpperCase());
  } catch {
    return "Buy";
  }
}

const RETAILER_THEME: Record<
  string,
  { idle: string; hover: string; bar: string }
> = {
  Amazon: {
    idle: "border-amber-300 bg-amber-50 text-amber-900",
    hover: "hover:border-amber-500 hover:bg-amber-100",
    bar: "bg-amber-500",
  },
  "Amazon India": {
    idle: "border-amber-300 bg-amber-50 text-amber-900",
    hover: "hover:border-amber-500 hover:bg-amber-100",
    bar: "bg-amber-500",
  },
  "Amazon US": {
    idle: "border-amber-300 bg-amber-50 text-amber-900",
    hover: "hover:border-amber-500 hover:bg-amber-100",
    bar: "bg-amber-500",
  },
  "Amazon UK": {
    idle: "border-amber-300 bg-amber-50 text-amber-900",
    hover: "hover:border-amber-500 hover:bg-amber-100",
    bar: "bg-amber-500",
  },
  Boots: {
    idle: "border-blue-300 bg-blue-50 text-blue-900",
    hover: "hover:border-blue-500 hover:bg-blue-100",
    bar: "bg-blue-700",
  },
  LookFantastic: {
    idle: "border-purple-300 bg-purple-50 text-purple-900",
    hover: "hover:border-purple-500 hover:bg-purple-100",
    bar: "bg-purple-500",
  },
  "Cult Beauty": {
    idle: "border-stone-300 bg-stone-50 text-stone-900",
    hover: "hover:border-stone-500 hover:bg-stone-100",
    bar: "bg-stone-900",
  },
  "Space NK": {
    idle: "border-stone-300 bg-stone-50 text-stone-900",
    hover: "hover:border-stone-500 hover:bg-stone-100",
    bar: "bg-stone-900",
  },
  "Holland & Barrett": {
    idle: "border-emerald-300 bg-emerald-50 text-emerald-900",
    hover: "hover:border-emerald-500 hover:bg-emerald-100",
    bar: "bg-emerald-700",
  },
  Nykaa: {
    idle: "border-pink-300 bg-pink-50 text-pink-900",
    hover: "hover:border-pink-500 hover:bg-pink-100",
    bar: "bg-pink-500",
  },
  Myntra: {
    idle: "border-rose-300 bg-rose-50 text-rose-900",
    hover: "hover:border-rose-500 hover:bg-rose-100",
    bar: "bg-rose-500",
  },
  Flipkart: {
    idle: "border-blue-300 bg-blue-50 text-blue-900",
    hover: "hover:border-blue-500 hover:bg-blue-100",
    bar: "bg-blue-500",
  },
  Ajio: {
    idle: "border-stone-300 bg-stone-50 text-stone-900",
    hover: "hover:border-stone-500 hover:bg-stone-100",
    bar: "bg-stone-700",
  },
  Target: {
    idle: "border-red-300 bg-red-50 text-red-900",
    hover: "hover:border-red-500 hover:bg-red-100",
    bar: "bg-red-500",
  },
  Walmart: {
    idle: "border-blue-300 bg-blue-50 text-blue-900",
    hover: "hover:border-blue-500 hover:bg-blue-100",
    bar: "bg-blue-500",
  },
  Sephora: {
    idle: "border-stone-300 bg-stone-50 text-stone-900",
    hover: "hover:border-stone-500 hover:bg-stone-100",
    bar: "bg-stone-900",
  },
  Ulta: {
    idle: "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-900",
    hover: "hover:border-fuchsia-500 hover:bg-fuchsia-100",
    bar: "bg-fuchsia-500",
  },
  Naturaltein: {
    idle: "border-emerald-300 bg-emerald-50 text-emerald-900",
    hover: "hover:border-emerald-500 hover:bg-emerald-100",
    bar: "bg-emerald-500",
  },
  Earthful: {
    idle: "border-emerald-300 bg-emerald-50 text-emerald-900",
    hover: "hover:border-emerald-500 hover:bg-emerald-100",
    bar: "bg-emerald-600",
  },
  DistaUSA: {
    idle: "border-stone-300 bg-stone-50 text-stone-900",
    hover: "hover:border-stone-500 hover:bg-stone-100",
    bar: "bg-stone-700",
  },
  "Dr. Sheth's": {
    idle: "border-yellow-300 bg-yellow-50 text-yellow-900",
    hover: "hover:border-yellow-500 hover:bg-yellow-100",
    bar: "bg-yellow-500",
  },
  "The Whole Truth": {
    idle: "border-yellow-300 bg-yellow-50 text-yellow-900",
    hover: "hover:border-yellow-500 hover:bg-yellow-100",
    bar: "bg-yellow-600",
  },
};

const DEFAULT_THEME = {
  idle: "border-stone-200 bg-white text-stone-700",
  hover: "hover:border-stone-900 hover:text-stone-900",
  bar: "bg-stone-700",
};

export function themeForRetailer(name: string): {
  idle: string;
  hover: string;
  bar: string;
} {
  return RETAILER_THEME[name] ?? DEFAULT_THEME;
}

/**
 * Brand → accent text color (Tailwind class), used to color the brand
 * eyebrow on product cards / detail pages so each card carries the
 * brand's visual identity at a glance. Same content-color philosophy
 * as the retailer button themes above: not part of site chrome (which
 * stays rose+stone) but a derived signal from the product itself.
 *
 * If a brand isn't listed, we fall back to neutral stone so missing
 * entries fail safely instead of breaking the layout.
 */
const BRAND_TEXT_COLOR: Record<string, string> = {
  // Skincare
  "La Roche-Posay": "text-sky-700 dark:text-sky-400",
  "TIRTIR": "text-red-600 dark:text-red-400",
  "BAIMEI": "text-emerald-600 dark:text-emerald-400",
  "Mighty Patch": "text-amber-600 dark:text-amber-400",
  "Hero Cosmetics": "text-amber-600 dark:text-amber-400",
  "Anua": "text-emerald-700 dark:text-emerald-400",
  "Beauty of Joseon": "text-rose-500 dark:text-rose-300",
  "Caudalie": "text-emerald-700 dark:text-emerald-400",
  "The Ordinary": "text-stone-800 dark:text-stone-200",
  "CeraVe": "text-blue-700 dark:text-blue-400",
  "Cetaphil": "text-blue-700 dark:text-blue-400",
  "Paula's Choice": "text-fuchsia-700 dark:text-fuchsia-400",
  "Skin1004": "text-emerald-600 dark:text-emerald-400",
  "Aqualogica": "text-pink-600 dark:text-pink-400",
  "BANILA CO": "text-stone-800 dark:text-stone-200",
  "Cipla": "text-blue-700 dark:text-blue-400",
  "Dot & Key": "text-rose-600 dark:text-rose-400",
  "Dr. Sheth's": "text-yellow-700 dark:text-yellow-400",
  "Forest Essentials": "text-yellow-800 dark:text-yellow-500",
  "Garnier": "text-green-700 dark:text-green-400",
  "Mamaearth": "text-green-700 dark:text-green-400",
  "Minimalist": "text-stone-800 dark:text-stone-200",
  "Neutrogena": "text-orange-600 dark:text-orange-400",
  "O3+": "text-orange-600 dark:text-orange-400",
  "Olay": "text-red-700 dark:text-red-400",
  "Plum": "text-green-600 dark:text-green-400",
  "Que Bella": "text-rose-500 dark:text-rose-300",
  "WOW Life Science": "text-emerald-700 dark:text-emerald-400",
  "YEOUTH": "text-cyan-700 dark:text-cyan-400",
  // Supplements
  "Nutricost": "text-blue-700 dark:text-blue-400",
  "Sports Research": "text-orange-600 dark:text-orange-400",
  "Magtein": "text-violet-600 dark:text-violet-400",
  "Myprotein": "text-red-600 dark:text-red-400",
  "Optimum Nutrition": "text-yellow-600 dark:text-yellow-400",
  "Thorne": "text-stone-700 dark:text-stone-300",
  "Earthful": "text-emerald-700 dark:text-emerald-400",
  "Naturaltein": "text-emerald-600 dark:text-emerald-400",
  "DistaUSA": "text-stone-600 dark:text-stone-400",
  "Viva Naturals": "text-green-700 dark:text-green-400",
  "MuscleBlaze": "text-orange-600 dark:text-orange-400",
  "Canadian Protein": "text-red-600 dark:text-red-400",
  "Carbamide Forte": "text-orange-700 dark:text-orange-400",
  "Core Power": "text-orange-600 dark:text-orange-400",
  "Nutrabay": "text-orange-600 dark:text-orange-400",
  "The Whole Truth": "text-yellow-700 dark:text-yellow-400",
  // Oral care
  "Oral-B": "text-blue-700 dark:text-blue-400",
  "Sensodyne": "text-cyan-700 dark:text-cyan-400",
  "Listerine": "text-amber-600 dark:text-amber-400",
  "Colgate": "text-red-600 dark:text-red-400",
  "Philips Sonicare": "text-cyan-700 dark:text-cyan-400",
  "Crest": "text-red-600 dark:text-red-400",
  "DenTek": "text-red-700 dark:text-red-400",
  // Hair care
  "Olaplex": "text-stone-900 dark:text-stone-100",
  "Kristin Ess": "text-rose-500 dark:text-rose-300",
  "L'Oreal Professionnel": "text-amber-700 dark:text-amber-500",
  "Padagis": "text-stone-600 dark:text-stone-400",
  // Body care
  "Dove": "text-yellow-700 dark:text-yellow-400",
  "Native": "text-stone-700 dark:text-stone-300",
  "Method": "text-emerald-600 dark:text-emerald-400",
  "MCaffeine": "text-amber-800 dark:text-amber-500",
  "NIVEA": "text-blue-800 dark:text-blue-400",
  "Nykaa": "text-pink-600 dark:text-pink-400",
};

const DEFAULT_BRAND_COLOR = "text-stone-500 dark:text-stone-400";

export function brandTextColor(brand: string): string {
  return BRAND_TEXT_COLOR[brand] ?? DEFAULT_BRAND_COLOR;
}

const INDIA_HOSTS = [
  "amazon.in",
  "nykaa.com",
  "myntra.com",
  "flipkart.com",
  "ajio.com",
  "naturaltein.in",
  "earthful.me",
  "distausa.com",
  "drsheths.com",
  "thewholetruthfoods.com",
  "myprotein.co.in",
  "healthkart.com",
  "sephora.in",
];

const USA_HOSTS = [
  "amazon.com",
  "amzn.to",
  "target.com",
  "walmart.com",
  "sephora.com",
  "ulta.com",
  "thorne.com",
];

const UK_HOSTS = [
  "amazon.co.uk",
  "boots.com",
  "lookfantastic.com",
  "cultbeauty.co.uk",
  "spacenk.com",
  "feelunique.com",
  "hollandandbarrett.com",
  "myprotein.com",
  "myprotein.co.uk",
];

export type Region = "india" | "usa" | "uk";

export function regionForUrl(url: string | undefined | null): Region | null {
  if (!url) return null;
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
  for (const h of INDIA_HOSTS) {
    if (host === h || host.endsWith(`.${h}`)) return "india";
  }
  for (const h of USA_HOSTS) {
    if (host === h || host.endsWith(`.${h}`)) return "usa";
  }
  for (const h of UK_HOSTS) {
    if (host === h || host.endsWith(`.${h}`)) return "uk";
  }
  return null;
}

export function availableInRegion(
  review: {
    boughtFromUrl?: string;
    indiaLinks?: { url: string }[];
    westernLinks?: { url: string }[];
    ukLinks?: { url: string }[];
  },
  region: Region,
): boolean {
  if (region === "india") {
    if (review.indiaLinks && review.indiaLinks.length > 0) return true;
    return regionForUrl(review.boughtFromUrl) === "india";
  }
  if (region === "uk") {
    if (review.ukLinks && review.ukLinks.length > 0) return true;
    return regionForUrl(review.boughtFromUrl) === "uk";
  }
  if (review.westernLinks && review.westernLinks.length > 0) return true;
  return regionForUrl(review.boughtFromUrl) === "usa";
}

const REGION_NAME: Record<Region, string> = {
  india: "India",
  usa: "USA",
  uk: "UK",
};

export function availableRegions(review: {
  boughtFromUrl?: string;
  indiaLinks?: { url: string }[];
  westernLinks?: { url: string }[];
  ukLinks?: { url: string }[];
}): Region[] {
  return (["india", "usa", "uk"] as const).filter((r) =>
    availableInRegion(review, r),
  );
}

/**
 * Short human label describing where a review's product can be bought.
 * Returns null if no buy links exist at all.
 *
 *   ["india"]               → "India only"
 *   ["usa"]                 → "USA only"
 *   ["uk"]                  → "UK only"
 *   ["india", "usa"]        → "India + USA"
 *   ["india", "usa", "uk"]  → "India · USA · UK"
 */
export function availabilityLabel(review: {
  boughtFromUrl?: string;
  indiaLinks?: { url: string }[];
  westernLinks?: { url: string }[];
  ukLinks?: { url: string }[];
}): string | null {
  const regions = availableRegions(review);
  if (regions.length === 0) return null;
  if (regions.length === 1) return `${REGION_NAME[regions[0]]} only`;
  if (regions.length === 2)
    return `${REGION_NAME[regions[0]]} + ${REGION_NAME[regions[1]]}`;
  return regions.map((r) => REGION_NAME[r]).join(" · ");
}
