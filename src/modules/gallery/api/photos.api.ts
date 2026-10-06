import { httpClient } from "@/shared/api/httpClient";
import { PHOTO_COUNT } from "../constants";
import type { Photo, PicsumListItem } from "../types";

const LIST_URL = "https://picsum.photos/v2/list";

export async function fetchPhotos(limit: number = PHOTO_COUNT): Promise<Photo[]> {
  // validateStatus lets non-2xx responses through so the status can be
  // reported in the error message instead of axios' generic rejection.
  const { data: items, status } = await httpClient.get<PicsumListItem[]>(`${LIST_URL}?page=1&limit=${limit}`, {
    validateStatus: () => true,
  });
  if (status < 200 || status >= 300) {
    throw new Error(`Could not load photos (HTTP ${status})`);
  }

  return items.map((item) => ({
    id: item.id,
    author: item.author,
    width: item.width,
    height: item.height,
    // Full-size original, e.g. 5000x3333 - this is what makes the page "image heavy".
    src: `https://picsum.photos/id/${item.id}/${item.width}/${item.height}`,
  }));
}
