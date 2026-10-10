"use client";

import { useCallback, useState } from "react";
import { CopyIcon, CheckIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";
import { copyText, cx } from "@/lib/utils";
import { getContractAddress, truncateAddress } from "@/config/site.config";

type CopyContractProps = {
  className?: string;
  /** Compact pill used in the hero; full-width row used in the token panel. */
  variant?: "pill" | "row";
  label?: string;
};

/**
 * Contract-address copier.
 * While no official address is configured the control renders disabled with a
 * "Coming soon" label, so it can never copy an unverified value.
 */
export function CopyContract({ className, variant = "pill", label = "Copy contract address" }: CopyContractProps) {
  const address = getContractAddress();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    if (!address) return;
    const ok = await copyText(address);
    if (ok) {
      setCopied(true);
      toast("Contract address copied to clipboard", "success");
      window.setTimeout(() => setCopied(false), 2200);
    } else {
      toast("Couldn't copy automatically — please copy it manually.", "warning");
    }
  }, [address, toast]);

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={onCopy}
        disabled={!address}
        aria-label={address ? `${label}: ${address}` : "Contract address not yet available"}
        title={address ? "Copy contract address" : "The official contract address has not been published yet"}
        className={cx(
          "inline-flex w-full items-center justify-center gap-2 rounded-pill border px-5 py-3 text-sm font-bold uppercase tracking-wide transition",
          address
            ? "border-bitcoin/60 bg-bitcoin/10 text-golden hover:border-golden hover:bg-bitcoin/20"
            : "cursor-not-allowed border-white/10 bg-white/[0.03] text-white/40",
          className,
        )}
      >
        {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
        {address ? (copied ? "Copied!" : label) : "Contract coming soon"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={!address}
      aria-label={address ? `${label}: ${address}` : "Contract address not yet available"}
      title={address ? "Copy contract address" : "The official contract address has not been published yet"}
      className={cx(
        "inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-xs font-bold uppercase tracking-wider transition sm:text-sm",
        address
          ? "border-bitcoin/50 bg-ink/60 text-golden hover:-translate-y-0.5 hover:border-golden hover:bg-bitcoin/15"
          : "cursor-not-allowed border-white/10 bg-white/[0.03] text-white/40",
        className,
      )}
    >
      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
      <span className="font-mono tracking-normal">
        {address ? (copied ? "Copied!" : truncateAddress(address, 8, 6)) : "Contract: coming soon"}
      </span>
    </button>
  );
}

export default CopyContract;
