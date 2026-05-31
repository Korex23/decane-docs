"use client";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function Toc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".docs-main h2[id], .docs-main h3[id]")
    );

    const extracted: TocItem[] = headings.map((h) => {
      const clone = h.cloneNode(true) as HTMLElement;
      clone.querySelectorAll(".docs-anchor").forEach((n) => n.remove());
      return {
        id: h.id,
        text: clone.textContent?.trim() ?? "",
        level: h.tagName === "H2" ? 2 : 3,
      };
    });
    setItems(extracted);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-70px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);

  if (items.length === 0) return <aside className="docs-toc" />;

  return (
    <aside className="docs-toc">
      <div className="docs-toc-title">On this page</div>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.level === 2 ? "l2" : "l3"}>
            <a
              href={`#${item.id}`}
              className={activeId === item.id ? "active" : ""}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
