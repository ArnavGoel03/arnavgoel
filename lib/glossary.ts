/**
 * Quick-reference glossary: short, canonical definitions for the
 * skincare and supplement terms that show up across the reviews and
 * primers. **The glossary is the canonical source for "what is X".**
 * Primers should not redefine a term inline; they should rely on the
 * glossary entry and instead cover combinations, dosing, or how to
 * read labels.
 *
 * Each entry:
 *   term     — the canonical name (matches a primer title where one
 *              exists, so the primer-detail page can auto-link back)
 *   slug     — anchor used by /glossary#<slug> deep-links
 *   also     — synonyms / alt names readers might search for
 *   domain   — skincare / supplement / general (for the colour chip)
 *   body     — one paragraph; never longer
 *   seeAlso  — cross-link to the primer that goes deep on this term
 */

export type GlossaryEntry = {
  term: string;
  slug: string;
  also?: string[];
  domain: "skincare" | "supplement" | "general";
  body: string;
  seeAlso?: { label: string; href: string }[];
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "Active",
    slug: "active",
    domain: "general",
    body: "The functional ingredient in a formula, the part that actually drives the effect (retinol in a retinol serum, niacinamide in a niacinamide cream, magnesium glycinate in a sleep-stack capsule). Marketing copy often hides actives behind brand names; the ingredients list does not.",
  },
  {
    term: "AHA",
    slug: "aha",
    also: ["alpha hydroxy acid", "glycolic acid", "lactic acid", "mandelic acid"],
    domain: "skincare",
    body: "Water-soluble exfoliant that loosens the bonds between dead surface cells. Glycolic is the smallest molecule and most aggressive; lactic is gentler and hydrating; mandelic is the gentlest and the safest on darker skin tones.",
    seeAlso: [{ label: "AHA / BHA / PHA primer", href: "/primers/aha-bha-pha" }],
  },
  {
    term: "Ashwagandha (KSM-66)",
    slug: "ashwagandha",
    also: ["withania somnifera", "KSM-66", "Sensoril"],
    domain: "supplement",
    body: "Adaptogen with the strongest stress-cortisol clinical data. KSM-66 is the most-studied root extract (5% withanolides, 600 mg/day, balanced and non-sedating). Sensoril is the root + leaf, more sedating, better for evening dosing. Cycle off every 6 months because long-term safety data thins past that.",
    seeAlso: [{ label: "Ashwagandha primer", href: "/primers/ashwagandha" }],
  },
  {
    term: "Azelaic acid",
    slug: "azelaic-acid",
    domain: "skincare",
    body: "Dicarboxylic acid that is anti-inflammatory, anti-bacterial, and mildly tyrosinase-inhibiting all at once. Better tolerated than retinoids on rosacea, melasma, and post-inflammatory pigmentation. OTC up to 10%, prescription Finacea at 15%.",
    seeAlso: [{ label: "Azelaic acid primer", href: "/primers/azelaic-acid" }],
  },
  {
    term: "Bakuchiol",
    slug: "bakuchiol",
    domain: "skincare",
    body: "Plant-derived compound from Psoralea corylifolia, marketed as a 'retinol alternative'. Modest data on photoaging at 0.5-1%; less irritating than retinol but also weaker. A reasonable pick for pregnancy, breastfeeding, or barriers that cannot tolerate retinoids; not a replacement when retinoids are usable.",
    seeAlso: [{ label: "Bakuchiol primer", href: "/primers/bakuchiol" }],
  },
  {
    term: "Barrier",
    slug: "barrier",
    also: ["skin barrier", "moisture barrier"],
    domain: "skincare",
    body: "The outermost layer of skin that holds water in and irritants out. Built from corneocytes (dead skin cells) cemented by lipids: ceramides, cholesterol, fatty acids. A 'damaged barrier' means tight, red, easily-irritated skin; barrier-repair products are formulated to top those lipids back up.",
    seeAlso: [{ label: "Ceramides primer", href: "/primers/ceramides" }],
  },
  {
    term: "BHA",
    slug: "bha",
    also: ["beta hydroxy acid", "salicylic acid"],
    domain: "skincare",
    body: "Oil-soluble exfoliant. Slips into the pore lining and clears the gunk that AHAs (which work on the surface) cannot reach. Best for blackheads and oily-skin acne. Salicylic acid is the only real BHA in cosmetics.",
    seeAlso: [{ label: "AHA / BHA / PHA primer", href: "/primers/aha-bha-pha" }],
  },
  {
    term: "Broad spectrum",
    slug: "broad-spectrum",
    domain: "skincare",
    body: "Sunscreen that protects against both UVA (the aging rays) and UVB (the burning rays). Without 'broad spectrum' on the label, the product may have a high SPF but leave UVA-driven photoaging unaddressed. Always pick broad-spectrum.",
    seeAlso: [{ label: "Sunscreen 101 primer", href: "/primers/sunscreen-101" }],
  },
  {
    term: "Caffeine (topical)",
    slug: "caffeine",
    domain: "skincare",
    body: "Vasoconstrictor used in eye creams to temporarily reduce the look of under-eye puffiness; modest evidence for cellulite-cream claims. Effect is short-lived and cosmetic. Topical caffeine has no relationship to oral caffeine intake.",
    seeAlso: [{ label: "Caffeine primer", href: "/primers/caffeine" }],
  },
  {
    term: "Ceramides",
    slug: "ceramides",
    domain: "skincare",
    body: "Lipids that make up roughly half of the skin barrier's cement. Topical ceramides (Ceramide NP, AP, EOP) get incorporated into the barrier within hours and are the single most-evidenced ingredient for repairing dryness and irritation. Look for them paired with cholesterol and fatty acids in a 1:1:1 ratio.",
    seeAlso: [{ label: "Ceramides primer", href: "/primers/ceramides" }],
  },
  {
    term: "Collagen",
    slug: "collagen",
    domain: "supplement",
    body: "Hydrolyzed collagen peptides (10-15 g/day) show modest evidence for skin elasticity, joint comfort, and nail strength over 8-12 weeks. The mechanism is not 'eat collagen, become collagen', it is amino-acid signalling. Vitamin C is required for endogenous collagen synthesis; pair them.",
    seeAlso: [{ label: "Collagen primer", href: "/primers/collagen" }],
  },
  {
    term: "Comedogenic",
    slug: "comedogenic",
    domain: "skincare",
    body: "Pore-clogging. The 1980s rabbit-ear comedogenicity scale (0 to 5) is widely cited and largely unreliable; ingredient context, concentration, and your own skin matter more than any list. Useful as a heuristic, not as gospel.",
  },
  {
    term: "Creatine monohydrate",
    slug: "creatine-monohydrate",
    domain: "supplement",
    body: "The single most-studied performance supplement. 3-5 g per day, no loading required, no cycling. Strength, power, and (newer evidence) cognitive benefits under sleep deprivation. Side effect to know: ~1 kg water-weight gain in the first month, which is intracellular and what the supplement is doing.",
    seeAlso: [{ label: "Creatine primer", href: "/primers/creatine" }],
  },
  {
    term: "EPA / DHA",
    slug: "epa-dha",
    also: ["omega-3", "fish oil"],
    domain: "supplement",
    body: "The two omega-3 fatty acids with the most clinical evidence. EPA is the anti-inflammatory; DHA is the brain and retina structural one. Total combined dose for general use is 1-2 g per day, ideally from triglyceride-form fish oil for absorption.",
    seeAlso: [{ label: "Omega-3 primer", href: "/primers/omega-3" }],
  },
  {
    term: "Hyaluronic acid",
    slug: "hyaluronic-acid",
    also: ["HA", "sodium hyaluronate"],
    domain: "skincare",
    body: "A humectant glycosaminoglycan that binds up to 1000x its weight in water. Topical HA hydrates the surface, it does not plump the dermis. Layer on damp skin, then seal with a moisturizer; otherwise in dry climates it can pull water from skin instead of into it.",
    seeAlso: [{ label: "Hyaluronic acid primer", href: "/primers/hyaluronic-acid" }],
  },
  {
    term: "L-threonate",
    slug: "l-threonate",
    also: ["magnesium L-threonate", "Magtein"],
    domain: "supplement",
    body: "The only magnesium form clinically shown to cross the blood-brain barrier in meaningful amounts. Branded as Magtein. Used for cognition, memory, and as a sleep adjuvant. Taken with the glycinate, not instead of it.",
    seeAlso: [{ label: "Magnesium forms primer", href: "/primers/magnesium-forms" }],
  },
  {
    term: "Magnesium glycinate",
    slug: "magnesium-glycinate",
    domain: "supplement",
    body: "Magnesium chelated to glycine. Higher absorption than the citrate or oxide forms, much gentler on the stomach. The right choice for sleep, anxiety, and recovery doses (200-400 mg elemental magnesium nightly). L-threonate is the brain-targeted variant.",
    seeAlso: [{ label: "Magnesium forms primer", href: "/primers/magnesium-forms" }],
  },
  {
    term: "Melatonin",
    slug: "melatonin",
    domain: "supplement",
    body: "Endogenous sleep-onset hormone. Effective at low doses (0.3-0.5 mg) for circadian shift (jet lag, shift work); the 5-10 mg doses commonly sold are pharmacological, not physiological, and the next-day grogginess is the giveaway. Not a sedative; a chronobiotic.",
    seeAlso: [{ label: "Melatonin primer", href: "/primers/melatonin" }],
  },
  {
    term: "Niacinamide",
    slug: "niacinamide",
    also: ["vitamin B3", "nicotinamide"],
    domain: "skincare",
    body: "Form of vitamin B3 used in skincare at 2-10%. Strengthens the barrier (boosts ceramide synthesis), regulates sebum, fades post-inflammatory pigmentation, reduces redness. The 'do not mix with vitamin C' warning is from a 1960s raw-chemistry study and does not apply to modern formulations.",
    seeAlso: [{ label: "Niacinamide primer", href: "/primers/niacinamide" }],
  },
  {
    term: "NMF",
    slug: "nmf",
    also: ["natural moisturizing factor"],
    domain: "skincare",
    body: "The cocktail of small, water-binding molecules the skin makes naturally: amino acids, lactic acid, urea, sodium PCA. Topical 'NMF' products top up what is already there; they hydrate but do not seal moisture in (occlusives do that).",
  },
  {
    term: "Occlusive",
    slug: "occlusive",
    domain: "skincare",
    body: "Ingredient that sits on top of the skin and physically blocks water from evaporating. Petrolatum (Vaseline / Aquaphor) is the gold standard. The 'slugging' trend at night is just applying an occlusive after the rest of the routine.",
  },
  {
    term: "P5P",
    slug: "p5p",
    also: ["pyridoxal-5-phosphate", "active B6"],
    domain: "supplement",
    body: "The activated form of vitamin B6, what the body converts standard pyridoxine into anyway. P5P is the right choice if you have MTHFR or related methylation issues, or if you are already on a multi and want minimal conversion overhead.",
  },
  {
    term: "Peptides",
    slug: "peptides",
    domain: "skincare",
    body: "Short chains of amino acids that signal skin to make more collagen, elastin, or stop breaking them down. Matrixyl (palmitoyl pentapeptide-4) and copper peptides have the most repeated trial data; argireline is the 'topical Botox' marketing peptide with the weakest evidence. Effects are gradual and modest; pair with retinoids and sunscreen for the actual heavy lifting.",
    seeAlso: [{ label: "Peptides primer", href: "/primers/peptides" }],
  },
  {
    term: "PHA",
    slug: "pha",
    also: ["polyhydroxy acid", "gluconolactone", "lactobionic acid"],
    domain: "skincare",
    body: "Larger-molecule exfoliant family. Sits on top of the skin rather than penetrating, so the cell-turnover effect is gentler and the irritation is lower. The right starter exfoliant for sensitive or barrier-compromised skin.",
    seeAlso: [{ label: "AHA / BHA / PHA primer", href: "/primers/aha-bha-pha" }],
  },
  {
    term: "Retinoid",
    slug: "retinoid",
    also: ["retinol", "tretinoin", "adapalene", "retinaldehyde"],
    domain: "skincare",
    body: "Vitamin A derivatives. Retinol → retinaldehyde → tretinoin in increasing potency; adapalene is a synthetic third-gen that is gentler on the barrier but not noticeably weaker on acne. The single best-evidenced topical for both anti-acne and anti-aging.",
    seeAlso: [{ label: "Retinoids primer", href: "/primers/retinoids" }],
  },
  {
    term: "SPF",
    slug: "spf",
    also: ["sun protection factor"],
    domain: "skincare",
    body: "How much UVB the sunscreen blocks at the testing dose (2 mg per cm²). SPF 30 blocks ~97%, SPF 50 ~98%, SPF 100 ~99%. The relevant truth: people apply about a quarter of the testing dose, so the higher number gives more headroom against sloppy application, not more theoretical protection.",
    seeAlso: [{ label: "Sunscreen 101 primer", href: "/primers/sunscreen-101" }],
  },
  {
    term: "Vitamin B12",
    slug: "vitamin-b12",
    also: ["cobalamin", "methylcobalamin", "cyanocobalamin"],
    domain: "supplement",
    body: "Water-soluble vitamin essential for nerve function and red-blood-cell formation. Methylcobalamin is the activated form, preferred for sublingual or oral supplementation. Vegetarians, vegans, and people on long-term metformin or PPIs need it; everyone else gets enough from diet. Test serum B12 (or MMA for borderline cases) before assuming deficiency.",
    seeAlso: [{ label: "Vitamin B12 primer", href: "/primers/vitamin-b12" }],
  },
  {
    term: "Vitamin C (topical)",
    slug: "vitamin-c",
    also: ["L-ascorbic acid", "ascorbyl glucoside", "MAP", "tetrahexyldecyl ascorbate"],
    domain: "skincare",
    body: "Antioxidant that brightens, evens tone, and provides daytime UV-damage support paired with sunscreen. L-ascorbic acid (10-20%) at low pH is the best-evidenced form but unstable. THD ascorbate and ascorbyl glucoside are stable derivatives that convert to active C in the skin; weaker per percent but easier to formulate.",
    seeAlso: [{ label: "Vitamin C primer", href: "/primers/vitamin-c" }],
  },
  {
    term: "Vitamin D3",
    slug: "vitamin-d3",
    also: ["cholecalciferol", "25-OH vitamin D"],
    domain: "supplement",
    body: "Fat-soluble vitamin and pre-hormone. Test 25-OH vitamin D before dosing; aim for 30-50 ng/mL (75-125 nmol/L). 1,000-4,000 IU/day is the typical maintenance range; pair with K2 (MK-7) for cardiovascular safety and with a fatty meal for absorption. More is not better past a serum level of ~60 ng/mL.",
    seeAlso: [{ label: "Vitamin D3 primer", href: "/primers/vitamin-d3" }],
  },
];

/**
 * Resolve a term (or alternate name, or primer slug) to its glossary
 * entry. Used by primer detail pages so the primer can link back to
 * the canonical short definition rather than redefining inline.
 */
export function findGlossaryEntry(input: string): GlossaryEntry | null {
  if (!input) return null;
  const norm = input.toLowerCase();
  for (const e of GLOSSARY) {
    if (e.slug === norm) return e;
    if (e.term.toLowerCase() === norm) return e;
    if (e.also?.some((a) => a.toLowerCase() === norm)) return e;
  }
  // Try a primer-slug match: any seeAlso href that ends with /primers/<slug>.
  for (const e of GLOSSARY) {
    if (!e.seeAlso) continue;
    if (
      e.seeAlso.some((s) =>
        s.href.toLowerCase().endsWith(`/primers/${norm}`),
      )
    ) {
      return e;
    }
  }
  return null;
}
