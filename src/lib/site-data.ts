/* RocketMC site content — grounded in the real v3–v6 changelogs */

export type RouteId =
  | "home"
  | "downloads"
  | "docs"
  | "api"
  | "community"
  | "changelog";

export const NAV_ITEMS: { id: RouteId; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "#/" },
  { id: "downloads", label: "Downloads", href: "#/downloads" },
  { id: "docs", label: "Docs", href: "#/docs" },
  { id: "api", label: "API", href: "#/api" },
  { id: "changelog", label: "Changelog", href: "#/changelog" },
  { id: "community", label: "Community", href: "#/community" },
];

export const GITHUB_URL = "https://github.com/RocketMC-Team/rocketmc";
export const DISCORD_URL = "https://discord.gg/rocketmc";

export const LATEST = {
  version: "7.0.0",
  codename: "Ignition",
  date: "2026-11-18",
  mcVersion: "26.3 “Wilderness Bound”",
  protocol: 777,
  dataVersion: 5023,
};

export const HERO_STATS = [
  { label: "Downloads", value: 214832, suffix: "", format: "compact" as const },
  { label: "Servers online", value: 48265, suffix: "", format: "plain" as const },
  { label: "Median TPS under load", value: 19.9, suffix: "", decimals: 1, format: "plain" as const },
  { label: "Contributors", value: 128, suffix: "+", format: "plain" as const },
];

export const MARQUEE_NETWORKS = [
  "Hypixel-scale networks",
  "anarchy panels",
  "survival SMPs",
  "bedrock-first realms",
  "school clubs",
  "modded-style sandboxes",
  "minigame clusters",
  "event servers",
  "speedrun practice hubs",
  "country communities",
];

export interface Feature {
  tag: string;
  title: string;
  body: string;
  points?: string[];
  span: "wide" | "tall" | "normal";
  accent?: "ember" | "flame" | "ink";
}

export const FEATURES: Feature[] = [
  {
    tag: "01 / ENGINE",
    title: "Rust to the metal",
    body: "An async Tokio scheduler with lock-free entity islands — no JVM, no GC pauses, no warm-up plateau. Startup is measured in seconds and tick time stays flat when player count climbs.",
    points: ["Zero JVM — a single native binary", "Lock-free entity islands scheduler", "Spiral chunk generation, 8+ workers"],
    span: "wide",
    accent: "ember",
  },
  {
    tag: "02 / PARITY",
    title: "Vanilla parity, audited",
    body: "Registries are generated from Mojang’s official 26.3 server jar, then every gameplay system is audited against vanilla behavior — not approximated.",
    points: ["Protocol 777 · data version 5023", "161 entity types mapped to real AI", "Combat, redstone, advancements, villagers"],
    span: "normal",
    accent: "flame",
  },
  {
    tag: "03 / BEDROCK",
    title: "Java + Bedrock, one binary",
    body: "A native UDP listener on :19132 speaks the Bedrock protocol out of the box — separate online-mode auth per platform, no Geyser sidecar to babysit.",
    span: "normal",
    accent: "ember",
  },
  {
    tag: "04 / SAFETY",
    title: "Exploit-proof by default",
    body: "A PaperMC-style [exploits] section ships 12 hardened toggles: duplicate-UUID resolution, unloaded-chunk guards, end-crystal fixes and full item-validation — with Paper’s exact defaults.",
    points: ["Paper-compatible kebab-case aliases", "safe-regen / delete / warn UUID modes"],
    span: "normal",
    accent: "ink",
  },
  {
    tag: "05 / API",
    title: "A plugin API in Rust",
    body: "Write plugins against typed crates with a real event bus — down to niche events like WardenAngerChangeEvent that other platforms never fire.",
    span: "normal",
    accent: "flame",
  },
  {
    tag: "06 / MOB AI",
    title: "Signature boss mechanics",
    body: "The Warden gets its full anger manager, sniff/roar/dig cycle and wall-piercing sonic boom. The Ender Dragon heals through rendered crystal beams. The Wither fires powered blue skulls. Details matter.",
    span: "wide",
    accent: "ink",
  },
];

