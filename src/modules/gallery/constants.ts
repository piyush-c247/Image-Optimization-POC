export const PHOTO_COUNT = 24;
export const FEATURED_COUNT = 3;

/** Hero image + every photo in the gallery. */
export const TOTAL_IMAGES = PHOTO_COUNT + 1;

/**
 * The hero is a fixed, full-size (5000x3333) photo so it is present in the
 * server-rendered HTML. That makes it the LCP element on both pages.
 * 5000 px is the largest size Picsum serves; bigger requests get a 400.
 */
export const HERO = {
  src: "https://picsum.photos/id/1015/5000/3333",
  width: 5000,
  height: 3333,
  alt: "Large landscape photo used as the hero image",
} as const;

/** `sizes` hints: tell the browser how wide the image is at each breakpoint. */
export const HERO_SIZES = "(min-width: 1152px) 1152px, 100vw";
export const FEATURED_SIZES = "(min-width: 1024px) 360px, (min-width: 640px) 33vw, 100vw";
export const GRID_SIZES = "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw";

const blurSvg =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'><filter id='b' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='1'/></filter><rect width='8' height='5' fill='#cbd5e1' filter='url(#b)'/></svg>";

/** Tiny inline placeholder shown while an optimized image is loading. */
export const BLUR_DATA_URL = `data:image/svg+xml;base64,${btoa(blurSvg)}`;
