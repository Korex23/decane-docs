import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gas sponsorship",
  description: "Let your users send without holding ETH: your project pays the gas, or they pay it in USDC. Coming soon to Decane Connect Kit.",
  alternates: { canonical: "/gas-sponsorship" },
  openGraph: { title: "Decane: Gas sponsorship", description: "Let your users send without holding ETH: your project pays the gas, or they pay it in USDC. Coming soon to Decane Connect Kit.", url: "/gas-sponsorship" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
