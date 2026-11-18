"use client";

import { ArrowUpRight, Github } from "lucide-react";
import { DISCORD_URL, GITHUB_URL } from "@/lib/site-data";
import { useRouter } from "./router";
import { LogoMark, Wordmark } from "./logo";
import type { RouteId } from "@/lib/site-data";

const COLUMNS: {
  title: string;
  links: { label: string; view?: RouteId; href?: string }[];
}[] = [
  {
    title: "Project",
    links: [
      { label: "Downloads", view: "downloads" },
      { label: "Changelog", view: "changelog" },
      { label: "API Reference", view: "api" },
      { label: "Documentation", view: "docs" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "Getting started", view: "docs" },
      { label: "Configuration", view: "docs" },
      { label: "Exploit protections", view: "docs" },
      { label: "Migrating from Paper", view: "docs" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discord", href: DISCORD_URL },
      { label: "GitHub", href: GITHUB_URL },
      { label: "Contributing", view: "community" },
      { label: "Showcase", view: "community" },
    ],
  },
];

export function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-ink-950 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark size={36} />
              <Wordmark dark size="text-xl" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-400">
              The high-performance Minecraft server engine, written in Rust.
              Vanilla parity, built-in Bedrock support, and a plugin API with
              no JVM in sight.
            </p>
            <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[11px] tracking-wide text-stone-300">
                All systems operational
              </span>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.view ? (
                      <button
                        onClick={() => navigate(link.view as RouteId)}
                        className="group inline-flex items-center gap-1 text-sm text-stone-400 transition-colors hover:text-ember-300"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-ember-300"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs leading-relaxed text-stone-500">
            © 2026 RocketMC Team. Released under the MIT license. Not an
            official Minecraft product — not affiliated with Mojang or
            Microsoft.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-stone-500 transition-colors hover:text-ember-300"
            >
              <Github className="h-3.5 w-3.5" /> source
            </a>
            <span className="font-mono text-[11px] uppercase tracking-widest text-stone-600">
              site v1.0.0
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-stone-600">
              protocol 777
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
