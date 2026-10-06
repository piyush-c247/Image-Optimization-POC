"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPhotos } from "../api/photos.api";
import { PHOTO_COUNT } from "../constants";

export function usePhotos(limit: number = PHOTO_COUNT) {
  return useQuery({
    queryKey: ["photos", limit],
    queryFn: () => fetchPhotos(limit),
    staleTime: Infinity,
  });
}
