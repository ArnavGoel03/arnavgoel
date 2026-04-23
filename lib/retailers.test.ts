import { describe, it, expect } from "vitest";
import {
  retailerForUrl,
  regionForUrl,
  availableInRegion,
  availabilityLabel,
  themeForRetailer,
} from "./retailers";

describe("retailerForUrl", () => {
  it("maps Amazon hosts to the right country name", () => {
    expect(retailerForUrl("https://www.amazon.com/dp/B0")).toBe("Amazon");
    expect(retailerForUrl("https://www.amazon.in/dp/B0")).toBe("Amazon India");
    expect(retailerForUrl("https://www.amazon.co.uk/dp/B0")).toBe("Amazon UK");
  });

  it("maps the Indian retailer hosts we care about", () => {
    expect(retailerForUrl("https://www.nykaa.com/foo/p/1")).toBe("Nykaa");
    expect(retailerForUrl("https://www.myntra.com/x/123")).toBe("Myntra");
    expect(retailerForUrl("https://naturaltein.in/products/x")).toBe(
      "Naturaltein",
    );
    expect(retailerForUrl("https://earthful.me/products/x")).toBe("Earthful");
  });

  it("maps the UK retailers", () => {
    expect(retailerForUrl("https://www.boots.com/x")).toBe("Boots");
    expect(retailerForUrl("https://www.lookfantastic.com/x")).toBe(
      "LookFantastic",
    );
    expect(retailerForUrl("https://www.cultbeauty.co.uk/x")).toBe("Cult Beauty");
  });

  it("returns a sensible fallback for unknown hosts", () => {
    expect(retailerForUrl("https://www.example.com/x")).toBe("Example");
  });

  it("returns 'Buy' for malformed URLs", () => {
    expect(retailerForUrl("not a url")).toBe("Buy");
  });
});

describe("regionForUrl", () => {
  it("returns india for Indian retailer hosts", () => {
    expect(regionForUrl("https://www.amazon.in/dp/X")).toBe("india");
    expect(regionForUrl("https://www.nykaa.com/x/p/1")).toBe("india");
    expect(regionForUrl("https://naturaltein.in/x")).toBe("india");
    expect(regionForUrl("https://earthful.me/x")).toBe("india");
  });

  it("returns usa for US retailer hosts", () => {
    expect(regionForUrl("https://www.amazon.com/dp/X")).toBe("usa");
    expect(regionForUrl("https://www.target.com/p/x")).toBe("usa");
    expect(regionForUrl("https://www.sephora.com/x")).toBe("usa");
  });

  it("returns uk for UK retailer hosts", () => {
    expect(regionForUrl("https://www.amazon.co.uk/dp/X")).toBe("uk");
    expect(regionForUrl("https://www.boots.com/x")).toBe("uk");
    expect(regionForUrl("https://www.cultbeauty.co.uk/x")).toBe("uk");
  });

  it("returns null for unknown regions", () => {
    expect(regionForUrl("https://www.example.com/x")).toBeNull();
    expect(regionForUrl(undefined)).toBeNull();
    expect(regionForUrl("not a url")).toBeNull();
  });
});

describe("availableInRegion", () => {
  it("true when the region's link array has entries", () => {
    const review = {
      indiaLinks: [{ url: "https://www.nykaa.com/x/p/1" }],
      westernLinks: [],
      ukLinks: [],
    };
    expect(availableInRegion(review, "india")).toBe(true);
    expect(availableInRegion(review, "usa")).toBe(false);
    expect(availableInRegion(review, "uk")).toBe(false);
  });

  it("falls back to boughtFromUrl host when the region array is empty", () => {
    const review = {
      boughtFromUrl: "https://www.amazon.com/dp/X",
      indiaLinks: [],
      westernLinks: [],
      ukLinks: [],
    };
    expect(availableInRegion(review, "usa")).toBe(true);
    expect(availableInRegion(review, "india")).toBe(false);
  });

  it("returns false for all regions when nothing is set", () => {
    const review = { indiaLinks: [], westernLinks: [], ukLinks: [] };
    expect(availableInRegion(review, "india")).toBe(false);
    expect(availableInRegion(review, "usa")).toBe(false);
    expect(availableInRegion(review, "uk")).toBe(false);
  });
});

describe("availabilityLabel", () => {
  const empty = { indiaLinks: [], westernLinks: [], ukLinks: [] };

  it("returns null when no links exist", () => {
    expect(availabilityLabel(empty)).toBeNull();
  });

  it("returns '{Region} only' for single-region availability", () => {
    expect(
      availabilityLabel({
        ...empty,
        indiaLinks: [{ url: "https://nykaa.com/x/p/1" }],
      }),
    ).toBe("India only");
    expect(
      availabilityLabel({
        ...empty,
        westernLinks: [{ url: "https://www.amazon.com/dp/X" }],
      }),
    ).toBe("USA only");
    expect(
      availabilityLabel({
        ...empty,
        ukLinks: [{ url: "https://www.amazon.co.uk/dp/X" }],
      }),
    ).toBe("UK only");
  });

  it("joins two regions with +", () => {
    expect(
      availabilityLabel({
        ...empty,
        indiaLinks: [{ url: "https://nykaa.com/x/p/1" }],
        westernLinks: [{ url: "https://www.amazon.com/dp/X" }],
      }),
    ).toBe("India + USA");
  });

  it("joins three regions with · separators", () => {
    expect(
      availabilityLabel({
        ...empty,
        indiaLinks: [{ url: "https://nykaa.com/x/p/1" }],
        westernLinks: [{ url: "https://www.amazon.com/dp/X" }],
        ukLinks: [{ url: "https://www.amazon.co.uk/dp/X" }],
      }),
    ).toBe("India · USA · UK");
  });
});

describe("themeForRetailer", () => {
  it("returns a theme object for known retailers", () => {
    const amazon = themeForRetailer("Amazon");
    expect(amazon.idle).toContain("amber");
    expect(amazon.bar).toContain("amber");
  });

  it("returns a default theme for unknown retailers", () => {
    const theme = themeForRetailer("Unknown Brand");
    expect(theme.idle).toContain("stone");
  });
});