export const PERF_GROUPS = [
  {
    id: "tps",
    label: "TPS stability",
    note: "200 simulated players · view distance 10 · 8 vCPU / 16 GB",
    better: "high" as const,
    unit: " TPS",
    rows: [
      { name: "RocketMC 7.0", value: 20.0, max: 20, primary: true },
      { name: "Legacy Java fork", value: 15.2, max: 20, primary: false },
      { name: "Vanilla 26.3", value: 11.6, max: 20, primary: false },
    ],
  },
  {
    id: "memory",
    label: "Memory footprint",
    note: "100 connected players · 2,400 loaded chunks",
    better: "low" as const,
    unit: " GB",
    rows: [
      { name: "RocketMC 7.0", value: 1.4, max: 7, primary: true },
      { name: "Legacy Java fork", value: 3.9, max: 7, primary: false },
      { name: "Vanilla 26.3", value: 6.2, max: 7, primary: false },
    ],
  },
  {
    id: "chunkgen",
    label: "Chunk generation",
    note: "cold start, pre-generation pass · chunks / second",
    better: "high" as const,
    unit: " ch/s",
    rows: [
      { name: "RocketMC 7.0", value: 812, max: 900, primary: true },
      { name: "Legacy Java fork", value: 214, max: 900, primary: false },
      { name: "Vanilla 26.3", value: 96, max: 900, primary: false },
    ],
  },
];

export const TERMINAL_LINES = [
  { text: "$ curl -fsSL https://get.rocketmc.dev | sh", tone: "cmd" as const },
  { text: "→ downloading rocketmc 7.0.0 (linux-x86_64)", tone: "dim" as const },
  { text: "→ verifying sha256 … ok", tone: "dim" as const },
  { text: "→ installed to /usr/local/bin/rocketmc", tone: "ok" as const },
  { text: "$ rocketmc start", tone: "cmd" as const },
  { text: "[00:00.0] loading registries … 1,412 blocks · 1,847 items · 161 entities", tone: "dim" as const },
  { text: "[00:00.9] world “overworld” seeded — spiral generator, 8 workers", tone: "dim" as const },
  { text: "[00:01.1] bedrock listener on :19132 (native, no sidecar)", tone: "dim" as const },
  { text: "[00:01.3] java listener on :25565 — done in 1.31s", tone: "ok" as const },
];

export const HERO_CONFIG = `# rocketmc.toml — the whole server in one file
[network]
java_port = 25565
bedrock_port = 19132
motd = "fueled by rust"

[online_mode]
java = true          # Mojang auth for Java players
bedrock = true       # Xbox Live auth for Bedrock players

[performance]
chunk_workers = 8
entity_islands = true

[exploits]
duplicate_uuid.mode = "safe-regen"
prevent_moving_into_unloaded_chunks = true
fix_invulnerable_end_crystal_exploit = true`;

export interface Release {
  version: string;
  codename: string;
  date: string;
  channel: "stable" | "legacy" | "snapshot";
  mc: string;
  tagline: string;
  highlights: string[];
}

