import type { Metadata } from "next";
import { DocsView } from "../docs/components/DocsView";

export const metadata: Metadata = {
  title: "Swift SDK",
  description: "DecaneKit, the Swift SDK for Decane wallets on iOS and macOS.",
  alternates: { canonical: "/swift-docs" },
};

export default function Page() {
  return <DocsView set="swift" slug="overview" />;
}
