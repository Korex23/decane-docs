import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "decane-connect-kit — Documentation",
  description: "Wallet connection library for EVM, Solana, Tron, Bitcoin and social sign-in",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
