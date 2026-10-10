# Bitty the Cat ($BTC) — Official Website

> **The Cat With Bitcoin Energy.**
> A premium, meme-native landing page for the Bitty the Cat meme coin: Next.js 15,
> React 19, TypeScript, Tailwind CSS v4, zero UI dependencies.

---

## 1. Quick start

```bash
npm install          # install dependencies
npm run dev          # http://localhost:3000
```

Production build (static site in `out/`):

```bash
npm run build        # type-checks, builds and exports to ./out
npm run serve:out    # preview the exported site on http://localhost:4321
```

Requirements: Node.js 18.18+ (built and verified on Node 24). Running
`npm run assets` additionally needs macOS `sips` and a Chrome/Chromium install;
`python3` (standard library only) is used for the circular mascot mask and icons.

Other scripts:

| Script              | What it does                                                             |
| ------------------- | ------------------------------------------------------------------------ |
| `npm run typecheck` | TypeScript only, no emit.                                                |
| `npm run assets`    | Regenerates every brand/gallery image from `scripts/mascot-source.jpg`.   |
| `npm run lint`      | Next.js lint (requires an ESLint config, optional).                       |

---

## 2. Where everything lives

```
bitty-the-cat/
├─ src/
│  ├─ config/
│  │  └─ site.config.ts        ★ SINGLE SOURCE OF TRUTH — edit this file
│  ├─ data/
│  │  └─ content.ts            ★ About copy, buy steps, gallery, roadmap, FAQ
│  ├─ app/
│  │  ├─ layout.tsx            Metadata, SEO, Open Graph, fonts, globals
│  │  ├─ page.tsx              Page composition + JSON-LD structured data
│  │  ├─ globals.css           Design tokens, animations, utilities
│  │  ├─ robots.ts             /robots.txt (generated at build time)
│  │  └─ sitemap.ts            /sitemap.xml (generated at build time)
│  ├─ components/
│  │  ├─ Navbar.tsx            Sticky nav + mobile hamburger menu
│  │  ├─ Footer.tsx            Footer, socials, contract, disclaimer
│  │  ├─ ScrollReveal.tsx      IntersectionObserver reveal-on-scroll
│  │  ├─ sections/             Hero, Marquee, About, TokenInfo, Tokenomics,
│  │  │                        HowToBuy, Gallery, Community, Roadmap, Faq
│  │  └─ ui/                   Button, Logo, MascotImage, SectionHeading,
│  │                           CopyContract, Toast, icons
│  └─ lib/utils.ts             Clipboard + class-name helpers
├─ public/
│  ├─ brand/                   Generated mascot sizes + og-image.jpg
│  ├─ gallery/                 Generated meme tiles (400/640/900 px)
│  ├─ icons/                   Favicons, apple-touch-icon, PWA icons
│  ├─ favicon.ico
│  ├─ manifest.webmanifest
│  └─ _headers                 Security + cache headers (Netlify/CF Pages)
└─ scripts/
   ├─ mascot-source.jpg        The supplied mascot artwork (source of truth)
   ├─ generate-assets.mjs      Builds every raster asset (Chrome + sips + python3)
   ├─ make-circular-mascot.py  Circular alpha mask + favicon/app icon set
   ├─ serve-static.mjs         Tiny static server used for previews/QA
   └─ visual-check.mjs         Dev-only screenshot/interaction QA harness
```

---

## 3. Publishing your official project data

Everything the site displays comes from **`src/config/site.config.ts`**.
Any value left as `""` renders a tasteful *Coming soon* / *Not yet available*
state — the site never invents a blockchain, contract, supply or statistic.

```ts
// src/config/site.config.ts
token: {
  blockchain: "Solana",                 // ← your chain, once announced
  contractAddress: "0x…",               // ← verified contract address
  totalSupply: "1000000000",            // ← verified supply, digits only
  totalSupplyUnit: "tokens",
},
links: {
  buy: "https://…",                     // ← official DEX/swap page
  explorer: "https://…",                // ← official block explorer page
  chart: "https://…",                   // ← optional chart page
  socials: {
    x: "https://x.com/…",
    telegram: "https://t.me/…",
    discord: "https://discord.gg/…",
  },
},
```

### Behaviour driven by that config

