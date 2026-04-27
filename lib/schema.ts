import { z } from "zod";

export const reviewFrontmatter = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  category: z.string().min(1),
  verdict: z.enum(["recommend", "okay", "bad"]).optional(),
  ratings: z
    .object({
      effect: z.number().min(0).max(10).optional(),
      value: z.number().min(0).max(10).optional(),
      tolerance: z.number().min(0).max(10).optional(),
    })
    .optional(),
  price: z
    .union([
      z.string(),
      z.object({
        in: z.string().optional(),
        us: z.string().optional(),
        uk: z.string().optional(),
      }),
    ])
    .optional(),
  servingsPerContainer: z.number().positive().optional(),
  dailyServings: z.number().positive().optional(),
  skinType: z.array(z.string()).optional(),
  goal: z.array(z.string()).optional(),
  routines: z
    .array(z.enum(["morning", "evening", "stack", "shower"]))
    .default([]),
  photo: z.string().optional(),
  // Additional product shots (alt angles, packaging, in-use). Listing
  // cards cycle through these on hover; the detail-page gallery shows
  // them as slides. Distinct from `photoTimeline` (dated progress).
  photos: z.array(z.string()).default([]),
  // Optional product video (review walkthrough, application demo).
  // Detail page only, never the listing card. Accepts:
  //   - raw file URL (.mp4 / .webm / .mov) — rendered with <video>
  //   - YouTube watch / shorts / youtu.be URL — rendered as iframe
  //   - Vimeo URL — rendered as iframe
  video: z.string().url().optional(),
  photoTimeline: z
    .array(
      z.object({
        date: z.string(),
        src: z.string().min(1),
        note: z.string().optional(),
      }),
    )
    .default([]),
  boughtFromUrl: z.string().url().optional(),
  indiaLinks: z
    .array(z.object({ retailer: z.string().min(1), url: z.string().url() }))
    .default([]),
  westernLinks: z
    .array(z.object({ retailer: z.string().min(1), url: z.string().url() }))
    .default([]),
  ukLinks: z
    .array(z.object({ retailer: z.string().min(1), url: z.string().url() }))
    .default([]),
  ingredients: z.array(z.string()).optional(),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  repurchase: z.boolean().optional(),
  hidden: z.boolean().default(false),
  retired: z.boolean().default(false),
  retiredReason: z.string().optional(),
  datePublished: z.string(),
  lastUpdated: z.string().optional(),
  changelog: z
    .array(
      z.object({
        date: z.string(),
        note: z.string().min(1),
      }),
    )
    .default([]),
  summary: z.string().default(""),
});

/**
 * A Primer is a short, high-signal reference page.
 *   - `kind: "stack"`, a combined-together explainer (bone health, omega-3,
 *     the sleep stack). Usually includes a `stack` list of component parts.
 *   - `kind: "ingredient"`, a single-ingredient primer (niacinamide, retinoids,
 *     ceramides, magnesium forms).
 * `domain` toggles between supplement / skincare context for grouping on
 * the index page.
 */
export const primerFrontmatter = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  kind: z.enum(["stack", "ingredient"]),
  domain: z.enum(["supplement", "skincare", "oral", "meta"]),
  tags: z.array(z.string()).default([]),
  stack: z.array(z.string()).default([]),
  relatedProductSlugs: z.array(z.string()).default([]),
  datePublished: z.string(),
  lastUpdated: z.string().optional(),
});

export type ReviewFrontmatter = z.infer<typeof reviewFrontmatter>;
