"use client";

import { DocsShell } from "./DocsShell";
import {
  PAGES as WEB_PAGES,
  ANCHORS as WEB_ANCHORS,
  SEARCH as WEB_SEARCH,
} from "@/app/docs/content";
import {
  PAGES as NODE_PAGES,
  ANCHORS as NODE_ANCHORS,
  SEARCH as NODE_SEARCH,
} from "@/app/node-docs/content";
import {
  PAGES as PY_PAGES,
  ANCHORS as PY_ANCHORS,
  SEARCH as PY_SEARCH,
} from "@/app/python-docs/content";
import {
  PAGES as RS_PAGES,
  ANCHORS as RS_ANCHORS,
  SEARCH as RS_SEARCH,
} from "@/app/rust-docs/content";
import {
  PAGES as SW_PAGES,
  ANCHORS as SW_ANCHORS,
  SEARCH as SW_SEARCH,
} from "@/app/swift-docs/content";
import {
  PAGES as KT_PAGES,
  ANCHORS as KT_ANCHORS,
  SEARCH as KT_SEARCH,
} from "@/app/kotlin-docs/content";

const SETS = {
  web: {
    basePath: "/docs",
    pages: WEB_PAGES,
    anchors: WEB_ANCHORS,
    search: WEB_SEARCH,
  },
  node: {
    basePath: "/node-docs",
    pages: NODE_PAGES,
    anchors: NODE_ANCHORS,
    search: NODE_SEARCH,
  },
  python: {
    basePath: "/python-docs",
    pages: PY_PAGES,
    anchors: PY_ANCHORS,
    search: PY_SEARCH,
  },
  rust: {
    basePath: "/rust-docs",
    pages: RS_PAGES,
    anchors: RS_ANCHORS,
    search: RS_SEARCH,
  },
  swift: {
    basePath: "/swift-docs",
    pages: SW_PAGES,
    anchors: SW_ANCHORS,
    search: SW_SEARCH,
  },
  kotlin: {
    basePath: "/kotlin-docs",
    pages: KT_PAGES,
    anchors: KT_ANCHORS,
    search: KT_SEARCH,
  },
} as const;

export function DocsView({
  set,
  slug,
}: {
  set: keyof typeof SETS;
  slug: string;
}) {
  const s = SETS[set];
  const page = s.pages.find((p) => p.slug === slug) ?? s.pages[0];
  return (
    <DocsShell
      set={set}
      basePath={s.basePath}
      pages={s.pages}
      page={page}
      anchors={s.anchors}
      search={s.search}
    />
  );
}
