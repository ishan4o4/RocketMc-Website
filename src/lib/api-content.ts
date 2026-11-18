/* RocketMC plugin API reference — docs.rs-style content */

export interface ApiItem {
  id: string;
  name: string;
  kind: "trait" | "struct" | "enum" | "fn" | "mod" | "type";
  signature: string;
  description: string;
  example?: string;
  notes?: string[];
  since: string;
}

export interface ApiCrate {
  id: string;
  name: string;
  version: string;
  blurb: string;
  items: ApiItem[];
}

export const API_CRATES: ApiCrate[] = [
  {
    id: "rocketmc-api",
    name: "rocketmc-api",
    version: "7.0.0",
    blurb:
      "The plugin-facing surface. Implement the Plugin trait, register listeners on the event bus, and drive players, entities and worlds through typed handles.",
    items: [
      {
        id: "plugin",
        name: "Plugin",
        kind: "trait",
        signature: `pub trait Plugin: Send + Sync + 'static {
    fn id(&self) -> &'static str;
    fn on_enable(&mut self, ctx: &mut ServerContext) -> PluginResult<()>;
    fn on_disable(&mut self, ctx: &mut ServerContext) -> PluginResult<()>;
}`,
        description:
          "The lifecycle contract every RocketMC plugin implements. on_enable runs after registries are loaded but before listeners open; on_disable runs before worlds are saved, giving plugins a deterministic teardown window.",
        example: `struct Enderworks;

impl Plugin for Enderworks {
    fn id(&self) -> &'static str { "enderworks" }

    fn on_enable(&mut self, ctx: &mut ServerContext) -> PluginResult<()> {
        ctx.events().subscribe::<WardenAngerChangeEvent>(|e| {
            log::info!("{} angered {}", e.offender().name(), e.warden().id());
            Ok(())
        })?;
        Ok(())
    }
}`,
        notes: [
          "on_enable may register commands, listeners and scheduled tasks",
          "Panics inside a plugin are caught per-tick and disable the plugin, not the server",
        ],
        since: "3.5.0",
      },
      {
        id: "event-bus",
        name: "EventBus",
        kind: "struct",
        signature: `pub struct EventBus { /* lock-free subscriber map */ }

impl EventBus {
    pub fn subscribe<E: Event>(&mut self, f: Handler<E>) -> Result<SubscriptionId>;
    pub fn unsubscribe(&mut self, id: SubscriptionId) -> bool;
    pub fn emit<E: Event>(&self, event: &mut E) -> EmitFlow;
}`,
        description:
          "The shared event bus used by both the engine and plugins. Handlers run in subscription order with an EmitFlow that can allow, cancel or mutate an event before the engine consumes it.",
        notes: [
          "emit is synchronous within the tick phase that fired the event",
          "Cancelling an event is observed by the engine — a cancelled WardenAngerChangeEvent still decays anger but skips the boost",
        ],
        since: "4.2.0",
      },
      {
        id: "server-context",
        name: "ServerContext",
        kind: "struct",
        signature: `pub struct ServerContext { /* ... */ }

impl ServerContext {
    pub fn worlds(&self) -> impl Iterator<Item = WorldHandle>;
    pub fn world(&self, name: &str) -> Option<WorldHandle>;
    pub fn online_players(&self) -> impl Iterator<Item = PlayerHandle>;
    pub fn events(&mut self) -> &mut EventBus;
    pub fn scheduler(&mut self) -> &mut Scheduler;
}`,
        description:
          "Root handle handed to plugin lifecycle hooks. It fans out into typed handles for worlds, players, the event bus and the tick scheduler.",
        since: "3.5.0",
      },
      {
        id: "warden-anger-change-event",
        name: "WardenAngerChangeEvent",
        kind: "struct",
        signature: `pub struct WardenAngerChangeEvent {
    pub warden: EntityHandle,
    pub offender: EntityHandle,
    pub old_level: u32,
    pub new_level: u32,
    pub cause: AngerCause,
}`,
        description:
          "Fires on every anger increase for a warden — direct attacks, contact damage, vibration hearing, sniff results and the first-hostility bonus. AngerCause is a closed enum so plugins can react to exactly why the warden got angry.",
        notes: [
          "cause variants: Attack, Contact, Vibration, Sniff, FirstHostility",
          "The event fires before the new level lands in the anger manager",
        ],
        since: "5.9.0",
      },
    ],
  },
  {
    id: "rocketmc-world",
    name: "rocketmc-world",
    version: "7.0.0",
    blurb:
      "Worlds, chunks and block storage. Spiral chunk generation, region-format IO and the block state registry live here.",
    items: [
      {
        id: "world",
        name: "World",
        kind: "struct",
        signature: `pub struct World { /* chunk map + tick arenas */ }

impl World {
    pub fn set_block(&self, pos: BlockPos, state: BlockState) -> BlockUpdate;
    pub fn get_block(&self, pos: BlockPos) -> BlockState;
    pub fn schedule_tick(&self, pos: BlockPos, delay: u16);
    pub fn spawn(&self, kind: EntityType, pos: BlockPos) -> Option<EntityHandle>;
}`,
        description:
          "A loaded dimension. Block writes return a BlockUpdate describing side effects (neighbor shape updates, scheduled ticks, game events fired) so plugins can react without re-reading the world.",
        since: "3.5.0",
      },
      {
        id: "block-pos",
        name: "BlockPos",
        kind: "struct",
        signature: `#[derive(Copy, Clone, Eq, PartialEq, Hash)]
pub struct BlockPos {
    pub x: i32,
    pub y: i32,
    pub z: i32,
}`,
        description:
          "A block coordinate. Implements the packing used by the chunk map and the section-relative layout that makes neighbor lookups branchless in the common case.",
        since: "3.5.0",
      },
      {
        id: "chunk",
        name: "Chunk",
        kind: "struct",
        signature: `pub struct Chunk { /* sections, heightmaps, light */ }

impl Chunk {
    pub fn section(&self, y: i32) -> &Section;
    pub fn heightmap(&self, kind: HeightmapKind) -> &Heightmap;
    pub fn is_ready(&self) -> bool;
}`,
        description:
          "A loaded 16×384×16 column split into sections. is_ready reports whether the chunk passed both generation and light passes — the same gate the move guard consults for unloaded-chunk protection.",
        since: "4.2.0",
      },
    ],
  },
  {
    id: "rocketmc-entity",
    name: "rocketmc-entity",
    version: "7.0.0",
    blurb:
      "Entities and mobs. The entity islands scheduler, damage pipelines, multi-part hitboxes and the AI goal system.",
    items: [
      {
        id: "living-entity",
        name: "LivingEntity",
        kind: "struct",
        signature: `pub struct LivingEntity { /* ... */ }

impl LivingEntity {
    pub fn damage_with_context(&self, amount: f32, ctx: &DamageContext) -> DamageOutcome;
    pub fn health(&self) -> f32;
    pub fn max_health(&self) -> f32;
    pub fn attribute(&self, kind: AttributeKind) -> f64;
}`,
        description:
          "Base type for everything with health. damage_with_context runs the full vanilla pipeline: immunity frames, armor, enchantments (including Thorns), shields with the melee fallback, then game events — the attacker is emitted as EntityDamage context so wardens and sculk sensors hear it.",
        since: "4.2.0",
      },
      {
        id: "multipart-hitbox",
        name: "MultiPartHitbox",
        kind: "struct",
        signature: `pub struct MultiPartHitbox {
    pub parts: SmallVec<[EntityPart; 3]>,
}

impl MultiPartHitbox {
    pub fn part_at(&self, ray: &Ray) -> Option<&EntityPart>;
    pub fn route_damage(&self, part: &EntityPart, amount: f32, ctx: &DamageContext);
}`,
        description:
          "Multi-part routing for compound entities like the Ender Dragon. part_at resolves which of head / body / tail / wings the ray hit; route_damage applies part-specific multipliers (vanilla head-shot semantics) and forwards to the parent entity's damage pipeline exactly once per packet.",
        notes: [
          "Introduced in 7.0.0 with dragon multi-part damage routing",
          "Damage forwarded to the parent keeps a single immunity-frame window",
        ],
        since: "7.0.0",
      },
      {
        id: "anger-manager",
        name: "AngerManager",
        kind: "struct",
        signature: `pub struct AngerManager { /* per-offender levels */ }

impl AngerManager {
    pub fn increase(&mut self, offender: EntityHandle, by: i32, cause: AngerCause) -> AngerDelta;
    pub fn level_of(&self, offender: &EntityHandle) -> u32;
    pub fn most_angry_at(&self, threshold: u32) -> Option<EntityHandle>;
    pub fn clear(&mut self);
}`,
        description:
          "Vanilla WardenAngerManager semantics: levels 0–150 per offender, hostility at 80, decay of 1 per second, cleared on death, gamemode change or leaving. Persisted as vanilla-compatible Anger.entries NBT with int-array UUIDs, so a warden remembers offenders across restarts.",
        since: "5.9.0",
      },
      {
        id: "goal",
        name: "Goal",
        kind: "trait",
        signature: `pub trait Goal {
    fn can_start(&mut self, mob: &mut MobState) -> bool;
    fn start(&mut self, mob: &mut MobState);
    fn tick(&mut self, mob: &mut MobState);
    fn should_continue(&mut self, mob: &mut MobState) -> bool;
    fn stop(&mut self, mob: &mut MobState);
}`,
        description:
          "The behavior primitive behind all 161 mob implementations. Goals are stacked in priority order; the warden's sniff/roar/dig cycle, the breeze's jump/slide pattern and phantom insomnia spawns are all Goal stacks.",
        since: "4.2.0",
      },
    ],
  },
  {
    id: "rocketmc-config",
    name: "rocketmc-config",
    version: "7.0.0",
    blurb:
      "The typed config layer behind rocketmc.toml. Every option carries a Paper-style kebab-case alias and ships with tests.",
    items: [
      {
        id: "config",
        name: "Config",
        kind: "struct",
        signature: `#[derive(Deserialize)]
#[serde(default)]
pub struct Config {
    pub network: NetworkSettings,
    pub online_mode: OnlineModeSettings,
    pub performance: PerformanceSettings,
    pub world: WorldSettings,
    pub exploits: ExploitSettings,
    pub bedrock: BedrockSettings,
}`,
        description:
          "The full rocketmc.toml model, deserialized with serde(default) so partial files are valid. Unknown keys are reported at startup instead of silently dropped.",
        since: "3.5.0",
      },
      {
        id: "exploit-settings",
        name: "ExploitSettings",
        kind: "struct",
        signature: `#[derive(Deserialize)]
#[serde(default, alias = "exploits")]
pub struct ExploitSettings {
    pub allow_piston_duplication: bool,          // alias: allow-piston-duplication
    pub prevent_moving_into_unloaded_chunks: bool,
    pub fix_invulnerable_end_crystal_exploit: bool,
    pub duplicate_uuid: DuplicateUuidSettings,
    pub item_validation: ItemValidationSettings,
    /* …12 toggles total */
}`,
        description:
          "The PaperMC-equivalent exploit surface. Defaults match Paper's shipped values; kebab-case aliases mean a paper.yml snippet pastes straight into rocketmc.toml.",
        notes: [
          "duplicate_uuid.mode: safe-regen | delete | nothing | warn",
          "Config tests cover every alias — 38 tests green per release",
        ],
        since: "6.3.0",
      },
      {
        id: "online-mode-settings",
        name: "OnlineModeSettings",
        kind: "struct",
        signature: `#[derive(Deserialize)]
pub struct OnlineModeSettings {
    pub java: bool,    // default: true
    pub bedrock: bool, // default: true
}`,
        description:
          "Independent auth per platform. Java follows the vanilla encryption handshake; Bedrock validates the Xbox Live token chain from the login packet.",
        since: "3.5.0",
      },
    ],
  },
  {
    id: "rocketmc-data",
    name: "rocketmc-data",
    version: "0.2.2+26.3-26.60",
    blurb:
      "Generated registries from Mojang's official 26.3 server jar — blocks, items, entities, damage types, effects, recipes and the data component model.",
    items: [
      {
        id: "item-type",
        name: "ItemType",
        kind: "enum",
        signature: `#[derive(Copy, Clone, Eq, PartialEq, Hash)]
#[repr(u16)]
pub enum ItemType {
    Diamond = 552,
    /* …1,847 variants generated from the 26.3 jar */
}`,
        description:
          "The generated item registry. Discriminants match the 26.3 vanilla IDs; the enum is exhaustive so the compiler flags any new vanilla item during upgrades.",
        since: "3.5.0",
      },
      {
        id: "damage-type",
        name: "DamageType",
        kind: "enum",
        signature: `pub enum DamageType {
    SonicBoom,
    /* …generated from vanilla damage_type registry */
}`,
        description:
          "Generated damage types with their bypass tags. SonicBoom lands in bypasses_armor, bypasses_enchantments and bypasses_shield automatically because the tags come from the official jar — armor, Protection and shields all correctly fail against it.",
        since: "5.9.0",
      },
      {
        id: "data-component",
        name: "DataComponent",
        kind: "enum",
        signature: `pub enum DataComponent {
    ProvidesPotteryPattern(PotteryPattern),
    CookingFuel(CookingFuel),
    /* …all twelve 26.3 components */
}`,
        description:
          "The 26.3 data component model. Gameplay code consumes components directly — provides_pottery_pattern drives decorated-pot placement, cooking_fuel drives furnace burn ticks with the bucket-remainder rule.",
        since: "6.3.0",
      },
    ],
  },
];
