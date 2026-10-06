"use client";

import { useEffect, useState } from "react";

type LcpEntry = PerformanceEntry & { url?: string };
type LayoutShiftEntry = PerformanceEntry & { value: number; hadRecentInput: boolean };

export type WebVitals = {
  lcp: { time: number; url: string } | null;
  cls: number;
};

/** Live Largest Contentful Paint and Cumulative Layout Shift for the current page. */
export function useWebVitals(): WebVitals {
  const [lcp, setLcp] = useState<WebVitals["lcp"]>(null);
  const [cls, setCls] = useState(0);

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;

    setLcp(null);
    setCls(0);

    const observers: PerformanceObserver[] = [];

    const observe = (type: string, onEntries: (entries: PerformanceEntry[]) => void) => {
      try {
        const observer = new PerformanceObserver((list) => onEntries(list.getEntries()));
        observer.observe({ type, buffered: true });
        observers.push(observer);
      } catch {
        // Entry type not supported in this browser (e.g. Safari for LCP).
      }
    };

    observe("largest-contentful-paint", (entries) => {
      const last = entries[entries.length - 1] as LcpEntry | undefined;
      if (last) setLcp({ time: last.startTime, url: last.url ?? "" });
    });

    observe("layout-shift", (entries) => {
      let added = 0;
      for (const entry of entries as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) added += entry.value;
      }
      if (added > 0) setCls((value) => value + added);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return { lcp, cls };
}
