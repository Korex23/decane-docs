"use client";
import { DocsSidebar, NAV_ICONS, type NavGroup } from "../../docs/components/DocsSidebar";

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
    key: "social", title: "Sign-in", icon: NAV_ICONS.social, open: true,
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
    key: "verify", title: "Verification", icon: NAV_ICONS.verify, open: false,
    items: [
      { href: "#verification-modes", label: "Verification modes" },
      { href: "#static-key", label: "Static key" },
      { href: "#jwks", label: "JWKS" },
      { href: "#express", label: "Express middleware" },
      { href: "#nextjs-route", label: "Next.js route handler" },
    ],
  },
  {
    key: "server", title: "API", icon: NAV_ICONS.server, open: true,
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
    key: "ref", title: "Reference", icon: NAV_ICONS.ref, open: false,
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
    key: "framework", title: "Other docs", icon: NAV_ICONS.framework, open: true,
    items: [
      { href: "/docs", label: "Web SDK (decane-connect-kit)" },
      { href: "/llms-node.txt", label: "llms-node.txt", mono: true },
    ],
  },
];

export function NodeSidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  return <DocsSidebar nav={NAV} mobileOpen={mobileOpen} onClose={onClose} />;
}
