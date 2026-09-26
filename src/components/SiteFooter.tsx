import Link from "next/link";
import { DecaneLogo } from "./DecaneLogo";
import { DASHBOARD_URL } from "@/lib/theme";
import { VERSIONS, NPM } from "@/lib/versions";

// Shared footer for "/", "/pricing" and "/recovery".
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-grid">
          <div>
            <span className="brand">
              <DecaneLogo size={24} />
              Decane
            </span>
            <p className="site-footer-blurb">
              Non-custodial wallets behind social sign-in. The key is only ever reconstructed inside
              an attested enclave, for the moment it signs.
            </p>
          </div>
          <div>
            <h4>Developers</h4>
            <ul>
              <li><Link href="/docs">Web and React Native docs</Link></li>
              <li><Link href="/node-docs">Node SDK docs</Link></li>
              <li><a href="/llms.txt" target="_blank" rel="noreferrer">llms.txt for agents</a></li>
              <li><a href={`${DASHBOARD_URL}/auth/register`}>Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4>Packages</h4>
            <ul>
              <li><a href={NPM.web} target="_blank" rel="noreferrer"><span className="mono">decane-connect-kit</span> {VERSIONS.web}</a></li>
              <li><a href={NPM.expo} target="_blank" rel="noreferrer"><span className="mono">decane-connect-kit-expo</span> {VERSIONS.expo}</a></li>
              <li><a href={NPM.node} target="_blank" rel="noreferrer"><span className="mono">decane-node</span> {VERSIONS.node}</a></li>
            </ul>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/recovery">Recovering a wallet</Link></li>
              <li><a href="mailto:info@decane.app">info@decane.app</a></li>
            </ul>
          </div>
        </div>
        <div className="site-footer-bottom">
          <span>Decane. The connector SDK is MIT licensed; the hosted wallet service is priced per project.</span>
          <span className="mono">kit.decane.app</span>
        </div>
      </div>
    </footer>
  );
}
