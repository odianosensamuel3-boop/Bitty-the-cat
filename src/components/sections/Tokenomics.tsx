import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { BitcoinIcon, ChartIcon, ShieldIcon } from "@/components/ui/icons";
import {
  allocationAmount,
  displayValue,
  formatTotalSupply,
  isTokenomicsReady,
  NOT_AVAILABLE,
  siteConfig,
} from "@/config/site.config";

/** Slice colours, in order. Keeps the donut on-brand and easy to read. */
const SLICE_COLORS = ["#FF6B00", "#F7931A", "#FFC928", "#FF9E4A", "#8A5A2B", "#5C3A1A"];

const RADIUS = 68;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Tokenomics.
 * The donut only renders when `tokenomics.finalized` is true AND the
 * allocation percentages add up to 100 — see `isTokenomicsReady()`.
 */
export function Tokenomics() {
  const allocations = siteConfig.tokenomics.allocations;
  const ready = isTokenomicsReady();
  const supply = formatTotalSupply();

  let offset = 0;
  const segments = allocations.map((allocation, index) => {
    const percent = allocation.percent ?? 0;
    const length = (percent / 100) * CIRCUMFERENCE;
    const segment = {
      ...allocation,
      percent,
      length,
      offset,
      color: SLICE_COLORS[index % SLICE_COLORS.length],
    };
    offset += length;
    return segment;
  });

  return (
    <section id="tokenomics" className="relative overflow-hidden py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(85%_65%_at_20%_10%,#1D1004_0%,transparent_60%)]" />
        <div className="absolute left-1/4 bottom-0 h-72 w-72 rounded-full bg-bitcoin/10 blur-[130px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tokenomics"
          title={
            <>
              BITTY <span className="text-gradient-orange">TOKENOMICS</span>
            </>
          }
          description={
            <p>
              {ready
                ? "The verified allocation of the total supply is shown below."
                : "Official tokenomics will be published here as soon as the split is finalized and verifiable."}
            </p>
          }
        />

        {ready ? (
          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            {/* ---------- donut ---------- */}
            <div className="reveal relative mx-auto w-full max-w-sm">
              <svg viewBox="0 0 200 200" className="h-auto w-full -rotate-90" role="img" aria-label="Token allocation chart">
                <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="24" />
                {segments.map((segment) => (
                  <circle
                    key={segment.key}
                    cx="100"
                    cy="100"
                    r={RADIUS}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="24"
                    strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
                    strokeDashoffset={-segment.offset}
                    strokeLinecap="butt"
                  />
                ))}
              </svg>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">Total supply</span>
                <span className="mt-1 font-display text-2xl font-black text-white sm:text-3xl">
                  {supply === NOT_AVAILABLE ? NOT_AVAILABLE : siteConfig.token.totalSupply}
                </span>
                <span className="font-mono text-xs text-golden">{siteConfig.token.totalSupplyUnit}</span>
              </div>
            </div>

            {/* ---------- legend ---------- */}
            <ul className="space-y-3">
              {segments.map((segment, index) => (
                <li
                  key={segment.key}
                  className="reveal flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4"
                  style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span>
                      <span className="block font-display text-sm uppercase tracking-wide text-white">
                        {segment.label}
                      </span>
                      <span className="block text-xs text-white/50">{segment.description}</span>
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block font-display text-lg font-black text-golden">{segment.percent}%</span>
                    {allocationAmount(segment.percent) ? (
                      <span className="block font-mono text-[0.7rem] text-white/45">
                        {allocationAmount(segment.percent)}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          /* ---------- pending state ---------- */
          <div className="reveal mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden rounded-card surface-card p-8 sm:p-10">
              <div aria-hidden="true" className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-orange/20 blur-[100px]" />
              <span className="inline-flex items-center gap-2 rounded-pill border border-golden/40 bg-golden/10 px-4 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-golden">
                <ChartIcon className="h-3.5 w-3.5" />
                Awaiting verified data
              </span>
              <h3 className="relative mt-5 font-display text-2xl uppercase leading-tight text-white sm:text-3xl">
                Official tokenomics will be published here.
              </h3>
              <p className="relative mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                We do not display allocation percentages, supply figures or liquidity claims until they are final and
                independently verifiable. The chart below activates automatically the moment the real numbers are added
                to the project configuration.
              </p>
              <ul className="relative mt-6 grid gap-3 sm:grid-cols-2">
                {allocations.map((allocation, index) => (
                  <li
                    key={allocation.key}
                    className="flex items-center gap-3 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-4 py-3"
                  >
                    <span
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 rounded-full"
                      style={{ backgroundColor: SLICE_COLORS[index % SLICE_COLORS.length] }}
                    />
                    <span className="flex-1 text-sm font-semibold text-white/70">{allocation.label}</span>
                    <span className="font-mono text-xs text-white/40">TBA</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="reveal flex flex-col gap-4" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
              <div className="rounded-card surface-card p-6 sm:p-7">
                <h3 className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-white">
                  <BitcoinIcon className="h-5 w-5 text-golden" />
                  What we will publish
                </h3>
                <dl className="mt-4 space-y-3 text-sm">
                  {[
                    ["Total Supply", "Verified on-chain supply"],
                    ["Liquidity", "How much is paired for trading"],
                    ["Community", "Rewards and community initiatives"],
                    ["Marketing", "Memes, content and promotion"],
                    ["Team", "Long-term development allocation"],
                  ].map(([label, hint]) => (
                    <div key={label} className="flex items-start justify-between gap-4 border-b border-white/6 pb-3 last:border-0 last:pb-0">
                      <dt className="font-semibold uppercase tracking-wide text-white/70">{label}</dt>
                      <dd className="text-right text-xs text-white/45">{hint}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-card border border-golden/25 bg-golden/[0.06] p-6">
                <p className="flex gap-3 text-sm leading-relaxed text-golden/90">
                  <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>
                    No claim of locked liquidity, renounced ownership or third-party audits is made on this website
                    unless it is independently verifiable.
                  </span>
                </p>
              </div>

              <Link
                href="#faq"
                className="inline-flex items-center gap-2 px-1 text-sm font-bold uppercase tracking-wide text-white/60 transition hover:text-golden"
              >
                Read the FAQ
                <span aria-hidden="true">→</span>
              </Link>
            </aside>
          </div>
        )}

        <p className="reveal mt-10 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/40">
          Supply: <span className="text-white/60">{displayValue(supply, "to be announced")}</span>
        </p>
      </div>
    </section>
  );
}

export default Tokenomics;
