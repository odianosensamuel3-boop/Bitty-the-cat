import type { Metadata, Viewport } from "next";
import siteConfig from "@/config/site.config";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const { brand } = siteConfig;
const title = `${brand.name} (${brand.ticker}) — ${brand.tagline}`;
const description = brand.description;
const siteUrl = getSiteUrl() || brand.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${brand.name} ${brand.ticker}`,
  },
  description,
  applicationName: brand.name,
  keywords: [
    "Bitty the Cat",
    "$BTC",
    "Bitty",
    "meme coin",
    "cat meme coin",
    "crypto meme",
    "Bitcoin energy",
    "web3 community",
  ],
  authors: [{ name: brand.name }],
  creator: brand.name,
  publisher: brand.name,
  category: "cryptocurrency",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: brand.name,
    title,
    description,
    locale: brand.locale,
    images: [
      {
        url: brand.ogImage,
        width: brand.ogImageWidth,
        height: brand.ogImageHeight,
        alt: `${brand.name} — ${brand.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [brand.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/favicon-96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: brand.themeColor,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Marks the document as JS-capable so scroll-reveal can start hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-reveal');`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-ink text-white antialiased">{children}</body>
    </html>
  );
}
