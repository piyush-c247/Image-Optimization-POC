import { Badge } from "@/shared/ui/Badge";
import { CodeBlock } from "@/shared/ui/CodeBlock";
import type { Mode } from "@/modules/metrics";

const beforeCode = `<img
  src="https://picsum.photos/id/0/5000/3333"
  alt="..."
  className="w-full"
/>

/* No width/height, no sizes, no resizing,
   no lazy loading, original JPEG every time */`;

const afterCode = `<Image
  src="https://picsum.photos/id/0/5000/3333"
  alt="..."
  width={5000}
  height={3333}
  sizes="(min-width: 1024px) 360px, 100vw"
  quality={60}
  placeholder="blur"
  className="h-auto w-full"
/>

/* Hero image only: add the  preload  prop */`;

const content = {
  before: {
    tone: "bad" as const,
    tag: "BEFORE",
    title: "Plain <img> tags",
    intro: "This is how most pages are built by default. Watch the numbers above while it loads.",
    points: [
      "Full-size originals (up to 5000 px wide) are downloaded for ~350 px slots",
      "No width/height, so the page jumps around as each image arrives (layout shift)",
      "Hero image has no priority hints, so it competes with everything else (slow LCP)",
      "All images start downloading immediately, even far below the screen",
      "Featured row is forced to a fixed height, so photos look stretched (distorted ratio)",
    ],
    code: beforeCode,
  },
  after: {
    tone: "good" as const,
    tag: "AFTER",
    title: "Next.js <Image /> component",
    intro: "Same photos, same layout, same data. Only the image tag changed.",
    points: [
      "Automatically resized and converted to WebP, served in a size that fits the slot",
      "width/height reserve space up front, so nothing jumps (CLS near 0)",
      "Hero uses the preload prop, so the browser fetches it first (better LCP)",
      "Gallery images are lazy: they download only when you scroll near them",
      "Original aspect ratio is kept (width/height + h-auto), nothing is stretched",
    ],
    code: afterCode,
  },
};

export function ModeBanner({ mode }: { mode: Mode }) {
  const item = content[mode];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={item.tone}>{item.tag}</Badge>
        <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
      </div>
      <p className="mt-2 text-sm text-slate-600">{item.intro}</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <ul className="space-y-2 text-sm text-slate-700">
          {item.points.map((point) => (
            <li key={point} className="flex gap-2">
              <span className={item.tone === "bad" ? "text-rose-500" : "text-emerald-500"}>
                {item.tone === "bad" ? "✕" : "✓"}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <CodeBlock code={item.code} />
      </div>
    </section>
  );
}
