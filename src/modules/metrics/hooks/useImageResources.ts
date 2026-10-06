"use client";

import { useEffect, useState } from "react";
import type { ImageResource } from "../types";

function isPageImage(entry: PerformanceResourceTiming): boolean {
  const fromImgOrPreload = entry.initiatorType === "img" || entry.initiatorType === "link";
  const isPhoto = entry.name.includes("picsum.photos") || entry.name.includes("/_next/image");
  return fromImgOrPreload && isPhoto;
}

/** Every photo request the browser has made so far (grows live while you scroll). */
export function useImageResources(): ImageResource[] {
  const [resources, setResources] = useState<ImageResource[]>([]);

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;

    setResources([]);

    let observer: PerformanceObserver | undefined;
    try {
      observer = new PerformanceObserver((list) => {
        const found = (list.getEntries() as PerformanceResourceTiming[])
          .filter(isPageImage)
          .map((entry) => ({
            url: entry.name,
            bytes: entry.encodedBodySize || entry.transferSize || 0,
          }));

        if (found.length === 0) return;

        setResources((previous) => {
          const byUrl = new Map(previous.map((item) => [item.url, item]));
          for (const item of found) byUrl.set(item.url, item);
          return Array.from(byUrl.values());
        });
      });
      observer.observe({ type: "resource", buffered: true });
    } catch {
      // Resource timing not available.
    }

    return () => observer?.disconnect();
  }, []);

  return resources;
}
