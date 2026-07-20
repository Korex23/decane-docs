import Link from "next/link";
import { DecaneLogo } from "./DecaneLogo";

const MONO = "'Geist Mono', ui-monospace, 'SF Mono', monospace";

// Shared footer for "/" and "/pricing".
export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--doc-border)",
        padding: "32px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 13,
        color: "var(--doc-text-muted)",
        fontFamily: MONO,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <DecaneLogo size={22} />
        <span style={{ color: "var(--doc-accent)" }}>decane</span>
        <span>connect-kit</span>
        <span>·</span>
        <span>MIT</span>
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <Link href="/pricing" style={{ color: "inherit" }}>
          pricing
        </Link>
        <Link href="/docs" style={{ color: "inherit" }}>
          docs
        </Link>
        <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
          github
        </a>
        <a href="https://npmjs.com" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
          npm
        </a>
      </div>
    </footer>
  );
}
