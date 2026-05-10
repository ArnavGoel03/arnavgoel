/**
 * Reduce a noisy Amazon URL pulled straight from the address bar
 * (`/<slug>/dp/<ASIN>?ref=…&pd_rd_…`) down to the canonical
 * `https://www.amazon.<tld>/dp/<ASIN>` form.
 *
 * Why bother: `lib/affiliate.ts` rewrites every `amazon.<tld>` URL with
 * the right `?tag=` at render time, so anything we save in MDX should
 * be the cleanest possible product URL — no SiteStripe round-trip
 * required. Search-style URLs and short links (`amzn.to/X`,
 * `amzn.in/d/X`) can't be normalised without an HTTP follow, so we
 * leave them as-is.
 */

const AMAZON_HOSTS = new Set([
  "amazon.com",
  "amazon.in",
  "amazon.co.uk",
  "amazon.co.jp",
  "amazon.de",
  "amazon.fr",
  "amazon.it",
  "amazon.es",
  "amazon.ca",
  "amazon.com.au",
  "amazon.com.mx",
  "amazon.com.br",
  "amazon.ae",
  "amazon.sg",
  "amazon.nl",
  "amazon.pl",
  "amazon.se",
]);

const ASIN_RE = /\/(?:dp|gp\/product|gp\/aw\/d|gp\/offer-listing)\/([A-Z0-9]{10})(?:[\/?#]|$)/i;

function bareHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "").replace(/^m\./, "");
}

export function normalizeAmazonUrl(rawUrl: string): string {
  let u: URL;
  try {
    u = new URL(rawUrl.trim());
  } catch {
    return rawUrl;
  }
  const host = bareHost(u.hostname);
  if (!AMAZON_HOSTS.has(host)) return rawUrl;

  const match = u.pathname.match(ASIN_RE);
  if (!match) return rawUrl;
  const asin = match[1].toUpperCase();
  return `https://www.${host}/dp/${asin}`;
}
