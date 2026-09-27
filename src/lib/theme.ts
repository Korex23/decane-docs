"use client";

import { useEffect, useState } from "react";

// Single site-wide theme mechanism, shared by "/", "/pricing", and "/docs".
// All three read/write the same localStorage key and the same --doc-*
// CSS custom properties (defined in globals.css) so toggling anywhere
// applies identically everywhere.

export type Theme = "dark" | "light";
const THEME_KEY = "dc-theme";

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY) as Theme | null;
      if (stored === "dark" || stored === "light") setTheme(stored);
      else if (window.matchMedia?.("(prefers-color-scheme: light)").matches)
        setTheme("light");
    } catch {
      // localStorage unavailable — default to dark, no crash
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
