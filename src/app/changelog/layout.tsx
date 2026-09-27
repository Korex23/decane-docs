import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "What changed in decane-connect-kit, decane-connect-kit-expo, decane-node and the Connect API, release by release.",
  alternates: { canonical: "/changelog" },
};

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
