"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type ToastTone = "success" | "info" | "warning";

export type Toast = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  toast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_STYLES: Record<ToastTone, string> = {
  success: "border-golden/60 text-white",
  info: "border-white/25 text-white",
  warning: "border-bitcoin/70 text-golden",
};

const TONE_ICON: Record<ToastTone, string> = {
  success: "🐾",
  info: "₿",
  warning: "!",
};

/**
 * Lightweight toast system (no dependencies).
 * Wrap the app once and call `useToast().toast("...")` anywhere below.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (message: string, tone: ToastTone = "success") => {
      const id = ++idRef.current;
      setToasts((current) => [...current.slice(-2), { id, message, tone }]);
      const timer = setTimeout(() => dismiss(id), 3200);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((timer) => clearTimeout(timer));
      map.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`animate-pop pointer-events-auto flex max-w-[92vw] items-center gap-3 rounded-pill border bg-charcoal/95 px-5 py-3 text-sm font-semibold shadow-[0_20px_50px_-20px_rgba(0,0,0,0.95)] backdrop-blur sm:max-w-md ${TONE_STYLES[t.tone]}`}
          >
            <span aria-hidden="true" className="text-base leading-none">
              {TONE_ICON[t.tone]}
            </span>
            <span className="leading-snug">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="ml-1 rounded-full px-2 py-0.5 text-xs text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fail soft: a missing provider should never crash a page render.
    return { toast: () => undefined };
  }
  return ctx;
}
