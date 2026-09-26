import Link from "next/link";
import { DecaneLogo } from "./DecaneLogo";

// Shared footer for "/", "/pricing" and "/recovery": one row.
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span className="brand">
          <DecaneLogo size={22} />
          Decane
        </span>
        <ul>
          <li><Link href="/docs">Docs</Link></li>
          <li><Link href="/node-docs">Node SDK</Link></li>
          <li><Link href="/pricing">Pricing</Link></li>
          <li><Link href="/recovery">Recovery</Link></li>
          <li><a href="/llms.txt" target="_blank" rel="noreferrer">llms.txt</a></li>
          <li><a href="/llms-expo.txt" target="_blank" rel="noreferrer">llms-expo.txt</a></li>
          <li><a href="/llms-node.txt" target="_blank" rel="noreferrer">llms-node.txt</a></li>
          <li><a href="mailto:info@decane.app">info@decane.app</a></li>
        </ul>
        <span className="fine">MIT-licensed connector SDK · <span className="mono">kit.decane.app</span></span>
      </div>
    </footer>
  );
}
