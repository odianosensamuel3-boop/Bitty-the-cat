import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { SOCIAL_ICONS } from "@/components/ui/icons";
import {
  getContractAddress,
  getSocialLinks,
  siteConfig,
  truncateAddress,
  safeExternalUrl,
} from "@/config/site.config";
import { CopyContract } from "@/components/ui/CopyContract";

const FOOTER_LINKS = [
  ...siteConfig.navigation,
  { label: "Meme Gallery", href: "#memes" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

/** Footer: brand, navigation, official channels, contract + disclaimer. */
export function Footer() {
  const address = getContractAddress();
  const socials = getSocialLinks().filter((link) => link.href);
  const explorer = safeExternalUrl(siteConfig.links.explorer);
  const year = siteConfig.legal.copyrightYear === "auto" ? new Date().getFullYear() : siteConfig.legal.copyrightYear;

  return (
    <footer className="relative overflow-hidden border-t border-bitcoin/20 bg-[linear-gradient(180deg,#111111,#0A0A0A)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-paw-pattern opacity-60" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-0 h-60 w-60 rounded-full bg-orange/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr_1fr]">
          {/* ---------- brand ---------- */}
          <div>
            <Logo size={48} href="#home" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              <span className="font-display uppercase tracking-wide text-golden">
                {siteConfig.brand.tagline}
              </span>
              <br />
              {siteConfig.brand.name} ({siteConfig.brand.ticker}) is a community-driven meme coin built around one
              unforgettable cat.
            </p>

            <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-white/45">Contract address</p>
              <p className="mt-2 break-all font-mono text-xs text-golden sm:text-sm">
                {address ? truncateAddress(address, 12, 10) : "Not yet available — verify before you buy"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <CopyContract label="Copy address" />
                {explorer ? (
                  <a
                    href={explorer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-pill border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/80 transition hover:border-golden/60 hover:text-golden"
                  >
                    Explorer
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {/* ---------- navigation ---------- */}
          <nav aria-label="Footer">
            <h2 className="font-display text-sm uppercase tracking-[0.24em] text-white/80">Explore</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-1">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-semibold text-white/60 transition-colors duration-300 hover:text-golden"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- socials ---------- */}
          <div>
            <h2 className="font-display text-sm uppercase tracking-[0.24em] text-white/80">Official channels</h2>
            {socials.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-3">
                {socials.map((link) => {
                  const Icon = SOCIAL_ICONS[link.key];
                  return (
                    <li key={link.key}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        title={link.label}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] text-white/75 transition duration-300 hover:-translate-y-0.5 hover:border-golden/60 hover:text-golden"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-5">
                <ul className="flex flex-wrap gap-3">
                  {getSocialLinks()
                    .slice(0, 3)
                    .map((link) => {
                      const Icon = SOCIAL_ICONS[link.key];
                      return (
                        <li key={link.key}>
                          <span
                            aria-disabled="true"
                            title={`Official ${link.label} link coming soon`}
                            className="inline-flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-white/30"
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                        </li>
                      );
                    })}
                </ul>
                <p className="mt-4 max-w-xs text-xs leading-relaxed text-white/40">
                  Official community links will be published on this website once available. Until then, treat any
                  Bitty channel as unverified.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ---------- disclaimer ---------- */}
        <div className="mt-12 rounded-card border border-white/8 bg-white/[0.02] p-5 sm:p-6">
          <h2 className="font-display text-xs uppercase tracking-[0.24em] text-golden">Disclaimer</h2>
          <p className="mt-3 text-xs leading-relaxed text-white/50 sm:text-sm">{siteConfig.legal.disclaimer}</p>
        </div>

        {/* ---------- bottom bar ---------- */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-6 sm:flex-row">
          <p className="text-xs text-white/45">
            © {year} {siteConfig.legal.copyrightHolder}. All rights reserved.
          </p>
          <p className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
            <span>{siteConfig.brand.ticker}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-golden/60" />
            <span>{siteConfig.brand.tagline}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
