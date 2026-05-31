"use client";
import { useRef, useState } from "react";

interface CodeBlockProps {
  lang: string;
  file?: string;
  children: React.ReactNode;
}

export function CodeBlock({ lang, file, children }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = preRef.current?.innerText ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <div className="docs-code">
      <div className="docs-code-head">
        <span className="docs-code-lang">{lang}</span>
        {file && <span className="docs-code-file">{file}</span>}
        <button className={`docs-copy-btn${copied ? " copied" : ""}`} onClick={handleCopy}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre ref={preRef}><code>{children}</code></pre>
    </div>
  );
}
