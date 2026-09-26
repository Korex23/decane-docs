"use client";
import { DocsTopbar, type SearchItem } from "../../docs/components/DocsTopbar";

const SEARCH_INDEX: SearchItem[] = [
  { id: "overview", title: "Overview", crumb: "Getting started" },
  { id: "install", title: "Install", crumb: "Getting started" },
  { id: "quick-start", title: "Quick start", crumb: "Getting started" },
  { id: "auth", title: "Server-side sign-in", crumb: "Sign-in" },
  { id: "auth-api-key", title: "The API key", crumb: "Sign-in" },
  { id: "auth-email", title: "Email OTP", crumb: "Sign-in" },
  { id: "auth-google-token", title: "connectWithGoogleToken()", crumb: "Sign-in" },
  { id: "auth-kingschat-token", title: "connectWithKingsChatToken()", crumb: "Sign-in" },
  { id: "auth-external", title: "connectWithToken()", crumb: "Sign-in" },
  { id: "auth-revoke", title: "revokeAccessToken()", crumb: "Sign-in" },
  { id: "auth-errors", title: "DecaneApiError", crumb: "Sign-in" },
  { id: "auth-limits", title: "Operational limits", crumb: "Sign-in" },
  { id: "verification-modes", title: "Verification modes", crumb: "Verification" },
  { id: "static-key", title: "Static verification key", crumb: "Verification" },
  { id: "jwks", title: "JWKS", crumb: "Verification" },
  { id: "express", title: "Express middleware", crumb: "Verification" },
  { id: "nextjs-route", title: "Next.js route handler", crumb: "Verification" },
  { id: "decane-client", title: "DecaneClient", crumb: "API" },
  { id: "verify-access-token", title: "verifyAccessToken()", crumb: "API" },
  { id: "safe-verify", title: "safeVerifyAccessToken()", crumb: "API" },
  { id: "get-addresses", title: "getAddresses()", crumb: "API" },
  { id: "get-user", title: "getUser()", crumb: "API" },
  { id: "standalone-verify", title: "Standalone verifyAccessToken", crumb: "API" },
  { id: "claims", title: "Token claims", crumb: "Reference" },
  { id: "errors", title: "Error handling", crumb: "Reference" },
  { id: "config", title: "Configuration", crumb: "Reference" },
  { id: "client-token", title: "Getting the token client-side", crumb: "Reference" },
  { id: "revocation", title: "Statelessness & revocation", crumb: "Reference" },
  { id: "privy-migration", title: "Migrating from Privy", crumb: "Reference" },
  { id: "typescript", title: "TypeScript", crumb: "Reference" },
];

interface NodeTopbarProps {
  theme: "dark" | "light";
  onThemeToggle: () => void;
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

export function NodeTopbar(props: NodeTopbarProps) {
  return (
    <DocsTopbar
      {...props}
      current="node"
      searchIndex={SEARCH_INDEX}
    />
  );
}
