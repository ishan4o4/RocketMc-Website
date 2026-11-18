# rocketmc-website v3

## Release number → v1.0.0
- Latest release 7.0.0 → **1.0.0** everywhere (hero, downloads/docker/tarball names, docs, JSON-LD `softwareVersion`, benchmark labels, builds table; rc/alpha builds → 1.0.0-rc.N / 1.1.0-alpha.1).
- Older history can't sit above 1.0.0, so it is renumbered mechanically to pre-1.0: 6.3.0→0.6.3, 5.9.0→0.5.9, 4.2.0→0.4.2, 3.5.0→0.3.5 (changelog, builds, home cards). Dates and content unchanged.
- API reference sections are versioned 1.0.0. **The Rust workspace still says 0.2.2+26.3-26.60** — bump `[workspace.package] version` in the server repo to match. (Native plugin compatibility is gated by `PLUGIN_API_VERSION` = 5, independent of this.)

## API reference re-verified against the source (55 Rust identifiers + 49 WIT names cross-checked)
- Added the **native plugin API** missed in v2: `rocketmc-core::plugin` (`Plugin`, `Context`, `EventHandler<E>`, `Cancellable`) + `rocketmc-api-macros` (`#[plugin_impl]`, `#[plugin_method]`, `#[with_runtime]`), loaded from .so/.dll/.dylib; unsandboxed; gated by `PLUGIN_API_VERSION`.
- WASM section: note that the v0.2 world sits behind the `plugin-v0_2` feature (off by default).
- Copy/FAQ/metadata: "Rust — sandboxed WASM or native"; docs migration note updated.
