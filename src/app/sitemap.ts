import type { MetadataRoute } from "next";
import { PAGES as WEB } from "./docs/content";
import { PAGES as NODE } from "./node-docs/content";

const SITE_URL = "https://kit.decane.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...WEB.filter((p) => p.slug !== "overview").map((p) => ({ url: `${SITE_URL}/docs/${p.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/node-docs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...NODE.filter((p) => p.slug !== "overview").map((p) => ({ url: `${SITE_URL}/node-docs/${p.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: `${SITE_URL}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/recovery`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    // Listed so agent crawlers discover the machine-readable spec the same way
    // they discover the human pages, rather than only via the /docs callout.
    { url: `${SITE_URL}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/llms-node.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/llms-python.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/llms-rust.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];
}
