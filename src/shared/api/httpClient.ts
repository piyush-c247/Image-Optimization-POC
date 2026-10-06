import axios from "axios";

/**
 * Shared axios instance for all browser-side API calls.
 *
 * axios has no notion of the current origin, so a relative URL such as
 * "/api/image-size" would be rejected as invalid. Supplying baseURL fixes
 * that; absolute URLs (like the picsum.photos list endpoint) ignore it.
 *
 * No default headers are set on purpose. A default `Content-Type` would be
 * sent on GET requests too, which is not CORS-safelisted and would trigger
 * a preflight the image host does not answer.
 */
export const httpClient = axios.create({
  baseURL: typeof window === "undefined" ? undefined : window.location.origin,
});