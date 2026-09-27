// Published package versions shown across the site. Bump these when a package
// is published; the docs' llms-version.json is the machine-readable source.
export const VERSIONS = {
  web: "2.28.0",
  expo: "0.6.0",
  node: "1.5.0",
  python: "1.0.0",
  rust: "1.0.0",
  swift: "0.1.0",
  kotlin: "0.1.0",
} as const;

export const NPM = {
  web: "https://www.npmjs.com/package/decane-connect-kit",
  expo: "https://www.npmjs.com/package/decane-connect-kit-expo",
  node: "https://www.npmjs.com/package/decane-node",
} as const;

// Every published package, whatever its registry.
export const REGISTRY = {
  ...NPM,
  python: "https://pypi.org/project/decane/",
  rust: "https://crates.io/crates/decane",
  swift: "https://github.com/Korex23/decane-swift",
  kotlin: "https://github.com/Korex23/decane-connect-kit/packages",
} as const;
