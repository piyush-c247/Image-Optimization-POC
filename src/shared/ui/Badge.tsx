import type { ReactNode } from "react";

const tones = {
  neutral: "bg-slate-100 text-slate-700",
  bad: "bg-rose-100 text-rose-700",
  good: "bg-emerald-100 text-emerald-700",
  warn: "bg-amber-100 text-amber-800",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
