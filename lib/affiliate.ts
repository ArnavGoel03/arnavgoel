const INDIAN_RETAILER_HOSTS = [
  "nykaa.com",
  "myntra.com",
  "flipkart.com",
  "ajio.com",
  "naturaltein.in",
  "earthful.me",
  "distausa.com",
];

function withAmazonTag(url: string, tag: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("tag", tag);
    return u.toString();
  } catch {
    return url;
  }
}

function withTemplate(url: string, template: string): string {
  if (!template.includes("{url}")) return url;
  return template.replace("{url}", encodeURIComponent(url));
}

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function affiliatize(rawUrl: string | undefined | null): string | undefined {
  if (!rawUrl) return rawUrl ?? undefined;
  const host = hostOf(rawUrl);
  if (!host) return rawUrl;

  if (host.endsWith("amazon.com") || host === "amzn.to") {
    const tag = process.env.AMAZON_US_TAG;
    if (tag) return withAmazonTag(rawUrl, tag);
  }

  if (host.endsWith("amazon.in")) {
    const tag = process.env.AMAZON_IN_TAG;
    if (tag) return withAmazonTag(rawUrl, tag);
  }

  if (host.endsWith("amazon.co.uk")) {
    const tag = process.env.AMAZON_UK_TAG;
    if (tag) return withAmazonTag(rawUrl, tag);
  }

  if (INDIAN_RETAILER_HOSTS.some((d) => host === d || host.endsWith(`.${d}`))) {
    const template = process.env.INDIA_AFFILIATE_TEMPLATE;
    if (template) return withTemplate(rawUrl, template);
  }

  if (process.env.WESTERN_AFFILIATE_TEMPLATE) {
    if (
      host.endsWith("target.com") ||
      host.endsWith("walmart.com") ||
      host.endsWith("sephora.com") ||
      host.endsWith("ulta.com")
    ) {
      return withTemplate(rawUrl, process.env.WESTERN_AFFILIATE_TEMPLATE);
    }
  }

  return rawUrl;
}

export function isAffiliated(rawUrl: string): boolean {
  return affiliatize(rawUrl) !== rawUrl;
}
