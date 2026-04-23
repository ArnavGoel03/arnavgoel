import { ArrowUpRight } from "lucide-react";
import type { Review } from "@/lib/types";
import { affiliatize } from "@/lib/affiliate";

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

function PrimaryLink({ href, label }: { href: string; label: string }) {
  const link = buildLinkProps(href);
  return (
    <a
      href={link.href}
      target="_blank"
      rel={link.rel}
      className="group inline-flex w-full items-center justify-between gap-2 rounded-2xl border border-stone-900 bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
    >
      <span>
        {label}
        {link.isAffiliate && (
          <span className="ml-2 text-xs font-normal text-stone-400">
            affiliate
          </span>
        )}
      </span>
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

function SecondaryLink({ href, label }: { href: string; label: string }) {
  const link = buildLinkProps(href);
  return (
    <a
      href={link.href}
      target="_blank"
      rel={link.rel}
      className="group inline-flex w-full items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900"
    >
      <span>
        {label}
        {link.isAffiliate && (
          <span className="ml-2 text-xs text-stone-400">affiliate</span>
        )}
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

export function ReviewMeta({ review }: { review: Review }) {
  const tags = review.skinType ?? review.goal ?? [];
  const seen = new Set<string>();
  const bought = review.boughtFromUrl;
  if (bought) seen.add(bought);
  const india =
    review.buyIndiaUrl && !seen.has(review.buyIndiaUrl)
      ? review.buyIndiaUrl
      : undefined;
  if (india) seen.add(india);
  const western =
    review.buyWesternUrl && !seen.has(review.buyWesternUrl)
      ? review.buyWesternUrl
      : undefined;
  const hasAnyLink = bought || india || western;

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
        <Row
          label="Reviewed"
          value={new Date(review.datePublished).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
      </dl>

      {hasAnyLink && (
        <div className="space-y-2">
          {bought && <PrimaryLink href={bought} label="Bought from" />}
          {(india || western) && (
            <div className="pt-1">
              <p className="mb-2 text-xs uppercase tracking-wider text-stone-500">
                Also available
              </p>
              <div className="space-y-2">
                {india && <SecondaryLink href={india} label="Buy in India" />}
                {western && (
                  <SecondaryLink href={western} label="Buy in the US / West" />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
