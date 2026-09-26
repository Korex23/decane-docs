// Published package versions shown across the site. Bump these when a package
// is published; the docs' llms-version.json is the machine-readable source.
export const VERSIONS = {
  web: "2.27.0",
  expo: "0.5.0",
  node: "1.5.0",
} as const;

export const NPM = {
  web: "https://www.npmjs.com/package/decane-connect-kit",
  expo: "https://www.npmjs.com/package/decane-connect-kit-expo",
  node: "https://www.npmjs.com/package/decane-node",
} as const;
