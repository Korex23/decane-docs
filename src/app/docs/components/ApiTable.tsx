import type { ReactNode } from "react";

export interface ApiRow {
  /** Member name, rendered in mono. */
  name: string;
  /** Type or signature, rendered in mono. */
  type: string;
  /** Plain-language description. May include inline <code>. */
  desc: ReactNode;
}

export interface ApiGroup {
  title: string;
  rows: ApiRow[];
}

/**
 * The reference table for a hook or object: one row per member, grouped by
 * what the member is for. Tables, not annotated code, because a reader scans
 * a reference by name and needs the type and the meaning side by side without
 * decoding a comment column.
 */
export function ApiTable({ groups }: { groups: ApiGroup[] }) {
  return (
    <div className="docs-api-wrap">
      <table className="docs-api">
        <colgroup>
          <col className="c-name" />
          <col className="c-type" />
          <col className="c-desc" />
        </colgroup>
        <thead>
          <tr>
            <th>Member</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        {groups.map((g) => (
          <tbody key={g.title}>
            <tr className="docs-api-group">
              <th colSpan={3}>{g.title}</th>
            </tr>
            {g.rows.map((r) => (
              <tr key={r.name}>
                <td className="name">
                  <code>{r.name}</code>
                </td>
                <td className="type">
                  <code>{r.type}</code>
                </td>
                <td className="desc">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
