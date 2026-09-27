import Link from "next/link";
import { DecaneLogo } from "./DecaneLogo";
import { CookieNotice } from "./CookieNotice";
import { BrandLogo } from "./BrandLogo";
import { DASHBOARD_URL } from "@/lib/theme";
import { VERSIONS, REGISTRY } from "@/lib/versions";

// Every published package: one quiet panel, a row each, so the versions read
// as a list rather than seven buttons.
const PACKAGES = [
  {
    logo: "react",
    name: "decane-connect-kit",
    registry: "npm",
    version: VERSIONS.web,
    href: REGISTRY.web,
  },
  {
    logo: "react",
    name: "decane-connect-kit-expo",
    registry: "npm",
    version: VERSIONS.expo,
    href: REGISTRY.expo,
  },
  {
    logo: "nodejs",
    name: "decane-node",
    registry: "npm",
    version: VERSIONS.node,
    href: REGISTRY.node,
  },
  {
    logo: "python",
    name: "decane",
    registry: "PyPI",
    version: VERSIONS.python,
    href: REGISTRY.python,
  },
  {
    logo: "rust",
    name: "decane",
    registry: "crates.io",
    version: VERSIONS.rust,
    href: REGISTRY.rust,
  },
  {
    logo: "swift",
    name: "DecaneKit",
    registry: "Swift PM",
    version: VERSIONS.swift,
    href: REGISTRY.swift,
  },
  {
    logo: "kotlin",
    name: "decane-kit",
    registry: "Maven",
    version: VERSIONS.kotlin,
    href: REGISTRY.kotlin,
  },
];

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
            <ul className="site-footer-pkgs" aria-label="Published packages">
              {PACKAGES.map((p) => (
                <li key={`${p.name}-${p.registry}`}>
                  <a href={p.href} target="_blank" rel="noreferrer">
                    <BrandLogo name={p.logo} size={16} />
                    <code>{p.name}</code>
                    <small>{p.registry}</small>
                    <span className="ver">{p.version}</span>
                  </a>
                </li>
              ))}
            </ul>
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
