# RocketMC Website — v1.0.0

Official-style marketing + documentation site for **RocketMC**, the
high-performance Minecraft server engine written in Rust. Modeled after
papermc.io: hero, feature grid, benchmarks, downloads, docs, API reference,
community and changelog.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 with a custom ember/flame token system (orange / red / white)
- Framer Motion animations (scroll reveals, stagger, spotlight cards, typing
  terminal, animated counters, marquee, scroll progress bar)
- next-themes — **dark mode by default**, user-toggleable (persisted in
  `localStorage`, no flash on load)
- SEO: full Metadata API config, Open Graph image, JSON-LD structured data,
  `sitemap.xml`, `robots.txt`, PWA manifest, semantic HTML + a11y labels

## Routes

The public site is a single route (`/`) with hash-based client routing:
`#/#/home`, `#/downloads`, `#/docs/<guide-id>`, `#/api/<crate>`,
`#/community`, `#/changelog` — every view is deep-linkable.

## Run

Requires **Node.js 20.9+** (Node 22 recommended). Any package manager works:

```bash
npm install        # or: bun install / pnpm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # production build
npm run start      # serve the production build
```

Scripts are plain cross-platform commands (`next dev` / `next build` /
`next start`) — no shell pipes, no bun required to run.

## Theme

All colors resolve from CSS variables in `src/app/globals.css`
(`:root` = light, `.dark` = dark). Brand surfaces: `paper`, `cream`,
`surface`; text tones: `heading`, `stone-*`; accents: `ember-*` / `flame-*`.
Dark is the default (`defaultTheme="dark"` in `theme-provider.tsx`).

## Versioning

This drop is **website v1.0.0** (footer badge: “site v1.0.0”; matches
`package.json`). RocketMC the server is independently versioned (latest
release v7.0.0 “Ignition”).
