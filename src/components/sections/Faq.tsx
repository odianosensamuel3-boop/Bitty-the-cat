"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { faqItems } from "@/data/content";
import { cx } from "@/lib/utils";

/** Accessible accordion FAQ. One panel open at a time, keyboard friendly. */
export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px hairline" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-orange/10 blur-[130px]" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              QUESTIONS? <span className="text-gradient-orange">WE'VE GOT ANSWERS.</span>
            </>
          }
        />

        <ul className="mt-12 space-y-3">
          {faqItems.map((item, index) => {
            const open = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <li
                key={item.question}
                className="reveal overflow-hidden rounded-card surface-card"
                style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className={cx(
                      "flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors duration-300 sm:px-6",
                      open ? "text-golden" : "text-white hover:text-golden",
                    )}
                  >
                    <span className="font-display text-base uppercase leading-snug tracking-wide sm:text-lg">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cx(
                        "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                        open
                          ? "rotate-45 border-golden/70 bg-golden/15 text-golden"
                          : "border-white/15 bg-white/[0.04] text-white/70",
                      )}
                    >
                      <span className="absolute h-0.5 w-4 rounded-full bg-current" />
                      <span className="absolute h-4 w-0.5 rounded-full bg-current" />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!open}
                  className="px-5 pb-5 text-sm leading-relaxed text-white/70 sm:px-6 sm:pb-6 sm:text-base"
                >
                  {item.answer}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="reveal mt-8 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/40">
          Still unsure? Reach out through the official community channels only.
        </p>
      </div>
    </section>
  );
}

export default Faq;
