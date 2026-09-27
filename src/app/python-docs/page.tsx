import type { Metadata } from "next";
import { DocsView } from "../docs/components/DocsView";

export const metadata: Metadata = {
  title: "Python SDK",
  description:
    "The decane Python SDK: verify Decane access tokens, sign users in, per-user records and server-side wallet creation.",
  alternates: { canonical: "/python-docs" },
};

export default function Page() {
  return <DocsView set="python" slug="overview" />;
}
