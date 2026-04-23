"use server";

import { z } from "zod";
import { put } from "@vercel/blob";
import { commitRepoFile, readRepoFile } from "@/lib/github";
import { retailerForUrl } from "@/lib/retailers";

const reviewSchema = z.object({
  kind: z.enum(["skincare", "supplements", "oral-care"]),
  name: z.string().trim().min(1, "required"),
  brand: z.string().trim().min(1, "required"),
  category: z.string().trim().min(1, "required"),
  rating: z
    .string()
    .optional()
    .transform((v) => {
      if (v === undefined || v === "") return undefined;
      const n = Number(v);
      return isNaN(n) ? undefined : n;
    }),
  effectRating: z
    .string()
    .optional()
    .transform((v) => {
      if (v === undefined || v === "") return undefined;
      const n = Number(v);
      return isNaN(n) ? undefined : n;
    }),
  valueRating: z
    .string()
    .optional()
    .transform((v) => {
      if (v === undefined || v === "") return undefined;
      const n = Number(v);
      return isNaN(n) ? undefined : n;
    }),
  toleranceRating: z
    .string()
    .optional()
    .transform((v) => {
      if (v === undefined || v === "") return undefined;
      const n = Number(v);
      return isNaN(n) ? undefined : n;
    }),
  hidden: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean(),
  ),
  price: z.string().trim().optional(),
  skinType: z.string().optional(),
  goal: z.string().optional(),
  photo: z.string().trim().optional(),
  boughtFromUrl: z
    .string()
    .trim()
    .url("must be a valid URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  indiaLinks: z.string().optional(),
  westernLinks: z.string().optional(),
  ukLinks: z.string().optional(),
  ingredients: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  repurchase: z.preprocess(
    (v) => {
      if (v === undefined || v === "" || v === "undecided") return undefined;
      if (v === "yes" || v === "on" || v === "true" || v === true) return true;
      if (v === "no" || v === "false" || v === false) return false;
      return undefined;
    },
    z.boolean().optional(),
  ),
  datePublished: z.string().trim().min(1, "required"),
  summary: z.string().optional().transform((v) => (v ?? "").trim()),
  body: z.string().optional(),
});

const photoSchema = z.object({
  alt: z.string().trim().min(1, "required"),
  caption: z.string().trim().min(1, "required"),
  location: z.string().trim().optional(),
  date: z.string().trim().min(1, "required"),
  width: z.coerce.number().int().positive(),
  height: z.coerce.number().int().positive(),
});

