"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Info,
  Lightbulb,
  Search,
  Waypoints,
} from "lucide-react";
import { DOC_GUIDES, type DocBlock } from "@/lib/docs-content";
import { useRouter } from "../router";
import { CodeBlock } from "../code-block";
import { Kicker, Reveal } from "../motion";

const CALLOUT_STYLES = {
  info: {
    ring: "border-ember-500/25 bg-ember-50/70 text-ember-900",
    icon: Info,
    iconCls: "text-ember-600",
  },
  warn: {
    ring: "border-flame-500/30 bg-flame-500/[0.06] text-flame-700",
    icon: AlertTriangle,
    iconCls: "text-flame-600 dark:text-flame-400",
  },
  tip: {
    ring: "border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-800 dark:text-emerald-300",
    icon: Lightbulb,
    iconCls: "text-emerald-600 dark:text-emerald-400",
  },
};

function Block({ block }: { block: DocBlock }) {
  if (block.kind === "p") {
    return (
      <p className="text-[15px] leading-relaxed text-stone-700">{block.text}</p>
    );
  }
  if (block.kind === "code") {
    return (
      <CodeBlock
        code={block.code ?? ""}
        lang={block.lang ?? "bash"}
        title={block.title}
        dense
      />
    );
  }
  if (block.kind === "callout") {
    const style = CALLOUT_STYLES[block.tone ?? "info"];
    const Icon = style.icon;
    return (
      <aside className={`flex items-start gap-3 rounded-xl border p-4 ${style.ring}`}>
        <Icon className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${style.iconCls}`} />
        <div>
          <p className="text-[14px] font-semibold">{block.title}</p>
          <p className="mt-1 text-[13.5px] leading-relaxed opacity-90">{block.text}</p>
        </div>
      </aside>
    );
  }
  if (block.kind === "list") {
    return (
      <ul className="space-y-2.5">
        {block.list?.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-stone-700">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.kind === "table" && block.table) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto scroll-slim">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-border bg-cream/70">
                {block.table.headers.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-stone-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.table.rows.map((row, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-ember-50/40">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-4 py-3 text-[13px] leading-relaxed align-top ${
                        j === 0 ? "font-mono text-[12.5px] font-medium text-heading" : "text-stone-600"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return null;
}

export function DocsView({ sub }: { sub?: string | null }) {
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");

  const initial = useMemo(() => {
    const found = DOC_GUIDES.find((g) => g.id === sub);
    return found ? found.id : DOC_GUIDES[0].id;
  }, [sub]);

  // derive the active guide straight from the deep-linkable hash (no state-in-effect)
  const activeId = initial;
  const active = DOC_GUIDES.find((g) => g.id === activeId) ?? DOC_GUIDES[0];
  const filtered = DOC_GUIDES.filter(
    (g) =>
      query === "" ||
      g.title.toLowerCase().includes(query.toLowerCase()) ||
      g.kicker.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="bg-paper pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Kicker>documentation</Kicker>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-heading sm:text-5xl">
            Ship a server in minutes.
          </h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-stone-600">
            Install, configure and harden RocketMC. Every guide reflects the
            shipped config format — no aspirational docs.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[250px_1fr]">
          {/* sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search guides…"
                aria-label="Search guides"
                className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-[14px] text-heading outline-none transition-colors placeholder:text-stone-400 focus:border-ember-500/60 focus:ring-2 focus:ring-ember-500/20"
              />
            </div>
            <nav aria-label="Documentation" className="mt-4 space-y-1">
              {filtered.map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => navigate("docs", guide.id)}
                  className={`relative block w-full rounded-lg px-3.5 py-2.5 text-left text-[14px] font-medium transition-colors ${
                    activeId === guide.id
                      ? "bg-ember-50 text-ember-800 ring-1 ring-ember-500/25"
                      : "text-stone-600 hover:bg-muted hover:text-heading"
                  }`}
                >
                  {activeId === guide.id && (
                    <motion.span
                      layoutId="docs-marker"
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-ember-500"
                    />
                  )}
                  {guide.title}
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
                    {guide.kicker}
                  </span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-3 py-4 text-[13px] text-stone-400">
                  No guides match “{query}”.
                </p>
              )}
            </nav>
            <div className="mt-6 rounded-xl border border-border bg-cream p-4">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                <Waypoints className="h-3.5 w-3.5 text-ember-500" />
                shipped version
              </p>
              <p className="mt-2 font-mono text-[13px] font-semibold text-heading">
                rocketmc 7.0.0 · 26.3
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-stone-500">
                Docs follow the current stable build. Older guides live on
                GitHub tags.
              </p>
            </div>
          </aside>

          {/* content */}
          <motion.article
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="min-w-0 max-w-3xl"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ember-600">
              {active.kicker}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-heading">
              {active.title}
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-stone-700">
              {active.intro}
            </p>
            <div className="mt-8 space-y-6">
              {active.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>

            {/* next / prev */}
            <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
              {(() => {
                const idx = DOC_GUIDES.findIndex((g) => g.id === active.id);
                const prev = DOC_GUIDES[idx - 1];
                const next = DOC_GUIDES[idx + 1];
                return (
                  <>
                    {prev ? (
                      <button
                        onClick={() => navigate("docs", prev.id)}
                        className="group text-left"
                      >
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-400">
                          ← previous
                        </span>
                        <span className="block text-[14px] font-semibold text-heading transition-colors group-hover:text-ember-700">
                          {prev.title}
                        </span>
                      </button>
                    ) : (
                      <span />
                    )}
                    {next ? (
                      <button
                        onClick={() => navigate("docs", next.id)}
                        className="group text-right"
                      >
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-400">
                          next →
                        </span>
                        <span className="block text-[14px] font-semibold text-heading transition-colors group-hover:text-ember-700">
                          {next.title}
                        </span>
                      </button>
                    ) : (
                      <span />
                    )}
                  </>
                );
              })()}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
