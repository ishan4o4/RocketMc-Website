"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Braces,
  Check,
  Crosshair,
  Gauge,
  Github,
  Layers,
  MessagesSquare,
  Plus,
  ShieldCheck,
  Skull,
  Swords,
} from "lucide-react";
import {
  FEATURES,
  HERO_CONFIG,
  HERO_STATS,
  LATEST,
  MARQUEE_NETWORKS,
  PERF_GROUPS,
  RELEASES,
  TERMINAL_LINES,
  DISCORD_URL,
  GITHUB_URL,
} from "@/lib/site-data";
import { useRouter } from "../router";
import { Counter, Kicker, Reveal, SpotlightCard, Stagger, StaggerItem, EASE } from "../motion";
import { CodeBlock, TypingTerminal } from "../code-block";

const FEATURE_ICONS = [Gauge, Crosshair, Layers, ShieldCheck, Braces, Brain];
const FEATURE_SPANS = [
  "md:col-span-4",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-6",
];

function Sparkline() {
  return (
    <svg
      viewBox="0 0 220 60"
      className="mt-2 h-24 w-full"
      role="img"
      aria-label="TPS comparison sparkline: RocketMC holds flat near 20 TPS while vanilla declines"
    >
      <defs>
        <linearGradient id="spark-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f97316" stopOpacity="0.22" />
          <stop offset="1" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="spark-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fb923c" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      {[12, 26, 40].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="220"
          y2={y}
          className="[stroke:rgba(28,15,8,0.07)] dark:[stroke:rgba(255,255,255,0.08)]"
        />
      ))}
      <motion.path
        d="M0 18 C 30 16, 60 19, 90 17 S 150 18, 220 16 L220 60 L0 60 Z"
        fill="url(#spark-area)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.8 }}
      />
      <motion.path
        d="M0 16 C 40 20, 80 34, 120 40 S 180 48, 220 50"
        fill="none"
        stroke="#a8a29e"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE }}
      />
      <motion.path
        d="M0 18 C 30 16, 60 19, 90 17 S 150 18, 220 16"
        fill="none"
        stroke="url(#spark-line)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
      />
    </svg>
  );
}

