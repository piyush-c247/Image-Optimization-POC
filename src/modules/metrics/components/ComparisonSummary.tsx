"use client";

import { useEffect, useState } from "react";
import { formatBytes, formatCls, formatSeconds } from "@/shared/lib/format";
import { SectionHeading } from "@/shared/ui/SectionHeading";
import { clearSnapshots, percentDrop, readSnapshot, SNAPSHOT_EVENT } from "../lib/snapshots";
import type { Snapshot } from "../types";

type Row = {
  label: string;
  before: string;
  after: string;
  change: number | null;
};

function buildRows(before: Snapshot, after: Snapshot): Row[] {
  return [
    {
      label: "Largest Contentful Paint",
      before: before.lcp === null ? "—" : formatSeconds(before.lcp),
      after: after.lcp === null ? "—" : formatSeconds(after.lcp),
      change: before.lcp === null || after.lcp === null ? null : percentDrop(before.lcp, after.lcp),
    },
    {
      label: "Cumulative Layout Shift",
      before: formatCls(before.cls),
      after: formatCls(after.cls),
      change: percentDrop(before.cls, after.cls),
    },
    {
      label: "Images requested on load",
      before: String(before.requests),
      after: String(after.requests),
      change: percentDrop(before.requests, after.requests),
    },
    {
      label: "Image download size",
      before: formatBytes(before.bytes),
      after: formatBytes(after.bytes),
      change: percentDrop(before.bytes, after.bytes),
    },
  ];
}

export function ComparisonSummary() {
  const [before, setBefore] = useState<Snapshot | null>(null);
  const [after, setAfter] = useState<Snapshot | null>(null);

  useEffect(() => {
    const refresh = () => {
      setBefore(readSnapshot("before"));
      setAfter(readSnapshot("after"));
    };
    refresh();
    window.addEventListener(SNAPSHOT_EVENT, refresh);
    return () => window.removeEventListener(SNAPSHOT_EVENT, refresh);
  }, []);

  const ready = before !== null && after !== null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <SectionHeading
          title="Before vs After"
          description="Open both pages once and let each one finish loading. Your numbers appear here."
        />
        <button
          type="button"
          onClick={clearSnapshots}
          className="shrink-0 rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
        >
          Clear results
        </button>
      </div>

      {ready ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4 font-medium">Metric</th>
                <th className="py-2 pr-4 font-medium">Before (&lt;img&gt;)</th>
                <th className="py-2 pr-4 font-medium">After (next/image)</th>
                <th className="py-2 font-medium">Improvement</th>
              </tr>
            </thead>
            <tbody>
              {buildRows(before, after).map((row) => (
                <tr key={row.label} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pr-4 font-medium">{row.label}</td>
                  <td className="py-3 pr-4 tabular-nums text-rose-600">{row.before}</td>
                  <td className="py-3 pr-4 tabular-nums text-emerald-600">{row.after}</td>
                  <td className="py-3 font-semibold tabular-nums">
                    {row.change === null ? "—" : row.change >= 0 ? `↓ ${row.change}%` : `↑ ${Math.abs(row.change)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className={`rounded-lg border p-3 ${before ? "border-emerald-200 bg-emerald-50" : "border-dashed border-slate-300"}`}>
            Before page: <strong>{before ? "measured ✓" : "not measured yet"}</strong>
          </div>
          <div className={`rounded-lg border p-3 ${after ? "border-emerald-200 bg-emerald-50" : "border-dashed border-slate-300"}`}>
            After page: <strong>{after ? "measured ✓" : "not measured yet"}</strong>
          </div>
        </div>
      )}
    </section>
  );
}
