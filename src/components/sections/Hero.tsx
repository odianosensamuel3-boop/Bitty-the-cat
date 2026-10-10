import Button from "@/components/ui/Button";
import { CopyContract } from "@/components/ui/CopyContract";
import { MascotImage } from "@/components/ui/MascotImage";
import { BitcoinIcon, ExternalLinkIcon, PawIcon, SparkIcon } from "@/components/ui/icons";
import { getBuyUrl, siteConfig } from "@/config/site.config";

const TRUST_POINTS = ["Community-driven", "Meme-powered", "One iconic cat"];

/** Above-the-fold hero: mascot + name + ticker + primary actions. */
export function Hero() {
  const buyUrl = getBuyUrl();
  const { ticker } = siteConfig.brand;

  return (
    <section id="home" className="relative isolate overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-28 lg:pt-36">
      {/* ---------- ambient background ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#2A1300_0%,#161616_45%,#101010_100%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
        <div className="absolute inset-x-0 top-0 h-[420px] bg-paw-pattern opacity-70" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-bitcoin/20 blur-[110px]" />
        <div className="absolute -right-16 top-10 h-80 w-80 rounded-full bg-orange/25 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>

      {/* ---------- floating brand confetti ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden sm:block">
        <PawIcon className="animate-float absolute left-[6%] top-[24%] h-9 w-9 text-bitcoin/25" />
        <PawIcon className="animate-float-slow absolute right-[9%] top-[62%] h-7 w-7 text-golden/25" />
        <PawIcon className="animate-float absolute bottom-[14%] left-[16%] h-6 w-6 text-orange/25" />
        <BitcoinIcon className="animate-float-slow absolute right-[16%] top-[16%] h-10 w-10 text-golden/30" />
        <SparkIcon className="animate-float absolute left-[42%] top-[10%] h-7 w-7 text-bitcoin/30" />
        <SparkIcon className="animate-float-slow absolute bottom-[18%] right-[34%] h-6 w-6 text-golden/25" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8">
        {/* ================= copy ================= */}
        <div className="reveal order-1 flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-pill border border-bitcoin/50 bg-bitcoin/12 px-4 py-1.5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.3em] text-golden sm:text-xs">
            <PawIcon className="h-3.5 w-3.5" />
            Meme coin · {ticker}
          </span>

          <h1 className="mt-6 font-display text-[2.6rem] leading-[0.95] tracking-tight sm:text-6xl lg:text-[4.4rem] xl:text-[5rem]">
            <span className="block text-gradient-white">MEET</span>
            <span className="block text-gradient-orange drop-shadow-[0_0_45px_rgba(255,107,0,0.35)]">
              BITTY THE CAT
            </span>
          </h1>

          <p className="mt-4 font-display text-lg uppercase tracking-[0.16em] text-white/90 sm:text-xl lg:text-2xl">
            The Cat With <span className="text-golden">Bitcoin Energy.</span>
          </p>

          <div className="mt-6 max-w-xl space-y-3 text-base leading-relaxed text-white/70 sm:text-lg">
            <p className="font-semibold text-white/90">Orange fur. Big dreams. Unlimited memes.</p>
            <p>
              Meet Bitty the Cat ({ticker}), the feline bringing a fresh dose of cat energy to crypto culture.
            </p>
            <p>Join the community, share the memes, and become part of the Bitty era.</p>
          </div>

          {/* ---------- actions ---------- */}
          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            {buyUrl ? (
              <Button href={buyUrl} external size="lg" icon={<BitcoinIcon className="h-5 w-5" />}>
                Buy {ticker}
              </Button>
            ) : (
              <Button href="#how-to-buy" size="lg" icon={<BitcoinIcon className="h-5 w-5" />}>
                Buy {ticker}
              </Button>
            )}
            <Button href="#community" variant="secondary" size="lg" icon={<PawIcon className="h-5 w-5" />}>
              Join the Community
            </Button>
          </div>

          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row lg:items-center">
            <CopyContract />
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/45">
              <ExternalLinkIcon className="h-3.5 w-3.5" />
              Official links are published here as soon as they are verified.
            </span>
          </div>

          {/* ---------- trust strip ---------- */}
          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-golden" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* ================= mascot ================= */}
        <div className="reveal relative order-2 mx-auto w-full max-w-[26rem] lg:max-w-none" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          {/* podium */}
          <div className="relative aspect-square">
            <div
              aria-hidden="true"
              className="animate-pulse-glow absolute inset-[6%] rounded-full bg-glow-radial blur-2xl"
            />
            <div
              aria-hidden="true"
              className="absolute inset-[3%] rounded-full border border-bitcoin/25"
            />
            <div
              aria-hidden="true"
              className="animate-spin-slow absolute inset-[8%] rounded-full border border-dashed border-golden/20"
            />
            <div className="animate-float relative z-10 h-full w-full">
              <MascotImage
                variant="circle"
                size={640}
                priority
                fetchPriority="high"
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 60vw, 44vw"
                className="drop-shadow-[0_40px_70px_rgba(0,0,0,0.7)]"
              />
            </div>

            {/* floating chips, kept clear of the badge itself */}
            <span className="animate-float-slow absolute -left-1 -top-3 z-20 rounded-2xl border border-bitcoin/40 bg-ink/90 px-3 py-2 text-left backdrop-blur sm:left-0">
              <span className="block font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/50">Ticker</span>
              <span className="block font-display text-lg font-black text-golden">{ticker}</span>
            </span>
            <span className="animate-float absolute -bottom-4 right-0 z-20 rounded-2xl border border-golden/40 bg-ink/90 px-3 py-2 text-left backdrop-blur sm:right-2">
              <span className="block font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/50">Energy</span>
              <span className="block font-display text-lg font-black text-bitcoin">₿ 100%</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
