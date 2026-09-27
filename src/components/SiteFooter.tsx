import Link from "next/link";
import { DecaneLogo } from "./DecaneLogo";
import { CookieNotice } from "./CookieNotice";
import { DASHBOARD_URL } from "@/lib/theme";
import { VERSIONS, NPM, REGISTRY } from "@/lib/versions";

// Shared footer for the site pages: brand and packages on the left, three
// link columns, one fine-print row.
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <span className="brand">
              <DecaneLogo size={24} />
              Decane
            </span>
            <p>Non-custodial wallets behind the sign-in your users already have. The key only ever comes together inside a sealed signer.</p>
            <ul className="site-footer-pkgs">
              <li><a href={NPM.web} target="_blank" rel="noreferrer"><code>decane-connect-kit</code><span>{VERSIONS.web}</span></a></li>
              <li><a href={NPM.expo} target="_blank" rel="noreferrer"><code>decane-connect-kit-expo</code><span>{VERSIONS.expo}</span></a></li>
              <li><a href={NPM.node} target="_blank" rel="noreferrer"><code>decane-node</code><span>{VERSIONS.node}</span></a></li>
              <li><a href={REGISTRY.python} target="_blank" rel="noreferrer"><code>decane</code> (PyPI)<span>{VERSIONS.python}</span></a></li>
              <li><a href={REGISTRY.rust} target="_blank" rel="noreferrer"><code>decane</code> (crates.io)<span>{VERSIONS.rust}</span></a></li>
            </ul>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><Link href="/docs">Docs</Link></li>
              <li><Link href="/node-docs">Node SDK</Link></li>
              <li><Link href="/python-docs">Python SDK</Link></li>
              <li><Link href="/rust-docs">Rust SDK</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/recovery">Recovering a wallet</Link></li>
              <li><a href={DASHBOARD_URL}>Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4>For agents</h4>
            <ul>
              <li><a href="/llms.txt" target="_blank" rel="noreferrer">llms.txt</a></li>
              <li><a href="/llms-expo.txt" target="_blank" rel="noreferrer">llms-expo.txt</a></li>
              <li><a href="/llms-node.txt" target="_blank" rel="noreferrer">llms-node.txt</a></li>
              <li><a href="/llms-python.txt" target="_blank" rel="noreferrer">llms-python.txt</a></li>
              <li><a href="/llms-rust.txt" target="_blank" rel="noreferrer">llms-rust.txt</a></li>
              <li><a href="/llms-version.json" target="_blank" rel="noreferrer">llms-version.json</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><a href="mailto:info@decane.app">info@decane.app</a></li>
            </ul>
          </div>
        </div>
        <div className="site-footer-bottom">
          <span>MIT-licensed connector SDK. The hosted wallet service is priced per project.</span>
          <span className="mono">kit.decane.app</span>
        </div>
      </div>
      <CookieNotice />
    </footer>
  );
}
