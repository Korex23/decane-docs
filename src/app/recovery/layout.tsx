import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recovering your wallet",
  description:
    "How decane wallet recovery works: sign in on a new device with a synced passkey, restore from your recovery file, or use the offline recovery tool with a full recovery file. Any two of three shares open your wallet.",
  alternates: { canonical: "/recovery" },
  openGraph: {
    title: "decane — Recovering your wallet",
    description:
      "Lose your phone, keep your wallet. Passkey sync, recovery files, and an offline recovery tool.",
    url: "/recovery",
  },
};

export default function RecoveryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
