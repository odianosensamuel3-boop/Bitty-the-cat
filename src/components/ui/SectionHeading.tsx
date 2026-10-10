import type { ReactNode } from "react";
import { cx } from "@/lib/utils";
import { PawIcon } from "@/components/ui/icons";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cx(
        "reveal flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-pill border border-bitcoin/40 bg-bitcoin/10 px-4 py-1.5 font-mono text-[0.66rem] font-bold uppercase tracking-[0.3em] text-golden sm:text-xs">
          <PawIcon className="h-3.5 w-3.5" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="max-w-3xl font-display text-3xl leading-[1.05] sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? (
        <div
          className={cx(
            "max-w-2xl space-y-3 text-base leading-relaxed text-white/70 sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </div>
      ) : null}
    </div>
  );
}

export default SectionHeading;
