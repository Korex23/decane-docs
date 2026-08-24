import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Node Docs",
  description:
    "API reference for decane-node — verify Decane access tokens and resolve wallet addresses from any Node backend. Static verification key or JWKS, no app secret.",
  alternates: { canonical: "/node-docs" },
  openGraph: {
    title: "decane-node — Docs",
    description:
      "Server-side SDK for Decane Connect Kit: verify access tokens and resolve wallet addresses from any Node backend.",
    url: "/node-docs",
  },
};

export default function NodeDocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
