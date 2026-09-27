"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { DecaneLogo } from "@/components/DecaneLogo";
import { ThemeToggle } from "@/components/SiteNav";
import { useTheme, DASHBOARD_URL } from "@/lib/theme";

// The SDK touches window and storage at import, so it only loads in the
// browser, and no other page carries it.
const DemoApp = dynamic(() => import("./DemoApp").then((m) => m.DemoApp), {
  ssr: false,
  loading: () => <div className="demo-boot">Loading the wallet…</div>,
});

export default function DemoPage() {
  const [theme, toggleTheme] = useTheme();
  return (
    <div className="site demo-root" data-theme={theme}>
      <header className="demo-bar">
        <Link href="/" className="brand"><DecaneLogo size={24} />Decane</Link>
        <span className="demo-badge">Demo</span>
        <div className="demo-bar-end">
          <span className="demo-bar-note">Decane takes minutes to set up</span>
          <Link href="/docs" className="btn btn-ghost btn-sm">Docs</Link>
          <a href={`${DASHBOARD_URL}/auth/register`} className="btn btn-primary btn-sm">Get started</a>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>
      <DemoApp theme={theme} onToggleTheme={toggleTheme} />
    </div>
  );
}
