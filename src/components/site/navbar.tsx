"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Download, Github, Menu, X } from "lucide-react";
import { DISCORD_URL, GITHUB_URL, LATEST, NAV_ITEMS } from "@/lib/site-data";
import { useRouter } from "./router";
import { LogoMark, Wordmark } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const { view, navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The home hero is dark — the transparent navbar starts light-on-dark there.
  const overDark = view === "home" && !scrolled && !open;
  const solid = scrolled || open || view !== "home";

  const linkCls = (active: boolean) =>
    `relative z-10 rounded-full px-3.5 py-1.5 text-[13.5px] font-medium transition-colors ${
      overDark
        ? active
          ? "text-white"
          : "text-stone-300 hover:text-white"
        : active
          ? "text-white"
          : "text-stone-600 hover:text-heading"
    }`;

  return (
    <header
      className={`theme-fade fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        solid
          ? "border-b border-border/80 bg-surface/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {/* scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-ember-500 via-flame-500 to-flame-600"
      />
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8"
      >
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2.5 rounded-lg pr-2 outline-offset-4 transition-transform duration-300 hover:scale-[1.02]"
          aria-label="RocketMC home"
        >
          <LogoMark size={32} />
          <Wordmark dark={overDark} />
        </button>

        <span
          className={`ml-1 hidden rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide md:inline-block ${
            overDark
              ? "border-white/20 bg-white/10 text-ember-200"
              : "border-ember-500/30 bg-ember-50 text-ember-700"
          }`}
        >
          v{LATEST.version}
        </span>

        <div className="mx-auto hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setOpen(false);
                navigate(item.id);
              }}
              className={linkCls(view === item.id)}
            >
              {view === item.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-ink-950 shadow-sm dark:bg-ember-500"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle overDark={overDark} />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="RocketMC on GitHub"
            className={`hidden h-9 w-9 items-center justify-center rounded-full border transition-colors sm:inline-flex ${
              overDark
                ? "border-white/20 text-stone-200 hover:border-white/50 hover:text-white"
                : "border-border text-stone-600 hover:border-ink-950/40 hover:text-heading"
            }`}
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden font-mono text-[11px] uppercase tracking-widest text-stone-500 transition-colors hover:text-ember-600 md:inline-block"
          >
            discord
          </a>
          <button
            onClick={() => {
              setOpen(false);
              navigate("downloads");
            }}
            className="group relative inline-flex h-9 shrink-0 items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-ember-500 to-flame-600 px-3.5 text-[13px] font-semibold text-white shadow-[0_6px_20px_-6px_rgba(249,115,22,0.6)] transition-transform duration-300 hover:scale-[1.03] active:scale-95"
          >
            <span className="shimmer-sweep absolute inset-0" aria-hidden="true" />
            <Download className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
            <span className="relative whitespace-nowrap">
              Get<span className="hidden sm:inline"> RocketMC</span>
            </span>
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`theme-fade inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors lg:hidden ${
              solid
                ? "border-border text-heading"
                : "border-white/25 text-white"
            }`}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden border-b border-border bg-surface/95 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  onClick={() => {
                    setOpen(false);
                    navigate(item.id);
                  }}
                  className={`block w-full rounded-lg px-4 py-2.5 text-left text-[15px] font-medium transition-colors ${
                    view === item.id
                      ? "bg-ember-50 text-ember-700"
                      : "text-stone-600 hover:bg-muted hover:text-heading"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
