"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Check, Copy } from "lucide-react";

type Tok = { text: string; cls: string };

const RUST_KEYWORDS = new Set([
  "pub", "fn", "impl", "struct", "enum", "trait", "let", "mut", "use", "mod",
  "self", "Self", "return", "if", "else", "match", "for", "in", "while",
  "loop", "async", "await", "move", "where", "dyn", "crate", "as", "true",
  "false", "const", "static", "type", "ref", "unsafe", "Some", "None", "Ok",
  "Err", "repr", "derive",
]);

const BASH_KEYWORDS = new Set([
  "curl", "sh", "cd", "mkdir", "echo", "export", "cargo", "install", "git",
  "rocketmc", "start", "sudo", "apt", "docker", "run",
]);

const C = {
  kw: "text-flame-400",
  ty: "text-ember-300",
  str: "text-ember-200",
  num: "text-flame-300",
  com: "text-stone-500 italic",
  key: "text-ember-400",
  sec: "text-ember-500 font-semibold",
  dim: "text-stone-400",
  plain: "text-stone-300",
};

function push(tokens: Tok[], text: string, cls: string) {
  if (text) tokens.push({ text, cls });
}

function highlightLine(line: string, lang: string): Tok[] {
  const tokens: Tok[] = [];
  const trimmed = line.trimStart();

  if (lang === "toml") {
    if (/^\[.*\]$/.test(trimmed)) {
      push(tokens, line, C.sec);
      return tokens;
    }
    const eq = line.indexOf("=");
    if (eq > -1) {
      push(tokens, line.slice(0, eq), C.key);
      const rest = line.slice(eq);
      // color strings and numbers inside the value
      const valRe = /("[^"]*"|'[^']*'|[-\d.]+)/g;
      let last = 0;
      let m: RegExpExecArray | null;
      while ((m = valRe.exec(rest))) {
        push(tokens, rest.slice(last, m.index), C.dim);
        push(tokens, m[0], m[0].startsWith('"') || m[0].startsWith("'") ? C.str : C.num);
        last = m.index + m[0].length;
      }
      push(tokens, rest.slice(last), C.dim);
      return tokens;
    }
    if (trimmed.startsWith("#")) {
      push(tokens, line, C.com);
      return tokens;
    }
    push(tokens, line, C.plain);
    return tokens;
  }

  if (lang === "bash") {
    if (trimmed.startsWith("#")) {
      push(tokens, line, C.com);
      return tokens;
    }
    const re = /("[^"]*"|'[^']*'|#.*$|\b\d+\b|[A-Za-z_][A-Za-z0-9_-]*|\s+|[^\sA-Za-z0-9_]+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line))) {
      const t = m[0];
      if (t.startsWith('"') || t.startsWith("'")) push(tokens, t, C.str);
      else if (t.startsWith("#")) push(tokens, t, C.com);
      else if (/^\d+$/.test(t)) push(tokens, t, C.num);
      else if (/^[A-Za-z_]/.test(t)) {
        const isKw = BASH_KEYWORDS.has(t);
        push(tokens, t, isKw ? C.kw : C.plain);
      } else if (/^\s+$/.test(t)) push(tokens, t, C.plain);
      else push(tokens, t, C.dim);
    }
    return tokens;
  }

  // rust
  const re =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\/.*$|\/\*.*?\*\/|\b\d[\d_]*(?:\.\d+)?\b|[A-Za-z_][A-Za-z0-9_]*|\s+|[^\sA-Za-z0-9_]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const t = m[0];
    if (t.startsWith("//")) push(tokens, t, C.com);
    else if (t.startsWith('"') || t.startsWith("'")) push(tokens, t, C.str);
    else if (/^\d/.test(t)) push(tokens, t, C.num);
    else if (/^[A-Za-z_]/.test(t)) {
      if (RUST_KEYWORDS.has(t)) push(tokens, t, C.kw);
      else if (/^[A-Z]/.test(t)) push(tokens, t, C.ty);
      else push(tokens, t, C.plain);
    } else if (/^\s+$/.test(t)) push(tokens, t, C.plain);
    else push(tokens, t, C.dim);
  }
  return tokens;
}