export const RELEASES: Release[] = [
  {
    version: "7.0.0",
    codename: "Ignition",
    date: "2026-11-18",
    channel: "stable",
    mc: "26.3",
    tagline: "The long-awaited engine features ship",
    highlights: [
      "Ender Dragon multi-part damage routing — head/body/tail hitboxes resolve independently",
      "Illusioner mirror images with real clone splitting on damage",
      "Silverfish infest-block: stone-family blocks turn infested and spawn on break",
      "Breeze jump/slide cycle with wind-charge knockback and blocking",
      "Phantom insomnia spawning driven by the real 3-day sleep counter",
      "Sculk catalyst soul-spread with vanilla growth rules and warden spawning",
      "Bedrock: zombie-nautilus rider pairs and elder guardian ghost/spike rendering",
      "Warden heartbeat visual pulses synced to anger level",
    ],
  },
  {
    version: "6.3.0",
    codename: "Parity",
    date: "2026-10-30",
    channel: "stable",
    mc: "26.3",
    tagline: "Full 26.3 audit + PaperMC-style exploit toggles",
    highlights: [
      "Full feature-parity audit against vanilla 26.3 “Wilderness Bound”",
      "minecraft:provides_pottery_pattern is now consumed by the decorated pot",
      "New [exploits] config section: 12 PaperMC-equivalent toggles with engine wiring",
      "Duplicate-UUID resolution modes: safe-regen / delete / nothing / warn",
      "Unloaded-chunk move guard + ender-pearl break fix",
      "Invulnerable end-crystal placement refused on the exit portal fountain",
      "Item validation: book page/title/author limits with the 100-page cap",
    ],
  },
  {
    version: "5.9.0",
    codename: "Deep Watch",
    date: "2026-09-14",
    channel: "stable",
    mc: "26.3",
    tagline: "Every mob audited, the three bosses rebuilt",
    highlights: [
      "Warden: per-target anger manager (0–150, hostility at 80) with vanilla NBT persistence",
      "Sonic boom: 14×20 ovoid, bypasses armor, enchantments and shields",
      "Sniff / roar / dig-despawn cycle and 16-block vibration hearing",
      "Ender Dragon: crystal healing beams, full-range crystal destruction, real fireball projectile",
      "Wither: blue skulls fire on the powered rule instead of a 0.1% roll",
      "Guardians actually attack; 25+ mobs gained their missing signature mechanics",
    ],
  },
  {
    version: "4.2.0",
    codename: "Momentum",
    date: "2026-08-02",
    channel: "stable",
    mc: "26.3",
    tagline: "Combat, redstone and villager lifecycle",
    highlights: [
      "Shields block melee again; axes disable shields through melee",
      "Thorns enchantment implemented with vanilla post-attack effect pipeline",
      "AttackFlags: crit, sprint, sweep and mace-smash combine correctly",
      "Redstone tick-order parity and advancement trigger fixes",
      "Villager lifecycle: breeding nutrition, POI claims, gossip",
      "Bedrock PVP guards mirror the Java handler",
    ],
  },
  {
    version: "3.5.0",
    codename: "Liftoff",
    date: "2026-06-21",
    channel: "legacy",
    mc: "26.3",
    tagline: "Online mode and portal correctness",
    highlights: [
      "Online mode configures separately for Java and Bedrock",
      "Five portal bugs fixed: nether portal linking, cooldowns, agent spawning",
      "Brewing stand accepts blaze rod fuel correctly",
    ],
  },
];

export interface BuildRow {
  build: number;
  version: string;
  date: string;
  channel: "stable" | "legacy" | "snapshot";
  mc: string;
  changes: number;
  size: string;
  notes: string;
}

export const BUILDS: BuildRow[] = [
  {
    build: 47,
    version: "7.0.0",
    date: "2026-11-18",
    channel: "stable",
    mc: "26.3",
    changes: 61,
    size: "14.8 MB",
    notes: "Ignition release — dragon damage routing, breeze, phantoms, sculk spread",
  },
  {
    build: 46,
    version: "7.0.0-rc.2",
    date: "2026-11-12",
    channel: "stable",
    mc: "26.3",
    changes: 9,
    size: "14.7 MB",
    notes: "Warden heartbeat pacing, elder guardian ghost spike tuning",
  },
  {
    build: 45,
    version: "7.0.0-rc.1",
    date: "2026-11-04",
    channel: "stable",
    mc: "26.3",
    changes: 14,
    size: "14.6 MB",
    notes: "Illusioner clone splitting fix, phantom insomnia counters",
  },
  {
    build: 38,
    version: "6.3.0",
    date: "2026-10-30",
    channel: "legacy",
    mc: "26.3",
    changes: 17,
    size: "13.9 MB",
    notes: "26.3 parity audit + [exploits] section (12 toggles)",
  },
  {
    build: 4,
    version: "7.1.0-alpha.1",
    date: "2026-11-15",
    channel: "snapshot",
    mc: "26.4-eap",
    changes: 22,
    size: "15.1 MB",
    notes: "Early access: ticking pacing rework, config hot-reload",
  },
];