function slugify(s: string): string {
  return s
    .normalize("NFKD")
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseList(s: string | undefined): string[] {
  return (s ?? "").split(",").map((x) => x.trim()).filter(Boolean);
}

function parseLines(s: string | undefined): string[] {
  return (s ?? "").split("\n").map((x) => x.trim()).filter(Boolean);
}

function parseBuyLinks(
  s: string | undefined,
): { retailer: string; url: string }[] {
  const out: { retailer: string; url: string }[] = [];
  for (const line of parseLines(s)) {
    let retailer: string;
    let url: string;
    if (line.includes("|")) {
      const [r, u] = line.split("|", 2).map((x) => x.trim());
      retailer = r || retailerForUrl(u);
      url = u;
    } else {
      url = line;
      retailer = retailerForUrl(line);
    }
    try {
      new URL(url);
    } catch {
      continue;
    }
    out.push({ retailer, url });
  }
  return out;
}

function yamlString(s: string): string {
  if (/^[-?*&!|>'"%@`#[{,]/.test(s) || /[:\n#]/.test(s)) {
    return JSON.stringify(s);
  }
  return s;
}

function buildReviewMdx(d: {
  name: string;
  brand: string;
  category: string;
  rating?: number;
  ratings?: { effect?: number; value?: number; tolerance?: number };
  hidden?: boolean;
  price?: string;
  skinType: string[];
  goal: string[];
  photo?: string;
  boughtFromUrl?: string;
  indiaLinks: { retailer: string; url: string }[];
  westernLinks: { retailer: string; url: string }[];
  ukLinks: { retailer: string; url: string }[];
  ingredients: string[];
  pros: string[];
  cons: string[];
  repurchase?: boolean;
  datePublished: string;
  summary: string;
  body: string;
}): string {
  const lines: string[] = ["---"];
  lines.push(`name: ${yamlString(d.name)}`);
  lines.push(`brand: ${yamlString(d.brand)}`);
  lines.push(`category: ${yamlString(d.category)}`);
  if (typeof d.rating === "number") lines.push(`rating: ${d.rating}`);
  if (d.ratings) {
    const r = d.ratings;
    const entries: string[] = [];
    if (typeof r.effect === "number") entries.push(`effect: ${r.effect}`);
    if (typeof r.value === "number") entries.push(`value: ${r.value}`);
    if (typeof r.tolerance === "number")
      entries.push(`tolerance: ${r.tolerance}`);
    if (entries.length) {
      lines.push("ratings:");
      for (const e of entries) lines.push(`  ${e}`);
    }
  }
  if (d.hidden) lines.push(`hidden: true`);
  if (d.price) lines.push(`price: ${yamlString(d.price)}`);
  if (d.skinType.length) lines.push(`skinType: [${d.skinType.join(", ")}]`);
  if (d.goal.length) lines.push(`goal: [${d.goal.join(", ")}]`);
  if (d.photo) lines.push(`photo: ${yamlString(d.photo)}`);
  if (d.boughtFromUrl)
    lines.push(`boughtFromUrl: ${JSON.stringify(d.boughtFromUrl)}`);
  if (d.indiaLinks.length) {
    lines.push("indiaLinks:");
    for (const l of d.indiaLinks) {
      lines.push(
        `  - { retailer: ${JSON.stringify(l.retailer)}, url: ${JSON.stringify(l.url)} }`,
      );
    }
  }
  if (d.westernLinks.length) {
    lines.push("westernLinks:");
    for (const l of d.westernLinks) {
      lines.push(
        `  - { retailer: ${JSON.stringify(l.retailer)}, url: ${JSON.stringify(l.url)} }`,
      );
    }
  }
  if (d.ukLinks.length) {
    lines.push("ukLinks:");
    for (const l of d.ukLinks) {
      lines.push(
        `  - { retailer: ${JSON.stringify(l.retailer)}, url: ${JSON.stringify(l.url)} }`,
      );
    }
  }
  if (d.ingredients.length)
    lines.push(`ingredients: [${d.ingredients.join(", ")}]`);
  if (d.pros.length) {
    lines.push("pros:");
    for (const p of d.pros) lines.push(`  - ${p}`);
  }
  if (d.cons.length) {
    lines.push("cons:");
    for (const c of d.cons) lines.push(`  - ${c}`);
  }
  if (typeof d.repurchase === "boolean")
    lines.push(`repurchase: ${d.repurchase}`);
  lines.push(`datePublished: "${d.datePublished}"`);
  if (d.summary) lines.push(`summary: ${yamlString(d.summary)}`);
  lines.push("---");
  lines.push("");
  lines.push(d.body.trim());
  lines.push("");
  return lines.join("\n");
}

export type ActionState = {
  ok: boolean;
  error?: string;
  message?: string;
  slug?: string;
  kind?: "skincare" | "supplements" | "oral-care";
  path?: string;
};

function buildContentFromForm(d: z.infer<typeof reviewSchema>): string {
  const ratings =
    d.effectRating !== undefined ||
    d.valueRating !== undefined ||
    d.toleranceRating !== undefined
      ? {
          effect: d.effectRating,
          value: d.valueRating,
          tolerance: d.toleranceRating,
        }
      : undefined;
  return buildReviewMdx({
    name: d.name,
    brand: d.brand,
    category: d.category,
    rating: d.rating,
    ratings,
    hidden: d.hidden,
    price: d.price || undefined,
    skinType: d.kind === "skincare" ? parseList(d.skinType) : [],
    goal: d.kind === "skincare" ? [] : parseList(d.goal),
    photo: d.photo || undefined,
    boughtFromUrl: d.boughtFromUrl,
    indiaLinks: parseBuyLinks(d.indiaLinks),
    westernLinks: parseBuyLinks(d.westernLinks),
    ukLinks: parseBuyLinks(d.ukLinks),
    ingredients: parseList(d.ingredients),
    pros: parseLines(d.pros),
    cons: parseLines(d.cons),
    repurchase: d.repurchase,
    datePublished: d.datePublished,
    summary: d.summary,
    body: d.body ?? "",
  });
}

export async function createReview(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues
        .map((i) => `${i.path.join(".") || "form"}: ${i.message}`)
        .join("; "),
    };
  }
  const d = parsed.data;
  const slug = slugify(`${d.brand} ${d.name}`);
  if (!slug) return { ok: false, error: "Could not generate slug." };

  const repoPath = `content/${d.kind}/${slug}.mdx`;

  try {
    await commitRepoFile({
      path: repoPath,
      content: buildContentFromForm(d),
      message: `Add ${d.brand} ${d.name} (${d.kind})`,
      expectExisting: false,
    });
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }

  return {
    ok: true,
    slug,
    kind: d.kind,
    path: repoPath,
    message: `Committed ${repoPath}. Live in ~30–60s once Vercel redeploys.`,
  };
}

