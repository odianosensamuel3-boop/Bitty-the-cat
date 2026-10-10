import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Optional leading glyph (emoji or inline svg). */
  icon?: ReactNode;
  /** Renders full width on small screens. */
  block?: boolean;
};

type ButtonAsLink = BaseProps & {
  href: string;
  external?: boolean;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
};

type ButtonAsButton = BaseProps & {
  href?: undefined;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
  title?: string;
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(120deg,#FFC928_0%,#F7931A_45%,#FF6B00_100%)] text-ink shadow-[0_18px_40px_-18px_rgba(255,107,0,0.85)] hover:shadow-[0_22px_60px_-16px_rgba(255,107,0,0.95)]",
  secondary:
    "border-2 border-bitcoin/70 bg-ink/40 text-golden hover:border-golden hover:bg-bitcoin/15 hover:text-white",
  ghost: "border border-white/15 bg-white/[0.04] text-white hover:border-bitcoin/60 hover:bg-white/[0.08]",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-4 text-base sm:text-lg",
};

function classes({ variant = "primary", size = "md", block, className, disabled }: BaseProps & { disabled?: boolean }) {
  return cx(
    "group relative inline-flex items-center justify-center gap-2 rounded-pill font-display font-black uppercase tracking-wide",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
    "focus-visible:outline-3 focus-visible:outline-golden focus-visible:outline-offset-3",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    !disabled && "hover:-translate-y-0.5 active:translate-y-0",
    disabled && "cursor-not-allowed opacity-45 saturate-50 hover:translate-y-0",
    block && "w-full sm:w-auto",
    className,
  );
}

/**
 * Shared button. Renders an <a> for real (validated) destinations, and a
 * disabled <button> with an explanatory tooltip when a link is not configured —
 * so the UI never shows a button that looks functional but goes nowhere.
 */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { children, icon, block } = props;

  if (props.href !== undefined) {
    const { href, external, disabled, variant, size, className, title, ariaLabel } = props;
    const content = (
      <>
        {icon}
        <span>{children}</span>
      </>
    );

    if (disabled) {
      return (
        <span
          role="link"
          aria-disabled="true"
          aria-label={ariaLabel}
          title={title ?? "Official link coming soon"}
          tabIndex={0}
          className={classes({ children, variant, size, block, className, disabled: true })}
        >
          {content}
        </span>
      );
    }

    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={title}
          aria-label={ariaLabel}
          className={classes({ children, variant, size, block, className })}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} title={title} aria-label={ariaLabel} className={classes({ children, variant, size, block, className })}>
        {content}
      </Link>
    );
  }

  const { onClick, disabled, type = "button", ariaLabel, title, variant, size, className } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      className={classes({ children, variant, size, block, className, disabled })}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

export default Button;
