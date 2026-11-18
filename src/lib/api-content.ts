/*
 * RocketMC plugin API reference.
 *
 * Mapped from the RocketMC workspace source: `rocketmc-plugin-api` + the
 * `rocketmc:plugin` WIT package (WebAssembly plugins), `rocketmc-core::plugin` +
 * `rocketmc-api-macros` (native plugins) and `rocketmc-config`.
 * Keep in sync with API.md / AGENTS.md in the server repo.
 * NOTE: the workspace crates still carry version 0.2.2+26.3-26.60 — bump
 * `[workspace.package] version` to 1.0.0 to match API_VERSION below.
 */

export interface ApiItem {
  id: string;
  name: string;
  kind: "trait" | "struct" | "enum" | "fn" | "mod" | "type" | "macro";
  signature: string;
  description: string;
  example?: string;
  notes?: string[];
  /** Optional: only set when the exact release is known. */
  since?: string;
  lang?: "rust" | "toml" | "bash";
}

export interface ApiCrate {
  id: string;
  name: string;
  version: string;
  blurb: string;
  items: ApiItem[];
}

const API_VERSION = "1.0.0";

export const API_CRATES: ApiCrate[] = [
  {
    id: "rocketmc-plugin-api",
    name: "rocketmc-plugin-api",
    version: API_VERSION,
    blurb:
      "WebAssembly plugins (sandboxed). The Rust crate for writing plugins that compile to WebAssembly components and run in a wasmtime sandbox; it wraps the generated `rocketmc:plugin` WIT bindings in ergonomic Rust types. Dual-licensed MIT OR Apache-2.0. For in-process native plugins see the “Native plugins” section.",
    items: [
      {
        id: "plugin",
        name: "Plugin",
        kind: "trait",
        signature: `pub trait Plugin: Send + Sync {
    fn new() -> Self where Self: Sized;
    fn metadata(&self) -> PluginMetadata;
    fn on_load(&self, _context: Context) -> Result<()> { Ok(()) }
    fn on_unload(&self, _context: Context) -> Result<()> { Ok(()) }
    fn handle_ipc_message(
        &self,
        _sender: wit::PluginId,
        _message: wit::IpcMessage,
    ) -> Result<wit::IpcMessage, String>;
}`,
        description:
          "The trait every plugin implements. new and metadata are required; on_load, on_unload and handle_ipc_message have defaults. Callbacks take &self so the runtime can safely re-enter a plugin — mutable state needs interior mutability (Mutex, atomics), and a non-reentrant lock must not be held across a host call, because the host may deliver an event back into the same plugin before the call returns.",
        example: `use rocketmc_plugin_api::{
    Context, Plugin, PluginMetadata, Result, register_plugin,
    permissions::{FS_READ_DATA, FS_WRITE_DATA},
};

struct MyPlugin;

impl Plugin for MyPlugin {
    fn new() -> Self { MyPlugin }

    fn metadata(&self) -> PluginMetadata {
        PluginMetadata {
            name: "my-plugin".into(),
            version: "0.1.0".into(),
            authors: vec!["you".into()],
            description: "An example plugin.".into(),
            dependencies: vec![],
            permissions: vec![FS_READ_DATA.into(), FS_WRITE_DATA.into()],
        }
    }

    fn on_load(&self, context: Context) -> Result<()> {
        let server = context.get_server();
        tracing::info!("loaded on Minecraft {}", server.get_minecraft_version());
        Ok(())
    }
}

register_plugin!(MyPlugin);`,
        notes: [
          "Result<T, E = String> is the crate's own alias — errors are plain strings",
          "A plugin whose metadata API version does not match the server is rejected with “Plugin API version mismatch”",
          "Plugins store data as ordinary files via WASI (std::fs) inside their private data folder — there is no separate storage API",
        ],
      },
      {
        id: "plugin-metadata",
        name: "PluginMetadata",
        kind: "struct",
        signature: `pub struct PluginMetadata {
    pub name: String,
    pub version: String,
    pub authors: Vec<String>,
    pub description: String,
    pub dependencies: Vec<String>,
    pub permissions: Vec<String>,
}`,
        description:
          "Returned from Plugin::metadata and read by the host at load time. permissions lists every sandbox capability the plugin requests; the host enforces them (see the permission constants below).",
      },
      {
        id: "register-plugin",
        name: "register_plugin!",
        kind: "macro",
        signature: `register_plugin!(MyPlugin);`,
        description:
          "Exports the WebAssembly init-plugin entry point. At init it installs the WIT tracing subscriber and builds the plugin via Plugin::new, exactly once — calling it twice panics. Dispatch of lifecycle callbacks, events, commands, scheduled tasks, AI goals and chunk generation is wired through the crate's WIT Guest implementation.",
      },
      {
        id: "context",
        name: "Context",
        kind: "struct",
        signature: `// WIT resource \`context\` (re-exported from rocketmc:plugin/context)
impl Context {
    pub fn get_server(&self) -> Server;
    pub fn get_data_folder(&self) -> String;
    pub fn get_marketplace_metadata(&self) -> Option<MarketplaceMetadata>;
    pub fn register_event_handler<E, H>(
        &self,
        handler: H,
        event_priority: EventPriority,
        blocking: bool,
    ) -> Result<u32>;
    // + register_command(command, permission), register_permission(permission)
}`,
        description:
          "The handle passed to on_load and on_unload. get_data_folder returns the plugin's private folder as seen from inside the WASI sandbox (needs fs.read.data / fs.write.data). register_event_handler is the Rust-side wrapper around the WIT register-event call and returns the handler id.",
      },
      {
        id: "server",
        name: "Server",
        kind: "struct",
        signature: `// WIT resource \`server\` (selected methods)
get_player_count() -> u32          get_all_players() -> Vec<Player>
get_player_by_name(&str)           get_player_by_uuid(Uuid)
get_all_worlds() -> Vec<World>     get_world_by_name(&str)
create_world(name, dimension)      unload_world(name) -> Result<(), String>
save_all() -> Result<(), String>   broadcast(&str)
execute_command(cmd, sender)       get_tps() / get_mspt() -> f64
get_difficulty()  set_difficulty(d)  set_difficulty_locked(bool)
is_difficulty_locked()  shutdown()  get_minecraft_version() -> String
get_max_players()  get_motd()  is_hardcore()  is_online_mode()
get_op_manager()  get_ban_manager()  get_whitelist_manager()
get_recipe_manager()  get_enchantment_manager()  get_datapack_manager()
get_advancement(id)  get_sys_info()  set_server_links(links)`,
        description:
          "Global server state and the manager handles. get_sys_info fields are permission-gated individually. shutdown triggers the same graceful path as /stop; the difficulty setters and get_minecraft_version are RocketMC additions available in both WIT worlds.",
      },
      {
        id: "server-ext",
        name: "ServerExt",
        kind: "trait",
        signature: `pub trait ServerExt {
    fn set_difficulty_by_name(&self, name: &str) -> Result<(), UnknownDifficulty>;
    fn is_hardcore_difficulty(&self) -> bool;
}`,
        description:
          "Rust convenience helpers on Server. set_difficulty_by_name accepts peaceful, easy, normal or hard (case-insensitive) and returns UnknownDifficulty otherwise.",
      },
      {
        id: "permissions",
        name: "permissions",
        kind: "mod",
        signature: `pub const NETWORK_DNS: &str = "network.dns";
pub const NETWORK_TCP: &str = "network.tcp";
pub const NETWORK_UDP: &str = "network.udp";
pub const NETWORK_LOOPBACK: &str = "network.loopback";
pub const NETWORK_OUTBOUND: &str = "network.outbound";
pub const HTTP_OUTBOUND: &str = "http.outbound";
pub const FS_READ_DATA: &str = "fs.read.data";
pub const FS_WRITE_DATA: &str = "fs.write.data";
pub const SYS_ENV: &str = "sys.env";
pub const SYS_INFO: &str = "sys.info"; // + SYS_INFO_CPU / _RAM / _OS`,
        description:
          "String constants for the sandbox permissions a plugin can request in PluginMetadata::permissions. Also defined: NETWORK_TCP_CONNECT/BIND, NETWORK_UDP_CONNECT/BIND, NETWORK_UDP_OUTGOING_DATAGRAM and the SYS_ENV_PREFIX (“sys.env.”) prefix. Use the constants instead of hard-coding strings.",
      },
    ],
  },
  {
    id: "events",
    name: "rocketmc_plugin_api::events",
    version: API_VERSION,
    blurb:
      "Typed event markers that connect a handler to the WIT event data record. The server fires 270+ events across block, dialog, enchantment, entity, hanging, inventory, packet, player, raid, server, vehicle and world.",
    items: [
      {
        id: "event-handler",
        name: "EventHandler",
        kind: "trait",
        signature: `pub trait EventHandler<E: FromIntoEvent> {
    fn handle(&self, server: Server, event: E::Data) -> E::Data;
}`,
        description:
          "Implement this for a handler type, once per event. handle receives the server handle and the event data record and returns the (possibly modified) data. Register it with Context::register_event_handler.",
        example: `use rocketmc_plugin_api::{Context, EventHandler, Server};
use rocketmc_plugin_api::events::{EventPriority, PlayerJoinEvent};
use rocketmc_plugin_api::events_wit::PlayerJoinEventData;
use rocketmc_plugin_api::text::TextComponent;

struct OnJoin;

impl EventHandler<PlayerJoinEvent> for OnJoin {
    fn handle(&self, _server: Server, mut event: PlayerJoinEventData) -> PlayerJoinEventData {
        event.join_message = TextComponent::text("Welcome to the server!");
        event
    }
}

// in Plugin::on_load:
context.register_event_handler(OnJoin, EventPriority::Normal, false)?;`,
        notes: [
          "Most data records carry cancelled: bool; a blocking handler that sets it stops the vanilla behavior",
          "Handlers run in priority order",
        ],
      },
      {
        id: "from-into-event",
        name: "FromIntoEvent",
        kind: "trait",
        signature: `pub trait FromIntoEvent: Sized {
    const EVENT_TYPE: EventType;
    type Data;
    fn data_from_event(event: Event) -> Self::Data;
    fn data_into_event(data: Self::Data) -> Event;
}`,
        description:
          "Implemented by each event marker (a unit struct such as PlayerJoinEvent). EVENT_TYPE tells the host which event to subscribe to; data_from_event and data_into_event convert between the opaque WIT Event variant and the concrete data record. EventData<E> is a type alias for E::Data.",
      },
      {
        id: "event-priority",
        name: "EventPriority",
        kind: "enum",
        signature: `pub enum EventPriority {
    Highest,
    High,
    Normal,
    Low,
    Lowest,
}`,
        description:
          "When a handler runs relative to other handlers. register_event_handler also takes a blocking flag: a blocking handler receives an exclusive borrow of the event data and its modifications (such as cancelled = true) are applied.",
      },
      {
        id: "warden-anger-change-event",
        name: "WardenAngerChangeEvent",
        kind: "struct",
        signature: `pub struct WardenAngerChangeEvent;   // marker
impl FromIntoEvent for WardenAngerChangeEvent {
    const EVENT_TYPE: EventType = EventType::WardenAngerChangeEvent;
    type Data = WardenAngerChangeEventData;
}

// WIT record
pub struct WardenAngerChangeEventData {
    pub entity_id: i32,    // the warden
    pub target_id: i32,    // the entity it is angry at
    pub old_anger: i32,
    pub new_anger: i32,
    pub cancelled: bool,
}`,
        description:
          "Fires when a warden's anger toward an entity changes. The data carries entity ids (not handles) and the old and new anger levels; the engine skips the event if the offender can no longer be resolved in the world.",
        example: `struct LogAnger;

impl EventHandler<WardenAngerChangeEvent> for LogAnger {
    fn handle(&self, _s: Server, e: WardenAngerChangeEventData) -> WardenAngerChangeEventData {
        tracing::info!("warden {} anger at {}: {} -> {}",
            e.entity_id, e.target_id, e.old_anger, e.new_anger);
        e
    }
}`,
      },
      {
        id: "packet-events",
        name: "packet events",
        kind: "mod",
        signature: `// WIT event records
packet-received-event-data     packet-sent-event-data
// payload enums
ServerboundPacket { Java(JavaServerboundPacket), Bedrock(BedrockServerboundPacket) }
ClientboundPacket { Java(JavaClientboundPacket), Bedrock(BedrockClientboundPacket) }`,
        description:
          "Raw serverbound and clientbound packet interception for both Java and Bedrock editions.",
      },
    ],
  },
  {
    id: "runtime",
    name: "rocketmc_plugin_api::{scheduler, commands, ai}",
    version: API_VERSION,
    blurb:
      "Scheduled tasks, plugin commands and custom mob AI goals. Each is registered by id and dispatched back into the plugin through the WIT handle-* exports.",
    items: [
      {
        id: "scheduler-ext",
        name: "SchedulerExt",
        kind: "trait",
        signature: `pub trait SchedulerExt {
    fn schedule_delayed_task<F>(&self, delay_ticks: u64, handler: F) -> u32
    where F: Fn(Server) + Send + Sync + 'static;

    fn schedule_repeating_task<F>(&self, delay_ticks: u64, period_ticks: u64, handler: F) -> u32
    where F: Fn(Server) + Send + Sync + 'static;
}

pub fn cancel_task(task_id: u32);`,
        description:
          "Implemented for both Context and Server. Delays are in game ticks (20 per second); each call returns a task id. cancel_task is a free function, not a method. Also available as free functions schedule_delayed_task and schedule_repeating_task.",
        example: `use rocketmc_plugin_api::scheduler::{SchedulerExt, cancel_task};

let id = context.schedule_repeating_task(100, 100, |server| {
    server.broadcast("every five seconds");
});
cancel_task(id);`,
        notes: ["Handlers are Fn, so captured mutable state needs Arc<Mutex<…>> or atomics"],
      },
      {
        id: "command-handler",
        name: "CommandHandler",
        kind: "trait",
        signature: `pub trait CommandHandler: Send + Sync {
    fn handle(
        &self,
        sender: CommandSender,
        server: Server,
        args: ConsumedArgs,
    ) -> Result<i32, CommandError>;
}

pub trait CommandSuggestionHandler: Send + Sync {
    fn suggest(&self, sender: CommandSender, server: Server, request: SuggestionRequest)
        -> CommandSuggestions;
}`,
        description:
          "Runs when a registered command is invoked; return Ok(0) for success or a CommandError to report a failure to the sender. Attach handlers with the command builder's execute and suggest methods and register the command with Context::register_command, which takes the permission node required to run it.",
      },
      {
        id: "ai-goal",
        name: "AiGoal",
        kind: "trait",
        signature: `pub trait AiGoal: Send + Sync {
    fn can_start(&self, server: Server, entity: Entity) -> bool { false }
    fn should_continue(&self, server: Server, entity: Entity) -> bool { false }
    fn start(&self, server: Server, entity: Entity) {}
    fn tick(&self, server: Server, entity: Entity) {}
    fn stop(&self, server: Server, entity: Entity) {}
}`,
        description:
          "Custom mob AI goals implemented in a plugin. All callbacks have defaults (can_start and should_continue default to false) and take &self, so goal state must use interior mutability.",
      },
    ],
  },
  {
    id: "worldgen",
    name: "rocketmc_plugin_api::worldgen",
    version: API_VERSION,
    blurb: "Custom world and chunk generation implemented in a plugin.",
    items: [
      {
        id: "chunk-generator",
        name: "ChunkGenerator",
        kind: "trait",
        signature: `pub trait ChunkGenerator: Send + Sync + 'static {
    fn generate_biomes(&self, chunk: &mut ChunkBuffer) {}
    fn generate_noise(&self, chunk: &mut ChunkBuffer) {}
    fn generate_surface(&self, chunk: &mut ChunkBuffer) {}
    fn generate_features(&self, chunk: &mut ChunkBuffer) {}
}

pub struct GeneratorManager;
impl GeneratorManager {
    pub fn register<G: ChunkGenerator>(generator: G) -> u32;
}`,
        description:
          "Four generation phases — biomes, noise, surface, features — each with an empty default. GeneratorManager::register returns a generator id; apply it to a world with world.set_chunk_generator(id).",
      },
      {
        id: "chunk-buffer",
        name: "ChunkBuffer",
        kind: "struct",
        signature: `impl ChunkBuffer {
    pub fn x(&self) -> i32;       pub fn z(&self) -> i32;
    pub fn min_y(&self) -> i32;   pub fn height(&self) -> u32;
    pub fn set_block(&mut self, x: u8, y: i32, z: u8, state_id: u16);
    pub fn get_block(&self, x: u8, y: i32, z: u8) -> u16;
    pub fn fill_layer(&mut self, y: i32, state_id: u16);
    pub fn fill_range(&mut self, x: u8, min_y: i32, max_y: i32, z: u8, state_id: u16);
    pub fn fill_cuboid(/* … */);
    pub fn set_biome(&mut self, x: u8, y: i32, z: u8, biome: Biome);
    pub fn fill_biome(&mut self, biome: Biome);
}`,
        description:
          "The mutable chunk handed to each generation phase. Block coordinates inside a chunk are u8; blocks are written as block state ids.",
      },
    ],
  },
  {
    id: "rocketmc-plugin-wit",
    name: "rocketmc-plugin-wit",
    version: "@0.1.0 · @0.2.0",
    blurb:
      "The versioned WebAssembly Interface Types package, `rocketmc:plugin`. Plugins in any language that targets the component model can implement it; rocketmc-plugin-api targets v0.1.",
    items: [
      {
        id: "worlds",
        name: "rocketmc:plugin world",
        kind: "mod",
        signature: `package rocketmc:plugin@0.1.0;   // also @0.2.0

world plugin {
    // host-provided imports: logging, gui, scoreboard, …
    // plugin exports: metadata, on-load / on-unload, handle-event,
    //   handle-command, handle-command-suggestion, handle-task,
    //   handle-ai-goal-*, handle-ipc-message, handle-generate-phase
}`,
        description:
          "Two released worlds, v0.1 and v0.2. v0.2 mirrors v0.1 and receives new features first — for example EntityToggleSitEvent exists only in v0.2. Breaking changes require a new world version; the host rejects plugins built for a mismatched version.",
        notes: [
          "The v0.2 host is behind the `plugin-v0_2` cargo feature of the `rocketmc` binary, which stays off until the v0.2 ABI is finished — default builds load v0.1 plugins only",
          "v0.1: 273 event-data records · v0.2: 274",
          "Interfaces include context, server, world, entity, player, inventory, event, command, scheduler, recipe, enchantments, datapack, forms, java-dialogs, gui, scoreboard, ipc, statistics, i18n and permission",
        ],
        lang: "rust",
      },
      {
        id: "warden-record",
        name: "warden-anger-change-event-data",
        kind: "type",
        signature: `record warden-anger-change-event-data {
    entity-id: s32,
    target-id: s32,
    old-anger: s32,
    new-anger: s32,
    cancelled: bool
}`,
        description:
          "The WIT record behind WardenAngerChangeEventData — the shape every event record follows (ids and values plus a cancelled flag).",
      },
    ],
  },
  {
    id: "native",
    name: "Native plugins · rocketmc-core",
    version: API_VERSION,
    blurb:
      "In-process plugins. A native plugin is a Rust dynamic library (.so on Linux, .dll on Windows, .dylib on macOS) loaded straight into the server process — async, with direct access to the server, and NOT sandboxed: the permission system that guards WebAssembly plugins does not confine native code. Rust has no stable ABI, so build with the same toolchain and core version as the server. Compatibility is gated by PLUGIN_API_VERSION.",
    items: [
      {
        id: "native-plugin",
        name: "Plugin (native)",
        kind: "trait",
        signature: `// rocketmc_core::plugin
pub trait Plugin: Send + Sync + 'static {
    fn on_load(&self, server: Arc<Context>) -> PluginFuture<'_, Result<(), String>>;
    fn on_unload(&self, server: Arc<Context>) -> PluginFuture<'_, Result<(), String>>;
    fn on_ipc_message(&self, sender: &str, message: &[u8])
        -> PluginFuture<'_, Result<Vec<u8>, String>>;
}

pub type PluginFuture<'a, T> = Pin<Box<dyn Future<Output = T> + Send + 'a>>;`,
        description:
          "The native plugin trait. All three callbacks have defaults (on_load / on_unload succeed, on_ipc_message returns “This plugin cannot receive messages.”) and return boxed futures. Unlike the WASM Plugin trait there is no new() or metadata() method — metadata is exported as a symbol by the macros below.",
      },
      {
        id: "native-macros",
        name: "plugin_impl / plugin_method / with_runtime",
        kind: "macro",
        signature: `// crate: rocketmc-api-macros (proc-macro)
#[plugin_method]   // on each Plugin method: body runs async on the global runtime
#[plugin_impl]     // on the plugin struct: generates the Plugin impl and the exports
#[with_runtime(global | local)]   // wraps every fn of an impl block in block_on`,
        description:
          "plugin_impl generates impl Plugin for your struct from the #[plugin_method] functions, and exports three symbols the loader looks up: ROCKETMC_API_VERSION (u32), METADATA (a LazyLock<PluginMetadata>) and plugin() (a constructor returning Box<dyn Plugin>, which calls YourStruct::new()). METADATA is built from your Cargo.toml package name, version, authors and description; dependencies and permissions are empty.",
        notes: [
          "The generated code references rocketmc::plugin::*, a tokio runtime and crate::GLOBAL_RUNTIME, so the plugin crate needs tokio and the server's plugin module available under the name `rocketmc`",
          "Loading fails with ApiVersionMissing, ApiVersionMismatch, MetadataMissing or EntrypointMissing if an export is absent or the version differs",
        ],
      },
      {
        id: "native-context",
        name: "Context (native)",
        kind: "struct",
        signature: `pub struct Context { pub server: Arc<Server>, /* … */ }

impl Context {
    pub fn get_data_folder(&self) -> PathBuf;
    pub fn get_player_by_name(&self, name: &str) -> Option<Arc<Player>>;
    pub fn register_event<E: Payload + 'static, H: EventHandler<E> + 'static>(
        &self, handler: Arc<H>, priority: EventPriority, blocking: bool);
    pub fn register_command<P: Into<String>>(
        &self, node: impl Into<CommandDetachedNode>, permission: P);
    pub fn register_command_with_aliases<P: Into<String>>(
        &self, node: impl Into<CommandDetachedNode>, aliases: &[String], permission: P);
    pub fn unregister_command(&self, name: &str);
    pub fn register_permission(&self, permission: Permission) -> Result<(), String>;
    pub fn player_has_permission(&self, uuid: &Uuid, permission: &str) -> bool;
    pub async fn register_service<N: Into<String>, T: Payload + 'static>(&self, name: N, service: Arc<T>);
    pub async fn get_service<T: Payload + 'static>(&self, name: &str) -> Option<Arc<T>>;
    pub async fn register_plugin_loader(&self, loader: Arc<dyn PluginLoader>) -> bool;
    pub fn log(&self, message: impl Display);
}`,
        description:
          "The handle passed to on_load / on_unload. A command permission without a colon is namespaced with the plugin name (name:permission). register_service / get_service let plugins share typed services with each other, and register_plugin_loader lets a plugin teach the server a new plugin format.",
      },
      {
        id: "native-event-handler",
        name: "EventHandler<E> (native)",
        kind: "trait",
        signature: `pub trait EventHandler<E: Payload>: Send + Sync {
    fn handle<'a>(&'a self, server: &'a Arc<Server>, event: &'a E) -> BoxFuture<'a, ()>;
    fn handle_blocking<'a>(&'a self, server: &'a Arc<Server>, event: &'a mut E)
        -> BoxFuture<'a, ()>;   // both default to a no-op
}

pub trait Cancellable: Send + Sync {
    fn cancelled(&self) -> bool;
    fn set_cancelled(&mut self, cancelled: bool);
}`,
        description:
          "Native handlers receive the event struct itself (not an opaque record). Non-blocking handlers observe it; a handler registered with blocking = true gets &mut E in handle_blocking and can modify or cancel it. Event types implement Payload and, when cancellable, Cancellable. EventPriority is Highest, High, Normal, Low, Lowest.",
        example: `// native event struct (rocketmc_core::plugin::api::events::entity)
pub struct WardenAngerChangeEvent {
    pub entity_id: i32,
    pub target_id: i32,
    pub old_anger: i32,
    pub new_anger: i32,
    pub cancelled: bool,   // via Cancellable
}`,
      },
    ],
  },
  {
    id: "rocketmc-config",
    name: "rocketmc-config",
    version: API_VERSION,
    blurb:
      "Server-side configuration. The [plugins] section of config/advanced.toml controls the plugin runtime (the WASM options — permissions, memory, signatures — apply to WebAssembly plugins).",
    items: [
      {
        id: "plugins-config",
        name: "PluginsConfig",
        kind: "struct",
        signature: `# config/advanced.toml
[plugins]
enabled = true                       # false: no plugins are loaded
hot_reload = false                   # watch plugins/ and reload modified plugins
ask_permission_confirmation = true   # console prompt when a plugin requests new permissions
allow_unsigned = true                # allow loading unsigned WASM plugins
verify_signatures = true             # verify signatures of signed plugins
allowed_permissions = []             # pre-approved for every plugin
blocked_permissions = []             # blocked for every plugin
inherit_env = false                  # inherit host env vars into WASI
loopback_only = false                # restrict plugin sockets to loopback
# max_memory_mb = 128               # per-plugin memory cap

[plugins.overrides.my_plugin]        # per-plugin overrides, keyed by plugin name
enabled = true
allow_unsigned = true`,
        description:
          "Plugin runtime settings. Drop built .wasm components (or native libraries) into the server's plugins/ folder; each plugin's private data lives under plugins/data/<name>/. Values shown are the struct defaults.",
        lang: "toml",
      },
    ],
  },
];
