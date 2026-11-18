"use client";

import { BookOpen, Github, MessagesSquare, ShieldCheck, Sparkles, Users } from "lucide-react";
import { COMMUNITY_CARDS, CONTRIBUTING_STEPS, DISCORD_URL, GITHUB_URL } from "@/lib/site-data";
import { useRouter } from "../router";
import { Kicker, Reveal, Stagger, StaggerItem } from "../motion";

const CARD_ICONS = [MessagesSquare, Github, BookOpen];

export function CommunityView() {
  const { navigate } = useRouter();
  return (
    <>
      <section className="bg-noise relative overflow-hidden bg-ink-950 pb-20 pt-32 text-white sm:pt-36">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div
          className="animate-aurora absolute -top-32 left-1/3 h-[400px] w-[600px] rounded-full bg-ember-600/20 blur-[110px]"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Kicker dark>community</Kicker>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold tracking-tight sm:text-6xl">
              128 contributors and{" "}
              <span className="text-gradient-ember">one workspace.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-stone-300">
              RocketMC is built in the open. Every fix, from portal bugs to
              warden anger math, lands through public PRs — and every release
              note names the people behind it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* channels */}
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stagger className="grid gap-4 md:grid-cols-3">
            {COMMUNITY_CARDS.map((card, i) => {
              const Icon = CARD_ICONS[i];
              const isDocs = card.title === "Docs";
              return (
                <StaggerItem key={card.title}>
                  <div className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_2px_rgba(28,15,8,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-[0_20px_48px_-18px_rgba(249,115,22,0.3)]">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ember-50 text-ember-600 ring-1 ring-ember-500/20 transition-colors duration-300 group-hover:bg-ember-500 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="mt-5 font-display text-xl font-bold text-heading">
                      {card.title}
                    </h2>
                    <p className="mt-1 font-mono text-[11.5px] text-ember-600">{card.handle}</p>
                    <p className="mt-3 flex-1 text-[14px] leading-relaxed text-stone-600">
                      {card.body}
                    </p>
                    <div className="mt-5">
                      {isDocs ? (
                        <button
                          onClick={() => navigate("docs")}
                          className="inline-flex h-10 items-center gap-2 rounded-full bg-ink-950 px-5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03] dark:bg-ember-500"
                        >
                          {card.cta}
                        </button>
                      ) : (
                        <a
                          href={card.title === "Discord" ? DISCORD_URL : GITHUB_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 items-center gap-2 rounded-full bg-ink-950 px-5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03] dark:bg-ember-500"
                        >
                          {card.cta}
                        </a>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* contributing */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Kicker>contributing</Kicker>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-heading sm:text-4xl">
              From fork to release notes.
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {CONTRIBUTING_STEPS.map((step) => (
              <StaggerItem key={step.step}>
                <div className="relative h-full rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-ember-500/40">
                  <span className="font-mono text-[26px] font-semibold text-ember-500/40">
                    {step.step}
                  </span>
                  <h3 className="mt-3 font-display text-[17px] font-bold text-heading">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-stone-600">
                    {step.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ground rules + showcase */}
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-border bg-surface p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ember-50 text-ember-600 ring-1 ring-ember-500/20">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold text-heading">
                  Code of conduct
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-stone-600">
                  Be precise, be kind, cite your vanilla references. We argue
                  about tick order, not about people. The full conduct policy
                  ships in the repository and applies to Discord, GitHub and
                  every community space.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-2xl border border-ink-800 bg-ink-950 p-6 text-white">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ember-500/15 text-ember-400 ring-1 ring-ember-500/30">
                  <Sparkles className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold">
                  Running RocketMC in production?
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-stone-300">
                  Share your server on Discord and get a profile badge in the
                  showcase channel. Networks running v1 or newer get featured
                  in the next release notes.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-ember-500 to-flame-600 px-5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]"
                  >
                    <MessagesSquare className="h-4 w-4" />
                    Show your server
                  </a>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-white/25 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <Github className="h-4 w-4" />
                    Read the source
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="mt-4 flex flex-col items-center gap-4 rounded-2xl border border-border bg-cream p-6 text-center sm:flex-row sm:text-left">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember-500 text-white shadow-[0_8px_24px_-8px_rgba(249,115,22,0.7)]">
                <Users className="h-5 w-5" />
              </span>
              <p className="flex-1 text-[14.5px] leading-relaxed text-stone-700">
                Need a hand with a migration or a stubborn config? The
                <span className="font-semibold"> #support </span>
                channel answers within hours, and the FAQ covers the most
                common setup questions.
              </p>
              <button
                onClick={() => navigate("docs")}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-ember-500/40 bg-surface px-5 text-[13px] font-semibold text-ember-700 transition-colors hover:border-ember-500 hover:bg-ember-50"
              >
                <BookOpen className="h-4 w-4" />
                Open the docs
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
