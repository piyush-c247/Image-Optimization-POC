import { Badge } from "@/shared/ui/Badge";

const problems = [
  {
    problem: "Slow image loading and large downloads",
    fix: "Images are resized and converted to WebP; srcset + sizes let the browser pick the smallest file that fits.",
    props: "sizes, quality, formats",
  },
  {
    problem: "Poor LCP",
    fix: "The hero image is preloaded so the browser starts fetching it immediately.",
    props: "preload (or priority in Next 15)",
  },
  {
    problem: "Layout shifts (CLS)",
    fix: "Width and height tell the browser the aspect ratio before the file arrives, so space is reserved.",
    props: "width, height, fill",
  },
  {
    problem: "Wrong loading priority",
    fix: "Only the above-the-fold hero is prioritised; everything else keeps the default.",
    props: "preload, loading, fetchPriority",
  },
  {
    problem: "Everything loads at once",
    fix: "Images are lazy by default and are only requested when they approach the viewport.",
    props: "loading=\"lazy\" (default)",
  },
  {
    problem: "Distorted image ratio",
    fix: "Original width/height are passed and CSS uses h-auto, so the ratio always matches the file.",
    props: "width, height, className",
  },
];

const steps = [
  { title: "Open the Before page", text: "Plain <img> tags. Let it load for 6 seconds without scrolling." },
  { title: "Open the After page", text: "Same photos, now with next/image. Do the same." },
  { title: "Compare", text: "The Before vs After table fills in with your own measured numbers." },
  { title: "Scroll the After page", text: "Watch “Images requested” grow as lazy images come into view." },
];

export function HomeView() {
  return (
    <div className="mx-auto max-w-6xl space-y-14 px-6 py-12">
      <section className="text-center">
        <Badge tone="neutral">Proof of concept</Badge>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight">
          How Next.js delivers responsive, optimized images
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Two versions of the same image-heavy page, built with plain <code>&lt;img&gt;</code> tags and with the
          Next.js <code>&lt;Image /&gt;</code> component. Measure the difference live, in your own browser.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="/before"
            className="rounded-lg border border-rose-200 bg-rose-50 px-6 py-3 font-medium text-rose-700 hover:bg-rose-100"
          >
            1 · Open Before page
          </a>
          <a
            href="/after"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-3 font-medium text-emerald-700 hover:bg-emerald-100"
          >
            2 · Open After page
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">How to use this demo</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <p className="mt-3 font-medium">{step.title}</p>
              <p className="mt-1 text-sm text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">Problems this POC addresses</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Problem</th>
                <th className="px-4 py-3 font-medium">How next/image solves it</th>
                <th className="px-4 py-3 font-medium">Key props</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((row) => (
                <tr key={row.problem} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 font-medium">{row.problem}</td>
                  <td className="px-4 py-3 text-slate-600">{row.fix}</td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-slate-700">{row.props}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
