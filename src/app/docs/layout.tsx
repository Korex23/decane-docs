import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "API reference for decane-connect-kit — connect EVM, Solana, Tron, and Bitcoin wallets, or add Google/email sign-in with non-custodial embedded wallets. One SDK, one set of hooks.",
  openGraph: {
    title: "decane-connect-kit — Docs",
    description:
      "API reference for connecting wallets across EVM, Solana, Tron, and Bitcoin, plus non-custodial social sign-in.",
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
