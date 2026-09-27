import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsView } from "../../docs/components/DocsView";
import { PAGES } from "../content";

export function generateStaticParams() {
  return PAGES.filter((p) => p.slug !== "overview").map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES.find((p) => p.slug === slug);
  return {
    title: page ? `${page.title} · Rust SDK` : "Rust SDK",
    alternates: { canonical: `/rust-docs/${slug}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!PAGES.some((p) => p.slug === slug)) notFound();
  return <DocsView set="rust" slug={slug} />;
}
