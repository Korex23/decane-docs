import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // llms.txt and its freshness manifest are meant to be read in place by
  // agents, not downloaded — so they're served inline as plain text, CORS-open
  // (both are public documents), and with must-revalidate rather than a long
  // max-age. The revalidate matters: an agent holding a cached copy re-checks
  // against the ETag on every read, so a version bump is picked up on the next
  // fetch instead of after some cache TTL expires.
  async headers() {
    const readable = [
      { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
      { key: "Content-Disposition", value: "inline" },
      { key: "Access-Control-Allow-Origin", value: "*" },
    ];
    return [
      {
        source: "/llms.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          ...readable,
        ],
      },
      {
        source: "/llms-expo.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          ...readable,
        ],
      },
      {
        source: "/llms-node.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          ...readable,
        ],
      },
      {
        source: "/llms-version.json",
        headers: [
          { key: "Content-Type", value: "application/json; charset=utf-8" },
          ...readable,
        ],
      },
    ];
  },
  async redirects() {
    return [
      // /social used to be a standalone marketing page for the hosted
      // social sign-in product. It's now folded into "/" as a first-class
      // section (id="social") rather than a separate page — redirect so
      // existing links/bookmarks/search results don't 404.
      { source: "/social", destination: "/#social", permanent: true },
      // Python and Rust used to share one page inside the Node docs.
      { source: "/node-docs/python-and-rust", destination: "/python-docs", permanent: true },
      // The Swift SDK used to be one page inside the web docs.
      { source: "/docs/ios", destination: "/swift-docs", permanent: true },
    ];
  },
};

export default config;
