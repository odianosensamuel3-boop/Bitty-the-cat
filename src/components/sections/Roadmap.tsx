import SectionHeading from "@/components/ui/SectionHeading";
import { CheckIcon, PawIcon, SparkIcon } from "@/components/ui/icons";
import { roadmapPhases, type RoadmapPhase } from "@/data/content";
import { cx } from "@/lib/utils";

const STATUS_META: Record<RoadmapPhase["status"], { label: string; badge: string; ring: string }> = {
  complete: {
    label: "Complete",
    badge: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    ring: "border-emerald-400/40",
  },
  active: {
    label: "In progress",
    badge: "border-golden/50 bg-golden/12 text-golden",
    ring: "border-golden/60",
  },
  upcoming: {
    label: "Upcoming",
    badge: "border-white/12 bg-white/[0.04] text-white/60",
    ring: "border-white/12",
  },
};

/** Roadmap: four configurable phases presented as goals, not guarantees. */
export function Roadmap() {
  return (
    <section id="roadmap" className="relative overflow-hidden py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_0%,#1E1104_0%,transparent_60%)]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Roadmap"
          title={
            <>
              THE ROAD TO THE <span className="text-gradient-orange">BITTY ERA</span>
            </>
          }
          description={
            <p>
              These are project goals — not promises. Roadmap items may change as the community grows. No listings,
              price targets or returns are guaranteed.
            </p>
          }
        />

        <ol className="relative mt-14 grid gap-6 lg:grid-cols-4">
          {/* connecting line on large screens */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-[3.15rem] hidden h-px bg-[linear-gradient(90deg,transparent,#F7931A66,#FFC92866,#F7931A66,transparent)] lg:block"
          />

          {roadmapPhases.map((phase, index) => {
            const meta = STATUS_META[phase.status];
            return (
              <li
                key={phase.phase}
                className="reveal group relative"
                style={{ "--reveal-delay": `${index * 100}ms` } as React.CSSProperties}
              >
                <div className="flex h-full flex-col rounded-card surface-card p-6 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-golden/50 hover:shadow-glow">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cx(
                        "inline-flex h-12 w-12 items-center justify-center rounded-2xl border bg-ink/80 font-display text-lg font-black",
                        meta.ring,
                        phase.status === "complete" ? "text-emerald-300" : "text-golden",
                      )}
                    >
                      {phase.status === "complete" ? <CheckIcon className="h-6 w-6" /> : String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cx(
                        "rounded-pill border px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em]",
                        meta.badge,
                      )}
                    >
                      {meta.label}
                    </span>
                  </div>

                  <p className="mt-5 font-mono text-[0.66rem] uppercase tracking-[0.26em] text-white/45">
                    {phase.phase}
                  </p>
                  <h3 className="mt-1 font-display text-xl uppercase leading-tight tracking-wide text-white sm:text-2xl">
                    {phase.title}
                  </h3>

                  <ul className="mt-4 space-y-2.5">
                    {phase.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/65">
                        <PawIcon
                          className={cx(
                            "mt-0.5 h-4 w-4 shrink-0 transition-colors duration-500",
                            phase.status === "upcoming" ? "text-white/25" : "text-golden",
                          )}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="reveal mt-10 flex items-center justify-center gap-2 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/40">
          <SparkIcon className="h-4 w-4 text-bitcoin/70" />
          Community first. Memes always. Promises never.
        </p>
      </div>
    </section>
  );
}

export default Roadmap;
