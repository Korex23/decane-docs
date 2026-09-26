"use client";
import { DocsSidebar, NAV_ICONS, type NavGroup } from "./DocsSidebar";

const NAV: NavGroup[] = [
  {
    key: "start", title: "Getting started", icon: NAV_ICONS.start, open: true,
    items: [
      { href: "#overview", label: "Overview" },
      { href: "#install", label: "Install" },
      { href: "#quick-start", label: "Quick start" },
    ],
  },
  {
    key: "framework", title: "Framework setup", icon: NAV_ICONS.framework, open: false,
    items: [
      { href: "#nextjs", label: "Next.js" },
      { href: "#vite", label: "Vite / CRA" },
    ],
  },
  {
    key: "config", title: "Configuration", icon: NAV_ICONS.config, open: false,
    items: [
      { href: "#configuration", label: "All options" },
      { href: "#networks", label: "Networks" },
      { href: "#supported-chains", label: "supportedChainIds", mono: true },
    ],
  },
  {
    key: "social", title: "Social sign-in", icon: NAV_ICONS.social, open: true,
    items: [
      { href: "#social", label: "Overview" },
      { href: "#connect-mode", label: "ConnectMode" },
      { href: "#social-config", label: "SocialConfig" },
      { href: "#per-signature-assertion", label: "Per-signature assertion" },
      { href: "#custom-auth", label: "Custom auth" },
      { href: "#useSocialAuth", label: "useSocialAuth()", mono: true },
      { href: "#useSocialWallet", label: "useSocialWallet()", mono: true },
      { href: "#social-wallet-modal", label: "SocialWalletModal", mono: true },
      { href: "#send-erc20", label: "Send ERC-20" },
      { href: "#send-solana", label: "Send Solana" },
    ],
  },
  {
    key: "rn", title: "React Native", icon: NAV_ICONS.rn, open: false,
    items: [
      { href: "#react-native", label: "Overview" },
      { href: "#rn-install", label: "Install" },
      { href: "#rn-config", label: "Configuration" },
      { href: "#rn-unlock", label: "Unlock tiers" },
      { href: "#rn-auth", label: "Signing in" },
      { href: "#rn-api", label: "Using the wallet" },
      { href: "#rn-recovery", label: "Getting back in" },
      { href: "#rn-attestation", label: "Attestation" },
    ],
  },
  {
    key: "hooks", title: "Hooks", icon: NAV_ICONS.hooks, open: true,
    items: [
      { href: "#useDecane", label: "useDecane()", mono: true },
      { href: "#useWalletSelector", label: "useWalletSelector()", mono: true },
      { href: "#useSignMessage", label: "useSignMessage()", mono: true },
      { href: "#useSendTransaction", label: "useSendTransaction()", mono: true },
      { href: "#useSignTypedData", label: "useSignTypedData()", mono: true },
      { href: "#useChainSwitch", label: "useChainSwitch()", mono: true },
    ],
  },
  {
    key: "ref", title: "Reference", icon: NAV_ICONS.ref, open: false,
    items: [
      { href: "#detection", label: "Wallet detection" },
      { href: "#chain-constants", label: "Chain constants" },
      { href: "#custom-chains", label: "Custom chains" },
      { href: "#errors", label: "Error handling" },
      { href: "#theme", label: "Theme" },
      { href: "#typescript", label: "TypeScript" },
      { href: "#not-included", label: "Not included" },
      { href: "#chain-list", label: "Built-in chains" },
    ],
  },
  {
    key: "server", title: "Server-side", icon: NAV_ICONS.server, open: true,
    items: [
      { href: "/node-docs", label: "decane-node docs", mono: true },
    ],
  },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  return <DocsSidebar nav={NAV} mobileOpen={mobileOpen} onClose={onClose} />;
}
