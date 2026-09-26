"use client";

import { useEffect, useState } from "react";

interface TocItem { id: string; text: string; level: 2 | 3 }

// "On this page" with a reading-progress rail and a place to ask for help.
export function Toc({ current = "web" }: { current?: "web" | "node" }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>(".docs-main h2[id], .docs-main h3[id]"));
    setItems(
      headings.map((h) => {
        const clone = h.cloneNode(true) as HTMLElement;
        clone.querySelectorAll(".docs-anchor").forEach((n) => n.remove());
        return { id: h.id, text: clone.textContent?.trim() ?? "", level: h.tagName === "H2" ? 2 : 3 };
      }),
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActiveId(entry.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((h) => io.observe(h));

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const pct = Math.round(progress * 100);
  return (
    <aside className="docs-toc">
      <div className="docs-toc-head">
        <span className="docs-toc-title">On this page</span>
        <span className="docs-toc-progress">{pct}%</span>
      </div>
      <div className="docs-toc-rail">
        <div className="docs-toc-fill" style={{ height: `${pct}%` }} />
        <ul>
          {items.map((item) => (
            <li key={item.id} className={item.level === 2 ? "l2" : "l3"}>
              <a href={`#${item.id}`} className={activeId === item.id ? "active" : ""}>{item.text}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="docs-help">
        <b>Stuck?</b>
        <a href={`https://github.com/Korex23/decane-docs/blob/main/src/app/${current === "web" ? "docs" : "node-docs"}/page.tsx`} target="_blank" rel="noreferrer">Edit this page</a>
        <a href="mailto:info@decane.app">Email info@decane.app</a>
        {current === "web" ? (
          <>
            <a href="/llms.txt" target="_blank" rel="noreferrer">llms.txt for the web SDK</a>
            <a href="/llms-expo.txt" target="_blank" rel="noreferrer">llms-expo.txt for React Native</a>
          </>
        ) : (
          <a href="/llms-node.txt" target="_blank" rel="noreferrer">llms-node.txt for your agent</a>
        )}
      </div>
    </aside>
  );
}
