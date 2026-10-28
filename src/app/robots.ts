import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Crawlers that feed AI answers (ChatGPT search runs on Bing's index plus
// OAI-SearchBot; Claude, Perplexity and Apple have their own). The wildcard
// rule already allows them; naming them records the intent so a future
// blanket block does not take them out by accident. The app support and
// legal pages carry meta noindex and are deliberately not disallowed here: a
// robots block would stop crawlers reading that directive.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Bingbot",
  "Applebot",
  "Applebot-Extended",
  "DuckAssistBot",
  "Amazonbot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
