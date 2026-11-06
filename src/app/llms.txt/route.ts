import { NextResponse } from "next/server";
import { generateLlmsTxt } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  const content = generateLlmsTxt();
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
