import type { ReactNode } from "react";

// A small tokenizer that emits the tok-* classes the docs code blocks use.
// Enough for readable samples in TypeScript, Python, Rust, TOML and shell.

export type Lang = "ts" | "python" | "rust" | "toml" | "bash";

const KEYWORDS: Record<Lang, Set<string>> = {
  ts: new Set(["const", "let", "var", "await", "async", "new", "import", "export", "from", "return", "function", "interface", "type", "true", "false", "null", "undefined", "as", "of", "in", "if", "else", "throw", "class"]),
  python: new Set(["import", "from", "as", "def", "async", "await", "return", "if", "elif", "else", "for", "in", "with", "try", "except", "raise", "class", "None", "True", "False", "not", "and", "or", "is", "pass", "lambda", "yield"]),
  rust: new Set(["use", "let", "mut", "fn", "async", "await", "pub", "struct", "enum", "impl", "match", "if", "else", "return", "Some", "None", "Ok", "Err", "self", "Self", "true", "false", "mod", "crate", "move", "where", "for", "in", "as", "ref", "type", "const"]),
  toml: new Set(["true", "false"]),
  bash: new Set(["pip", "uv", "cargo", "npm", "export", "curl"]),
};

export function hl(code: string, lang: Lang = "ts"): ReactNode[] {
  const comment = lang === "python" || lang === "toml" || lang === "bash" ? "#[^\\n]*" : "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/";
  const str = lang === "rust"
    ? `"(?:[^"\\\\]|\\\\.)*"`
    : `"""[\\s\\S]*?"""|"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'`;
  const re = new RegExp(`(${comment})|(${str})|(\\b\\d+(?:[\\d_]*\\d)?(?:\\.\\d+)?n?\\b)|([A-Za-z_$][A-Za-z0-9_$]*!?)|(\\s+)|([^\\s])`, "g");
  const kw = KEYWORDS[lang];
  const out: ReactNode[] = [];
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(code)) !== null) {
    const key = i++;
    if (m[1] !== undefined) out.push(<span key={key} className="tok-c">{m[1]}</span>);
    else if (m[2] !== undefined) out.push(<span key={key} className="tok-s">{m[2]}</span>);
    else if (m[3] !== undefined) out.push(<span key={key} className="tok-n">{m[3]}</span>);
    else if (m[4] !== undefined) {
      const w = m[4];
      const next = code[re.lastIndex];
      if (kw.has(w)) out.push(<span key={key} className="tok-k">{w}</span>);
      else if (w.endsWith("!") || next === "(") out.push(<span key={key} className="tok-f">{w}</span>);
      else if (/^[A-Z]/.test(w)) out.push(<span key={key} className="tok-t">{w}</span>);
      else out.push(<span key={key} className="tok-id">{w}</span>);
    } else if (m[5] !== undefined) out.push(m[5]);
    else out.push(<span key={key} className="tok-p">{m[6]}</span>);
  }
  return out;
}
