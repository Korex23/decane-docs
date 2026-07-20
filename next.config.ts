import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // /social used to be a standalone marketing page for the hosted
      // social sign-in product. It's now folded into "/" as a first-class
      // section (id="social") rather than a separate page — redirect so
      // existing links/bookmarks/search results don't 404.
      { source: "/social", destination: "/#social", permanent: true },
    ];
  },
};

export default config;
