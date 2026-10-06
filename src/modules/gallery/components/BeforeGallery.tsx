"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { SectionHeading } from "@/shared/ui/SectionHeading";
import { usePhotos } from "../hooks/usePhotos";
import { FEATURED_COUNT } from "../constants";
import type { Photo } from "../types";
import { GalleryError, GalleryLoading } from "./GalleryState";
import { LoadedBadge, readLoadedInfo, type LoadedInfo } from "./LoadedBadge";

function FeaturedCard({ photo }: { photo: Photo }) {
  const [info, setInfo] = useState<LoadedInfo | null>(null);

  return (
    <figure>
      {/* Forced height + full width => the picture is stretched (distorted ratio). */}
      <img
        src={photo.src}
        alt={`Photo by ${photo.author}`}
        className="h-36 w-full rounded-lg"
        onLoad={(e) => setInfo(readLoadedInfo(e.currentTarget))}
      />
      <figcaption className="mt-2 text-sm text-slate-700">
        {photo.author}
        <span className="text-slate-400"> · original {photo.width}×{photo.height}</span>
      </figcaption>
      <LoadedBadge info={info} tone="bad" />
    </figure>
  );
}

function GridCard({ photo }: { photo: Photo }) {
  const [info, setInfo] = useState<LoadedInfo | null>(null);

  return (
    <figure className="rounded-xl border border-slate-200 bg-white p-3">
      {/* No width/height => height is unknown until the file arrives (layout shift). */}
      <img
        src={photo.src}
        alt={`Photo by ${photo.author}`}
        className="w-full rounded-lg"
        onLoad={(e) => setInfo(readLoadedInfo(e.currentTarget))}
      />
      <figcaption className="mt-2 text-sm text-slate-700">
        {photo.author}
        <span className="text-slate-400"> · original {photo.width}×{photo.height}</span>
      </figcaption>
      <LoadedBadge info={info} tone="bad" />
    </figure>
  );
}

export function BeforeGallery() {
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
          description="Fixed height + full width. Look closely: the photos are stretched."
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
          description="Every image is requested immediately, even the ones far below the screen."
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
