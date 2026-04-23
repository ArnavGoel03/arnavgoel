"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { createReview, updateReview, type ActionState } from "./actions";
import { ProductPhotoUpload } from "./product-photo-upload";
import { cn } from "@/lib/utils";

const today = () => new Date().toISOString().slice(0, 10);

function slugPreview(brand: string, name: string): string {
  return (
    (brand + " " + name)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/['']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "…"
  );
}

const labelCls = "block text-xs uppercase tracking-wider text-stone-500 mb-1.5";
const optionalCls = "ml-1 text-stone-400 normal-case tracking-normal";
const inputCls =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-400";
const textareaCls = cn(inputCls, "resize-y font-mono");

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="border-b border-stone-200 pb-2">
        <h2 className="font-serif text-lg text-stone-900">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-stone-500">{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Optional() {
  return <span className={optionalCls}>(optional)</span>;
}

export type ProductFormInitial = {
  slug: string;
  kind: "skincare" | "supplements" | "oral-care";
  name: string;
  brand: string;
  category: string;
  rating?: number;
  ratings?: { effect?: number; value?: number; tolerance?: number };
  hidden?: boolean;
  price?: string;
  skinType?: string[];
  goal?: string[];
  photo?: string;
  boughtFromUrl?: string;
  indiaLinks?: { retailer: string; url: string }[];
  westernLinks?: { retailer: string; url: string }[];
  ukLinks?: { retailer: string; url: string }[];
  ingredients?: string[];
  pros: string[];
  cons: string[];
  repurchase?: boolean;
  datePublished: string;
  summary: string;
  body: string;
};

