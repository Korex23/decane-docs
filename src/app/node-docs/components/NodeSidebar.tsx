"use client";
import { useEffect, useState } from "react";
import { DocsSwitch } from "../../docs/components/DocsSwitch";

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
    title: "Sign-in",
    items: [
      { href: "#auth", label: "Overview" },
      { href: "#auth-api-key", label: "The API key" },
      { href: "#auth-email", label: "Email OTP" },
      { href: "#auth-google-token", label: "Google token" },
      { href: "#auth-kingschat-token", label: "KingsChat token" },
      { href: "#auth-external", label: "connectWithToken()", mono: true },
      { href: "#auth-revoke", label: "revokeAccessToken()", mono: true },
      { href: "#auth-errors", label: "DecaneApiError", mono: true },
      { href: "#auth-limits", label: "Operational limits" },
    ],
  },
  {
    title: "Verification",
    items: [
      { href: "#verification-modes", label: "Verification modes" },
      { href: "#static-key", label: "Static key" },
      { href: "#jwks", label: "JWKS" },
      { href: "#express", label: "Express middleware" },
      { href: "#nextjs-route", label: "Next.js route handler" },
    ],
  },
  {
    title: "API",
    items: [
      { href: "#decane-client", label: "DecaneClient", mono: true },
      { href: "#verify-access-token", label: "verifyAccessToken()", mono: true },
      { href: "#safe-verify", label: "safeVerifyAccessToken()", mono: true },
      { href: "#get-addresses", label: "getAddresses()", mono: true },
      { href: "#get-user", label: "getUser()", mono: true },
      { href: "#standalone-verify", label: "Standalone verify" },
    ],
  },
  {
    title: "Reference",
    items: [
      { href: "#claims", label: "Token claims" },
      { href: "#errors", label: "Error handling" },
      { href: "#config", label: "Configuration" },
      { href: "#client-token", label: "Client-side token" },
      { href: "#revocation", label: "Revocation" },
      { href: "#privy-migration", label: "Migrating from Privy" },
      { href: "#typescript", label: "TypeScript" },
    ],
  },
  {
    title: "Other docs",
    items: [
      { href: "/docs", label: "Web SDK (decane-connect-kit)" },
      { href: "/llms-node.txt", label: "llms-node.txt", mono: true },
    ],
  },
];

interface NodeSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function NodeSidebar({ mobileOpen, onClose }: NodeSidebarProps) {
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
        <DocsSwitch current="node" />
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
