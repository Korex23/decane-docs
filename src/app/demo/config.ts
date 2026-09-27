// The live demo's Decane project. Both values are public by design: the app id
// identifies the project and the dck_live_ key is a publishable key, restricted
// server-side to the origins allow-listed for it in the dashboard
// (kit.decane.app, and localhost while developing). It is not a secret.
export const DEMO_APP_ID = "6d5e7519-d5c9-4dce-a2c7-8c7d31557fd0";
export const DEMO_API_KEY = "dck_live_-w9PRwjshVpLnAsp69aQdf9Pe2sZylHx";

export type Method = "google" | "email" | "phone" | "x" | "kingschat";
export const METHODS: Array<{ id: Method; label: string }> = [
  { id: "google", label: "Google" },
  { id: "email", label: "Email" },
  { id: "phone", label: "SMS" },
  { id: "x", label: "X" },
  { id: "kingschat", label: "KingsChat" },
];

export const CHAINS = [
  { id: "evm:8453", label: "Base", logo: "evm", kind: "evm" },
  { id: "evm:1", label: "Ethereum", logo: "evm", kind: "evm" },
  { id: "solana:mainnet", label: "Solana", logo: "solana", kind: "solana" },
  { id: "tron:mainnet", label: "Tron", logo: "tron", kind: "tron" },
] as const;
export type ChainId = (typeof CHAINS)[number]["id"];

// "all" puts installed wallets (EIP-6963, Wallet Standard, TronLink) beside
// social sign-in; "social" is social sign-in alone.
export type DemoMode = "all" | "social";
export const MODES: Array<{ id: DemoMode; label: string }> = [
  { id: "all", label: "Social + wallets" },
  { id: "social", label: "Social only" },
];

export interface DemoSettings {
  mode: DemoMode;
  methods: Record<Method, boolean>;
  chains: Record<ChainId, boolean>;
}

export const DEFAULT_SETTINGS: DemoSettings = {
  mode: "all",
  methods: {
    google: true,
    email: true,
    phone: true,
    x: true,
    kingschat: false,
  },
  chains: {
    "evm:8453": true,
    "evm:1": false,
    "solana:mainnet": true,
    "tron:mainnet": true,
  },
};
