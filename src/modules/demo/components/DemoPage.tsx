import { AfterGallery, AfterHero, BeforeGallery, BeforeHero, TOTAL_IMAGES } from "@/modules/gallery";
import { ComparisonSummary, MetricsPanel, type Mode } from "@/modules/metrics";
import { SectionHeading } from "@/shared/ui/SectionHeading";
import { ModeBanner } from "./ModeBanner";

export function DemoPage({ mode }: { mode: Mode }) {
  const isBefore = mode === "before";

  return (
    <>
      <MetricsPanel mode={mode} totalImages={TOTAL_IMAGES} />

      <div className="mx-auto max-w-6xl space-y-12 px-6 pt-8">
        <ModeBanner mode={mode} />

        <section>
          <SectionHeading
            title="Hero image"
            description={
              isBefore
                ? "A 5000×3333 original with no size information."
                : "Same photo, resized by Next.js, with space reserved and preload enabled."
            }
          />
          {isBefore ? <BeforeHero /> : <AfterHero />}
        </section>

        <ComparisonSummary />

        {isBefore ? <BeforeGallery /> : <AfterGallery />}
      </div>
    </>
  );
}
