"use client";

import { useQueries } from "@tanstack/react-query";
import { fetchImageSize } from "../api/imageSize.api";

/** Looks up sizes (via react-query) for images whose size the browser hides. */
export function useImageSizes(urls: string[]): Record<string, number> {
  const results = useQueries({
    queries: urls.map((url) => ({
      queryKey: ["image-size", url],
      queryFn: async () => {
        try {
          return await fetchImageSize(url);
        } catch {
          // Treat unreachable or timed-out lookups as "size unknown" so the
          // query settles instead of leaving the UI waiting on a dead request.
          return 0;
        }
      },
      staleTime: Infinity,
      retry: 1,
    })),
  });

  const sizes: Record<string, number> = {};
  results.forEach((result, index) => {
    if (result.data !== undefined) sizes[urls[index]] = result.data;
  });
  return sizes;
}
