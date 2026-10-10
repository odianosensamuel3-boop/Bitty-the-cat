import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { BitcoinIcon, ChartIcon, ShieldIcon, WalletIcon } from "@/components/ui/icons";
import { buySteps } from "@/data/content";
import { getBuyUrl, siteConfig } from "@/config/site.config";

const STEP_ICONS = {
  wallet: WalletIcon,
  spark: BitcoinIcon,
  shield: ShieldIcon,
} as const;

/** How to buy: three beginner-friendly steps + the official DEX call to action. */
export function HowToBuy() {
  const buyUrl = getBuyUrl();
  const { ticker } = siteConfig.brand;

  return (
    <section id="how-to-buy" className="relative overflow-hidden py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_10%,#241300_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-paw-pattern opacity-50" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How to Buy"
          title={
            <>
              THREE STEPS TO <span className="text-gradient-orange">GET BITTY</span>
            </>
          }
          description={
            <p>
              New to crypto? Here is the short version. Take your time, double-check every link, and never share your
              seed phrase with anyone.
            </p>
          }
        />

        <ol className="mt-12 grid gap-5 lg:grid-cols-3">
          {buySteps.map((step, index) => {
            const Icon = STEP_ICONS[step.icon];
            return (
              <li
                key={step.step}
                className="reveal group relative flex flex-col rounded-card surface-card p-6 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-golden/50 hover:shadow-glow sm:p-7"
                style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-bitcoin/40 bg-ink/70 text-golden transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="font-display text-4xl font-black text-white/10 transition-colors duration-500 group-hover:text-bitcoin/30">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl uppercase tracking-wide text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">{step.description}</p>
                {index < buySteps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-bitcoin/40 bg-ink text-xs text-golden lg:flex"
                  >
                    →
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>

        {/* ---------- call to action + risk notice ---------- */}
        <div className="reveal mt-12 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-card border border-bitcoin/30 bg-[linear-gradient(130deg,#26150A,#140D06)] p-7 sm:p-9">
            <div aria-hidden="true" className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-orange/25 blur-[90px]" />
            <h3 className="relative font-display text-2xl uppercase leading-tight text-white sm:text-3xl">
              Ready for some <span className="text-gradient-orange">Bitcoin energy?</span>
            </h3>
            <p className="relative mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              {buyUrl
                ? "The official swap link is live. Always confirm the contract address shown in your wallet before you confirm a trade."
                : "The official exchange link will appear here — and on our official channels — as soon as it is live. Until then, never buy from a link you cannot verify."}
            </p>
            <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              {buyUrl ? (
                <Button href={buyUrl} external size="lg" icon={<BitcoinIcon className="h-5 w-5" />}>
                  Buy {ticker}
                </Button>
              ) : (
                <span
                  role="link"
                  aria-disabled="true"
                  title="The official exchange link has not been published yet"
                  className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-pill border-2 border-bitcoin/40 bg-ink/50 px-7 py-4 font-display text-base font-black uppercase tracking-wide text-white/45 sm:text-lg"
                >
                  <BitcoinIcon className="h-5 w-5" />
                  Buy {ticker} — coming soon
                </span>
              )}
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                <ChartIcon className="h-4 w-4 text-bitcoin/80" />
                Official links only
              </span>
            </div>
          </div>

          <div className="rounded-card border border-white/10 bg-white/[0.03] p-7 sm:p-8">
            <h3 className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-white">
              <ShieldIcon className="h-5 w-5 text-golden" />
              Risk disclaimer
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/65">{siteConfig.legal.riskNotice}</p>
            <p className="mt-4 text-xs leading-relaxed text-white/45">
              Nothing on this website is financial advice. Always do your own research and verify official contract
              information before transacting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowToBuy;
