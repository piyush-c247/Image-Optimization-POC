"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionHeading } from "@/shared/ui/SectionHeading";
import { usePhotos } from "../hooks/usePhotos";
import { BLUR_DATA_URL, FEATURED_COUNT, FEATURED_SIZES, GRID_SIZES } from "../constants";
import type { Photo } from "../types";
import { GalleryError, GalleryLoading } from "./GalleryState";
import { LoadedBadge, readLoadedInfo, type LoadedInfo } from "./LoadedBadge";

function FeaturedCard({ photo }: { photo: Photo }) {
  const [info, setInfo] = useState<LoadedInfo | null>(null);

  return (
    <figure>
      {/* Original width/height + h-auto => correct ratio, space reserved up front. */}
      <Image
        src={photo.src}
        alt={`Photo by ${photo.author}`}
        width={photo.width}
        height={photo.height}
        sizes={FEATURED_SIZES}
        quality={60}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="h-auto w-full rounded-lg"
        onLoad={(e) => setInfo(readLoadedInfo(e.currentTarget))}
      />
      <figcaption className="mt-2 text-sm text-slate-700">
        {photo.author}
        <span className="text-slate-400"> · original {photo.width}×{photo.height}</span>
      </figcaption>
      <LoadedBadge info={info} tone="good" />
    </figure>
  );
}

function GridCard({ photo }: { photo: Photo }) {
  const [info, setInfo] = useState<LoadedInfo | null>(null);

  return (
    <figure className="rounded-xl border border-slate-200 bg-white p-3">
      {/* Lazy loading is the default: the file is only requested near the viewport. */}
      <Image
        src={photo.src}
        alt={`Photo by ${photo.author}`}
        width={photo.width}
        height={photo.height}
        sizes={GRID_SIZES}
        quality={60}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="h-auto w-full rounded-lg"
        onLoad={(e) => setInfo(readLoadedInfo(e.currentTarget))}
      />
      <figcaption className="mt-2 text-sm text-slate-700">
        {photo.author}
        <span className="text-slate-400"> · original {photo.width}×{photo.height}</span>
      </figcaption>
      <LoadedBadge info={info} tone="good" />
    </figure>
  );
}

export function AfterGallery() {
  const { data, isPending, isError, refetch } = usePhotos();

  if (isPending) return <GalleryLoading />;
  if (isError) return <GalleryError onRetry={() => void refetch()} />;

  const featured = data.slice(0, FEATURED_COUNT);
  const rest = data.slice(FEATURED_COUNT);

  return (
    <div className="space-y-12">
      <section>
        <SectionHeading
          title="Featured"
          description="Same photos, original aspect ratio preserved."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {featured.map((photo) => (
            <FeaturedCard key={photo.id} photo={photo} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          title="Gallery"
          description="Scroll down: images are only requested when they get close to the screen."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((photo) => (
            <GridCard key={photo.id} photo={photo} />
          ))}
        </div>
      </section>
    </div>
  );
}
