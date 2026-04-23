import { z } from "zod";

export const frontmatterSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  category: z.string().min(1),
  rating: z.number().min(0).max(10),
  price: z.string().optional(),
  skinType: z.array(z.string()).optional(),
  goal: z.array(z.string()).optional(),
  photo: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  repurchase: z.boolean().default(false),
  datePublished: z.string(),
  summary: z.string().min(1),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;
