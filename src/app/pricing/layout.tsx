import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free up to 1,000 monthly active wallets. Pricing for decane's hosted non-custodial social sign-in — Google & email login that creates a real EVM and Solana wallet.",
  openGraph: {
    title: "decane — Pricing",
    description:
      "Free up to 1,000 monthly active wallets. Pricing for hosted non-custodial social sign-in.",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