| Config value                       | UI behaviour                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| `token.contractAddress` empty      | Copy buttons render **disabled** with “Contract coming soon”; nothing is copied.   |
| `token.contractAddress` set        | Contract shows (truncated) + copy works and fires a toast.                         |
| `links.buy` empty                  | Every **BUY $BTC** button becomes a disabled/“coming soon” state.                  |
| `links.buy` set to an `https://` URL | All BUY buttons become external links to that page.                              |
| `links.explorer` empty             | “Explorer coming soon” disabled pill; otherwise a real link.                       |
| `links.socials.*` empty            | Social card/icon renders disabled with a “Coming soon” badge.                      |
| `tokenomics.finalized: false`      | Shows *“Official tokenomics will be published here.”* and lists the categories as TBA. |
| `tokenomics` complete + 100%       | The donut chart renders automatically with percentages and absolute amounts.       |

Only **absolute `https://` URLs** are ever rendered — `safeExternalUrl()` rejects
empty strings, `#`, `TODO`, `http://`, `javascript:` and relative paths, so a
button can never point at a fake or insecure destination.

### Tokenomics

```ts
tokenomics: {
  finalized: true,                                  // set true when verified
  allocations: [
    { key: "liquidity", label: "Liquidity", percent: 40, description: "…" },
    { key: "community", label: "Community", percent: 30, description: "…" },
    { key: "marketing", label: "Marketing", percent: 20, description: "…" },
    { key: "team",      label: "Team",      percent: 10, description: "…" },
    { key: "other",     label: "Other",     percent: null, description: "…" },
  ],
}
```

The chart renders only when `finalized === true`, every `percent` is a positive
number, and the percentages total exactly **100**. Otherwise the pending state
is shown. Absolute amounts are calculated from `token.totalSupply`.

### Editorial content

Headlines, about copy, buy steps, gallery captions, roadmap phases and FAQ
answers live in **`src/data/content.ts`**. Roadmap phases are plain objects —
add, remove or reorder them freely; `status` (`"complete" | "active" | "upcoming"`)
controls the badge and colour.

---

## 4. Brand assets & artwork

The mascot artwork you supply is used everywhere — it is never replaced with
stock imagery.

```bash
# 1. replace the source artwork
cp /path/to/new-mascot.jpg scripts/mascot-source.jpg

# 2. regenerate every derived asset
npm run assets
```

That command produces:

* `public/brand/mascot-{128…1024}.jpg` — responsive mascot sizes (hero fallback, about section)
* `public/brand/mascot-circle{,-384,-640}.png` — circular, transparent-background cut-outs used
  by the hero and logo (the artwork is a round badge on a white square, so the badge is masked
  to real transparency — no white corners or crescents on the dark background)
* `public/brand/og-image.jpg` — 1200×630 Open Graph / social preview
* `public/icons/*` + `public/favicon.ico` — favicons and PWA icons (circular, incl. a maskable 512 px)
* `public/gallery/*.jpg` — the eight “moods of Bitty” gallery tiles at 400/640/900 px

How it works: mascot derivatives are resized with macOS `sips`; `scripts/make-circular-mascot.py`
uses a pure-Python PNG codec to apply the circular alpha mask and build the icon set; the Open
Graph image and gallery tiles are composed as HTML/CSS in `scripts/generate-assets.mjs` and
rasterised with headless Chrome (auto-detected; override with `CHROME_PATH=/path/to/chrome`).
The pipeline fails loudly if a capture comes back at the wrong size or if the badge edge still
contains light pixels, so a broken asset can never ship silently.

### Adding your own gallery art

1. Drop your images into `public/gallery/` (e.g. `my-meme.jpg`, plus optional
   `my-meme-400.jpg` / `my-meme-640.jpg` variants).
2. Add an entry to `galleryItems` in `src/data/content.ts`:

```ts
{
  base: "/gallery/my-meme",        // file name without the size suffix/extension
  alt: "Short description for screen readers",
  caption: "Shown on the tile",
}
```

Tiles are square crops; 900×900 source images look best. Remove
`placeholder: true` once the art is official.

---

## 5. Design system

Design tokens live in `src/app/globals.css` under `@theme` (Tailwind v4), so
they are available as utilities everywhere:

| Token                          | Value     | Utility examples                        |
| ------------------------------ | --------- | --------------------------------------- |
| `--color-bitcoin`              | `#F7931A` | `text-bitcoin`, `border-bitcoin/40`     |
| `--color-orange`               | `#FF6B00` | `bg-orange`, `from-orange/25`           |
| `--color-golden`               | `#FFC928` | `text-golden`                           |
| `--color-ink`                  | `#101010` | `bg-ink`                                |
| `--color-charcoal`             | `#1A1A1A` | `bg-charcoal`                           |
| `--radius-card`                | `1.5rem`  | `rounded-card`                          |
| `--shadow-glow`                | orange    | `shadow-glow`                           |
| `--animate-float`, `pulse-glow`, `marquee`, `spin-slow` | | `animate-float`, … |

