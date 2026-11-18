"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Calendar,
  FileArchive,
  PackageOpen,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";
import {
  BUILDS,
  LATEST,
  PLATFORMS,
  type BuildRow,
} from "@/lib/site-data";
import { toast } from "@/hooks/use-toast";
import { CodeBlock } from "../code-block";
import { Kicker, Reveal, EASE } from "../motion";

type Channel = "all" | "stable" | "legacy" | "snapshot";

const CHANNELS: { id: Channel; label: string }[] = [
  { id: "all", label: "All builds" },
  { id: "stable", label: "Stable" },
  { id: "legacy", label: "Legacy" },
  { id: "snapshot", label: "Snapshot" },
];

const INSTALL_METHODS = [
  {
    id: "script",
    label: "Install script",
    code: `curl -fsSL https://get.rocketmc.dev | sh

# verifies sha256, installs to /usr/local/bin`,
    lang: "bash" as const,
  },
  {
    id: "cargo",
    label: "Cargo",
    code: `cargo install --git \\
  https://github.com/RocketMC-Team/rocketmc \\
  rocketmc`,
    lang: "bash" as const,
  },
  {
    id: "docker",
    label: "Docker",
    code: `docker run -d --name rocketmc \\
  -p 25565:25565 -p 19132:19132/udp \\
  -v $(pwd)/data:/data \\
  ghcr.io/rocketmc/rocketmc:1.0.0`,
    lang: "bash" as const,
  },
  {
    id: "manual",
    label: "Binary",
    code: `# grab the archive for your platform below
tar -xzf rocketmc-1.0.0-linux-x86_64.tar.gz
./rocketmc start`,
    lang: "bash" as const,
  },
];

function channelBadge(channel: BuildRow["channel"]) {
  if (channel === "stable")
    return "bg-ember-50 text-ember-700 ring-1 ring-ember-500/25";
  if (channel === "snapshot")
    return "bg-flame-500/10 text-flame-600 ring-1 ring-flame-500/25 dark:text-flame-400";
  return "bg-muted text-stone-500 ring-1 ring-border";
}

