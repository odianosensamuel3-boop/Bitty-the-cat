import { MascotImage } from "@/components/ui/MascotImage";
import SectionHeading from "@/components/ui/SectionHeading";
import { BitcoinIcon, PawIcon, SparkIcon, UsersIcon } from "@/components/ui/icons";
import { aboutCards, aboutIntro } from "@/data/content";
import siteConfig from "@/config/site.config";

const CARD_ICONS = {
  cat: PawIcon,
  users: UsersIcon,
  meme: SparkIcon,
} as const;

/** About section: the story, plus three brand pillars. */
export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 hairline" />
        <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-orange/10 blur-[120px]" />
        <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-bitcoin/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* ---------- mascot panel ---------- */}
          <div className="reveal relative mx-auto w-full max-w-md">
            <div className="surface-card relative overflow-hidden rounded-card p-5">
              <div aria-hidden="true" className="absolute inset-x-0 -top-16 h-40 bg-glow-radial blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.15rem] border border-bitcoin/20">
                <MascotImage size={768} sizes="(max-width: 1024px) 80vw, 34vw" />
              </div>
              <dl className="relative mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                  <dt className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/45">Ticker</dt>
                  <dd className="font-display text-lg font-black text-golden">{siteConfig.brand.ticker}</dd>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                  <dt className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/45">Species</dt>
                  <dd className="font-display text-lg font-black text-white">Very good cat</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* ---------- copy ---------- */}
          <div>
            <SectionHeading
              align="left"
              eyebrow="About Bitty"
              title={
                <>
                  ONE CAT. ONE COMMUNITY.
                  <span className="block text-gradient-orange">ENDLESS MEMES.</span>
                </>
              }
            />
            <div className="reveal mt-6 space-y-4 text-base leading-relaxed text-white/70 sm:text-lg">
              {aboutIntro.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index >= 2 ? "font-display text-lg uppercase tracking-wide text-white/90 sm:text-xl" : undefined
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- pillars ---------- */}
        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {aboutCards.map((card, index) => {
            const Icon = CARD_ICONS[card.icon];
            return (
              <li
                key={card.title}
                className="reveal group relative overflow-hidden rounded-card surface-card p-6 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-golden/50 hover:shadow-glow sm:p-7"
                style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-bitcoin/40 bg-ink/70 text-golden transition-transform duration-500 group-hover:scale-110 group-hover:border-golden">
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="font-mono text-xs font-bold tracking-[0.3em] text-white/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="relative mt-5 font-display text-xl uppercase tracking-wide text-white sm:text-2xl">
                  {card.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-white/65 sm:text-base">{card.description}</p>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,#FFC928,#FF6B00,transparent)] transition-transform duration-500 group-hover:scale-x-100"
                />
              </li>
            );
          })}
        </ul>

        <p className="reveal mt-10 flex items-center justify-center gap-2 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/40">
          <BitcoinIcon className="h-4 w-4 text-bitcoin/70" />
          No promises. No fake numbers. Just memes and a cat.
        </p>
      </div>
    </section>
  );
}

export default About;
