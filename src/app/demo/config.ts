// The live demo's Decane project. Both values are public by design: the app id
// identifies the project and the dck_live_ key is a publishable key, restricted
// server-side to the origins allow-listed for it in the dashboard
// (kit.decane.app, and localhost while developing). It is not a secret.
export const DEMO_APP_ID = "6d5e7519-d5c9-4dce-a2c7-8c7d31557fd0";
export const DEMO_API_KEY = "dck_live_-w9PRwjshVpLnAsp69aQdf9Pe2sZylHx";

export const DEMO_CHAINS = [
  { id: "evm:8453", label: "Base", logo: "evm" },
  { id: "solana:mainnet", label: "Solana", logo: "solana" },
  { id: "tron:mainnet", label: "Tron", logo: "tron" },
] as const;
