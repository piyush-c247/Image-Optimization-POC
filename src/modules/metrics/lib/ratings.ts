import type { Rating } from "../types";

/** Thresholds from https://web.dev/articles/vitals */
export function rateLcp(ms: number): Rating {
  if (ms <= 2500) return "good";
  if (ms <= 4000) return "needs-improvement";
  return "poor";
}

export function rateCls(value: number): Rating {
  if (value <= 0.1) return "good";
  if (value <= 0.25) return "needs-improvement";
  return "poor";
}

export const ratingStyles: Record<Rating, { chip: string; label: string }> = {
  good: { chip: "bg-emerald-100 text-emerald-700", label: "Good" },
  "needs-improvement": { chip: "bg-amber-100 text-amber-800", label: "Needs work" },
  poor: { chip: "bg-rose-100 text-rose-700", label: "Poor" },
};
