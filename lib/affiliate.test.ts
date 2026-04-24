import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { affiliatize, isAffiliated } from "./affiliate";

/**
 * We stash and restore the affiliate env vars around every test so tests
 * can't leak into each other or pick up whatever the dev environment has.
 */
const ENV_KEYS = [
  "AMAZON_US_TAG",
  "AMAZON_IN_TAG",
  "AMAZON_UK_TAG",
  "INDIA_AFFILIATE_TEMPLATE",
  "WESTERN_AFFILIATE_TEMPLATE",
] as const;

let saved: Record<(typeof ENV_KEYS)[number], string | undefined>;

beforeEach(() => {
  saved = {} as typeof saved;
  for (const k of ENV_KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("affiliatize, no-op cases", () => {
  it("returns the URL unchanged when no env vars are set", () => {
    const url = "https://www.amazon.com/dp/B09ZV8N75K";
    expect(affiliatize(url)).toBe(url);
    expect(isAffiliated(url)).toBe(false);
  });

  it("returns the URL unchanged for unknown retailers", () => {
    process.env.AMAZON_US_TAG = "arnav-20";
    const url = "https://www.example.com/product";
    expect(affiliatize(url)).toBe(url);
  });

  it("normalizes undefined/null/empty to a falsy value", () => {
    // Both null and undefined come back as undefined (the function uses
    // `rawUrl ?? undefined`). Empty string passes through untouched.
    expect(affiliatize(undefined)).toBeUndefined();
    expect(affiliatize(null)).toBeUndefined();
    expect(affiliatize("")).toBe("");
  });

  it("passes through malformed URLs", () => {
    process.env.AMAZON_US_TAG = "arnav-20";
    expect(affiliatize("not a url")).toBe("not a url");
  });
});

describe("affiliatize, Amazon tagging", () => {
  it("appends tag to amazon.com URLs when AMAZON_US_TAG is set", () => {
    process.env.AMAZON_US_TAG = "arnav-20";
    const out = affiliatize("https://www.amazon.com/dp/B0B3R661JP");
    expect(out).toContain("tag=arnav-20");
    expect(out).toContain("amazon.com/dp/B0B3R661JP");
  });

  it("appends tag to amazon.in URLs when AMAZON_IN_TAG is set", () => {
    process.env.AMAZON_IN_TAG = "yash04e2-21";
    const out = affiliatize("https://www.amazon.in/dp/B09ZV8N75K");
    expect(out).toContain("tag=yash04e2-21");
  });

  it("appends tag to amazon.co.uk URLs when AMAZON_UK_TAG is set", () => {
    process.env.AMAZON_UK_TAG = "arnav-21";
    const out = affiliatize("https://www.amazon.co.uk/dp/B0B3R661JP");
    expect(out).toContain("tag=arnav-21");
  });

  it("replaces an existing tag rather than appending a duplicate", () => {
    process.env.AMAZON_US_TAG = "arnav-20";
    const out =
      affiliatize("https://www.amazon.com/dp/X?tag=old-tag") ?? "";
    expect(out).toContain("tag=arnav-20");
    expect(out).not.toContain("old-tag");
  });

  it("doesn't cross-wire, .in tag must not touch .com URLs", () => {
    process.env.AMAZON_IN_TAG = "yash04e2-21";
    const out = affiliatize("https://www.amazon.com/dp/X");
    expect(out).not.toContain("yash04e2-21");
  });

  it("is a no-op for amazon.com if only the IN/UK tag is set", () => {
    process.env.AMAZON_IN_TAG = "yash04e2-21";
    process.env.AMAZON_UK_TAG = "arnav-21";
    const url = "https://www.amazon.com/dp/X";
    expect(affiliatize(url)).toBe(url);
  });

  it("marks tagged URLs as affiliated", () => {
    process.env.AMAZON_US_TAG = "arnav-20";
    expect(isAffiliated("https://www.amazon.com/dp/X")).toBe(true);
  });
});

describe("affiliatize, non-Amazon aggregator templates", () => {
  it("wraps Indian retailers with the INDIA_AFFILIATE_TEMPLATE", () => {
    process.env.INDIA_AFFILIATE_TEMPLATE =
      "https://linksredirect.com/?pub_id=ABC&url={url}";
    const out = affiliatize("https://www.nykaa.com/foo/p/1");
    expect(out).toContain("linksredirect.com");
    expect(out).toContain(encodeURIComponent("https://www.nykaa.com/foo/p/1"));
  });

  it("does not wrap Indian retailers when the template is unset", () => {
    const url = "https://www.nykaa.com/foo/p/1";
    expect(affiliatize(url)).toBe(url);
  });

  it("wraps target.com with WESTERN_AFFILIATE_TEMPLATE when set", () => {
    process.env.WESTERN_AFFILIATE_TEMPLATE =
      "https://skimlinks.example/?url={url}";
    const out = affiliatize("https://www.target.com/p/something");
    expect(out).toContain("skimlinks.example");
  });

  it("never wraps an Amazon URL with a region template, Amazon owns its own tag flow", () => {
    process.env.INDIA_AFFILIATE_TEMPLATE = "https://wrap.example/?url={url}";
    process.env.AMAZON_IN_TAG = "yash04e2-21";
    const out =
      affiliatize("https://www.amazon.in/dp/B09ZV8N75K") ?? "";
    expect(out).not.toContain("wrap.example");
    expect(out).toContain("tag=yash04e2-21");
  });
});
