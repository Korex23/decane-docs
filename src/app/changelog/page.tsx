import { DocsShell } from "../docs/components/DocsShell";
import type { DocPage } from "../docs/components/types";
import manifest from "../../../public/llms-version.json";

interface Entry { version: string; date: string; summary: string }
interface Section { key: string; label: string; pkg: string; entries: Entry[] }

// The changelog is the freshness manifest agents read, rendered for people:
// one entry per release across all four packages, newest first.
const SECTIONS: Section[] = [
  { key: "web", label: "Web SDK", pkg: manifest.package, entries: manifest.changelog as Entry[] },
  { key: "mobile", label: "React Native SDK", pkg: manifest.mobile.package, entries: manifest.mobile.changelog as Entry[] },
  { key: "node", label: "Node SDK", pkg: manifest.node.package, entries: manifest.node.changelog as Entry[] },
  { key: "python", label: "Python SDK", pkg: manifest.python.package, entries: manifest.python.changelog as Entry[] },
  { key: "rust", label: "Rust SDK", pkg: manifest.rust.package, entries: manifest.rust.changelog as Entry[] },
  { key: "swift", label: "Swift SDK", pkg: manifest.swift.package, entries: manifest.swift.changelog as Entry[] },
  { key: "connect", label: "Connect API", pkg: "connect/v1", entries: manifest.connect.changelog.map((e) => ({ version: e.api, date: e.date, summary: e.summary })) },
];

const ALL = SECTIONS.flatMap((s) => s.entries.map((e) => ({ ...e, label: s.label, pkg: s.pkg, key: s.key })))
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

function fmt(d: string) {
  const dt = new Date(d + "T00:00:00Z");
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function ChangelogBody() {
  return (
    <div className="changelog">
      {ALL.map((e, i) => (
        <article key={`${e.key}-${i}`} className="changelog-entry">
          <div className="changelog-meta">
            <span className="changelog-date">{fmt(e.date)}</span>
            <span className="changelog-pkg">{e.label}</span>
          </div>
          <div className="changelog-text">
            <h3 id={`v-${e.key}-${i}`}><code>{e.pkg}</code>{e.version !== e.pkg && ` ${e.version}`}</h3>
            <p>{e.summary}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

const PAGE: DocPage = { slug: "overview", group: "Changelog", title: "Changelog", icon: "history", body: <ChangelogBody /> };

export default function ChangelogPage() {
  return (
    <DocsShell
      set="changelog"
      basePath="/changelog"
      pages={[PAGE]}
      page={PAGE}
      anchors={{}}
      search={ALL.slice(0, 12).map((e, i) => ({ id: `/changelog#v-${e.key}-${i}`, title: e.version !== e.pkg ? `${e.pkg} ${e.version}` : e.pkg, crumb: fmt(e.date), mono: true }))}
      lede="Notable changes across the SDKs and the API, newest first. Agents read the same data from llms-version.json."
    />
  );
}
