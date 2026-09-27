import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free up to 499 monthly active wallets, then two Scale bands and custom Enterprise pricing. Pricing for decane's hosted non-custodial social sign-in — Google & email login that creates a real EVM and Solana wallet.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "decane — Pricing",
    description:
      "Free up to 499 monthly active wallets, then two Scale bands and custom Enterprise pricing.",
    url: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
