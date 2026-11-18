"use client";

import { Check, Github, Tag } from "lucide-react";
import { GITHUB_URL, RELEASES, type Release } from "@/lib/site-data";
import { Kicker, Reveal } from "../motion";

function ChannelBadge({ channel }: { channel: Release["channel"] }) {
  const cls =
    channel === "stable"
      ? "bg-ember-50 text-ember-700 ring-ember-500/25"
      : channel === "snapshot"
        ? "bg-flame-500/10 text-flame-600 ring-flame-500/25 dark:text-flame-400"
        : "bg-muted text-stone-500 ring-border";
  return (
    <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ring-1 ${cls}`}>
      {channel}
    </span>
  );
}

export function ChangelogView() {
  return (
    <section className="bg-paper pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Kicker>changelog</Kicker>
          <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-heading sm:text-5xl">
                Every rocket has a{" "}
                <span className="text-gradient-ember">flight log.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-stone-600">
                Highlights from v3.5 through v7.0. Full per-file notes live on
                GitHub with each release tag.
              </p>
            </div>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink-950 px-5 text-[13.5px] font-semibold text-white transition-transform hover:scale-[1.03] dark:bg-ember-500"
            >
              <Github className="h-4 w-4" />
              Release tags
            </a>
          </div>
        </Reveal>

        <ol className="relative mt-16 space-y-10">
          <span
            className="absolute left-[19px] top-2 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-ember-500 via-ember-500/30 to-transparent sm:left-[87px]"
            aria-hidden="true"
          />
          {RELEASES.map((release, i) => (
            <li key={release.version}>
              <Reveal delay={i * 0.04}>
                <article className="group relative grid gap-4 sm:grid-cols-[44px_1fr] sm:gap-8">
                  <div className="flex items-start sm:justify-center">
                    <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-ember-500/40 bg-surface text-ember-600 shadow-[0_0_0_6px_rgba(255,248,242,1)] transition-colors duration-300 group-hover:bg-ember-500 group-hover:text-white sm:h-14 sm:w-14 dark:shadow-[0_0_0_6px_rgba(14,9,6,1)]">
                      <Tag className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="min-w-0 rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_2px_rgba(28,15,8,0.05)] transition-all duration-300 hover:border-ember-500/40 hover:shadow-[0_20px_48px_-20px_rgba(249,115,22,0.28)]">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-mono text-[22px] font-semibold tracking-tight text-heading">
                        v{release.version}
                      </h2>
                      <span className="font-display text-[15px] font-semibold text-ember-600">
                        “{release.codename}”
                      </span>
                      <ChannelBadge channel={release.channel} />
                      <span className="ml-auto font-mono text-[11.5px] text-stone-500">
                        {release.date} · MC {release.mc}
                      </span>
                    </div>
                    <p className="mt-2 text-[15px] font-medium text-stone-800">
                      {release.tagline}
                    </p>
                    <ul className="mt-4 grid gap-2.5 md:grid-cols-2">
                      {release.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-stone-600"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember-500" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-14">
          <div className="rounded-2xl border border-ember-500/25 bg-ember-50/60 p-6 text-center">
            <p className="font-display text-lg font-semibold text-heading">
              Older history lives on the launchpad.
            </p>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-stone-600">
              Pre-3.5 releases predate the public workspace. The full commit
              history is open on GitHub from day one.
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-ember-500 to-flame-600 px-6 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              <Github className="h-4 w-4" />
              Browse the repository
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
