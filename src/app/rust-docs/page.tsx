import type { Metadata } from "next";
import { DocsView } from "../docs/components/DocsView";

export const metadata: Metadata = {
  title: "Rust SDK",
  description: "The decane Rust SDK: verify Decane access tokens, sign users in, per-user records and server-side wallet creation.",
  alternates: { canonical: "/rust-docs" },
};

export default function Page() {
  return <DocsView set="rust" slug="overview" />;
}
