"use client";

import { DocsShell } from "./DocsShell";
import { PAGES as WEB_PAGES, ANCHORS as WEB_ANCHORS, SEARCH as WEB_SEARCH } from "@/app/docs/content";
import { PAGES as NODE_PAGES, ANCHORS as NODE_ANCHORS, SEARCH as NODE_SEARCH } from "@/app/node-docs/content";

const SETS = {
  web: { basePath: "/docs", pages: WEB_PAGES, anchors: WEB_ANCHORS, search: WEB_SEARCH },
  node: { basePath: "/node-docs", pages: NODE_PAGES, anchors: NODE_ANCHORS, search: NODE_SEARCH },
} as const;

export function DocsView({ set, slug }: { set: "web" | "node"; slug: string }) {
  const s = SETS[set];
  const page = s.pages.find((p) => p.slug === slug) ?? s.pages[0];
  return <DocsShell set={set} basePath={s.basePath} pages={s.pages} page={page} anchors={s.anchors} search={s.search} />;
}
