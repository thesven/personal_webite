import { describe, it, expect } from "vitest";
import { generateRssFeed, generateJsonFeed } from "@/lib/feed";
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

describe("JSON Feed 1.1 Generator", () => {
  it("should generate valid JSON Feed 1.1 data structure", () => {
    const jsonStr = generateJsonFeed(ARTICLES, "https://michael-svendsen.dev");
    const parsed = JSON.parse(jsonStr);

    expect(parsed.version).toBe("https://jsonfeed.org/version/1.1");
    expect(parsed.title).toBe("Michael Svendsen — Systems Publications");
    expect(parsed.home_page_url).toBe("https://michael-svendsen.dev/");
    expect(parsed.feed_url).toBe("https://michael-svendsen.dev/feed.json");
    expect(parsed.authors[0].name).toBe("Michael Svendsen");
    expect(parsed.items).toHaveLength(ARTICLES.length);

    const first = parsed.items[0];
    expect(first.id).toBe(`https://michael-svendsen.dev/articles/${ARTICLES[0].slug}/`);
    expect(first.title).toBe(ARTICLES[0].title);
    expect(first.summary).toBe(ARTICLES[0].summary);
    expect(first.tags).toEqual(ARTICLES[0].tags);
    expect(first.date_published).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
