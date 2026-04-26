/**
 * Quick-reference glossary for skincare and supplement terms readers
 * keep encountering across the reviews. Different from /primers in
 * that the entries are short definitions, not deep-dive pages.
 *
 * Each entry: term, optional shorthand, one-paragraph definition,
 * optional cross-link to a primer or review for the full story.
 */

export type GlossaryEntry = {
  term: string;
  also?: string[];
  domain: "skincare" | "supplement" | "general";
  body: string;
  seeAlso?: { label: string; href: string }[];
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "Active",
    domain: "general",
    body: "The functional ingredient in a formula, the part that actually drives the effect (retinol in a retinol serum, niacinamide in a niacinamide cream, magnesium glycinate in a sleep-stack capsule). Marketing copy often hides actives behind brand names; the ingredients list does not.",
  },
  {
    term: "Barrier",
    also: ["skin barrier", "moisture barrier"],
    domain: "skincare",
    body: "The outermost layer of skin that holds water in and irritants out. Built from corneocytes (dead skin cells) cemented by lipids: ceramides, cholesterol, fatty acids. A 'damaged barrier' means tight, red, easily-irritated skin; barrier-repair products are formulated to top those lipids back up.",
    seeAlso: [{ label: "Niacinamide primer", href: "/primers/niacinamide" }],
  },
  {
    term: "BHA",
    also: ["beta hydroxy acid", "salicylic acid"],
    domain: "skincare",
    body: "Oil-soluble exfoliant. Slips into the pore lining and clears the gunk that AHAs (which work on the surface) can't reach. Best for blackheads and oily-skin acne. Salicylic acid is the only real BHA in cosmetics.",
    seeAlso: [{ label: "AHA / BHA / PHA primer", href: "/primers/aha-bha-pha" }],
  },
  {
    term: "AHA",
    also: ["alpha hydroxy acid", "glycolic acid", "lactic acid", "mandelic acid"],
    domain: "skincare",
    body: "Water-soluble exfoliant that loosens the bonds between dead surface cells. Glycolic is the smallest molecule and most aggressive; lactic is gentler and hydrating; mandelic is the gentlest and the safest on darker skin tones.",
    seeAlso: [{ label: "AHA / BHA / PHA primer", href: "/primers/aha-bha-pha" }],
  },
  {
    term: "PHA",
    also: ["polyhydroxy acid", "gluconolactone", "lactobionic acid"],
    domain: "skincare",
    body: "Larger-molecule exfoliant family. Sits on top of the skin rather than penetrating, so the cell-turnover effect is gentler and the irritation is lower. The right starter exfoliant for sensitive or barrier-compromised skin.",
  },
  {
    term: "Comedogenic",
    domain: "skincare",
    body: "Pore-clogging. The 1980s rabbit-ear comedogenicity scale (0 to 5) is widely cited and largely unreliable; ingredient context, concentration, and your own skin matter more than any list. Useful as a heuristic, not as gospel.",
  },
  {
    term: "Ceramides",
    domain: "skincare",
    body: "Lipids that make up roughly half of the skin barrier's cement. Topical ceramides (Ceramide NP, AP, EOP) get incorporated into the barrier within hours and are the single most-evidenced ingredient for repairing dryness and irritation. Look for them paired with cholesterol and fatty acids in a 1:1:1 ratio.",
    seeAlso: [{ label: "Niacinamide primer", href: "/primers/niacinamide" }],
  },
  {
    term: "Retinoid",
    also: ["retinol", "tretinoin", "adapalene", "retinaldehyde"],
    domain: "skincare",
    body: "Vitamin A derivatives. Retinol → retinaldehyde → tretinoin in increasing potency; adapalene is a synthetic third-gen that is gentler on the barrier but not noticeably weaker on acne. The single best-evidenced topical for both anti-acne and anti-aging.",
  },
  {
    term: "SPF",
    also: ["sun protection factor"],
    domain: "skincare",
    body: "How much UVB the sunscreen blocks at the testing dose (2 mg per cm²). SPF 30 blocks ~97%, SPF 50 ~98%, SPF 100 ~99%. The relevant truth: people apply about a quarter of the testing dose, so the higher number gives more headroom against sloppy application, not more theoretical protection.",
  },
  {
    term: "Broad spectrum",
    domain: "skincare",
    body: "Sunscreen that protects against both UVA (the aging rays) and UVB (the burning rays). Without 'broad spectrum' on the label, the product may have a high SPF but leave UVA-driven photoaging unaddressed. Always pick broad-spectrum.",
  },
  {
    term: "NMF",
    also: ["natural moisturizing factor"],
    domain: "skincare",
    body: "The cocktail of small, water-binding molecules the skin makes naturally: amino acids, lactic acid, urea, sodium PCA. Topical 'NMF' products top up what's already there; they hydrate but do not seal moisture in (occlusives do that).",
  },
  {
    term: "Occlusive",
    domain: "skincare",
    body: "Ingredient that sits on top of the skin and physically blocks water from evaporating. Petrolatum (Vaseline / Aquaphor) is the gold standard. The 'slugging' trend at night is just applying an occlusive after the rest of the routine.",
  },
  {
    term: "EPA / DHA",
    domain: "supplement",
    body: "The two omega-3 fatty acids with the most clinical evidence. EPA is the anti-inflammatory; DHA is the brain and retina structural one. Total combined dose for general use is 1–2 g per day, ideally from triglyceride-form fish oil for absorption.",
    seeAlso: [{ label: "Omega-3 primer", href: "/primers/omega-3" }],
  },
  {
    term: "Magnesium glycinate",
    domain: "supplement",
    body: "Magnesium chelated to glycine. Higher absorption than the citrate or oxide forms, much gentler on the stomach. The right choice for sleep, anxiety, and recovery doses (200–400 mg elemental magnesium nightly). L-threonate is the brain-targeted variant.",
    seeAlso: [{ label: "Magnesium primer", href: "/primers/magnesium" }],
  },
  {
    term: "L-threonate",
    also: ["magnesium L-threonate", "Magtein"],
    domain: "supplement",
    body: "The only magnesium form clinically shown to cross the blood-brain barrier in meaningful amounts. Branded as Magtein. Used for cognition, memory, and as a sleep adjuvant. Taken with the glycinate, not instead of it.",
  },
  {
    term: "Creatine monohydrate",
    domain: "supplement",
    body: "The single most-studied performance supplement. 3–5 g per day, no loading required, no cycling. Strength, power, and (newer evidence) cognitive benefits under sleep deprivation. Side effect to know: ~1 kg water-weight gain in the first month, which is intracellular and what the supplement is doing.",
    seeAlso: [{ label: "Creatine primer", href: "/primers/creatine" }],
  },
  {
    term: "Ashwagandha (KSM-66)",
    domain: "supplement",
    body: "Adaptogen with the strongest stress-cortisol clinical data. KSM-66 is the most-studied extract. Dose: 600 mg per day. Effect window: 4–8 weeks. Cycle off every 6 months because the long-term safety dataset thins out past that.",
    seeAlso: [{ label: "Ashwagandha primer", href: "/primers/ashwagandha" }],
  },
  {
    term: "P5P",
    also: ["pyridoxal-5-phosphate", "active B6"],
    domain: "supplement",
    body: "The activated form of vitamin B6, what the body converts standard pyridoxine into anyway. P5P is the right choice if you have MTHFR or related methylation issues, or if you're already on a multi and want minimal conversion overhead.",
  },
];
