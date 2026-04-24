import { describe, it, expect } from "vitest";
import {
  getAllReviews,
  getAllReviewsIncludingHidden,
  getNote,
  getNotes,
  getPrimer,
  getPrimers,
  getReview,
  getReviews,
} from "./content";
import type { Kind } from "./types";

/**
 * Content-loading smoke tests. These run against the real content/ directory
 * on purpose, if a frontmatter field drifts or a new review has bad YAML,
 * the tests fail before a bad deploy goes out.
 */

const KINDS: Kind[] = ["skincare", "supplements", "oral-care"];

describe("getReviews(), per kind", () => {
  for (const kind of KINDS) {
    it(`returns a valid array for ${kind} and all entries match the kind`, () => {
      const reviews = getReviews(kind);
      expect(Array.isArray(reviews)).toBe(true);
      for (const r of reviews) {
        expect(r.kind).toBe(kind);
        expect(r.slug).toMatch(/^[a-z0-9-]+$/);
        expect(r.brand.length).toBeGreaterThan(0);
        expect(r.name.length).toBeGreaterThan(0);
        expect(r.category.length).toBeGreaterThan(0);
        expect(r.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it(`sorts ${kind} reviews newest first`, () => {
      const reviews = getReviews(kind);
      for (let i = 1; i < reviews.length; i++) {
        expect(
          reviews[i - 1].datePublished.localeCompare(reviews[i].datePublished),
        ).toBeGreaterThanOrEqual(0);
      }
    });
  }
});

describe("getReviews(), hidden filter", () => {
  it("public listing never includes hidden reviews", () => {
    for (const kind of KINDS) {
      const pub = getReviews(kind);
      expect(pub.every((r) => r.hidden !== true)).toBe(true);
    }
  });

  it("admin listing can include hidden reviews", () => {
    for (const kind of KINDS) {
      const all = getAllReviewsIncludingHidden(kind);
      const pub = getReviews(kind);
      // all must be a superset of pub
      const pubSlugs = new Set(pub.map((r) => r.slug));
      for (const r of pub) {
        expect(all.find((x) => x.slug === r.slug)).toBeDefined();
      }
      // any review in `all` but not `pub` is hidden
      for (const r of all) {
        if (!pubSlugs.has(r.slug)) {
          expect(r.hidden).toBe(true);
        }
      }
    }
  });
});

describe("getReview(), single lookup", () => {
  it("round-trips: every slug from getReviews() resolves", () => {
    for (const kind of KINDS) {
      const reviews = getReviews(kind);
      for (const r of reviews) {
        const single = getReview(kind, r.slug);
        expect(single).not.toBeNull();
        expect(single?.slug).toBe(r.slug);
        expect(single?.brand).toBe(r.brand);
      }
    }
  });

  it("returns null for a slug that does not exist", () => {
    expect(getReview("skincare", "definitely-not-a-real-product")).toBeNull();
  });
});

describe("slug uniqueness", () => {
  it("no two reviews share the same slug within a kind", () => {
    for (const kind of KINDS) {
      const slugs = getAllReviewsIncludingHidden(kind).map((r) => r.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});

describe("getAllReviews()", () => {
  it("combines all kinds and excludes hidden", () => {
    const all = getAllReviews();
    const total =
      getReviews("skincare").length +
      getReviews("supplements").length +
      getReviews("oral-care").length;
    expect(all.length).toBe(total);
    expect(all.every((r) => r.hidden !== true)).toBe(true);
  });
});

describe("getNotes() and getNote()", () => {
  it("returns an array of notes with required fields", () => {
    const notes = getNotes();
    expect(Array.isArray(notes)).toBe(true);
    for (const n of notes) {
      expect(n.slug).toMatch(/^[a-z0-9-]+$/);
      expect(n.title.length).toBeGreaterThan(0);
      expect(n.description.length).toBeGreaterThan(0);
      expect(n.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("round-trips slugs through getNote()", () => {
    for (const n of getNotes()) {
      expect(getNote(n.slug)).not.toBeNull();
    }
  });
});

describe("getPrimers() and getPrimer()", () => {
  it("returns an array (possibly empty)", () => {
    expect(Array.isArray(getPrimers())).toBe(true);
  });

  it("round-trips any existing primer slugs", () => {
    for (const p of getPrimers()) {
      const single = getPrimer(p.slug);
      expect(single).not.toBeNull();
      expect(single?.slug).toBe(p.slug);
    }
  });
});
