import { NextResponse } from "next/server";
import { ARTICLES } from "@/data/articles";
import { generateRssFeed } from "@/lib/feed";

export const dynamic = "force-static";

export function GET() {
  const rssXml = generateRssFeed(ARTICLES, "https://michael-svendsen.dev");
  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