export function ProductForm({ initial }: { initial?: ProductFormInitial }) {
  const isEdit = !!initial;
  const [state, action, pending] = useActionState<ActionState | null, FormData>(
    isEdit ? updateReview : createReview,
    null,
  );
  const [kind, setKind] = useState<"skincare" | "supplements" | "oral-care">(
    initial?.kind ?? "skincare",
  );
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [name, setName] = useState(initial?.name ?? "");

  const slug = useMemo(
    () => initial?.slug ?? slugPreview(brand, name),
    [initial?.slug, brand, name],
  );

  return (
    <form action={action} className="space-y-12">
      <input type="hidden" name="kind" value={kind} />
      {isEdit && <input type="hidden" name="slug" value={initial!.slug} />}

      <Section
        title="Basics"
        description="Only brand, name, category, and rating are required. Everything else can wait."
      >
        <div>
          <span className={labelCls}>Kind</span>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: "skincare", label: "Skincare" },
                { value: "supplements", label: "Supplements" },
                { value: "oral-care", label: "Oral care" },
              ] as const
            ).map((k) => (
              <button
                key={k.value}
                type="button"
                onClick={() => !isEdit && setKind(k.value)}
                disabled={isEdit}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  kind === k.value
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300",
                  isEdit && "cursor-not-allowed opacity-60",
                )}
              >
                {k.label}
              </button>
            ))}
          </div>
          {isEdit && (
            <p className="mt-2 text-xs text-stone-500">
              Kind is locked when editing.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="brand" className={labelCls}>Brand</label>
            <input
              id="brand"
              name="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Beauty of Joseon"
              required
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="name" className={labelCls}>Product name</label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Radiance Cleansing Balm"
              required
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="category" className={labelCls}>Category</label>
            <input
              id="category"
              name="category"
              defaultValue={initial?.category ?? ""}
              placeholder={
                kind === "skincare"
                  ? "cleanser"
                  : kind === "supplements"
                    ? "mineral"
                    : "electric toothbrush"
              }
              required
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="rating" className={labelCls}>
              Overall rating <Optional />
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              defaultValue={initial?.rating ?? ""}
              placeholder="Leave blank while testing"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="price" className={labelCls}>
              Price <Optional />
            </label>
            <input
              id="price"
              name="price"
              defaultValue={initial?.price ?? ""}
              placeholder="$20"
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="effectRating" className={labelCls}>
              Effect <Optional />
            </label>
            <input
              id="effectRating"
              name="effectRating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              defaultValue={initial?.ratings?.effect ?? ""}
              placeholder="0–10"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-stone-500">Does it work?</p>
          </div>
          <div>
            <label htmlFor="valueRating" className={labelCls}>
              Value <Optional />
            </label>
            <input
              id="valueRating"
              name="valueRating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              defaultValue={initial?.ratings?.value ?? ""}
              placeholder="0–10"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-stone-500">Worth the price?</p>
          </div>
          <div>
            <label htmlFor="toleranceRating" className={labelCls}>
              Tolerance <Optional />
            </label>
            <input
              id="toleranceRating"
              name="toleranceRating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              defaultValue={initial?.ratings?.tolerance ?? ""}
              placeholder="0–10"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-stone-500">Easy to live with?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="datePublished" className={labelCls}>
              Date published
            </label>
            <input
              id="datePublished"
              name="datePublished"
              type="date"
              defaultValue={initial?.datePublished ?? today()}
              required
              className={inputCls}
            />
          </div>
          <div>
            <span className={labelCls}>Repurchase?</span>
            <div className="flex gap-4 pt-2 text-sm text-stone-700">
              {(
                [
                  { value: "undecided", label: "Not yet" },
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ] as const
              ).map((opt) => {
                const checked =
                  opt.value === "undecided"
                    ? initial?.repurchase === undefined
                    : opt.value === "yes"
                      ? initial?.repurchase === true
                      : initial?.repurchase === false;
                return (
                  <label key={opt.value} className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="repurchase"
                      value={opt.value}
                      defaultChecked={checked}
                      className="size-4"
                    />
                    {opt.label}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
          <input
            type="checkbox"
            name="hidden"
            value="true"
            defaultChecked={initial?.hidden ?? false}
            className="mt-0.5 size-4 rounded border-stone-300"
          />
          <span className="flex-1">
            <span className="font-medium">Hide from the catalogue.</span>{" "}
            <span className="text-stone-500">
              The product stays in the repo and at its direct URL, but won&apos;t
              appear on listing pages, the home &ldquo;just added&rdquo; row, or
              in sitemap/filters. Useful when you&apos;ve stopped using
              something or want to draft without publishing.
            </span>
          </span>
        </label>
      </Section>

      <Section
        title="Photo"
        description="Drop an image here. Stored at original quality."
      >
        <ProductPhotoUpload initialUrl={initial?.photo} fieldName="photo" />
      </Section>

      <Section
        title="Tags"
        description="Helps with filtering. All optional."
      >
        {kind === "skincare" ? (
          <div>
            <label htmlFor="skinType" className={labelCls}>
              Skin type <Optional />
            </label>
            <input
              id="skinType"
              name="skinType"
              defaultValue={initial?.skinType?.join(", ") ?? ""}
              placeholder="dry, sensitive, normal"
              className={inputCls}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="goal" className={labelCls}>
              {kind === "supplements" ? "Goal" : "Best for"} <Optional />
            </label>
            <input
              id="goal"
              name="goal"
              defaultValue={initial?.goal?.join(", ") ?? ""}
              placeholder={
                kind === "supplements"
                  ? "sleep, recovery, stress"
                  : "plaque, gum health, whitening"
              }
              className={inputCls}
            />
          </div>
        )}

        <div>
          <label htmlFor="ingredients" className={labelCls}>
            Ingredients <Optional />
          </label>
          <input
            id="ingredients"
            name="ingredients"
            defaultValue={initial?.ingredients?.join(", ") ?? ""}
            placeholder="Rice Bran Oil, Ginseng Extract, Shea Butter"
            className={inputCls}
          />
          <p className="mt-1 text-xs text-stone-500">Comma-separated.</p>
        </div>
      </Section>

      <Section
        title="Purchase links"
        description="Bought-from URL is shown as the prominent button. India and West sections each accept multiple URLs (one per line) — readers see them all."
      >
        <div>
          <label htmlFor="boughtFromUrl" className={labelCls}>
            Bought from <Optional />
          </label>
          <input
            id="boughtFromUrl"
            name="boughtFromUrl"
            type="url"
            defaultValue={initial?.boughtFromUrl ?? ""}
            placeholder="https://… (where you actually bought it)"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="indiaLinks" className={labelCls}>
            India retailers <Optional />
          </label>
          <textarea
            id="indiaLinks"
            name="indiaLinks"
            rows={3}
            defaultValue={
              initial?.indiaLinks
                ?.map((l) => `${l.retailer} | ${l.url}`)
                .join("\n") ?? ""
            }
            placeholder={
              "https://www.amazon.in/dp/...\nhttps://www.nykaa.com/...\nhttps://www.myntra.com/..."
            }
            className={textareaCls}
          />
          <p className="mt-1 text-xs text-stone-500">
            One URL per line. Retailer name is auto-detected from the domain;
            you can override with <code>Retailer | URL</code> format.
          </p>
        </div>
        <div>
          <label htmlFor="westernLinks" className={labelCls}>
            USA retailers <Optional />
          </label>
          <textarea
            id="westernLinks"
            name="westernLinks"
            rows={3}
            defaultValue={
              initial?.westernLinks
                ?.map((l) => `${l.retailer} | ${l.url}`)
                .join("\n") ?? ""
            }
            placeholder={
              "https://www.amazon.com/dp/...\nhttps://www.target.com/p/...\nhttps://www.sephora.com/..."
            }
            className={textareaCls}
          />
          <p className="mt-1 text-xs text-stone-500">
            Same format as India.
          </p>
        </div>
        <div>
          <label htmlFor="ukLinks" className={labelCls}>
            UK retailers <Optional />
          </label>
          <textarea
            id="ukLinks"
            name="ukLinks"
            rows={3}
            defaultValue={
              initial?.ukLinks
                ?.map((l) => `${l.retailer} | ${l.url}`)
                .join("\n") ?? ""
            }
            placeholder={
              "https://www.amazon.co.uk/dp/...\nhttps://www.boots.com/...\nhttps://www.lookfantastic.com/..."
            }
            className={textareaCls}
          />
          <p className="mt-1 text-xs text-stone-500">
            Same format as India.
          </p>
        </div>
      </Section>

      <Section
        title="Review"
        description="Add as much or as little as you want. The summary shows on the card; the body is the full prose."
      >
        <div>
          <label htmlFor="summary" className={labelCls}>
            Summary <Optional />
          </label>
          <input
            id="summary"
            name="summary"
            defaultValue={initial?.summary ?? ""}
            placeholder="The first cleanse I've actually stuck with."
            className={inputCls}
          />
          <p className="mt-1 text-xs text-stone-500">
            Shown on the listing card. One sentence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="pros" className={labelCls}>
              Pros <Optional />
            </label>
            <textarea
              id="pros"
              name="pros"
              rows={4}
              defaultValue={initial?.pros?.join("\n") ?? ""}
              placeholder={"Melts sunscreen off\nRinses clean"}
              className={textareaCls}
            />
            <p className="mt-1 text-xs text-stone-500">One per line.</p>
          </div>
          <div>
            <label htmlFor="cons" className={labelCls}>
              Cons <Optional />
            </label>
            <textarea
              id="cons"
              name="cons"
              rows={4}
              defaultValue={initial?.cons?.join("\n") ?? ""}
              placeholder={"Jar packaging\nGoes fast"}
              className={textareaCls}
            />
            <p className="mt-1 text-xs text-stone-500">One per line.</p>
          </div>
        </div>

        <div>
          <label htmlFor="body" className={labelCls}>
            Body (markdown) <Optional />
          </label>
          <textarea
            id="body"
            name="body"
            rows={12}
            defaultValue={initial?.body ?? ""}
            placeholder={"## Why I bought it\n\n…\n\n## How I use it\n\n…"}
            className={textareaCls}
          />
        </div>
      </Section>

      <div className="sticky bottom-4 z-10">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="mb-3 font-mono text-xs text-stone-600">
            {isEdit ? "Editing" : "Saves to"}{" "}
            <span className="text-stone-900">
              content/{kind}/{slug}.mdx
            </span>
          </div>

          {state?.ok === false && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </div>
          )}

          {state?.ok && (
            <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
              {state.message}{" "}
              {state.kind && state.slug && (
                <Link
                  href={`/${state.kind}/${state.slug}`}
                  className="font-medium underline underline-offset-2"
                >
                  View →
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-6 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50 sm:w-auto"
          >
            {pending
              ? "Committing…"
              : isEdit
                ? "Update review"
                : "Save review"}
          </button>
        </div>
      </div>
    </form>
  );
}
