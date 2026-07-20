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
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        fontSize: 13,
        color: "var(--doc-text-muted)",
        fontFamily: MONO,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <DecaneLogo size={22} />
        <span style={{ color: "var(--doc-accent)" }}>decane</span>
        <span>connect-kit</span>
        <span>·</span>
        <span>MIT</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        <Link href="/pricing" style={{ color: "inherit" }}>
          pricing
        </Link>
        <Link href="/docs" style={{ color: "inherit" }}>
          docs
        </Link>
        <a href="/llms.txt" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
          llms.txt
        </a>
        <a href="https://www.npmjs.com/package/decane-connect-kit" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
          npm
        </a>
      </div>
    </footer>
  );
}
