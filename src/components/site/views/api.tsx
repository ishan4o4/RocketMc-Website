"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookMarked, Package, Search } from "lucide-react";
import { API_CRATES, type ApiItem } from "@/lib/api-content";
import { useRouter } from "../router";
import { CodeBlock } from "../code-block";
import { Kicker, Reveal } from "../motion";

const KIND_STYLES: Record<ApiItem["kind"], string> = {
  trait: "bg-ember-50 text-ember-700 ring-ember-500/25",
  struct: "bg-flame-500/[0.08] text-flame-600 ring-flame-500/25 dark:text-flame-400",
  enum: "bg-stone-100 text-stone-600 ring-stone-400/30",
  fn: "bg-cream text-ember-800 ring-ember-500/20",
  mod: "bg-muted text-stone-600 ring-stone-400/30",
  type: "bg-stone-100 text-stone-600 ring-stone-400/30",
  macro: "bg-cream text-ember-800 ring-ember-500/20",
};

function ItemCard({ item }: { item: ApiItem }) {
  return (
    <motion.article
      id={`api-item-${item.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="scroll-mt-28 rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_2px_rgba(28,15,8,0.05)]"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-md px-2.5 py-0.5 font-mono text-[11px] font-semibold ring-1 ${KIND_STYLES[item.kind]}`}
        >
          {item.kind}
        </span>
        <h3 className="font-mono text-[17px] font-semibold tracking-tight text-heading">
          {item.name}
        </h3>
        {item.since && (
          <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 font-mono text-[10.5px] text-stone-500">
            since {item.since}
          </span>
        )}
      </div>

      <div className="mt-4">
        <CodeBlock code={item.signature} lang={item.lang ?? "rust"} title={`${item.name.toLowerCase()}.rs`} dense />
      </div>

      <p className="mt-4 text-[14.5px] leading-relaxed text-stone-700">
        {item.description}
      </p>

      {item.notes && (
        <ul className="mt-4 space-y-2">
          {item.notes.map((note) => (
            <li key={note} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-stone-600">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500" />
              {note}
            </li>
          ))}
        </ul>
      )}

      {item.example && (
        <div className="mt-4">
          <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-400">
            example
          </p>
          <CodeBlock code={item.example} lang="rust" dense />
        </div>
      )}
    </motion.article>
  );
}

export function ApiView({ sub }: { sub?: string | null }) {
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");
  const [activeCrate, setActiveCrate] = useState(API_CRATES[0].id);

  // deep-link: #/api/<item-id> — derive the owning crate without state-in-effect
  const ownerCrate = useMemo(() => {
    if (!sub) return null;
    for (const crate of API_CRATES) {
      if (crate.items.some((item) => item.id === sub)) return crate.id;
    }
    return null;
  }, [sub]);

  const currentCrateId = ownerCrate ?? activeCrate;

  useEffect(() => {
    if (!sub) return;
    const t = setTimeout(() => {
      document
        .getElementById(`api-item-${sub}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 320);
    return () => clearTimeout(t);
  }, [sub]);

  const trimmed = query.trim().toLowerCase();
  const searching = trimmed.length > 0;
  const searchResults = searching
    ? API_CRATES.flatMap((crate) =>
        crate.items
          .filter(
            (item) =>
              item.name.toLowerCase().includes(trimmed) ||
              item.description.toLowerCase().includes(trimmed) ||
              item.kind === trimmed
          )
          .map((item) => ({ item, crate }))
      )
    : [];
  const crate = API_CRATES.find((c) => c.id === currentCrateId) ?? API_CRATES[0];
  const totalItems = API_CRATES.reduce((n, c) => n + c.items.length, 0);

  return (
    <section className="bg-paper pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Kicker>api reference</Kicker>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-heading sm:text-5xl">
            Plugin API,{" "}
            <span className="text-gradient-ember">documented.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-stone-600">
            Mapped from the workspace source — {totalItems} documented items
            across {API_CRATES.length} sections. Plugins are written in
            Rust, either as sandboxed WebAssembly components (
            <span className="font-mono text-[14px]">rocketmc-plugin-api</span>)
            or as native in-process libraries.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[270px_1fr]">
          {/* sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items…"
                aria-label="Search API items"
                className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-[14px] text-heading outline-none transition-colors placeholder:text-stone-400 focus:border-ember-500/60 focus:ring-2 focus:ring-ember-500/20"
              />
            </div>

            <nav aria-label="API crates" className="mt-4 space-y-1">
              {API_CRATES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setQuery("");
                    setActiveCrate(c.id);
                    navigate("api");
                  }}
                  className={`block w-full rounded-lg px-3.5 py-2.5 text-left transition-colors ${
                    !searching && currentCrateId === c.id
                      ? "bg-ember-50 ring-1 ring-ember-500/25"
                      : "hover:bg-muted"
                  }`}
                >
                  <span
                    className={`block font-mono text-[13.5px] font-semibold ${
                      !searching && currentCrateId === c.id ? "text-ember-800" : "text-heading"
                    }`}
                  >
                    {c.name}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] text-stone-400">
                    {c.version.startsWith("@") ? c.version : `v${c.version}`} · {c.items.length} items
                  </span>
                </button>
              ))}
            </nav>

            <div className="mt-6 rounded-xl border border-border bg-cream p-4">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                <BookMarked className="h-3.5 w-3.5 text-ember-500" />
                adding a plugin
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-stone-600">
                <strong>WASM:</strong> depend on{" "}
                <span className="font-mono">rocketmc-plugin-api</span> in a{" "}
                <span className="font-mono">cdylib</span> crate, implement{" "}
                <span className="font-mono">Plugin</span>, call{" "}
                <span className="font-mono">register_plugin!</span>, build a WASM
                component. <strong>Native:</strong> use{" "}
                <span className="font-mono">#[plugin_impl]</span> and build a
                shared library. Drop the file into the server&apos;s{" "}
                <span className="font-mono">plugins/</span> folder.
              </p>
            </div>
          </aside>

          {/* content */}
          <div className="min-w-0 max-w-3xl">
            {searching ? (
              searchResults.length > 0 ? (
                <div className="space-y-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-400">
                    {searchResults.length} result{searchResults.length === 1 ? "" : "s"} for
                    “{query}”
                  </p>
                  {searchResults.map(({ item, crate: c }) => (
                    <div key={item.id}>
                      <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] text-stone-400">
                        <Package className="h-3 w-3" /> {c.name}
                      </p>
                      <ItemCard item={item} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-cream/60 p-10 text-center">
                  <p className="font-display text-lg font-semibold text-heading">
                    Nothing matches “{query}”.
                  </p>
                  <p className="mt-2 text-[14px] text-stone-500">
                    Try a type name (struct, trait), an item name, or clear the
                    search to browse crates.
                  </p>
                </div>
              )
            ) : (
              <>
                <motion.header
                  key={`${crate.id}-header`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-ink-800 bg-ink-950 p-6 text-white"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ember-500/15 text-ember-400 ring-1 ring-ember-500/30">
                      <Package className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-mono text-lg font-semibold">{crate.name}</h2>
                      <p className="font-mono text-[11px] text-stone-400">{crate.version.startsWith("@") ? crate.version : `v${crate.version}`}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[14px] leading-relaxed text-stone-300">
                    {crate.blurb}
                  </p>
                </motion.header>
                <div key={`${crate.id}-items`} className="mt-6 space-y-4">
                  {crate.items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
