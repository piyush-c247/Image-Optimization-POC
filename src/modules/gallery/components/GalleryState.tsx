export function GalleryLoading() {
  return (
    <div className="grid min-h-[50vh] place-items-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-500">
      Loading photo list…
    </div>
  );
}

export function GalleryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="grid min-h-[30vh] place-items-center rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
      <div>
        <p className="font-medium">Could not load the photo list.</p>
        <p className="mt-1">Check your internet connection (photos come from picsum.photos).</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md bg-rose-600 px-3 py-1.5 font-medium text-white hover:bg-rose-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
