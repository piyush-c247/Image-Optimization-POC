import { httpClient } from "@/shared/api/httpClient";

/**
 * Asks our own server (/api/image-size) how big a remote image is.
 * Needed because browsers hide the size of cross-origin images from
 * the Performance API unless the remote server opts in.
 */
export async function fetchImageSize(url: string): Promise<number> {
  // Relative URL: httpClient.baseURL fills in the page origin.
  const { data, status } = await httpClient.get<{ bytes: number }>(
    `/api/image-size?url=${encodeURIComponent(url)}`,
    { validateStatus: () => true },
  );
  if (status < 200 || status >= 300) {
    throw new Error(`Size lookup failed (HTTP ${status})`);
  }
  return data.bytes;
}
