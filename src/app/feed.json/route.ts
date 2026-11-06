import { NextResponse } from "next/server";
import { ARTICLES } from "@/data/articles";
import { generateJsonFeed } from "@/lib/feed";

export const dynamic = "force-static";

export function GET() {
  const jsonFeed = generateJsonFeed(ARTICLES, "https://michael-svendsen.dev");
  return new NextResponse(jsonFeed, {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
