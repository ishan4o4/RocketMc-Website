/* Documentation guides for the RocketMC docs view */

export interface DocBlock {
  kind: "p" | "code" | "callout" | "table" | "list";
  text?: string;
  title?: string;
  lang?: "bash" | "toml" | "rust";
  code?: string;
  list?: string[];
  table?: { headers: string[]; rows: string[][] };
  tone?: "info" | "warn" | "tip";
}

export interface DocGuide {
  id: string;
  title: string;
  kicker: string;
  intro: string;
  blocks: DocBlock[];
}

export const DOC_GUIDES: DocGuide[] = [
  {
    id: "getting-started",
    title: "Getting started",
    kicker: "5 minutes",
    intro:
      "RocketMC ships as a single native binary for Linux, macOS (Apple silicon) and Windows. There is no JVM to install and no heap to tune — you only need a machine, a port and one command.",
    blocks: [
      {
        kind: "p",
        text: "The quickest path is the install script. It detects your architecture, downloads the latest stable build, verifies the SHA-256 checksum and puts the binary on your PATH.",
      },
      {
        kind: "code",
        lang: "bash",
        title: "terminal",
        code: `# install the latest stable build
curl -fsSL https://get.rocketmc.dev | sh

# or take control yourself
cargo install --git https://github.com/RocketMC-Team/rocketmc rocketmc

# verify
rocketmc --version
# rocketmc 7.0.0 (26.3 "Wilderness Bound", protocol 777)`,
      },
      {
        kind: "p",
        text: "Start the server in a working directory. On first run RocketMC generates a rocketmc.toml, seeds the overworld with the spiral generator, and opens both listeners: TCP :25565 for Java and UDP :19132 for Bedrock.",
      },
      {
        kind: "code",
        lang: "bash",
        title: "terminal",
        code: `mkdir my-server && cd my-server
rocketmc start

[00:00.0] loading registries … 1,412 blocks · 1,847 items · 161 entities
[00:01.3] java listener on :25565 — done in 1.31s`,
      },
      {
        kind: "callout",
        tone: "info",
        title: "Ports at a glance",
        text: "Java Edition connects on TCP 25565, Bedrock Edition on UDP 19132. Both listeners start by default; disable either one in [network].",
      },
      {
        kind: "list",
        list: [
          "Linux x86_64 / aarch64 — glibc 2.31+ (Ubuntu 20.04, Debian 11, Fedora 36)",
          "macOS aarch64 — macOS 13 Ventura or newer",
          "Windows x86_64 — Windows 10 / Server 2019 or newer",
          "2+ CPU cores recommended; 1 GB RAM covers a small SMP",
        ],
      },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    kicker: "rocketmc.toml",
    intro:
      "Everything lives in one file, rocketmc.toml, generated on first run. Sections are additive — anything you omit falls back to a sane, vanilla-faithful default.",
    blocks: [
      {
        kind: "code",
        lang: "toml",
        title: "rocketmc.toml",
        code: `[network]
java_port = 25565
bedrock_port = 19132
motd = "fueled by rust"
max_players = 100

[online_mode]
java = true
bedrock = true

[performance]
chunk_workers = 8
entity_islands = true
view_distance = 10

[world]
seed = "keep-mine"
prevent_moving_into_unloaded_chunks = true

[exploits]
duplicate_uuid.mode = "safe-regen"
fix_invulnerable_end_crystal_exploit = true`,
      },
      {
        kind: "table",
        table: {
          headers: ["Section", "Keys", "What it controls"],
          rows: [
            ["[network]", "java_port, bedrock_port, motd, max_players", "Listeners, MOTD, player cap"],
            ["[online_mode]", "java, bedrock", "Mojang auth for Java, Xbox Live auth for Bedrock — set per platform"],
            ["[performance]", "chunk_workers, entity_islands, view_distance", "Parallel chunk gen, lock-free entity scheduler, render distance"],
            ["[world]", "seed, spawn_protection, difficulty", "World identity and vanilla difficulty settings"],
            ["[exploits]", "12 hardened toggles", "PaperMC-equivalent exploit protections — see the dedicated guide"],
            ["[bedrock]", "ghost_rendering, spike_entities, rider_pairs", "Bedrock-side rendering fidelity options"],
          ],
        },
      },
      {
        kind: "callout",
        tone: "tip",
        title: "Every option has an alias",
        text: "Exploit options accept both snake_case and PaperMC's kebab-case spelling (allow-piston-duplication), so you can paste Paper snippets into rocketmc.toml and they just work.",
      },
    ],
  },
  {
    id: "online-mode",
    title: "Online mode",
    kicker: "auth per platform",
    intro:
      "RocketMC treats authentication as a per-platform decision. A common setup: verify Java players against Mojang's session servers while Bedrock players authenticate through Xbox Live — or run a fully offline network for testing.",
    blocks: [
      {
        kind: "code",
        lang: "toml",
        title: "rocketmc.toml",
        code: `[online_mode]
java = true    # Mojang session server auth
bedrock = true # Xbox Live auth for Bedrock clients`,
      },
      {
        kind: "p",
        text: "Java authentication follows the vanilla encryption handshake. Bedrock authentication validates the Xbox Live token chain carried in the login packet. Because both paths are independent, mixed networks keep correct identity on each platform — no forced offline fallback for Bedrock clients.",
      },
      {
        kind: "table",
        table: {
          headers: ["java", "bedrock", "Result"],
          rows: [
            ["true", "true", "Both platforms verified — recommended for production"],
            ["true", "false", "Java verified, Bedrock open — LAN or private realm setups"],
            ["false", "false", "Fully offline — testing only, usernames are not validated"],
          ],
        },
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Offline mode is not anonymous",
        text: "With perform_username_validation enabled (default), usernames are still checked for disallowed characters and impersonation-prone patterns even in offline mode.",
      },
    ],
  },
  {
    id: "exploit-protections",
    title: "Exploit protections",
    kicker: "[exploits]",
    intro:
      "RocketMC ships a PaperMC-style [exploits] section with 12 hardened toggles, Paper's exact defaults, and kebab-case aliases. Every toggle is wired into the engine — these are not decorative flags.",
    blocks: [
      {
        kind: "table",
        table: {
          headers: ["Option", "Default", "PaperMC equivalent"],
          rows: [
            ["allow_piston_duplication", "false", "unsupported-settings.allow-piston-duplication"],
            ["allow_headless_pistons", "false", "unsupported-settings.allow-headless-pistons"],
            ["allow_permanent_block_break_exploits", "false", "unsupported-settings.allow-permanent-block-break-exploits"],
            ["allow_unsafe_end_portal_teleportation", "false", "unsupported-settings.allow-unsafe-end-portal-teleportation"],
            ["skip_tripwire_hook_placement_validation", "false", "unsupported-settings.skip-tripwire-hook-placement-validation"],
            ["perform_username_validation", "true", "unsupported-settings.perform-username-validation"],
            ["skip_vanilla_damage_tick_when_shield_blocked", "false", "unsupported-settings.skip-vanilla-damage-tick-when-shield-blocked"],
            ["prevent_moving_into_unloaded_chunks", "false", "chunks.prevent-moving-into-unloaded-chunks"],
            ["disable_unloaded_chunk_enderpearl_exploit", "false", "fixes.disable-unloaded-chunk-enderpearl-exploit"],
            ["fix_invulnerable_end_crystal_exploit", "true", "unsupported-settings.fix-invulnerable-end-crystal-exploit"],
            ["duplicate_uuid.mode", "safe-regen", "entities.duplicate-uuid.mode"],
            ["duplicate_uuid.safe_regen_delete_range", "32", "entities.duplicate-uuid.safe-regen-delete-range"],
            ["item_validation.*", "paper defaults", "item-validation"],
          ],
        },
      },
      {
        kind: "p",
        text: "The duplicate-UUID resolver runs on every entity-add path. safe-regen deletes same-UUID entities inside the configured range and accepts the newcomer; delete removes the old entity; warn keeps both and logs; nothing keeps both silently.",
      },
      {
        kind: "code",
        lang: "toml",
        title: "rocketmc.toml",
        code: `[exploits]
duplicate_uuid.mode = "safe-regen"
duplicate_uuid.safe_regen_delete_range = 32
prevent_moving_into_unloaded_chunks = true
disable_unloaded_chunk_enderpearl_exploit = true
fix_invulnerable_end_crystal_exploit = true

[exploits.item_validation]
book_page_limits = true
book_title_limits = true
book_author_limits = true
book_page_max = 100`,
      },
      {
        kind: "callout",
        tone: "info",
        title: "Server-side teleports are exempt",
        text: "The unloaded-chunk move guard only rejects client position packets — plugin and command teleports are already gated by the awaiting_teleport handshake and never snap back.",
      },
    ],
  },
  {
    id: "bedrock",
    title: "Bedrock support",
    kicker: "native listener",
    intro:
      "RocketMC implements the Bedrock protocol natively — no Geyser sidecar, no translation proxy, no extra process to monitor. Bedrock players join on UDP :19132 and are full players on the server side.",
    blocks: [
      {
        kind: "list",
        list: [
          "Separate online-mode and Xbox Live auth per platform",
          "Inventory actions mirror Java-side PVP guards: no self-attacks, protect_creative, no attacking while spectating",
          "Elder guardian ghost and spike entities render with Bedrock-side fidelity options",
          "Zombie-nautilus rider pairs are spawned correctly on Bedrock clients",
          "Ghost rendering and spike entities are tunable in [bedrock]",
        ],
      },
      {
        kind: "code",
        lang: "toml",
        title: "rocketmc.toml",
        code: `[network]
bedrock_port = 19132

[online_mode]
bedrock = true

[bedrock]
ghost_rendering = true
spike_entities = true
rider_pairs = true`,
      },
      {
        kind: "callout",
        tone: "tip",
        title: "One binary, two editions",
        text: "The Bedrock listener shares the same world, entity islands and plugin events as the Java listener. A WardenAngerChangeEvent fires whichever platform angered the warden.",
      },
    ],
  },
  {
    id: "migrating",
    title: "Migrating from Paper",
    kicker: "drop-in worlds",
    intro:
      "RocketMC reads vanilla region format, player data and advancement JSON as-is. Most migrations are copy the world folder, map a few config keys, start.",
    blocks: [
      {
        kind: "list",
        list: [
          "Copy your world folders (region, playerdata, advancements, DIM-1, DIM1) unchanged",
          "Map paper.yml global settings to [exploits] — names match with kebab-case aliases",
          "Vanilla datapacks load through the generated registry pipeline",
          "Permission plugins: RocketMC ships its own permission bridge for LuckPerms-style stores",
          "Plugin jars do not carry over — RocketMC plugins are Rust crates; see the API reference",
        ],
      },
      {
        kind: "table",
        table: {
          headers: ["Paper (paper.yml / config)", "RocketMC (rocketmc.toml)"],
          rows: [
            ["unsupported-settings.allow-piston-duplication", "[exploits] allow_piston_duplication"],
            ["chunks.prevent-moving-into-unloaded-chunks", "[exploits] prevent_moving_into_unloaded_chunks"],
            ["entities.duplicate-uuid.mode", "[exploits] duplicate_uuid.mode"],
            ["item-validation", "[exploits.item_validation]"],
            ["settings.online-mode", "[online_mode] java"],
            ["proxies.velocity.enabled", "planned — [proxy] section, 7.1 snapshot"],
          ],
        },
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Test on a copy first",
        text: "Run the migration against a copy of your world. Region files are read-only during RocketMC startup, but a first boot will write its own level.dat metadata alongside yours.",
      },
    ],
  },
];
