import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// AI scraper user-agents that compile training corpora. Blocking is
// advisory — bad actors ignore robots.txt — but the well-behaved
// crawlers (OpenAI / Anthropic / Google / Meta / Bytedance / Perplexity)
// all honor these tokens, which cuts the bulk of automated photo theft.
const AI_SCRAPERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "CCBot",
  "Google-Extended",
  "FacebookBot",
  "Meta-ExternalAgent",
  "Bytespider",
  "PerplexityBot",
  "Applebot-Extended",
  "Amazonbot",
  "cohere-ai",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "Omgili",
  "YouBot",
  "MistralAI-User",
  "AI2Bot",
  "DuckAssistBot",
  "Timpibot",
  "Webzio-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/compare"],
      },
      ...AI_SCRAPERS.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