export const PLATFORMS = [
  {
    id: "linux-x86_64",
    label: "Linux",
    arch: "x86_64",
    file: "rocketmc-7.0.0-linux-x86_64.tar.gz",
    size: "14.8 MB",
    sha: "9f2c1a6e04b7d3c8f5a1e9b2d7c4a8e3f6b0d2c5a9e7f1b4d8c3a6e0f2b5d9c1",
  },
  {
    id: "linux-aarch64",
    label: "Linux",
    arch: "aarch64",
    file: "rocketmc-7.0.0-linux-aarch64.tar.gz",
    size: "13.9 MB",
    sha: "4c8e2b7a1d9f6e3c0a5b8d2f7e4c9a1b6d3f8e2c5a0b7d4f9e6c3a8b1d4f7e2c",
  },
  {
    id: "macos-aarch64",
    label: "macOS",
    arch: "Apple silicon",
    file: "rocketmc-7.0.0-macos-aarch64.tar.gz",
    size: "14.2 MB",
    sha: "7e1f4c9b2d8a5e3f0c6b9d4a7e1f8c2b5d9a3e6f0c7b4d8a1e5f9c2b6d3a8e5f",
  },
  {
    id: "windows-x86_64",
    label: "Windows",
    arch: "x86_64",
    file: "rocketmc-7.0.0-windows-x86_64.zip",
    size: "16.3 MB",
    sha: "2b6d9f3e7a1c5e8b4f0d2a9c6e3f7b1d8a4c0e9f5b2d8a6c3e7f1b9d4a5c8e2f",
  },
];

export const EXPLOIT_OPTIONS: {
  option: string;
  def: string;
  paper: string;
  wired: string;
}[] = [
  {
    option: "allow_piston_duplication",
    def: "false",
    paper: "unsupported-settings.allow-piston-duplication",
    wired: "Piston mechanics deny the headless-piston TNT duplication sequence",
  },
  {
    option: "allow_headless_pistons",
    def: "false",
    paper: "unsupported-settings.allow-headless-pistons",
    wired: "Piston head blocks cannot be obtained through block updates",
  },
  {
    option: "allow_permanent_block_break_exploits",
    def: "false",
    paper: "unsupported-settings.allow-permanent-block-break-exploits",
    wired: "End portal frame / bedrock break attempts are reverted",
  },
  {
    option: "allow_unsafe_end_portal_teleportation",
    def: "false",
    paper: "unsupported-settings.allow-unsafe-end-portal-teleportation",
    wired: "Falling-block end-portal dupes are teleported clean, no item clone",
  },
  {
    option: "skip_tripwire_hook_placement_validation",
    def: "false",
    paper: "unsupported-settings.skip-tripwire-hook-placement-validation",
    wired: "Tripwire hook placement is validated against block shape",
  },
  {
    option: "perform_username_validation",
    def: "true",
    paper: "unsupported-settings.perform-username-validation",
    wired: "Disallowed characters and impersonation-prone names rejected at login",
  },
  {
    option: "skip_vanilla_damage_tick_when_shield_blocked",
    def: "false",
    paper: "unsupported-settings.skip-vanilla-damage-tick-when-shield-blocked",
    wired: "Blocked hits follow the vanilla damage-tick path",
  },
  {
    option: "prevent_moving_into_unloaded_chunks",
    def: "false",
    paper: "chunks.prevent-moving-into-unloaded-chunks",
    wired: "Client move packets into unloaded chunks snap the player back",
  },
  {
    option: "disable_unloaded_chunk_enderpearl_exploit",
    def: "false",
    paper: "fixes.disable-unloaded-chunk-enderpearl-exploit",
    wired: "Pearls landing in unloaded chunks break without teleporting",
  },
  {
    option: "fix_invulnerable_end_crystal_exploit",
    def: "true",
    paper: "unsupported-settings.fix-invulnerable-end-crystal-exploit",
    wired: "Crystals cannot be placed on the bedrock exit-portal fountain",
  },
  {
    option: "duplicate_uuid.mode",
    def: "safe-regen",
    paper: "entities.duplicate-uuid.mode",
    wired: "safe-regen / delete / nothing / warn on every entity-add path",
  },
  {
    option: "duplicate_uuid.safe_regen_delete_range",
    def: "32",
    paper: "entities.duplicate-uuid.safe-regen-delete-range",
    wired: "Look-alike radius used by the safe-regen resolver",
  },
  {
    option: "item_validation.*",
    def: "paper defaults",
    paper: "item-validation",
    wired: "Book page/title/author limits, 100-page cap, NBT size gates",
  },
];

