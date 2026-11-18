import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RocketMC — The high-performance Minecraft server, written in Rust",
    short_name: "RocketMC",
    description:
      "A Minecraft server engine written in Rust — vanilla 26.3 parity, built-in Java + Bedrock support, PaperMC-style exploit protections and a Rust plugin API (WebAssembly or native).",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0906",
    theme_color: "#f97316",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
