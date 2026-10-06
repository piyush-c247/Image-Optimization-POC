import { NextResponse, type NextRequest } from "next/server";
import { getRemoteImageSize, isAllowedImageUrl } from "@/modules/metrics/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !isAllowedImageUrl(url)) {
    return NextResponse.json({ error: "Invalid or disallowed url" }, { status: 400 });
  }

  try {
    const bytes = await getRemoteImageSize(url);
    return NextResponse.json({ url, bytes }, { headers: { "Cache-Control": "public, max-age=86400" } });
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
  }
}
