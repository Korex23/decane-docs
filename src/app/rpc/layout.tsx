import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RPC",
  description: "Read and write the chain from one URL: 20 requests a second free, 200 in the Builder Club. Coming soon to Decane.",
  alternates: { canonical: "/rpc" },
  openGraph: { title: "Decane RPC", description: "Read and write the chain from one URL: 20 requests a second free, 200 in the Builder Club. Coming soon to Decane.", url: "/rpc" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
