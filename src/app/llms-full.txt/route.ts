import { NextResponse } from "next/server";
import { generateLlmsFullTxt, computeContentHash } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  const content = generateLlmsFullTxt();
  const hash = computeContentHash(content);

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      ETag: `"${hash}"`,
      "Last-Modified": "Fri, 06 Nov 2026 00:00:00 GMT",
    },
  });
}
