const RETAILER_BY_HOST: Record<string, string> = {
  "amazon.com": "Amazon",
  "amzn.to": "Amazon",
  "amazon.in": "Amazon India",
  "amazon.co.uk": "Amazon UK",
  "nykaa.com": "Nykaa",
  "myntra.com": "Myntra",
  "flipkart.com": "Flipkart",
  "ajio.com": "Ajio",
  "naturaltein.in": "Naturaltein",
  "earthful.me": "Earthful",
  "distausa.com": "DistaUSA",
  "target.com": "Target",
  "walmart.com": "Walmart",
  "sephora.com": "Sephora",
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

const INDIA_HOSTS = [
  "amazon.in",
  "nykaa.com",
  "myntra.com",
  "flipkart.com",
  "ajio.com",
  "naturaltein.in",
  "earthful.me",
  "distausa.com",
];

const USA_HOSTS = [
  "amazon.com",
  "amzn.to",
  "target.com",
  "walmart.com",
  "sephora.com",
  "ulta.com",
];

export type Region = "india" | "usa";

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
  return null;
}

export function availableInRegion(
  review: {
    boughtFromUrl?: string;
    indiaLinks?: { url: string }[];
    westernLinks?: { url: string }[];
  },
  region: Region,
): boolean {
  if (region === "india") {
    if (review.indiaLinks && review.indiaLinks.length > 0) return true;
    return regionForUrl(review.boughtFromUrl) === "india";
  }
  if (review.westernLinks && review.westernLinks.length > 0) return true;
  return regionForUrl(review.boughtFromUrl) === "usa";
}
