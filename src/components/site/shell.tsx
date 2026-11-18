"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RouterProvider, useRouter } from "./router";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { HomeView } from "./views/home";
import { DownloadsView } from "./views/downloads";
import { DocsView } from "./views/docs";
import { ApiView } from "./views/api";
import { CommunityView } from "./views/community";
import { ChangelogView } from "./views/changelog";
import { EASE } from "./motion";

const VIEW_TITLES: Record<string, string> = {
  home: "RocketMC — The high-performance Minecraft server, written in Rust",
  downloads: "Downloads",
  docs: "Docs",
  api: "API Reference",
  community: "Community",
  changelog: "Changelog",
};

function ViewSwitcher() {
  const { view, sub } = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const title = VIEW_TITLES[view];
    if (title) document.title = title === VIEW_TITLES.home ? title : `${title} · RocketMC`;
  }, [view, sub]);

  return (
    <main id="main" className="flex-1">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${view}:${sub ?? ""}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.34, ease: EASE }}
        >
          {view === "home" && <HomeView />}
          {view === "downloads" && <DownloadsView />}
          {view === "docs" && <DocsView sub={sub} />}
          {view === "api" && <ApiView sub={sub} />}
          {view === "community" && <CommunityView />}
          {view === "changelog" && <ChangelogView />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export function SiteShell() {
  return (
    <RouterProvider>
      <div className="flex min-h-screen flex-col bg-paper">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <Navbar />
        <ViewSwitcher />
        <Footer />
      </div>
    </RouterProvider>
  );
}
