// Server-only helpers used by app/api/image-size/route.ts

const ALLOWED_HOSTS = new Set(["picsum.photos", "fastly.picsum.photos"]);

/** Only well-known image hosts may be looked up (prevents open-proxy abuse). */
export function isAllowedImageUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && ALLOWED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export async function getRemoteImageSize(url: string): Promise<number> {
  // Ask for just the first byte; the total size comes back in Content-Range.
  // The signal both caps runtime and makes Next's dedupe-fetch skip
  // response.clone(); cancelling one branch of a tee() waits for both
  // branches, so a bare body.cancel() would hang this request forever.
  const response = await fetch(url, {
    headers: { Range: "bytes=0-0" },
    redirect: "follow",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) {
    throw new Error(`Upstream responded with ${response.status}`);
  }

  const total = Number(response.headers.get("content-range")?.split("/")[1]);
  if (Number.isFinite(total) && total > 0) {
    // Drain the (1 byte) body instead of cancelling it, so the socket is
    // released immediately instead of being pinned by an unread stream.
    await response.arrayBuffer();
    return total;
  }

  // Server ignored Range (status 200): count the bytes instead.
  return (await response.arrayBuffer()).byteLength;
}
