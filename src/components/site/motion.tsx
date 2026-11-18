"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;

/* Scroll-triggered reveal with blur */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerChild = {
  hidden: { opacity: 0, y: 22, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerChild} className={className}>
      {children}
    </motion.div>
  );
}

/* Animated number counter */
export function Counter({
  value,
  decimals = 0,
  suffix = "",
  compact = false,
  duration = 1.7,
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  compact?: boolean;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        if (compact && value >= 1000) {
          setDisplay(`${(v / 1000).toFixed(1)}K`);
        } else {
          setDisplay(
            v.toLocaleString("en-US", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          );
        }
      },
    });
    return () => controls.stop();
  }, [inView, value, compact, decimals, duration]);

  return (
    <span ref={ref} className={`tabular ${className ?? ""}`}>
      {display}
      {suffix}
    </span>
  );
}

/* Mouse-tracking spotlight card */
export function SpotlightCard({
  children,
  className = "",
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -400, y: -400 });

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseLeave={() => setPos({ x: -400, y: -400 })}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: pos.x > -100 ? 1 : 0,
          background: dark
            ? `radial-gradient(340px circle at ${pos.x}px ${pos.y}px, rgba(249,115,22,0.16), transparent 72%)`
            : `radial-gradient(340px circle at ${pos.x}px ${pos.y}px, rgba(249,115,22,0.10), transparent 72%)`,
        }}
      />
      {children}
    </div>
  );
}

/* Micro section label */
export function Kicker({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <p
      className={`font-mono text-[11px] font-medium uppercase tracking-[0.22em] ${
        dark ? "text-ember-300" : "text-ember-600"
      }`}
    >
      <span
        className={`mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle ${
          dark ? "bg-ember-400" : "bg-ember-500"
        }`}
      />
      {children}
    </p>
  );
}
