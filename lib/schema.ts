import { z } from "zod";

export const reviewFrontmatter = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  category: z.string().min(1),
  rating: z.number().min(0).max(10).optional(),
  ratings: z
    .object({
      effect: z.number().min(0).max(10).optional(),
      value: z.number().min(0).max(10).optional(),
      tolerance: z.number().min(0).max(10).optional(),
    })
    .optional(),
  price: z.string().optional(),
  skinType: z.array(z.string()).optional(),
  goal: z.array(z.string()).optional(),
  photo: z.string().optional(),
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
  datePublished: z.string(),
  summary: z.string().default(""),
});

export const noteFrontmatter = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  datePublished: z.string(),
  tags: z.array(z.string()).default([]),
});

export type ReviewFrontmatter = z.infer<typeof reviewFrontmatter>;
export type NoteFrontmatter = z.infer<typeof noteFrontmatter>;
