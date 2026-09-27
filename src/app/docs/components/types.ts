import type { ReactNode } from "react";

export interface DocPage {
  slug: string;
  group: string;
  title: string;
  /** Short label for the sidebar when the title is a sentence. */
  navLabel?: string;
  icon: string;
  body: ReactNode;
}

export interface SearchEntry {
  id: string;
  title: string;
  crumb: string;
  mono?: boolean;
}
