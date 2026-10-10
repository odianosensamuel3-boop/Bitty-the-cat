import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function PawIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="12" cy="15.4" rx="4.6" ry="3.9" fill="currentColor" stroke="none" />
      <ellipse cx="5.9" cy="10.2" rx="2.1" ry="2.7" fill="currentColor" stroke="none" />
      <ellipse cx="9.7" cy="7.4" rx="2.1" ry="2.8" fill="currentColor" stroke="none" />
      <ellipse cx="14.3" cy="7.4" rx="2.1" ry="2.8" fill="currentColor" stroke="none" />
      <ellipse cx="18.1" cy="10.2" rx="2.1" ry="2.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BitcoinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden focusable="false" {...props}>
      <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.14" />
      <path
        d="M9.4 5.6v2M12.8 5.6v2M9.4 16.4v2M12.8 16.4v2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7.6 7.6h5.6c1.6 0 2.8 1 2.8 2.5 0 1.2-.7 2-1.8 2.3 1.4.3 2.3 1.2 2.3 2.6 0 1.7-1.3 2.8-3.2 2.8H7.6Zm3 2v3.1h2.1c.9 0 1.5-.6 1.5-1.5s-.6-1.6-1.5-1.6Zm0 5v3.3h2.4c1 0 1.7-.7 1.7-1.7s-.7-1.6-1.7-1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H6.5A2.5 2.5 0 0 0 4 5.5v6A2.5 2.5 0 0 0 6.5 14" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 6.5 9.6 17 4 11.4" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 4h6v6" />
      <path d="M20 4 10.5 13.5" />
      <path d="M18 14.5V18a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 18V8.5A2.5 2.5 0 0 1 6 6h3.5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M3 10.5h18" />
      <circle cx="16.5" cy="14.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4Z" />
      <path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z" />
    </svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 19.5h16" />
      <path d="M7 19.5V13M11.6 19.5V8.5M16.2 19.5v-4M20 19.5V5.5" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 19 6v6c0 4-3 7.2-7 8.5-4-1.3-7-4.5-7-8.5V6Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9.5" cy="8.5" r="3.6" />
      <path d="M3.5 19.5a6 6 0 0 1 12 0" />
      <path d="M16.5 6.2a3.3 3.3 0 0 1 0 6.4" />
      <path d="M18 19.5a5.6 5.6 0 0 0-2.2-4.4" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...props}>
      <path d="M17.53 3h3.02l-6.6 7.54L21.75 21h-5.9l-4.62-6.04L5.9 21H2.87l7.06-8.07L2.5 3h6.05l4.18 5.53Zm-1.06 16.2h1.67L7.6 4.71H5.81Z" />
    </svg>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...props}>
      <path d="M21.6 4.3 18.4 19c-.2 1-.9 1.3-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-1 .5l.4-4.8 8.4-7.6c.4-.3-.1-.5-.6-.2L6.6 12.9l-4.4-1.4c-.9-.3-.9-.9.2-1.3l17-6.6c.8-.3 1.5.2 1.2 1.2Z" />
    </svg>
  );
}

export function DiscordIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...props}>
      <path d="M19.3 5.6a16.2 16.2 0 0 0-4-1.3l-.3.6a12 12 0 0 1 3.5 1.7 13.7 13.7 0 0 0-11-.5l-.4.1a12.6 12.6 0 0 1 3.4-1.3l-.3-.6c-1.4.2-2.8.6-4.1 1.3A19 19 0 0 0 2.6 18a16 16 0 0 0 4.9 2.5l.6-1a10.6 10.6 0 0 1-1.8-.9l.4-.3a11.6 11.6 0 0 0 10.6 0l.4.3c-.6.4-1.2.7-1.9.9l.6 1A16 16 0 0 0 21.4 18a19 19 0 0 0-2.1-12.4ZM9.1 15.3c-.9 0-1.7-.9-1.7-2s.7-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2Zm5.8 0c-.9 0-1.7-.9-1.7-2s.7-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TiktokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...props}>
      <path d="M16.6 2h-3v13.1a2.6 2.6 0 1 1-2.1-2.6V9.4a5.9 5.9 0 1 0 5.1 5.8V8.6a6.4 6.4 0 0 0 3.9 1.3V6.6a3.5 3.5 0 0 1-3.9-3.4Z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...props}>
      <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15.2V8.8L15.5 12Z" />
    </svg>
  );
}

export const SOCIAL_ICONS = {
  x: XIcon,
  telegram: TelegramIcon,
  discord: DiscordIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  youtube: YoutubeIcon,
} as const;