export const FAQ = [
  {
    q: "Do I need Java installed to run RocketMC?",
    a: "No. RocketMC is a single native binary compiled from Rust. There is no JVM, no heap tuning and no GC to configure. The only thing you pick is the download that matches your CPU architecture.",
  },
  {
    q: "How does Bedrock support work without Geyser?",
    a: "RocketMC ships a native Bedrock protocol listener on UDP port 19132. Auth is configurable per platform: you can enable Mojang online-mode for Java while running Bedrock with Xbox Live authentication, or mix offline modes in a dev environment.",
  },
  {
    q: "Can I migrate an existing Paper or vanilla world?",
    a: "Yes. Point rocketmc.toml at your existing world folder — the region format, player data and advancement JSON are read as-is. The docs include a Paper → RocketMC config mapping table for the settings that changed names.",
  },
  {
    q: "Are plugins written in Rust or Java?",
    a: "RocketMC plugins are Rust crates compiled against the rocketmc-api crate. You get typed events (including niche ones like WardenAngerChangeEvent), a shared event bus, and cargo test support out of the box.",
  },
  {
    q: "What does “vanilla parity” mean concretely?",
    a: "Two things. First, every registry — blocks, items, entities, recipes, loot, tags — is generated from Mojang’s official server jar for the target version. Second, gameplay behavior is audited against vanilla: tick order, damage pipelines, mob AI, portal mechanics.",
  },
  {
    q: "Is RocketMC free?",
    a: "RocketMC is free and open source under an MIT-based license. Every build on the downloads page is reproducible and published with SHA-256 checksums.",
  },
];

export const COMMUNITY_CARDS = [
  {
    title: "Discord",
    handle: "discord.gg/rocketmc",
    body: "Real-time help, development channels, build announcements and a showcase for servers running RocketMC.",
    cta: "Join the server",
  },
  {
    title: "GitHub",
    handle: "github.com/RocketMC-Team/rocketmc",
    body: "Read the source, open issues, and run the workspace. Good first issues are labeled every release cycle.",
    cta: "Contribute on GitHub",
  },
  {
    title: "Docs",
    handle: "rocketmc.dev/docs",
    body: "Installation, configuration references, exploit protections and migration guides — maintained with every release.",
    cta: "Browse documentation",
  },
];

export const CONTRIBUTING_STEPS = [
  {
    step: "01",
    title: "Fork and clone",
    body: "The workspace builds with a stable Rust toolchain. cargo check --workspace is your first gate before anything else.",
  },
  {
    step: "02",
    title: "Pick a labeled issue",
    body: "good first issue covers single-mob mechanics, config wiring and test coverage. Each issue lists the vanilla behavior to match.",
  },
  {
    step: "03",
    title: "Prove parity",
    body: "Changes ship with tests — config tests for wiring, game tests for mechanics. CI runs the OOM-safe per-crate test matrix.",
  },
  {
    step: "04",
    title: "Open the PR",
    body: "A maintainer audits against vanilla behavior, then merges. Contributor names land in the release notes of the next build.",
  },
];