export function CodeBlock({
  code,
  lang = "rust",
  title,
  className = "",
  showLines = false,
  dense = false,
}: {
  code: string;
  lang?: "rust" | "toml" | "bash";
  title?: string;
  className?: string;
  showLines?: boolean;
  dense?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/10 bg-ink-950 shadow-[0_16px_48px_-16px_rgba(28,15,8,0.5)] ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-flame-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-ember-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-stone-500/70" />
        {title && (
          <span className="ml-2 truncate font-mono text-[11px] text-stone-400">
            {title}
          </span>
        )}
        <button
          onClick={copy}
          aria-label="Copy code"
          className="ml-auto inline-flex h-7 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 font-mono text-[11px] text-stone-400 transition-colors hover:border-ember-500/40 hover:text-ember-300"
        >
          {copied ? (
            <Check className="h-3 w-3 text-ember-400" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <div
        className={`scroll-slim overflow-x-auto ${dense ? "py-2.5" : "py-3.5"}`}
      >
        <pre
          className={`font-mono ${dense ? "text-[12px] leading-6" : "text-[13px] leading-6"}`}
        >
          {lines.map((line, i) => (
            <div key={i} className="flex min-w-max px-4">
              {showLines && (
                <span className="mr-4 w-6 shrink-0 select-none text-right text-stone-600">
                  {i + 1}
                </span>
              )}
              <code className="whitespace-pre">
                {highlightLine(line, lang).map((t, j) => (
                  <span key={j} className={t.cls}>
                    {t.text}
                  </span>
                ))}
                {line === "" ? "\u00A0" : null}
              </code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

/* Hero terminal with typing animation */
export function TypingTerminal({
  lines,
  className = "",
}: {
  lines: { text: string; tone: "cmd" | "dim" | "ok" }[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [progress, setProgress] = useState<{ line: number; char: number }>({
    line: 0,
    char: 0,
  });
  const done = progress.line >= lines.length;

  useEffect(() => {
    if (!inView || done) return;
    const current = lines[progress.line];
    if (!current) return;
    if (progress.char < current.text.length) {
      const t = setTimeout(
        () => setProgress((p) => ({ ...p, char: p.char + 1 })),
        current.tone === "cmd" ? 26 : 9
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setProgress((p) => ({ line: p.line + 1, char: 0 })),
      current.tone === "cmd" ? 420 : 170
    );
    return () => clearTimeout(t);
  }, [inView, progress, lines, done]);

  const toneCls = (tone: string) =>
    tone === "cmd"
      ? "text-white"
      : tone === "ok"
        ? "text-ember-400"
        : "text-stone-400";

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-xl border border-white/10 bg-ink-950/90 shadow-[0_24px_80px_-24px_rgba(249,115,22,0.28)] backdrop-blur ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-flame-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-ember-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-stone-500/70" />
        <span className="ml-2 font-mono text-[11px] text-stone-400">
          rocketmc@prod:~
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-stone-600">
          zsh
        </span>
      </div>
      <div className="scroll-slim h-[240px] overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-6 sm:text-[13px]">
        {lines.slice(0, progress.line).map((l, i) => (
          <div key={i} className={`min-w-max whitespace-pre ${toneCls(l.tone)}`}>
            {l.text}
          </div>
        ))}
        {!done && lines[progress.line] && (
          <div
            className={`min-w-max whitespace-pre ${toneCls(lines[progress.line].tone)}`}
          >
            {lines[progress.line].text.slice(0, progress.char)}
            <span className="animate-caret ml-0.5 inline-block h-3.5 w-[7px] translate-y-[2px] bg-ember-400" />
          </div>
        )}
        {done && (
          <div className="text-stone-400">
            <span className="text-ember-400">$</span>{" "}
            <span className="animate-caret ml-0.5 inline-block h-3.5 w-[7px] translate-y-[2px] bg-ember-400" />
          </div>
        )}
      </div>
    </div>
  );
}
