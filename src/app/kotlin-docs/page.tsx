import type { Metadata } from "next";
import { DocsView } from "../docs/components/DocsView";

export const metadata: Metadata = {
  title: "Kotlin SDK",
  description: "decane-kit, the Kotlin SDK for Decane wallets on Android.",
  alternates: { canonical: "/kotlin-docs" },
};

export default function Page() {
  return <DocsView set="kotlin" slug="overview" />;
}