export async function updateReview(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const slug = (formData.get("slug") ?? "").toString().trim();
  if (!slug) return { ok: false, error: "Missing slug — can't locate the file to update." };

  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues
        .map((i) => `${i.path.join(".") || "form"}: ${i.message}`)
        .join("; "),
    };
  }
  const d = parsed.data;
  const repoPath = `content/${d.kind}/${slug}.mdx`;

  try {
    await commitRepoFile({
      path: repoPath,
      content: buildContentFromForm(d),
      message: `Update ${d.brand} ${d.name} (${d.kind})`,
    });
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }

  return {
    ok: true,
    slug,
    kind: d.kind,
    path: repoPath,
    message: `Updated ${repoPath}. Live in ~30–60s once Vercel redeploys.`,
  };
}

export async function uploadProductImage(
  formData: FormData,
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file received." };
  }
  const origName = file.name || "upload";
  const ext = origName.includes(".") ? origName.split(".").pop()! : "bin";
  const base =
    origName
      .replace(/\.[^.]+$/, "")
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "product";
  const key = `products/${base}-${Date.now()}.${ext}`;
  try {
    const blob = await put(key, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });
    return { ok: true, url: blob.url };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function createPhoto(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Please choose an image file." };
  }
  const parsed = photoSchema.safeParse({
    alt: formData.get("alt"),
    caption: formData.get("caption"),
    location: formData.get("location"),
    date: formData.get("date"),
    width: formData.get("width"),
    height: formData.get("height"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues
        .map((i) => `${i.path.join(".") || "form"}: ${i.message}`)
        .join("; "),
    };
  }
  const meta = parsed.data;

  const origName = file.name || "upload";
  const ext = origName.includes(".") ? origName.split(".").pop()! : "bin";
  const base = origName
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "photo";
  const key = `photos/originals/${meta.date}-${base}-${Date.now()}.${ext}`;

  let uploadedUrl: string;
  try {
    const blob = await put(key, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });
    uploadedUrl = blob.url;
  } catch (err) {
    return { ok: false, error: `Blob upload failed: ${(err as Error).message}` };
  }

  const repoPath = "content/photos.json";
  try {
    const existing = await readRepoFile(repoPath);
    const current = existing ? (JSON.parse(existing) as unknown[]) : [];
    const entry = {
      src: uploadedUrl,
      alt: meta.alt,
      caption: meta.caption,
      location: meta.location || undefined,
      date: meta.date,
      width: meta.width,
      height: meta.height,
    };
    const next = [entry, ...current];
    const json = JSON.stringify(next, null, 2) + "\n";
    await commitRepoFile({
      path: repoPath,
      content: json,
      message: `Add photo: ${meta.caption.slice(0, 60)}`,
    });
  } catch (err) {
    return {
      ok: false,
      error: `Photo uploaded to Blob but commit failed: ${(err as Error).message}`,
    };
  }

  return {
    ok: true,
    path: repoPath,
    message: `Uploaded and committed. Live in ~30–60s once Vercel redeploys.`,
  };
}
