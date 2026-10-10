import SectionHeading from "@/components/ui/SectionHeading";
import { ExternalLinkIcon, PawIcon } from "@/components/ui/icons";
import { SOCIAL_ICONS } from "@/components/ui/icons";
import { getSocialLinks, siteConfig, type SocialLink } from "@/config/site.config";
import { cx } from "@/lib/utils";

const FEATURED: { key: SocialLink["key"]; label: string; blurb: string; accent: string }[] = [
  {
    key: "x",
    label: "X / Twitter",
    blurb: "Daily memes, updates and community reposts.",
    accent: "from-white/10 to-transparent",
  },
  {
    key: "telegram",
    label: "Telegram",
    blurb: "Chat, ask questions and hang out with fellow Bitty fans.",
    accent: "from-sky-400/15 to-transparent",
  },
  {
    key: "discord",
    label: "Discord",
    blurb: "Meme channels, art drops and community events.",
    accent: "from-indigo-400/15 to-transparent",
  },
];

/** Community section: official channels, or clearly disabled placeholders. */
export function Community() {
  const links = getSocialLinks();
  const byKey = new Map(links.map((link) => [link.key, link]));
  const extraLinks = links.filter(
    (link) => !["x", "telegram", "discord"].includes(link.key) && link.href,
  );

  return (
    <section id="community" className="relative overflow-hidden py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_0%,#2A1400_0%,transparent_65%)]" />
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/10 blur-[130px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Community"
          title={
            <>
              THE BITTY ERA <span className="text-gradient-orange">STARTS HERE.</span>
            </>
          }
          description={
            <>
              <p>Good vibes. Great memes. One unforgettable cat.</p>
              <p>Come hang out with the Bitty community.</p>
            </>
          }
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((item, index) => {
            const link = byKey.get(item.key);
            const Icon = SOCIAL_ICONS[item.key];
            const href = link?.href ?? "";
            const enabled = href.length > 0;

            const inner = (
              <>
                <div
                  aria-hidden="true"
                  className={cx(
                    "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
                    item.accent,
                    enabled && "group-hover:opacity-100",
                  )}
                />
                <div className="relative flex items-center justify-between">
                  <span
                    className={cx(
                      "inline-flex h-14 w-14 items-center justify-center rounded-2xl border bg-ink/70 transition-transform duration-500",
                      enabled
                        ? "border-bitcoin/40 text-golden group-hover:scale-110 group-hover:border-golden"
                        : "border-white/10 text-white/35",
                    )}
                  >
                    <Icon className="h-7 w-7" />
                  </span>
                  {enabled ? (
                    <ExternalLinkIcon className="h-5 w-5 text-white/35 transition-colors duration-300 group-hover:text-golden" />
                  ) : (
                    <span className="rounded-pill border border-white/12 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/40">
                      Coming soon
                    </span>
                  )}
                </div>
                <h3
                  className={cx(
                    "relative mt-5 font-display text-xl uppercase tracking-wide",
                    enabled ? "text-white" : "text-white/55",
                  )}
                >
                  {item.label}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-white/60">{item.blurb}</p>
                <p className="relative mt-4 font-mono text-xs text-white/40">
                  {enabled ? link?.handle : "Official link not published yet"}
                </p>
              </>
            );

            return (
              <li
                key={item.key}
                className="reveal"
                style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
              >
                {enabled ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-full flex-col overflow-hidden rounded-card surface-card p-6 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-golden/50 hover:shadow-glow sm:p-7"
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    aria-disabled="true"
                    title={`Official ${item.label} link coming soon`}
                    className="group relative flex h-full cursor-not-allowed flex-col overflow-hidden rounded-card border border-white/10 bg-white/[0.02] p-6 sm:p-7"
                  >
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* ---------- extra channels + honesty note ---------- */}
        <div className="reveal mt-10 flex flex-col items-center gap-5 text-center">
          {extraLinks.length > 0 ? (
            <ul className="flex flex-wrap items-center justify-center gap-3">
              {extraLinks.map((link) => {
                const Icon = SOCIAL_ICONS[link.key];
                return (
                  <li key={link.key}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-pill border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/80 transition hover:border-golden/60 hover:text-golden"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <p className="flex max-w-2xl items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-white/40">
            <PawIcon className="h-4 w-4 text-bitcoin/70" />
            Official community links will be published on this website once available.
          </p>
          <p className="max-w-2xl text-xs leading-relaxed text-white/35">
            {siteConfig.brand.name} has no other official channels. Anyone contacting you first about a token, a
            giveaway or a "support desk" is not part of this project.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Community;
