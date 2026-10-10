import Link from "next/link";
import { CopyContract } from "@/components/ui/CopyContract";
import SectionHeading from "@/components/ui/SectionHeading";
import { BitcoinIcon, ChartIcon, ExternalLinkIcon, PawIcon, ShieldIcon, WalletIcon } from "@/components/ui/icons";
import {
  COMING_SOON,
  NOT_AVAILABLE,
  displayValue,
  formatTotalSupply,
  getContractAddress,
  getExplorerUrl,
  hasContractAddress,
  siteConfig,
  truncateAddress,
} from "@/config/site.config";

type Row = {
  label: string;
  value: string;
  pending: boolean;
  mono?: boolean;
  wide?: boolean;
  icon: "bitcoin" | "paw" | "wallet" | "chart" | "shield";
};

const ROW_ICONS = {
  bitcoin: BitcoinIcon,
  paw: PawIcon,
  wallet: WalletIcon,
  chart: ChartIcon,
  shield: ShieldIcon,
} as const;

/**
 * Token information dashboard.
 * Every unverified field renders a "Coming soon" / "Not yet available" state
 * instead of invented data — update src/config/site.config.ts to publish it.
 */
export function TokenInfo() {
  const address = getContractAddress();
  const explorer = getExplorerUrl();
  const network = displayValue(siteConfig.token.blockchain, COMING_SOON);
  const supply = formatTotalSupply();

  const rows: Row[] = [
    {
      label: "Token Name",
      value: siteConfig.brand.name,
      pending: false,
      icon: "paw",
    },
    {
      label: "Ticker",
      value: siteConfig.brand.ticker,
      pending: false,
      icon: "bitcoin",
    },
    {
      label: "Network",
      value: network,
      pending: !siteConfig.token.blockchain,
      icon: "wallet",
    },
    {
      label: "Contract Address",
      value: address ? truncateAddress(address, 10, 8) : NOT_AVAILABLE,
      pending: !hasContractAddress,
      mono: true,
      wide: true,
      icon: "shield",
    },
    {
      label: "Total Supply",
      value: supply,
      pending: supply === NOT_AVAILABLE,
      icon: "chart",
      wide: true,
    },
    {
      label: "Liquidity Information",
      value: "Published once liquidity is live",
      pending: true,
      icon: "chart",
    },
  ];

  return (
    <section id="token-info" className="relative overflow-hidden py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_15%_0%,#1E1104_0%,transparent_60%)]" />
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-bitcoin/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Token Information"
          title={
            <>
              THE <span className="text-gradient-orange">$BTC</span> DASHBOARD
            </>
          }
          description={
            <p>
              Everything official about the token lives here. Fields marked{" "}
              <span className="font-semibold text-golden">coming soon</span> will be published as soon as the details
              are verified — never guessed.
            </p>
          }
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          {/* ---------- details table ---------- */}
          <div className="reveal rounded-card surface-card p-2 sm:p-3">
            <dl className="divide-y divide-white/6">
              {rows.map((row) => {
                const Icon = ROW_ICONS[row.icon];
                return (
                  <div
                    key={row.label}
                    className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
                  >
                    <dt className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/50">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-bitcoin/30 bg-ink/60 text-golden">
                        <Icon className="h-4 w-4" />
                      </span>
                      {row.label}
                    </dt>
                    <dd
                      className={`text-base font-bold sm:text-right ${
                        row.pending
                          ? "text-white/40"
                          : row.mono
                            ? "font-mono text-golden"
                            : "text-white"
                      }`}
                    >
                      {row.value}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row sm:px-5">
              <CopyContract variant="row" className="sm:flex-1" />
              {explorer ? (
                <a
                  href={explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-pill border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:border-golden/60 hover:text-golden"
                >
                  <ExternalLinkIcon className="h-4 w-4" />
                  View on explorer
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  title="Official explorer link coming soon"
                  className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-pill border border-white/10 bg-white/[0.02] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white/40"
                >
                  <ExternalLinkIcon className="h-4 w-4" />
                  Explorer coming soon
                </span>
              )}
            </div>
          </div>

          {/* ---------- verification sidebar ---------- */}
          <aside className="reveal flex flex-col gap-4" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <div className="rounded-card surface-card p-6">
              <h3 className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-white">
                <ShieldIcon className="h-5 w-5 text-golden" />
                Verify before you buy
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/65">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-golden" />
                  Always confirm the contract address through official Bitty channels.
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-golden" />
                  Treat any other token using the Bitty name as unofficial.
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-golden" />
                  This site never publishes market cap, price or liquidity figures that we cannot verify.
                </li>
              </ul>
              <Link
                href="#how-to-buy"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-golden transition hover:text-white"
              >
                See how to buy
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="rounded-card border border-golden/25 bg-golden/[0.06] p-6">
              <p className="text-sm leading-relaxed text-golden/90">
                <span className="font-display uppercase tracking-wide">Roadmap note:</span> token details are published
                only when they are final and independently checkable. No fake statistics, ever.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default TokenInfo;
