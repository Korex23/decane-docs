export interface DocsCard {
  href: string;
  title: string;
  desc: string;
}

// Entry points at the top of a docs set: the four or six places a first-time
// reader is most likely to want next.
export function DocsCards({ items }: { items: DocsCard[] }) {
  return (
    <div className="docs-cards">
      {items.map((c) => (
        <a key={c.href} href={c.href} className="docs-card">
          <span className="docs-card-title">
            {c.title}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
          <span className="docs-card-desc">{c.desc}</span>
        </a>
      ))}
    </div>
  );
}