function Hero() {
  const { navigate } = useRouter();
  return (
    <section className="bg-noise relative overflow-hidden bg-ink-950 text-white">
      {/* backdrop */}
      <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
      <div
        className="animate-aurora absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-ember-600/25 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="animate-aurora-slow absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-flame-600/20 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="animate-float-slow absolute -left-32 bottom-0 h-[360px] w-[360px] rounded-full bg-ember-500/15 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="mask-fade-b absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.button
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              onClick={() => navigate("changelog")}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-ember-500/40 bg-ember-500/10 px-4 py-1.5 font-mono text-[11.5px] tracking-wide text-ember-200 transition-colors hover:border-ember-400/70"
            >
              <span className="shimmer-sweep absolute inset-0" aria-hidden="true" />
              <span className="relative flex h-1.5 w-1.5 rounded-full bg-ember-400 animate-ring-pulse" />
              <span className="relative">
                v{LATEST.version} “{LATEST.codename}” is live — dragon multi-part routing, breeze, phantoms
              </span>
              <ArrowRight className="relative h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </motion.button>

            <motion.h1
              initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, delay: 0.08, ease: EASE }}
              className="mt-7 font-display text-[2.75rem] font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.35rem]"
            >
              The Minecraft server engine,{" "}
              <span className="text-gradient-ember">written in Rust.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-stone-300 sm:text-base"
            >
              Vanilla 26.3 parity you can audit, Bedrock support without a
              sidecar, and PaperMC-style exploit protections — with startup in
              seconds and TPS that holds. No JVM required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              className="mt-9 flex flex-wrap items-center gap-3.5"
            >
              <button
                onClick={() => navigate("downloads")}
                className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-ember-500 to-flame-600 px-7 text-[15px] font-semibold text-white shadow-[0_10px_36px_-8px_rgba(249,115,22,0.65)] transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              >
                <span className="shimmer-sweep absolute inset-0" aria-hidden="true" />
                <ArrowDown className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                <span className="relative">Download {LATEST.version}</span>
              </button>
              <button
                onClick={() => navigate("docs")}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-7 text-[15px] font-semibold text-white backdrop-blur transition-colors hover:border-white/60 hover:bg-white/[0.06]"
              >
                Read the docs
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-7 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500"
            >
              protocol {LATEST.protocol} · data version {LATEST.dataVersion} ·
              MIT licensed · 1,847-item registry
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
            className="relative"
          >
            <div
              className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-ember-500/25 via-transparent to-flame-600/25 blur-xl"
              aria-hidden="true"
            />
            <TypingTerminal lines={TERMINAL_LINES} className="relative" />
          </motion.div>
        </div>

        {/* stats */}
        <Reveal delay={0.15} className="mt-16">
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur md:grid-cols-4 md:divide-x md:divide-white/10">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="border-t border-white/10 px-6 py-6 md:border-t-0">
                <p className="font-display text-3xl font-bold tracking-tight text-white">
                  <Counter
                    value={stat.value}
                    decimals={"decimals" in stat ? (stat.decimals as number) : 0}
                    suffix={stat.suffix}
                    compact={stat.format === "compact"}
                  />
                </p>
                <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Marquee() {
  const loop = [...MARQUEE_NETWORKS, ...MARQUEE_NETWORKS];
  return (
    <div className="border-b border-border bg-cream py-4">
      <div className="mask-fade-x overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-8">
          {loop.map((item, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-stone-500">
                {item}
              </span>
              <span className="text-[9px] text-ember-500" aria-hidden="true">
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section className="bg-paper py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <Kicker>01 / why RocketMC</Kicker>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-heading sm:text-[2.6rem]">
              Engineered, not approximated.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-[15px] leading-relaxed text-stone-600">
              Registries generated from Mojang’s official 26.3 jar, then every
              gameplay system audited against vanilla behavior. The result is a
              server that behaves like vanilla — at rocket speed.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-4 md:grid-cols-6">
          {FEATURES.map((feature, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <StaggerItem key={feature.title} className={FEATURE_SPANS[i]}>
                <SpotlightCard className="group h-full rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_2px_rgba(28,15,8,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-[0_20px_48px_-18px_rgba(249,115,22,0.35)]">
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ember-50 text-ember-600 ring-1 ring-ember-500/20 transition-colors duration-300 group-hover:bg-ember-500 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">
                        {feature.tag}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-heading">
                      {feature.title}
                    </h3>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-stone-600">
                      {feature.body}
                    </p>
                    {feature.points && (
                      <ul className="mt-4 space-y-2">
                        {feature.points.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-2 text-[13px] text-stone-700"
                          >
                            <Plus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember-500" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                    {i === 0 && (
                      <div className="mt-4">
                        <Sparkline />
                        <div className="mt-1 flex items-center gap-5 font-mono text-[10.5px] text-stone-500">
                          <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-ember-500" />
                            RocketMC · 19.9 TPS
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                            Vanilla · 11.6 TPS
                          </span>
                        </div>
                      </div>
                    )}
                    {i === 5 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {["Warden anger system", "Sonic boom", "Dragon beams", "Powered blue skulls", "25+ signature mechanics"].map(
                          (chip) => (
                            <span
                              key={chip}
                              className="rounded-full border border-border bg-cream px-3 py-1 font-mono text-[11px] text-stone-600 transition-colors group-hover:border-ember-500/30 group-hover:text-ember-700"
                            >
                              {chip}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

function Benchmarks() {
  return (
    <section className="bg-noise relative overflow-hidden bg-ink-950 py-24 text-white sm:py-28">
      <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
      <div
        className="animate-aurora absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-flame-600/15 blur-[110px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Kicker dark>02 / benchmarks</Kicker>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-[2.6rem]">
              Numbers over noise.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-stone-400">
              Synthetic benchmark on 8 vCPU / 16 GB with 200 simulated players,
              view distance 10. Lower is better only where marked — everything
              else, bigger is better.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-4 lg:grid-cols-3">
          {PERF_GROUPS.map((group) => (
            <StaggerItem key={group.id}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition-colors duration-300 hover:border-ember-500/30">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold">{group.label}</h3>
                  {group.better === "low" && (
                    <span className="rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-stone-400">
                      lower is better
                    </span>
                  )}
                </div>
                <p className="mt-1 font-mono text-[10.5px] text-stone-500">{group.note}</p>
                <div className="mt-6 space-y-5">
                  {group.rows.map((row) => {
                    const pct = Math.min(100, (row.value / group.rows[0].max) * 100);
                    return (
                      <div key={row.name}>
                        <div className="flex items-baseline justify-between">
                          <span
                            className={`text-[13px] font-medium ${row.primary ? "text-white" : "text-stone-400"}`}
                          >
                            {row.name}
                          </span>
                          <span
                            className={`font-mono text-[13px] tabular ${row.primary ? "text-ember-300" : "text-stone-500"}`}
                          >
                            {row.value.toLocaleString("en-US")}
                            {group.unit}
                          </span>
                        </div>
                        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
                            className={`h-full rounded-full ${
                              row.primary
                                ? "bg-gradient-to-r from-ember-500 to-flame-500 shadow-[0_0_14px_rgba(249,115,22,0.55)]"
                                : "bg-stone-600/70"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function ConfigShowcase() {
  const { navigate } = useRouter();
  return (
    <section className="bg-paper py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Kicker>03 / configuration</Kicker>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-heading sm:text-[2.6rem]">
              One file. Total control.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-stone-600">
              rocketmc.toml is the whole server. Auth per platform, performance
              tuning, world settings and a hardened [exploits] section with
              PaperMC’s exact defaults — paste a paper.yml snippet and the
              kebab-case aliases resolve automatically.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Separate online-mode for Java and Bedrock",
                "12 exploit toggles wired into the engine",
                "Duplicate-UUID modes: safe-regen / delete / warn / nothing",
                "Item validation with Paper’s book limits",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] text-stone-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember-500" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("docs")}
              className="group mt-8 inline-flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-ember-600 transition-colors hover:text-flame-600"
            >
              Read the config guide
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Reveal>
          <Reveal delay={0.12} className="min-w-0">
            <div className="group relative">
              <div
                className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-ember-500/15 to-flame-600/15 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
              <CodeBlock
                code={HERO_CONFIG}
                lang="toml"
                title="rocketmc.toml"
                showLines
                className="relative transition-transform duration-500 group-hover:-translate-y-1.5"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const BOSS_CARDS = [
  {
    icon: Brain,
    version: "v0.5.9",
    name: "Warden",
    points: [
      "Per-target anger manager, 0–150 with vanilla NBT persistence",
      "Sonic boom bypasses armor, enchantments and shields",
      "Sniff → roar → dig cycle plus 16-block vibration hearing",
    ],
  },
  {
    icon: Swords,
    version: "v1.0.0",
    name: "Ender Dragon",
    points: [
      "Crystal healing beams rendered at full vanilla range",
      "Multi-part damage routing: head / body / tail hitboxes",
      "Real fireball projectile with vanilla splash behavior",
    ],
  },
  {
    icon: Skull,
    version: "v0.5.9",
    name: "Wither",
    points: [
      "Blue skulls fire on the powered rule, not a 0.1% roll",
      "Skull deflection and armor-piercing damage rules",
      "Charge behavior and invulnerable armor phase enforced",
    ],
  },
];

function BossBand() {
  return (
    <section className="bg-cream py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Kicker>04 / mob AI</Kicker>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-heading sm:text-[2.6rem]">
              Every mob audited. The bosses rebuilt.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-stone-600">
              155 of 161 entity types map to real goal stacks. The three bosses
              got vanilla-grade rebuilds — because “a warden that never angers”
              is not a warden.
            </p>
          </Reveal>
        </div>
        <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
          {BOSS_CARDS.map((boss) => (
            <StaggerItem key={boss.name}>
              <div className="group h-full rounded-2xl border border-ink-800 bg-ink-950 p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-[0_24px_56px_-20px_rgba(249,115,22,0.4)]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ember-500/15 text-ember-400 ring-1 ring-ember-500/30 transition-colors duration-300 group-hover:bg-ember-500 group-hover:text-white">
                    <boss.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-[11px] text-stone-500">{boss.version}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{boss.name}</h3>
                <ul className="mt-3 space-y-2.5">
                  {boss.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-stone-300">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ember-400" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function ReleasesStrip() {
  const { navigate } = useRouter();
  return (
    <section className="bg-paper py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <Kicker>05 / releases</Kicker>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-heading sm:text-[2.6rem]">
              Fresh from the launchpad.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <button
              onClick={() => navigate("changelog")}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-[13.5px] font-semibold text-heading transition-all hover:border-ember-500/50 hover:text-ember-700"
            >
              Full changelog
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
          {RELEASES.slice(0, 3).map((release) => (
            <StaggerItem key={release.version}>
              <button
                onClick={() => navigate("changelog")}
                className="group block h-full w-full rounded-2xl border border-border bg-surface p-6 text-left shadow-[0_1px_2px_rgba(28,15,8,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-[0_20px_48px_-18px_rgba(249,115,22,0.3)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-semibold tracking-tight text-heading">
                    v{release.version}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                      release.channel === "stable"
                        ? "bg-ember-50 text-ember-700 ring-1 ring-ember-500/25"
                        : release.channel === "snapshot"
                          ? "bg-flame-500/10 text-flame-600 ring-1 ring-flame-500/25 dark:text-flame-400"
                          : "bg-muted text-stone-500 ring-1 ring-border"
                    }`}
                  >
                    {release.channel}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-stone-500">
                  {release.date} · MC {release.mc}
                </p>
                <h3 className="mt-4 font-display text-[17px] font-bold text-heading">
                  {release.tagline}
                </h3>
                <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-stone-600">
                  {release.highlights[0]} …
                </p>
                <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ember-600">
                  {release.highlights.length} changes
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </p>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function CommunityCta() {
  return (
    <section className="bg-noise relative overflow-hidden bg-gradient-to-br from-ember-500 via-ember-600 to-flame-600 py-24 text-white sm:py-28">
      <div className="bg-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="animate-float absolute -left-20 top-10 h-72 w-72 rounded-full border border-white/15"
        aria-hidden="true"
      />
      <div
        className="animate-float-slow absolute -right-16 bottom-8 h-96 w-96 rounded-full border border-white/10"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <Kicker dark>06 / community</Kicker>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Build it with us.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-ember-50/90">
            128 contributors, one workspace, zero gatekeeping. Whether you
            audit mob AI, wire config toggles or just run servers — there is a
            lane for you.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 text-[15px] font-semibold text-ember-700 shadow-lg transition-transform duration-300 hover:scale-[1.03] active:scale-95"
            >
              <MessagesSquare className="h-4.5 w-4.5" />
              Join Discord
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/40 px-7 text-[15px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              <Github className="h-4.5 w-4.5" />
              Star on GitHub
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function HomeView() {
  return (
    <>
      <Hero />
      <Marquee />
      <Features />
      <Benchmarks />
      <ConfigShowcase />
      <BossBand />
      <ReleasesStrip />
      <CommunityCta />
    </>
  );
}
