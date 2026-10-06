export type Photo = {
  id: string;
  author: string;
  /** Original width in px (from the API). */
  width: number;
  /** Original height in px (from the API). */
  height: number;
  /** Full-size original image URL. */
  src: string;
};

/** Shape returned by https://picsum.photos/v2/list */
export type PicsumListItem = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};
