import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live demo",
  description:
    "Sign in with Google, email, phone or X and get a real Ethereum, Solana and Tron wallet in seconds. A live Decane demo.",
  alternates: { canonical: "/demo" },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
