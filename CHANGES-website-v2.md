# rocketmc-website v2 — API page mapped to the real source

The old API page documented a crate (`rocketmc-api`) and types (`ServerContext`, `EventBus`, `on_enable`, `World::set_block -> BlockUpdate`, `since 3.5.0`...) that do not exist in the RocketMC workspace. Plugins are WASM components using `rocketmc-plugin-api` + the `rocketmc:plugin` WIT package.

- `src/lib/api-content.ts` — rewritten from the source: Plugin, PluginMetadata, register_plugin!, Context, Server, ServerExt, permissions, EventHandler, FromIntoEvent, EventPriority, WardenAngerChangeEvent (real fields: entity_id, target_id, old_anger, new_anger, cancelled), SchedulerExt/cancel_task, CommandHandler, AiGoal, ChunkGenerator/ChunkBuffer, WIT world v0.1/v0.2, `[plugins]` config. Fabricated `since` tags removed (field now optional); versions are the workspace version.
- `src/components/site/views/api.tsx` — hero/sidebar copy (no more `--plugin ...so`), optional `since`, `macro` kind, per-item code language.
- `src/lib/site-data.ts`, `src/app/layout.tsx`, `src/app/manifest.ts` — "native Rust plugin API / typed crates / event bus" replaced with the WASM-sandbox wording.

Not touched (unverified): home-page stats (161 entity types, 1,847 items, TPS/benchmarks), release/version numbers, changelog.
