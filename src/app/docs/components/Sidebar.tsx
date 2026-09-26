"use client";
import { useEffect, useState } from "react";
import { DocsSwitch } from "./DocsSwitch";

const NAV = [
  {
    title: "Getting started",
    items: [
      { href: "#overview", label: "Overview" },
      { href: "#install", label: "Install" },
      { href: "#quick-start", label: "Quick start" },
    ],
  },
  {
    title: "Framework setup",
    items: [
      { href: "#nextjs", label: "Next.js" },
      { href: "#vite", label: "Vite / CRA" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { href: "#configuration", label: "All options" },
      { href: "#networks", label: "Networks" },
      { href: "#supported-chains", label: "supportedChainIds", mono: true },
    ],
  },
  {
    title: "Social sign-in",
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
    title: "React Native",
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
    title: "Hooks",
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
    title: "Reference",
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
    title: "Server-side",
    items: [
      { href: "/node-docs", label: "decane-node docs", mono: true },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const [activeId, setActiveId] = useState("overview");

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".docs-main h2[id], .docs-main h3[id]")
    );

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-70px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {mobileOpen && <div className="docs-sidebar-backdrop" onClick={onClose} />}
      <aside className={`docs-sidebar${mobileOpen ? " mobile-open" : ""}`}>
        <DocsSwitch current="web" />
        {NAV.map((group) => (
          <nav key={group.title} className="docs-nav-group">
            <div className="docs-nav-group-title">{group.title}</div>
            <ul className="docs-nav-list">
              {group.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={activeId === item.href.slice(1) ? "active" : ""}
                    onClick={onClose}
                  >
                    {item.mono ? <code>{item.label}</code> : item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </aside>
    </>
  );
}
