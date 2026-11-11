import Link from "next/link";
import { DecaneLogo } from "./DecaneLogo";
import { CookieNotice } from "./CookieNotice";
import MascotBuddy from "./MascotBuddy";
import { MAIN_SITE, DISCORD_URL } from "@/lib/site";
import "./chrome.css";

// The footer, the same as decane.app's: link columns on the left, the
// wordmark, a line and the year on the right.

type FooterLink = { label: string; href: string };

const COLUMNS: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: "Products",
    links: [
      { label: "Decane Wallet", href: `${MAIN_SITE}/#wallet` },
      { label: "Connect Kit", href: "/" },
      { label: "Gas sponsorship", href: "/gas-sponsorship" },
      { label: "Decane RPC", href: "/rpc" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Server SDKs", href: "/node-docs" },
      { label: "Changelog", href: "/changelog" },
      { label: "llms.txt", href: "/llms.txt" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Community", href: DISCORD_URL },
      { label: "Recovering a wallet", href: "/recovery" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

function FooterAnchor({ l }: { l: FooterLink }) {
  if (l.href.startsWith("/") && !l.href.startsWith("/llms")) return <Link href={l.href}>{l.label}</Link>;
  const newTab = l.href.startsWith("/llms") || l.href.startsWith("https://discord");
  return (
    <a href={l.href} {...(newTab ? { target: "_blank", rel: "noreferrer" } : {})}>
      {l.label}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="dn-footer">
      <div className="dn-wrap dn-footer-grid">
        {COLUMNS.map((col) => (
          <nav key={col.title} className="dn-footer-col" aria-label={col.title}>
            <p>{col.title}</p>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <FooterAnchor l={l} />
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className="dn-footer-brand">
          <a href={MAIN_SITE} className="brand">
            <DecaneLogo size={36} />
            Decane
          </a>
          <p>No one holds a whole key. Not even us.</p>
          <small>© Decane {new Date().getFullYear()}</small>
        </div>
      </div>
      <CookieNotice />
      <MascotBuddy />
    </footer>
  );
}
