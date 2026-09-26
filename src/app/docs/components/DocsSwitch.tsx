import Link from "next/link";
import { VERSIONS } from "@/lib/versions";

// Sits at the top of both docs sidebars: which SDK you are reading about,
// and its published version.
export function DocsSwitch({ current }: { current: "web" | "node" }) {
  return (
    <div className="docs-switch" role="tablist" aria-label="Documentation set">
      <Link href="/docs" role="tab" aria-selected={current === "web"} className={current === "web" ? "active" : ""}>
        <span>Web and React Native</span>
        <small>{VERSIONS.web}</small>
      </Link>
      <Link href="/node-docs" role="tab" aria-selected={current === "node"} className={current === "node" ? "active" : ""}>
        <span>Node</span>
        <small>{VERSIONS.node}</small>
      </Link>
    </div>
  );
}
