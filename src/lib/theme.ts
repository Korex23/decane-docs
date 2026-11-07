"use client";

import { useEffect, useState } from "react";

// Single site-wide theme mechanism, shared by "/", "/pricing", and "/docs".
// All three read/write the same localStorage key and the same --doc-*
// CSS custom properties (defined in globals.css) so toggling anywhere
// applies identically everywhere.

export type Theme = "dark" | "light";
const THEME_KEY = "dc-theme";

export function useTheme(): [Theme, () => void] {
  // Light unless the visitor chose dark with the toggle (remembered).
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY) as Theme | null;
      if (stored === "dark" || stored === "light") setTheme(stored);
    } catch {
      // localStorage unavailable: stay light, no crash
    }
  }, []);

  function toggle() {
    setTheme((t) => {
      const next: Theme = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // ignore — theme just won't persist across reloads
      }
      return next;
    });
  }

  return [theme, toggle];
}

export const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "https://dashboard.decane.app";
