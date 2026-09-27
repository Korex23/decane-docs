import Link from "next/link";
import { DecaneLogo } from "./DecaneLogo";
import { CookieNotice } from "./CookieNotice";
import { DASHBOARD_URL } from "@/lib/theme";

const COLUMNS: Array<{
  title: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}> = [
  {
    title: "Product",
    links: [
      { label: "Live demo", href: "/demo" },
      { label: "Pricing", href: "/pricing" },
      { label: "Recovering a wallet", href: "/recovery" },
      { label: "Dashboard", href: DASHBOARD_URL, external: true },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Web & React Native", href: "/docs" },
      { label: "Node", href: "/node-docs" },
      { label: "Python", href: "/python-docs" },
      { label: "Rust", href: "/rust-docs" },
      { label: "Swift", href: "/swift-docs" },
      { label: "Kotlin", href: "/kotlin-docs" },
    ],
  },
  {
    title: "For agents",
    links: [
      { label: "llms.txt", href: "/llms.txt", external: true },
      { label: "llms-expo.txt", href: "/llms-expo.txt", external: true },
      { label: "llms-node.txt", href: "/llms-node.txt", external: true },
      { label: "llms-python.txt", href: "/llms-python.txt", external: true },
      { label: "llms-rust.txt", href: "/llms-rust.txt", external: true },
      { label: "llms-swift.txt", href: "/llms-swift.txt", external: true },
      { label: "llms-kotlin.txt", href: "/llms-kotlin.txt", external: true },
      {
        label: "llms-version.json",
        href: "/llms-version.json",
        external: true,
      },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      {
        label: "info@decane.app",
        href: "mailto:info@decane.app",
        external: true,
      },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Link href="/" className="brand">
              <DecaneLogo size={24} />
              Decane
            </Link>
            <p>
              Non-custodial wallets behind the sign-in your users already have.
              The key only ever comes together inside a sealed signer.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav
              key={col.title}
              className="site-footer-col"
              aria-label={col.title}
            >
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        {...(l.href.startsWith("http") ||
                        l.href.startsWith("/llms")
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="site-footer-bottom">
          <span>
            MIT-licensed connector SDK. The hosted wallet service is priced per
            project.
          </span>
          <span className="mono">kit.decane.app</span>
        </div>
      </div>
      <CookieNotice />
    </footer>
  );
}
