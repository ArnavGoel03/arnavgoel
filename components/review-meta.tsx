import { ArrowUpRight } from "lucide-react";
import type { BuyLink, Review } from "@/lib/types";
import { affiliatize } from "@/lib/affiliate";
import { availabilityLabel, themeForRetailer } from "@/lib/retailers";
import { cn } from "@/lib/utils";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-stone-100 py-3 text-sm last:border-none">
      <dt className="text-stone-500">{label}</dt>
      <dd className="text-right font-medium text-stone-900">{value}</dd>
    </div>
  );
}

function buildLinkProps(rawHref: string) {
  const finalHref = affiliatize(rawHref) ?? rawHref;
  const isAffiliate = finalHref !== rawHref;
  return {
    href: finalHref,
    rel: isAffiliate
      ? "noopener noreferrer sponsored nofollow"
      : "noopener noreferrer",
    isAffiliate,
  };
}

function PrimaryLink({
  href,
  label,
  sublabel,
}: {
  href: string;
  label: string;
  sublabel?: string;
}) {
  const link = buildLinkProps(href);
  return (
    <a
      href={link.href}
      target="_blank"
      rel={link.rel}
      className="group flex w-full items-center justify-between gap-2 rounded-2xl border border-stone-900 bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
    >
      <span className="flex flex-col items-start text-left">
        <span>
          {label}
          {link.isAffiliate && (
            <span className="ml-2 text-xs font-normal text-stone-400">
              affiliate
            </span>
          )}
        </span>
        {sublabel && (
          <span className="text-xs font-normal text-stone-400">{sublabel}</span>
        )}
      </span>
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

function SecondaryLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const link = buildLinkProps(href);
  const theme = themeForRetailer(label);
  return (
    <a
      href={link.href}
      target="_blank"
      rel={link.rel}
      className={cn(
        "group inline-flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors",
        theme.idle,
        theme.hover,
      )}
    >
      <span className="flex items-center gap-2">
        <span className={cn("h-1.5 w-1.5 rounded-full", theme.bar)} />
        {label}
        {link.isAffiliate && (
          <span className="ml-1 text-xs opacity-60">affiliate</span>
        )}
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

function dedupeByUrl(links: BuyLink[], skip: Set<string>): BuyLink[] {
  const out: BuyLink[] = [];
  const seen = new Set(skip);
  for (const l of links) {
    if (!l.url || seen.has(l.url)) continue;
    seen.add(l.url);
    out.push(l);
  }
  return out;
}

export function ReviewMeta({ review }: { review: Review }) {
  const tags = review.skinType ?? review.goal ?? [];
  const seen = new Set<string>();
  if (review.boughtFromUrl) seen.add(review.boughtFromUrl);
  const india = dedupeByUrl(review.indiaLinks ?? [], seen);
  india.forEach((l) => seen.add(l.url));
  const western = dedupeByUrl(review.westernLinks ?? [], seen);
  western.forEach((l) => seen.add(l.url));
  const uk = dedupeByUrl(review.ukLinks ?? [], seen);

  const hasAnyLink =
    review.boughtFromUrl ||
    india.length > 0 ||
    western.length > 0 ||
    uk.length > 0;
  const availability = availabilityLabel(review);
  const isRegionLocked = availability?.endsWith("only") ?? false;

  return (
    <div className="space-y-4">
      <dl className="rounded-2xl border border-stone-200 bg-white p-6">
        <Row label="Brand" value={review.brand} />
        <Row label="Category" value={<span className="capitalize">{review.category}</span>} />
        {review.price && <Row label="Price" value={review.price} />}
        {tags.length > 0 && (
          <Row
            label={review.skinType ? "Skin type" : "Best for"}
            value={<span className="capitalize">{tags.join(", ")}</span>}
          />
        )}
        {availability && (
          <Row
            label="Sold in"
            value={
              <span className={isRegionLocked ? "text-amber-700" : undefined}>
                {availability}
              </span>
            }
          />
        )}
        {review.repurchase !== undefined && (
          <Row
            label="Repurchase"
            value={
              review.repurchase ? (
                <span className="text-emerald-700">Yes</span>
              ) : (
                <span className="text-rose-700">No</span>
              )
            }
          />
        )}
        <Row
          label="Reviewed"
          value={new Date(review.datePublished).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
      </dl>

      {isRegionLocked && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-medium">Heads up:</span> this product is only
          stocked by{" "}
          <span className="italic">
            {availability!.replace(" only", "")}
          </span>{" "}
          retailers — readers outside that region may need to import or find a
          local equivalent.
        </div>
      )}

      {hasAnyLink && (
        <div className="space-y-3">
          {review.boughtFromUrl && (
            <PrimaryLink href={review.boughtFromUrl} label="Bought from" />
          )}
          {india.length > 0 && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-stone-500">
                Buy in India
              </p>
              <div className="space-y-2">
                {india.map((l) => (
                  <SecondaryLink key={l.url} href={l.url} label={l.retailer} />
                ))}
              </div>
            </div>
          )}
          {western.length > 0 && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-stone-500">
                Buy in the USA
              </p>
              <div className="space-y-2">
                {western.map((l) => (
                  <SecondaryLink key={l.url} href={l.url} label={l.retailer} />
                ))}
              </div>
            </div>
          )}
          {uk.length > 0 && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-stone-500">
                Buy in the UK
              </p>
              <div className="space-y-2">
                {uk.map((l) => (
                  <SecondaryLink key={l.url} href={l.url} label={l.retailer} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
