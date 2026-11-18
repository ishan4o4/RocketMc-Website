import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://rocketmc.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RocketMC — The high-performance Minecraft server, written in Rust",
    template: "%s · RocketMC",
  },
  description:
    "RocketMC is a Minecraft server engine written in Rust. Vanilla 26.3 'Wilderness Bound' parity, built-in Java + Bedrock support, PaperMC-style exploit protections and a Rust plugin API (WebAssembly or native) — no JVM required.",
  keywords: [
    "RocketMC",
    "Minecraft server",
    "Rust Minecraft server",
    "Pumpkin MC",
    "high performance Minecraft",
    "Bedrock support",
    "Geyser alternative",
    "exploit protections",
    "vanilla parity",
    "Minecraft server software",
    "PaperMC alternative",
    "plugin API",
  ],
  authors: [{ name: "The RocketMC Team" }],
  creator: "The RocketMC Team",
  publisher: "RocketMC",
  applicationName: "RocketMC",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "RocketMC",
    title: "RocketMC — The high-performance Minecraft server, written in Rust",
    description:
      "Vanilla 26.3 parity, built-in Java + Bedrock support, PaperMC-style exploit protections and a Rust plugin API (WebAssembly or native). No JVM required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RocketMC — The high-performance Minecraft server, written in Rust",
    description:
      "Vanilla 26.3 parity, built-in Java + Bedrock support, exploit protections and a Rust plugin API (WebAssembly or native). No JVM required.",
    creator: "@rocketmc_dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffdfb" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0906" },
  ],
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "RocketMC",
      url: SITE_URL,
      description:
        "The RocketMC Team builds a high-performance Minecraft server engine written in Rust.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "RocketMC",
      description: "The high-performance Minecraft server, written in Rust.",
      publisher: { "@id": `${SITE_URL}/#org` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "RocketMC",
      applicationCategory: "ServerApplication",
      operatingSystem: "Linux, macOS, Windows",
      softwareVersion: "1.0.0",
      description:
        "A Minecraft server engine written in Rust with vanilla 26.3 parity, built-in Java and Bedrock protocol support, PaperMC-style exploit protections and a Rust plugin API (WebAssembly or native).",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: { "@id": `${SITE_URL}/#org` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
