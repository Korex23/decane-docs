"use client";
import { useState } from "react";
import { CodeBlock } from "./CodeBlock";

export function FrameworkTabs() {
  const [active, setActive] = useState<"next" | "vite">("next");

  return (
    <div>
      <div className="docs-tabs" role="tablist">
        <button
          className={`docs-tab${active === "next" ? " active" : ""}`}
          onClick={() => setActive("next")}
        >
          Next.js (App Router)
        </button>
        <button
          className={`docs-tab${active === "vite" ? " active" : ""}`}
          onClick={() => setActive("vite")}
        >
          Vite / CRA
        </button>
      </div>

      <div className={`docs-tab-panel${active === "next" ? " active" : ""}`}>
        <p>
          Client components are required for all hooks. Wrap{" "}
          <code>DecaneKit</code> in a <code>&quot;use client&quot;</code>{" "}
          boundary so the server layout stays a server component.
        </p>
        <CodeBlock lang="tsx" file="src/components/Providers.tsx">
          <span className="tok-s">&quot;use client&quot;</span>
          <span className="tok-p">;</span>
          {"\n\n"}
          <span className="tok-k">import</span>{" "}
          <span className="tok-p">{"{"}</span>{" "}
          <span className="tok-id">DecaneKit</span>{" "}
          <span className="tok-p">{"}"}</span>{" "}
          <span className="tok-k">from</span>{" "}
          <span className="tok-s">&quot;decane-connect-kit&quot;</span>
          <span className="tok-p">;</span>
          {"\n"}
          <span className="tok-k">import</span>{" "}
          <span className="tok-k">type</span>{" "}
          <span className="tok-p">{"{"}</span>{" "}
          <span className="tok-id">ReactNode</span>{" "}
          <span className="tok-p">{"}"}</span>{" "}
          <span className="tok-k">from</span>{" "}
          <span className="tok-s">&quot;react&quot;</span>
          <span className="tok-p">;</span>
          {"\n\n"}
          <span className="tok-k">export function</span>{" "}
          <span className="tok-f">Providers</span>
          <span className="tok-p">{"({"}</span>{" "}
          <span className="tok-id">children</span>{" "}
          <span className="tok-p">{"}: {"}</span>{" "}
          <span className="tok-id">children</span>
          <span className="tok-p">:</span>{" "}
          <span className="tok-t">ReactNode</span>{" "}
          <span className="tok-p">{"}"}</span>
          <span className="tok-p">{")"}</span>{" "}
          <span className="tok-p">{"{"}</span>
          {"\n  "}
          <span className="tok-k">return</span> <span className="tok-p">(</span>
          {"\n    "}
          <span className="tok-p">&lt;</span>
          <span className="tok-t">DecaneKit</span>{" "}
          <span className="tok-f">config</span>
          <span className="tok-p">{"={"}</span>
          <span className="tok-p">{"{"}</span>{" "}
          <span className="tok-id">theme</span>
          <span className="tok-p">:</span>{" "}
          <span className="tok-s">&quot;auto&quot;</span>{" "}
          <span className="tok-p">{"}"}</span>
          <span className="tok-p">{"}"}</span>
          <span className="tok-p">&gt;</span>
          {"\n      "}
          <span className="tok-p">{"{"}</span>
          <span className="tok-id">children</span>
          <span className="tok-p">{"}"}</span>
          {"\n    "}
          <span className="tok-p">&lt;/</span>
          <span className="tok-t">DecaneKit</span>
          <span className="tok-p">&gt;</span>
          {"\n  "}
          <span className="tok-p">);</span>
          {"\n"}
          <span className="tok-p">{"}"}</span>
        </CodeBlock>

        <CodeBlock lang="tsx" file="src/app/layout.tsx">
          <span className="tok-k">import</span>{" "}
          <span className="tok-p">{"{"}</span>{" "}
          <span className="tok-id">Providers</span>{" "}
          <span className="tok-p">{"}"}</span>{" "}
          <span className="tok-k">from</span>{" "}
          <span className="tok-s">&quot;@/components/Providers&quot;</span>
          <span className="tok-p">;</span>
          {"\n\n"}
          <span className="tok-k">export default function</span>{" "}
          <span className="tok-f">RootLayout</span>
          <span className="tok-p">{"({"}</span>{" "}
          <span className="tok-id">children</span>{" "}
          <span className="tok-p">{"}: {"}</span>{" "}
          <span className="tok-id">children</span>
          <span className="tok-p">:</span> <span className="tok-t">React</span>
          <span className="tok-p">.</span>
          <span className="tok-t">ReactNode</span>{" "}
          <span className="tok-p">{"}"}</span>
          <span className="tok-p">{")"}</span>{" "}
          <span className="tok-p">{"{"}</span>
          {"\n  "}
          <span className="tok-k">return</span> <span className="tok-p">(</span>
          {"\n    "}
          <span className="tok-p">&lt;</span>
          <span className="tok-t">html</span>{" "}
          <span className="tok-f">lang</span>
          <span className="tok-p">=</span>
          <span className="tok-s">&quot;en&quot;</span>
          <span className="tok-p">&gt;</span>
          {"\n      "}
          <span className="tok-p">&lt;</span>
          <span className="tok-t">body</span>
          <span className="tok-p">&gt;</span>
          {"\n        "}
          <span className="tok-p">&lt;</span>
          <span className="tok-t">Providers</span>
          <span className="tok-p">&gt;</span>
          <span className="tok-p">{"{"}</span>
          <span className="tok-id">children</span>
          <span className="tok-p">{"}"}</span>
          <span className="tok-p">&lt;/</span>
          <span className="tok-t">Providers</span>
          <span className="tok-p">&gt;</span>
          {"\n      "}
          <span className="tok-p">&lt;/</span>
          <span className="tok-t">body</span>
          <span className="tok-p">&gt;</span>
          {"\n    "}
          <span className="tok-p">&lt;/</span>
          <span className="tok-t">html</span>
          <span className="tok-p">&gt;</span>
          {"\n  "}
          <span className="tok-p">);</span>
          {"\n"}
          <span className="tok-p">{"}"}</span>
        </CodeBlock>

        <p>
          Add <code>&quot;use client&quot;</code> to every component that uses a
          decane hook.
        </p>
        <p>
          Add <code>transpilePackages</code> to <code>next.config.ts</code>:
        </p>
        <CodeBlock lang="ts" file="next.config.ts">
          <span className="tok-k">const</span>{" "}
          <span className="tok-id">nextConfig</span>{" "}
          <span className="tok-p">=</span> <span className="tok-p">{"{"}</span>
          {"\n  "}
          <span className="tok-id">transpilePackages</span>
          <span className="tok-p">:</span> <span className="tok-p">[</span>
          <span className="tok-s">&quot;decane-connect-kit&quot;</span>
          <span className="tok-p">],</span>
          {"\n"}
          <span className="tok-p">{"}"}</span>
          <span className="tok-p">;</span>
        </CodeBlock>
      </div>

      <div className={`docs-tab-panel${active === "vite" ? " active" : ""}`}>
        <p>
          No extra config needed. Wrap your root component with{" "}
          <code>&lt;DecaneKit&gt;</code> and use hooks anywhere inside it.
        </p>
        <CodeBlock lang="tsx" file="src/main.tsx">
          <span className="tok-k">import</span>{" "}
          <span className="tok-id">ReactDOM</span>{" "}
          <span className="tok-k">from</span>{" "}
          <span className="tok-s">&quot;react-dom/client&quot;</span>
          <span className="tok-p">;</span>
          {"\n"}
          <span className="tok-k">import</span>{" "}
          <span className="tok-p">{"{"}</span>{" "}
          <span className="tok-id">DecaneKit</span>{" "}
          <span className="tok-p">{"}"}</span>{" "}
          <span className="tok-k">from</span>{" "}
          <span className="tok-s">&quot;decane-connect-kit&quot;</span>
          <span className="tok-p">;</span>
          {"\n"}
          <span className="tok-k">import</span>{" "}
          <span className="tok-id">App</span>{" "}
          <span className="tok-k">from</span>{" "}
          <span className="tok-s">&quot;./App&quot;</span>
          <span className="tok-p">;</span>
          {"\n\n"}
          <span className="tok-t">ReactDOM</span>
          <span className="tok-p">.</span>
          <span className="tok-f">createRoot</span>
          <span className="tok-p">(</span>
          <span className="tok-id">document</span>
          <span className="tok-p">.</span>
          <span className="tok-f">getElementById</span>
          <span className="tok-p">(</span>
          <span className="tok-s">&quot;root&quot;</span>
          <span className="tok-p">)!</span>
          <span className="tok-p">).</span>
          <span className="tok-f">render</span>
          <span className="tok-p">(</span>
          {"\n  "}
          <span className="tok-p">&lt;</span>
          <span className="tok-t">DecaneKit</span>{" "}
          <span className="tok-f">config</span>
          <span className="tok-p">{"={"}</span>
          <span className="tok-p">{"{"}</span>{" "}
          <span className="tok-id">theme</span>
          <span className="tok-p">:</span>{" "}
          <span className="tok-s">&quot;auto&quot;</span>{" "}
          <span className="tok-p">{"}"}</span>
          <span className="tok-p">{"}"}</span>
          <span className="tok-p">&gt;</span>
          {"\n    "}
          <span className="tok-p">&lt;</span>
          <span className="tok-t">App</span>{" "}
          <span className="tok-p">/&gt;</span>
          {"\n  "}
          <span className="tok-p">&lt;/</span>
          <span className="tok-t">DecaneKit</span>
          <span className="tok-p">&gt;</span>
          {"\n"}
          <span className="tok-p">);</span>
        </CodeBlock>
      </div>
    </div>
  );
}
