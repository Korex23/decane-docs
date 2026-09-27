"use client";

import dynamic from "next/dynamic";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useTheme } from "@/lib/theme";

// The SDK touches window and storage at import, so it only loads in the
// browser. This also keeps it out of every other page's bundle.
const DemoApp = dynamic(() => import("./DemoApp").then((m) => m.DemoApp), {
  ssr: false,
  loading: () => <div className="demo-card demo-loading">Loading the wallet…</div>,
});

export default function DemoPage() {
  const [theme, toggleTheme] = useTheme();
  return (
    <div className="site" data-theme={theme}>
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />
      <header className="hero page-head demo-head">
        <div className="container hero-inner">
          <div className="eyebrow">Live demo</div>
          <h1>Sign in. Get a wallet.</h1>
          <p className="lede">
            This is the real SDK on a real Decane project. Sign in the way you like and you&rsquo;ll
            have Ethereum, Solana and Tron addresses in a few seconds, with no extension and
            nothing to write down.
          </p>
        </div>
      </header>
      <section className="demo-section">
        <div className="container demo-wrap">
          <div className="demo-disclaimer" role="note">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>
            <p>
              <strong>Demo only. Do not send real funds to these addresses.</strong> They are real
              wallets on real networks, but this is a public demo project that may be reset, and
              anything sent here may be lost for good.
            </p>
          </div>
          <DemoApp theme={theme} />
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
