# next/image POC — User Guide

A small Next.js + Tailwind app that shows, side by side and with live numbers, how the Next.js
`<Image />` component delivers responsive, optimized images compared with plain `<img>` tags.

---

## 1. What this project teaches

| You will learn | Where you see it |
|---|---|
| How `<Image />` serves smaller, resized WebP files instead of huge originals | "Image download" metric, per-image "Downloaded … → shown …" label |
| How `width` / `height` remove layout shift | CLS metric, no page jumping on `/after` |
| How `sizes` + the generated `srcset` choose the right file | Network tab → image requests have `?w=640&q=60` style URLs |
| How `preload` improves the LCP image | LCP metric, `<link rel="preload" as="image">` in the page `<head>` |
| How lazy loading reduces the initial download | "Images requested" counter grows only while you scroll on `/after` |
| How to keep the original aspect ratio | Featured row: stretched on `/before`, correct on `/after` |

## 2. The app at a glance

| Route | What it shows |
|---|---|
| `/` | Overview, how to use the demo, problem → solution table |
| `/before` | Image-heavy page built with plain `<img>` tags (the problems) |
| `/after` | The identical page built with `next/image` (the fixes) |

Both pages use the same data (24 full-size photos from [Lorem Picsum](https://picsum.photos), typically
5000×3333 px) and the same layout. **Only the image tag differs.**

Each demo page has a sticky **metrics bar**:

- **LCP** – Largest Contentful Paint (good ≤ 2.5 s)
- **CLS** – Cumulative Layout Shift (good ≤ 0.1)
- **Images requested** – how many of the 25 images the browser has asked for so far
- **Image download** – total encoded size of those images

After 6 seconds each page saves its numbers, and the **Before vs After** table on both pages shows
the comparison and the percentage improvement.

## 3. Requirements

- Node.js 20.9 or newer (required by Next.js 16)
- npm
- An internet connection (photos and the photo list come from picsum.photos)

## 4. Run it

```bash
npm install
npm start
```

Open <http://localhost:3000>.

`npm start` runs `next build && next start` (a **production** build). This matters: image optimization
and performance numbers are only realistic in production mode. For quick UI edits use `npm run dev`.

| Script | What it does |
|---|---|
| `npm start` | Build, then start the production server on port 3000 |
| `npm run dev` | Development server with hot reload (numbers are slower and less accurate) |
| `npm run build` | Production build only |
| `npm run serve` | Start an already built production server |

## 5. How to see the impact (step by step)

1. Open **/before**. Do not scroll. Wait 6 seconds. The result is saved automatically.
2. Open **/after**. The first visit may be slower: the Next.js server downloads each original once and
   creates the resized WebP files. **Press "Reload & measure"** so you measure the cached, optimized files.
3. Look at the **Before vs After** table (visible on both pages).
4. On **/after**, scroll slowly and watch **Images requested** increase. That is lazy loading.
5. Switch between the pages with the header links. They are full page loads on purpose, so each page is
   measured from a clean start.

### Looking deeper with browser DevTools

- **Network tab → Img filter**: on `/before` you will see URLs like `picsum.photos/id/0/5000/3333` with
  multi-megabyte sizes; on `/after` you will see `/_next/image?url=…&w=640&q=60` with small `webp` files.
  Tick **Disable cache** for a fair comparison.
- **Network tab → Throttling → Fast 4G**: makes the difference far more visible.
- **Performance tab**: record a reload; the **Layout Shifts** track shows red marks on `/before` only.
- **Lighthouse**: run it on both pages (production build, incognito) for an independent LCP/CLS reading.
- **Elements tab**: inspect an `<img>` on `/after` and look at the generated `srcset`, `sizes`,
  `loading="lazy"`, `width`, `height`.

### Why my numbers might differ from someone else's

- Network speed, CPU and browser cache all change timings. Compare the two pages on the same machine.
- Cross-origin image sizes are hidden by browsers, so the app asks its own server (`/api/image-size`) for the
  original file size. That lookup is not counted in the results.
- LCP is not reported by Safari. Use Chrome or Edge.

## 6. Project structure (modular monolith)

One deployable app, split into self-contained modules. A module exposes a small public API through its
`index.ts`; other modules import only from there.

```text
src/
├─ app/                      Routing only (thin pages, layout, API route)
│  ├─ page.tsx               /
│  ├─ before/page.tsx        /before
│  ├─ after/page.tsx         /after
│  └─ api/image-size/route.ts
├─ modules/
│  ├─ gallery/               Photos domain
│  │  ├─ api/                fetchPhotos (picsum list)
│  │  ├─ hooks/              usePhotos  (react-query)
│  │  ├─ components/         BeforeHero, AfterHero, BeforeGallery, AfterGallery, …
│  │  ├─ constants.ts        hero image, sizes strings, blur placeholder
│  │  └─ index.ts            public API
│  ├─ metrics/               Measuring LCP / CLS / image bytes
│  │  ├─ hooks/              useWebVitals, useImageResources, useImageSizes (react-query)
│  │  ├─ components/         MetricsPanel, ComparisonSummary
│  │  ├─ lib/                ratings, snapshots (sessionStorage)
│  │  ├─ api/                fetchImageSize
│  │  ├─ server.ts           server-only helpers for the API route
│  │  └─ index.ts            public API
│  ├─ demo/                  Composes the Before/After pages
│  └─ home/                  Overview page content
└─ shared/                   Reusable, domain-free code
   ├─ providers/             QueryProvider (TanStack Query)
   ├─ layout/                Header, Footer
   ├─ ui/                    Badge, CodeBlock, SectionHeading
   └─ lib/                   formatting helpers
```

Rules used: pages in `app/` contain no logic; modules never import each other's internals;
`shared/` never imports from `modules/`; all API calls go through TanStack Query hooks. The app has no
forms; if you add one, use React Hook Form.

## 7. The Image component — most useful props

```tsx
import Image from "next/image";
```

| Prop | What it does | Use it when |
|---|---|---|
| `src` | Image path or URL. Remote hosts must be allowed in `next.config.ts`. | Always |
| `alt` | Text alternative (accessibility, SEO). | Always |
| `width`, `height` | Intrinsic size in pixels. Gives the browser the **aspect ratio** so space is reserved (no layout shift). They are not the displayed size; CSS controls that. | Any image whose size you know |
| `fill` | Image fills its positioned parent instead of using width/height. Pair with `object-cover` / `object-contain`. | Unknown image size, background-like images |
| `sizes` | How wide the image is displayed at each breakpoint, e.g. `"(min-width: 1024px) 360px, 100vw"`. Decides which `srcset` file the browser downloads. **The single most important prop for download size.** | Any responsive image |
| `quality` | 1–100 (default 75). Must be listed in `images.qualities` in Next.js 16. | Trade file size vs. sharpness |
| `preload` | Preloads the image (adds `<link rel="preload">`) and disables lazy loading. Next.js 16. | The LCP / hero image only |
| `priority` | Older name for `preload` (Next.js 15 and earlier; deprecated in 16). | Same as above on Next.js ≤ 15 |
| `loading` | `"lazy"` (default) or `"eager"`. | Leave default; use `"eager"` for above-the-fold images you don't want to preload |
| `fetchPriority` | `"high"`, `"low"` or `"auto"`. A browser hint for network priority. | See section 8 |
| `placeholder` | `"blur"` shows a blurred preview while loading. Remote images also need `blurDataURL`. | Improve perceived loading |
| `blurDataURL` | Base64 data URL used by `placeholder="blur"`. Local static imports generate it automatically. | With `placeholder="blur"` |
| `onLoad` / `onError` | Callbacks when the image finishes or fails. | Reading dimensions, fallbacks |
| `unoptimized` | Serve the original file untouched (no resizing). | SVG/GIF, or already-optimized assets |
| `loader` | Custom function to build URLs for an external image CDN. | Cloudinary, Imgix, etc. |
| `overrideSrc` | Override the `src` attribute while keeping the generated `srcset`. | SEO / migration cases |
| `decoding` | `"async"` (default), `"sync"`, `"auto"`. | Rarely |

Also useful:

- `getImageProps()` (from `next/image`) returns the props for a plain `<img>`/`<picture>` without rendering
  `<Image />`. Use it for art direction (different crops on mobile vs desktop) and dark/light variants.

### Configuration (`next.config.ts`)

| Option | Purpose | In this POC |
|---|---|---|
| `images.remotePatterns` | Allow-list of remote hosts the optimizer may fetch from | `picsum.photos`, `fastly.picsum.photos` |
| `images.formats` | Output formats (`image/webp`, `image/avif`) | `["image/webp"]` |
| `images.qualities` | Allowed `quality` values | `[60, 75]` |
| `images.deviceSizes` | Widths generated for full-width images | Default |
| `images.imageSizes` | Widths generated for small images (when `sizes` is set) | Default |
| `images.minimumCacheTTL` | How long optimized files are cached by the server | 1 day |

### How it delivers responsive images

1. At render time `<Image />` outputs an `<img>` with a `srcset` of several widths, e.g.
   `/_next/image?url=…&w=384&q=60 384w, …&w=640&q=60 640w, …`.
2. The browser reads `sizes`, the viewport width and the screen density, then requests the **one** best candidate.
3. The Next.js server fetches the original once, resizes it, converts it to WebP, caches it, and responds with
   long-lived cache headers.
4. `width` + `height` give the aspect ratio up front, so the layout is stable before the file arrives.
5. Without `preload`, the `<img>` is `loading="lazy"` and only requested near the viewport.

## 8. Where each fix is applied in this code

| Fix | File |
|---|---|
| Hero: `width`, `height`, `sizes`, `preload` | `src/modules/gallery/components/AfterHero.tsx` |
| Gallery: lazy loading (default), `sizes`, `quality`, blur placeholder, ratio kept | `src/modules/gallery/components/AfterGallery.tsx` |
| Allowed hosts, WebP, qualities | `next.config.ts` |
| The "bad" versions for comparison | `BeforeHero.tsx`, `BeforeGallery.tsx` |

### Priority variant: `fetchPriority`

The `/after` hero uses **`preload` only**. A variant you can try is adding the browser hint as well:

```tsx
<Image
  src={HERO.src}
  alt={HERO.alt}
  width={HERO.width}
  height={HERO.height}
  sizes={HERO_SIZES}
  preload
  fetchPriority="high"
  className="h-auto w-full"
/>
```

- `preload` makes Next.js emit `<link rel="preload" as="image">` in the `<head>`, so discovery is early.
- `fetchPriority="high"` additionally tells the browser to rank the request above other images.
- Use either approach on one image only (the LCP image). Marking many images as high priority cancels the benefit.
- On Next.js 15 and earlier, replace `preload` with `priority`.

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| `Invalid src prop … hostname is not configured` | Add the host to `images.remotePatterns` in `next.config.ts` and restart |
| `quality … is not configured in images.qualities` | Add the value to `images.qualities` |
| `/after` is slow on the very first visit | The server is creating the resized files; reload and measure again |
| Photo list does not load | Check your connection and that `picsum.photos` is reachable |
| `preload` is not a known prop | You are on Next.js 15 or older; use `priority` instead |
| Metrics show `…` for LCP | Browser does not report LCP (Safari). Use Chrome or Edge |
| Port 3000 busy | `npx next start -p 3001` (or `npx next dev -p 3001`) |

## 10. Further reading

- Next.js Image component: <https://nextjs.org/docs/app/api-reference/components/image>
- Image optimization guide: <https://nextjs.org/docs/app/getting-started/images>
- Core Web Vitals: <https://web.dev/articles/vitals>
