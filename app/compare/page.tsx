import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import { parseCompareId, parseIdsParam } from "@/lib/compare";
import { getReview } from "@/lib/content";
import { formatCostPerDay } from "@/lib/cost";
import { availabilityLabel } from "@/lib/retailers";
import { pricesByRegion, REGION_TAG } from "@/lib/price";
import type { Review } from "@/lib/types";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Side-by-side look at products on the shelf: verdict, 3-axis rating, price, cost per day, ingredients, regional availability.",
  alternates: { canonical: "/compare" },
  robots: { index: false, follow: true },
};

type Props = {
  searchParams: Promise<{ ids?: string | string[] }>;
};

const VERDICT_LABEL: Record<string, string> = {
  recommend: "Would recommend",
  okay: "Okayish",
  bad: "Bad",
};

const VERDICT_DOT: Record<string, string> = {
  recommend: "bg-emerald-500",
  okay: "bg-amber-500",
  bad: "bg-rose-500",
};

export default async function ComparePage({ searchParams }: Props) {
  const { ids } = await searchParams;
  const compareIds = parseIdsParam(ids);
  const reviews: Review[] = [];
  for (const id of compareIds) {
    const parsed = parseCompareId(id);
    if (!parsed) continue;
    const r = getReview(parsed.kind, parsed.slug);
    if (r) reviews.push(r);
  }

  return (
    <Container className="max-w-6xl py-12 sm:py-16">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>Side by side</span>
        </span>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </Link>
      </div>

      <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 sm:text-7xl dark:text-stone-100">
        Compare<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 mb-12 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
        Read two or more reviews next to each other. Pick them with the
        &ldquo;Compare&rdquo; toggle on any product card, then come back here.
      </p>

      {reviews.length < 2 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-stone-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-stone-300">
          <p className="font-serif text-lg">
            {reviews.length === 0
              ? "the tray is empty — add a couple of products to begin."
              : "one item so far. add one more and the comparison opens up."}
          </p>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Use the &ldquo;Compare&rdquo; toggle on a product card to add
            items. Two is the minimum; four is the practical max.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <Link
              href="/skincare"
              className="rounded-full border border-stone-200 bg-white px-4 py-1.5 transition-colors hover:border-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-400"
            >
              Browse skincare
            </Link>
            <Link
              href="/supplements"
              className="rounded-full border border-stone-200 bg-white px-4 py-1.5 transition-colors hover:border-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-400"
            >
              Browse supplements
            </Link>
            <Link
              href="/oral-care"
              className="rounded-full border border-stone-200 bg-white px-4 py-1.5 transition-colors hover:border-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-400"
            >
              Browse oral care
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-300 dark:border-stone-800">
                <th className="sticky left-0 z-10 w-36 bg-background py-4 text-left text-[10px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                  Product
                </th>
                {reviews.map((r) => (
                  <th
                    key={`${r.kind}-${r.slug}`}
                    className="min-w-[180px] px-4 py-4 text-left align-bottom"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                      {r.brand} · {r.category}
                    </p>
                    <Link
                      href={`/${r.kind}/${r.slug}`}
                      className="mt-1 inline-block font-serif text-xl leading-tight text-stone-900 transition-colors hover:text-rose-700 dark:text-stone-100"
                    >
                      {r.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              <Row label="Verdict">
                {reviews.map((r) => {
                  const dot = r.verdict
                    ? VERDICT_DOT[r.verdict]
                    : "bg-amber-400";
                  const label = r.verdict
                    ? VERDICT_LABEL[r.verdict]
                    : "Still testing";
                  return (
                    <Cell key={`${r.kind}-${r.slug}-v`}>
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          aria-hidden
                          className={`h-1.5 w-1.5 rounded-full ${dot}`}
                        />
                        <span
                          className={
                            r.verdict
                              ? ""
                              : "font-serif italic text-stone-500"
                          }
                        >
                          {label}
                        </span>
                      </span>
                    </Cell>
                  );
                })}
              </Row>

              <Row label="Effect">
                {reviews.map((r) => (
                  <Cell key={`${r.kind}-${r.slug}-e`}>
                    {axisOrDash(r.ratings?.effect)}
                  </Cell>
                ))}
              </Row>
              <Row label="Value">
                {reviews.map((r) => (
                  <Cell key={`${r.kind}-${r.slug}-vl`}>
                    {axisOrDash(r.ratings?.value)}
                  </Cell>
                ))}
              </Row>
              <Row label="Tolerance">
                {reviews.map((r) => (
                  <Cell key={`${r.kind}-${r.slug}-t`}>
                    {axisOrDash(r.ratings?.tolerance)}
                  </Cell>
                ))}
              </Row>

              <Row label="Price">
                {reviews.map((r) => {
                  const prices = pricesByRegion(r.price);
                  if (prices.length === 0) {
                    return (
                      <Cell key={`${r.kind}-${r.slug}-p`}>{dashEl()}</Cell>
                    );
                  }
                  return (
                    <Cell key={`${r.kind}-${r.slug}-p`}>
                      <span className="flex flex-col gap-0.5 tabular-nums">
                        {prices.map(({ region, value }) => (
                          <span key={region}>
                            <span>{value}</span>
                            <span className="ml-1.5 text-[10px] font-normal uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">
                              {REGION_TAG[region]}
                            </span>
                          </span>
                        ))}
                      </span>
                    </Cell>
                  );
                })}
              </Row>
              <Row label="Cost / day">
                {reviews.map((r) => {
                  const cpd = formatCostPerDay(r);
                  return (
                    <Cell key={`${r.kind}-${r.slug}-cpd`}>
                      {cpd ?? dashEl()}
                    </Cell>
                  );
                })}
              </Row>
              <Row label="Sold in">
                {reviews.map((r) => {
                  const label = availabilityLabel(r);
                  return (
                    <Cell key={`${r.kind}-${r.slug}-av`}>
                      <span
                        className={
                          label?.endsWith("only")
                            ? "text-amber-700 dark:text-amber-400"
                            : undefined
                        }
                      >
                        {label ?? dashEl()}
                      </span>
                    </Cell>
                  );
                })}
              </Row>

              <Row label="Ingredients">
                {reviews.map((r) => (
                  <Cell key={`${r.kind}-${r.slug}-i`}>
                    {r.ingredients && r.ingredients.length > 0 ? (
                      <ul className="flex flex-wrap gap-1">
                        {r.ingredients.map((i) => (
                          <li
                            key={i}
                            className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                          >
                            {i}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      dashEl()
                    )}
                  </Cell>
                ))}
              </Row>

              <Row label="Reviewed">
                {reviews.map((r) => (
                  <Cell key={`${r.kind}-${r.slug}-d`}>
                    <span className="font-mono text-xs text-stone-500 tabular-nums dark:text-stone-400">
                      {new Date(r.datePublished).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </Cell>
                ))}
              </Row>
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 whitespace-nowrap bg-background py-4 pr-4 text-left align-top text-[10px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400"
      >
        {label}
      </th>
      {children}
    </tr>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-4 align-top text-stone-800 dark:text-stone-200">
      {children}
    </td>
  );
}

function axisOrDash(n: number | undefined) {
  if (typeof n !== "number") return dashEl();
  return (
    <span className="inline-flex items-baseline gap-0.5 font-display text-xl font-light tabular-nums text-stone-900 dark:text-stone-100">
      {n.toFixed(1)}
      <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400 dark:text-stone-500">
        /10
      </span>
    </span>
  );
}

function dashEl() {
  return <span className="font-mono text-stone-400 dark:text-stone-500">·</span>;
}
