import { describe, it, expect } from "vitest";
import { generateRssFeed } from "@/lib/feed";
import { ARTICLES } from "@/data/articles";

describe("RSS 2.0 Syndication Feed Generator", () => {
  it("should generate valid RSS 2.0 XML string", () => {
    const rss = generateRssFeed(ARTICLES, "https://michael-svendsen.dev");
    expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(rss).toContain('<rss version="2.0"');
    expect(rss).toContain("<channel>");
    expect(rss).toContain("<title>Michael Svendsen — Systems Publications</title>");
  });

  it("should generate an item for every article", () => {
    const rss = generateRssFeed(ARTICLES, "https://michael-svendsen.dev");
    expect(rss).toContain("<item>");
    ARTICLES.forEach((art) => {
      expect(rss).toContain(`<title><![CDATA[${art.title}]]></title>`);
      expect(rss).toContain(`https://michael-svendsen.dev/articles/${art.slug}/`);
      expect(rss).toContain(`<category>${art.category}</category>`);
    });
  });

  it("should format pubDate into RFC 822 format", () => {
    const rss = generateRssFeed(ARTICLES.slice(0, 1), "https://michael-svendsen.dev");
    expect(rss).toMatch(/<pubDate>[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4}/);
  });
});
