"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { createReview, type ActionState } from "./actions";
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
const inputCls =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-400";
const textareaCls = cn(inputCls, "resize-y font-mono");

export function ProductForm() {
  const [state, action, pending] = useActionState<ActionState | null, FormData>(
    createReview,
    null,
  );
  const [kind, setKind] = useState<"skincare" | "supplements" | "oral-care">(
    "skincare",
  );
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");

  const slug = useMemo(() => slugPreview(brand, name), [brand, name]);

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="kind" value={kind} />

      <div>
        <span className={labelCls}>Kind</span>
        <div className="flex gap-2">
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
              onClick={() => setKind(k.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                kind === k.value
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300",
              )}
            >
              {k.label}
            </button>
          ))}
        </div>
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
          <label htmlFor="rating" className={labelCls}>Rating (0–10)</label>
          <input
            id="rating"
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="10"
            placeholder="8.5"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="price" className={labelCls}>Price</label>
          <input id="price" name="price" placeholder="$20" className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="datePublished" className={labelCls}>Date published</label>
        <input
          id="datePublished"
          name="datePublished"
          type="date"
          defaultValue={today()}
          required
          className={cn(inputCls, "sm:max-w-xs")}
        />
      </div>

      {kind === "skincare" ? (
        <div>
          <label htmlFor="skinType" className={labelCls}>Skin type (comma-separated)</label>
          <input
            id="skinType"
            name="skinType"
            placeholder="dry, sensitive, normal"
            className={inputCls}
          />
        </div>
      ) : (
        <div>
          <label htmlFor="goal" className={labelCls}>
            {kind === "supplements" ? "Goal" : "Best for"} (comma-separated)
          </label>
          <input
            id="goal"
            name="goal"
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
        <label htmlFor="ingredients" className={labelCls}>Ingredients (comma-separated)</label>
        <input
          id="ingredients"
          name="ingredients"
          placeholder="Rice Bran Oil, Ginseng Extract, Shea Butter"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="photo" className={labelCls}>Photo URL (optional)</label>
        <input
          id="photo"
          name="photo"
          placeholder="/photos/beauty-of-joseon.jpg or https://..."
          className={inputCls}
        />
      </div>

      <div className="space-y-5 rounded-2xl border border-stone-200 bg-stone-50 p-5">
        <div>
          <span className={labelCls}>Purchase links (all optional)</span>
          <p className="-mt-1 mb-3 text-xs text-stone-500">
            Where you bought it goes up top. Regional links help readers find
            it locally.
          </p>
        </div>
        <div>
          <label htmlFor="boughtFromUrl" className={labelCls}>Bought from</label>
          <input
            id="boughtFromUrl"
            name="boughtFromUrl"
            type="url"
            placeholder="https://… (where you actually bought it)"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="buyIndiaUrl" className={labelCls}>Buy in India</label>
          <input
            id="buyIndiaUrl"
            name="buyIndiaUrl"
            type="url"
            placeholder="https://www.nykaa.com/…"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="buyWesternUrl" className={labelCls}>Buy in the US / West</label>
          <input
            id="buyWesternUrl"
            name="buyWesternUrl"
            type="url"
            placeholder="https://www.target.com/p/…"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="pros" className={labelCls}>Pros (one per line)</label>
          <textarea
            id="pros"
            name="pros"
            rows={4}
            placeholder={"Melts sunscreen off\nRinses clean"}
            className={textareaCls}
          />
        </div>
        <div>
          <label htmlFor="cons" className={labelCls}>Cons (one per line)</label>
          <textarea
            id="cons"
            name="cons"
            rows={4}
            placeholder={"Jar packaging\nGoes fast"}
            className={textareaCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="summary" className={labelCls}>Summary (shown on cards)</label>
        <input
          id="summary"
          name="summary"
          placeholder="The first cleanse I've actually stuck with."
          required
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="body" className={labelCls}>Body (markdown)</label>
        <textarea
          id="body"
          name="body"
          rows={14}
          placeholder={"## Why I bought it\n\n…\n\n## How I use it\n\n…"}
          className={textareaCls}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          name="repurchase"
          value="true"
          className="size-4 rounded border-stone-300"
        />
        I would repurchase this
      </label>

      <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-xs text-stone-600">
        Will commit to{" "}
        <span className="text-stone-900">content/{kind}/{slug}.mdx</span>
      </div>

      {state?.ok === false && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {state?.ok && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {state.message}{" "}
          {state.kind && state.slug && (
            <Link
              href={`/${state.kind}/${state.slug}`}
              className="font-medium underline underline-offset-2"
            >
              View review →
            </Link>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center gap-2 rounded-full bg-stone-900 px-6 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
      >
        {pending ? "Committing…" : "Save review"}
      </button>
    </form>
  );
}
