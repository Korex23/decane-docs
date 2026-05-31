import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "decane-connect-kit — Docs",
  description: "Wallet connection SDK for EVM, Solana, Tron, Bitcoin and social sign-in",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
