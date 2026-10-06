export type Mode = "before" | "after";

export type ImageResource = {
  url: string;
  /** Encoded body size in bytes as reported by the browser (0 when hidden by CORS). */
  bytes: number;
};

export type Snapshot = {
  lcp: number | null;
  cls: number;
  requests: number;
  bytes: number;
  capturedAt: number;
};

export type Rating = "good" | "needs-improvement" | "poor";