export function DownloadsView() {
  const [channel, setChannel] = useState<Channel>("all");
  const [install, setInstall] = useState("script");

  const builds = BUILDS.filter(
    (b) => channel === "all" || b.channel === channel
  );

  const download = (build: BuildRow) => {
    toast({
      title: `Build #${build.build} — ${build.version}`,
      description:
        "Demo action: wire this button to your release CDN or GitHub Releases tag.",
    });
  };

  const copySha = async (sha: string, label: string) => {
    try {
      await navigator.clipboard.writeText(sha);
      toast({ title: "Checksum copied", description: `SHA-256 for ${label}` });
    } catch {
      toast({ title: "Clipboard unavailable", description: "Copy the checksum manually." });
    }
  };

  return (
    <>
      {/* header */}
      <section className="bg-noise relative overflow-hidden bg-ink-950 pb-16 pt-32 text-white sm:pt-36">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div
          className="animate-aurora absolute -top-32 right-1/4 h-[380px] w-[560px] rounded-full bg-ember-600/20 blur-[110px]"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Kicker dark>downloads</Kicker>
            <h1 className="mt-4 font-display text-5xl font-bold tracking-tight sm:text-6xl">
              Every build,{" "}
              <span className="text-gradient-ember">verified.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-stone-300">
              RocketMC {LATEST.version} “{LATEST.codename}” targets Minecraft{" "}
              {LATEST.mcVersion} — protocol {LATEST.protocol}, data version{" "}
              {LATEST.dataVersion}. One native binary, no JVM, SHA-256
              checksums on every artifact.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["No JVM required", "1 GB RAM covers a small SMP", "Reproducible CI artifacts"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-[12.5px] text-stone-300"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-ember-400" />
                    {chip}
                  </span>
                )
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* build matrix */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight text-heading">
                Build matrix
              </h2>
              <p className="mt-1 text-[13.5px] text-stone-600">
                Pick a channel, download the latest build for your platform.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex flex-wrap gap-1 rounded-full border border-border bg-surface p-1">
                {CHANNELS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setChannel(c.id)}
                    className={`relative rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                      channel === c.id
                        ? "text-white"
                        : "text-stone-600 hover:text-heading"
                    }`}
                  >
                    {channel === c.id && (
                      <motion.span
                        layoutId="channel-pill"
                        className="absolute inset-0 rounded-full bg-ink-950 dark:bg-ember-500"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10">{c.label}</span>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-8">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(28,15,8,0.05)]">
              <div className="overflow-x-auto scroll-slim">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-border bg-cream/60">
                      {["Build", "Version", "Date", "Changes", "Size", "Notes", ""].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-5 py-3.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-stone-500"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {builds.map((build, i) => (
                      <motion.tr
                        key={build.build}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                        className="group border-b border-border/70 transition-colors last:border-0 hover:bg-ember-50/50"
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-[15px] font-semibold text-heading">
                            #{build.build}
                          </span>
                          <span
                            className={`ml-2 rounded-full px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider ${channelBadge(
                              build.channel
                            )}`}
                          >
                            {build.channel}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-[13px] text-stone-700">
                          {build.version}
                          <span className="block text-[11px] text-stone-400">MC {build.mc}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-[13px] text-stone-600">
                            <Calendar className="h-3.5 w-3.5 text-stone-400" />
                            {build.date}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-[13px] tabular text-stone-700">
                          {build.changes}
                        </td>
                        <td className="px-5 py-4 font-mono text-[13px] text-stone-600">
                          {build.size}
                        </td>
                        <td className="max-w-[260px] px-5 py-4 text-[13px] leading-snug text-stone-600">
                          {build.notes}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => download(build)}
                            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-ember-500 to-flame-600 px-4 text-[12.5px] font-semibold text-white transition-transform duration-300 hover:scale-105 active:scale-95"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                            Download
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>

          {/* platforms */}
          <div className="mt-16 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal className="min-w-0">
              <h2 className="font-display text-2xl font-bold tracking-tight text-heading">
                Platform archives
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-stone-600">
                Static binaries — copy, extract, run. Every archive carries a
                SHA-256 checksum; click to copy it.
              </p>
              <div className="mt-6 space-y-3">
                {PLATFORMS.map((platform) => (
                  <div
                    key={platform.id}
                    className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-ember-500/40"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ember-50 text-ember-600 ring-1 ring-ember-500/20">
                      <FileArchive className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-[13px] font-medium text-heading">
                        {platform.file}
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-stone-500">
                        {platform.label} · {platform.arch} · {platform.size}
                      </p>
                    </div>
                    <button
                      onClick={() => copySha(platform.sha, platform.file)}
                      className="shrink-0 rounded-lg border border-border px-3 py-1.5 font-mono text-[11px] text-stone-600 transition-colors hover:border-ember-500/50 hover:text-ember-700"
                      title="Copy SHA-256 checksum"
                    >
                      sha256
                    </button>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="min-w-0">
              <h2 className="font-display text-2xl font-bold tracking-tight text-heading">
                Install methods
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-stone-600">
                Four supported paths, same binary. The install script is the
                fastest; Cargo is the build-it-yourself route.
              </p>
              <div className="mt-6 flex flex-wrap gap-1.5 rounded-full border border-border bg-surface p-1 w-fit">
                {INSTALL_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setInstall(method.id)}
                    className={`relative rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-colors ${
                      install === method.id
                        ? "text-white"
                        : "text-stone-600 hover:text-heading"
                    }`}
                  >
                    {install === method.id && (
                      <motion.span
                        layoutId="install-pill"
                        className="absolute inset-0 rounded-full bg-ink-950 dark:bg-ember-500"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10">{method.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4">
                {INSTALL_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className={install === method.id ? "block" : "hidden"}
                  >
                    <CodeBlock
                      code={method.code}
                      lang={method.lang}
                      title={method.id === "script" ? "terminal" : method.id}
                      dense
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-ember-500/25 bg-ember-50/70 p-4 text-[13px] leading-relaxed text-ember-800">
                <TerminalSquare className="mt-0.5 h-4 w-4 shrink-0" />
                First run generates <span className="font-mono">rocketmc.toml</span> in
                the working directory, seeds the overworld and opens both
                listeners — TCP <span className="font-mono">:25565</span> and UDP{" "}
                <span className="font-mono">:19132</span>.
              </div>
              <p className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-stone-500">
                <PackageOpen className="h-4 w-4" />
                Upgrading? Drop in the new binary — worlds, players and
                advancement data carry over unchanged.
                <ArrowUpRight className="h-3 w-3" />
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
