export type LoadedInfo = { natural: string; shown: string };

/** Reads what the browser really downloaded vs. what is drawn on screen. */
export function readLoadedInfo(img: HTMLImageElement): LoadedInfo {
  return {
    natural: `${img.naturalWidth}×${img.naturalHeight}`,
    shown: `${Math.round(img.clientWidth)}×${Math.round(img.clientHeight)}`,
  };
}

export function LoadedBadge({ info, tone }: { info: LoadedInfo | null; tone: "bad" | "good" }) {
  const color = tone === "bad" ? "text-rose-600" : "text-emerald-600";

  if (!info) {
    return <p className="mt-1 text-xs text-slate-400">Not downloaded yet…</p>;
  }

  return (
    <p className={`mt-1 text-xs font-medium ${color}`}>
      Downloaded {info.natural} px → shown {info.shown} px
    </p>
  );
}
