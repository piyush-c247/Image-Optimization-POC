"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { formatBytes, formatCls, formatSeconds } from "@/shared/lib/format";
import { useImageResources } from "../hooks/useImageResources";
import { useImageSizes } from "../hooks/useImageSizes";
import { useWebVitals } from "../hooks/useWebVitals";
import { rateCls, rateLcp, ratingStyles } from "../lib/ratings";
import { saveSnapshot } from "../lib/snapshots";
import type { Mode, Rating, Snapshot } from "../types";

const AUTO_CAPTURE_MS = 6000;

type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
  rating?: Rating;
};

function MetricCard({ label, value, hint, rating }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        {rating ? (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ratingStyles[rating].chip}`}>
            {ratingStyles[rating].label}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-slate-500">{hint}</p>
    </div>
  );
}

export function MetricsPanel({ mode, totalImages }: { mode: Mode; totalImages: number }) {
  const { lcp, cls } = useWebVitals();
  const resources = useImageResources();

  const unknownSize = useMemo(
    () => resources.filter((resource) => resource.bytes === 0).map((resource) => resource.url),
    [resources],
  );
  const lookedUp = useImageSizes(unknownSize);

  const bytes = resources.reduce((sum, resource) => sum + (resource.bytes || lookedUp[resource.url] || 0), 0);
  const requests = resources.length;

  const latest = useRef<Snapshot>({ lcp: null, cls: 0, requests: 0, bytes: 0, capturedAt: 0 });
  useEffect(() => {
    latest.current = { lcp: lcp?.time ?? null, cls, requests, bytes, capturedAt: Date.now() };
  });

  const capture = useCallback(() => {
    saveSnapshot(mode, { ...latest.current, capturedAt: Date.now() });
  }, [mode]);

  useEffect(() => {
    const timer = window.setTimeout(capture, AUTO_CAPTURE_MS);
    return () => window.clearTimeout(timer);
  }, [capture]);

  return (
    <section className="sticky top-14 z-20 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-3">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard
            label="LCP"
            value={lcp ? formatSeconds(lcp.time) : "…"}
            hint="Largest Contentful Paint (lower is better)"
            rating={lcp ? rateLcp(lcp.time) : undefined}
          />
          <MetricCard
            label="CLS"
            value={formatCls(cls)}
            hint="Layout shift score (lower is better)"
            rating={rateCls(cls)}
          />
          <MetricCard
            label="Images requested"
            value={`${requests} / ${totalImages}`}
            hint="Scroll and watch this number change"
          />
          <MetricCard label="Image download" value={formatBytes(bytes)} hint="Total size of images fetched so far" />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            Results are saved automatically {AUTO_CAPTURE_MS / 1000}s after the page loads. For a fair test,
            don&apos;t scroll until then.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={capture}
              className="rounded-md border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-slate-100"
            >
              Save result now
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md bg-slate-900 px-3 py-1 font-medium text-white hover:bg-slate-700"
            >
              Reload &amp; measure
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
