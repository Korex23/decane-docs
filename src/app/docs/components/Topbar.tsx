"use client";
import { DocsTopbar, type SearchItem } from "./DocsTopbar";
import { VERSIONS, NPM } from "@/lib/versions";

const SEARCH_INDEX: SearchItem[] = [
  { id: "overview", title: "Overview", crumb: "Getting started" },
  { id: "install", title: "Install", crumb: "Getting started" },
  { id: "quick-start", title: "Quick start", crumb: "Getting started" },
  { id: "framework-setup", title: "Framework setup", crumb: "Framework setup" },
  { id: "nextjs", title: "Next.js (App Router)", crumb: "Framework setup" },
  { id: "vite", title: "Vite / CRA", crumb: "Framework setup" },
  { id: "configuration", title: "Configuration", crumb: "Configuration" },
  { id: "networks", title: "networks", crumb: "Configuration" },
  { id: "supported-chains", title: "supportedChainIds", crumb: "Configuration" },
  // Social sign-in entries
  { id: "social", title: "Social sign-in", crumb: "Social" },
  { id: "connect-mode", title: "ConnectMode", crumb: "Social" },
  { id: "social-config", title: "SocialConfig", crumb: "Social" },
  { id: "useSocialAuth", title: "useSocialAuth()", crumb: "Social" },
  { id: "useSocialWallet", title: "useSocialWallet()", crumb: "Social" },
  { id: "social-wallet-modal", title: "SocialWalletModal", crumb: "Social" },
  // Hooks
  { id: "hooks", title: "Hooks", crumb: "Hooks" },
  { id: "useDecane", title: "useDecane()", crumb: "Hooks" },
  { id: "useWalletSelector", title: "useWalletSelector()", crumb: "Hooks" },
  { id: "useSignMessage", title: "useSignMessage()", crumb: "Hooks" },
  { id: "useSendTransaction", title: "useSendTransaction()", crumb: "Hooks" },
  { id: "useSignTypedData", title: "useSignTypedData()", crumb: "Hooks" },
  { id: "useChainSwitch", title: "useChainSwitch()", crumb: "Hooks" },
  // Reference
  { id: "detection", title: "Wallet detection", crumb: "Reference" },
  { id: "chain-constants", title: "Chain constants", crumb: "Reference" },
  { id: "custom-chains", title: "Custom chains", crumb: "Reference" },
  { id: "errors", title: "Error handling", crumb: "Reference" },
  { id: "theme", title: "Theme", crumb: "Reference" },
  { id: "typescript", title: "TypeScript", crumb: "Reference" },
  { id: "not-included", title: "What is not included", crumb: "Reference" },
  { id: "chain-list", title: "Built-in chains", crumb: "Reference" },
];

interface TopbarProps {
  theme: "dark" | "light";
  onThemeToggle: () => void;
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

export function Topbar(props: TopbarProps) {
  return (
    <DocsTopbar
      {...props}
      current="web"
      version={VERSIONS.web}
      npmUrl={NPM.web}
      searchIndex={SEARCH_INDEX}
    />
  );
}