Helpers: `.text-gradient-orange`, `.surface-card`, `.bg-paw-pattern`,
`.bg-grid-pattern`, `.hairline`, `.ring-brand`.

**Motion & accessibility** — scroll reveals, floats, marquee and glow pulses all
respect `prefers-reduced-motion: reduce` (animations stop, reveals show
immediately). Focus rings are visible on keyboard navigation, the mobile menu
locks scroll and closes on `Escape`, the FAQ is a real `aria-expanded` accordion,
and the gallery lightbox is a labelled modal (`role="dialog"`, `aria-modal`).

---

## 6. Deployment

The site is a **fully static export** (`output: "export"` in `next.config.ts`) —
no Node server required.

```bash
npm run build      # → ./out
```

| Host                 | Setup                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------- |
| **Vercel**           | Import the repo; framework preset auto-detects Next.js. Set the project root to this folder if the repo contains other projects. |
| **Netlify**          | Build command `npm run build`, publish directory `out`. `public/_headers` is applied automatically. |
| **Cloudflare Pages** | Build command `npm run build`, output directory `out`.                                |
| **GitHub Pages**     | Push `out/` to the `gh-pages` branch (a `.nojekyll` file is already included).         |
| **Any web server**   | Upload the contents of `out/` to your document root (nginx, S3 + CloudFront, …).       |

Before going live, set your real domain in `siteConfig.brand.url` so canonical,
`sitemap.xml`, `robots.txt` and Open Graph URLs are absolute.

### Deploying with a Node server instead

Remove `output: "export"` from `next.config.ts` and use `npm run build` +
`npm run start`. Everything else keeps working.

---

## 7. Verification performed

Checked against the production export (`out/`) in headless Chrome
(1440, 1280, 834 and 390 px viewports, with real timing so animations settle):

* **Responsive layout** — `scrollWidth === innerWidth` at every breakpoint: no horizontal
  overflow anywhere, on any section.
* **Navigation** — sticky bar condenses on scroll, highlights the section in view; the mobile
  hamburger opens and closes (verified `aria-expanded` toggles `true` → `false`) and locks
  body scroll while open.
* **FAQ accordion** — one panel open at a time; clicking another closes the first
  (`aria-expanded` sequence verified). Keyboard accessible.
* **Gallery lightbox** — opens from any tile and closes via the close button, `Escape`
  (`aria-modal="true"` dialog).
* **Copy buttons** — while no contract address is configured, all three copy controls report
  `disabled === true`; nothing is copied and no unverified value is shown.
* **BUY buttons** — resolve to `#how-to-buy` in the default configuration, never to an
  unverified exchange.
* **Scroll reveals** — 50/50 reveal elements reach their visible state after scrolling.
* **Images** — 0 broken images across the whole page (verified after scrolling the gallery).
* **Console** — 0 errors, 0 warnings in the production build.

Performance of the exported build:

| Metric                          | Value                                             |
| ------------------------------- | ------------------------------------------------- |
| First Load JS                   | **115 kB** (103 kB shared)                        |
| Page HTML                       | ~55 kB (all sections, no client framework bloat)  |
| Runtime dependencies            | none — no animation or UI libraries               |
| Hero mascot (2× ~600 px)        | ~279 kB PNG (278 kB, alpha) *or* 640 px variant    |
| Gallery tile (per image)        | 30–60 kB at 400 px, 180 kB at 900 px              |

Re-run the QA harness yourself:

```bash
npm run build && npm run serve:out      # terminal 1
node scripts/visual-check.mjs http://127.0.0.1:4321/ .tmp/shots --full --interact
```

Screenshots and a JSON report (`overflow`, hidden reveals, broken images, interaction
results, console errors) are written to `.tmp/shots/`.

---

## 8. Guardrails (please keep these)

This site is intentionally honest. When you edit content, avoid:

* inventing a blockchain, contract address, supply, liquidity figure, market cap or price;
* presenting allocations, locks, renounces or audits that are not independently verifiable;
* promising listings, price targets, returns or market-cap milestones;
* linking users to unverified contracts, unofficial trading pages or fake social accounts.

Meme coins are volatile. Keep the risk disclaimer and the footer disclaimer intact.

---

© Bitty the Cat. Artwork supplied by the project owner.
