"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ overDark = false }: { overDark?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className={`theme-fade relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border transition-colors ${
        overDark
          ? "border-white/20 text-stone-200 hover:border-white/50 hover:text-white"
          : "border-border text-stone-600 hover:border-ember-500/50 hover:text-ember-600"
      }`}
    >
      <span className="relative block h-4 w-4">
        {/* sun shows in dark mode (click → light), moon in light mode */}
        <Sun className="absolute inset-0 h-4 w-4 rotate-90 scale-0 transition-transform duration-300 ease-out dark:rotate-0 dark:scale-100" />
        <Moon className="absolute inset-0 h-4 w-4 scale-100 transition-transform duration-300 ease-out dark:-rotate-90 dark:scale-0" />
      </span>
    </button>
  );
}
