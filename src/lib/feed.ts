import { Article } from "@/data/articles";

export function generateRssFeed(
  articles: Article[],
  siteUrl: string = "https://michael-svendsen.dev"
): string {
  const cleanUrl = siteUrl.replace(/\/$/, "");

  const itemsXml = articles
    .map((art) => {
      const artUrl = `${cleanUrl}/articles/${art.slug}/`;
      const pubDate = new Date(art.date).toUTCString();

      return `    <item>
      <title><![CDATA[${art.title}]]></title>
      <link>${artUrl}</link>
      <guid isPermaLink="true">${artUrl}</guid>
      <description><![CDATA[${art.summary}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author><![CDATA[${art.author}]]></author>
      <category>${art.category}</category>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Michael Svendsen — Systems Publications</title>
    <link>${cleanUrl}</link>
    <description>Production analytics, AWS Bedrock AgentCore, Model Context Protocol (MCP), and open-source AI tooling by Michael Svendsen.</description>
    <language>en-us</language>
    <atom:link href="${cleanUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`.trim();
}

export function generateJsonFeed(
  articles: Article[],
  siteUrl: string = "https://michael-svendsen.dev"
): string {
  const cleanUrl = siteUrl.replace(/\/$/, "");

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Michael Svendsen — Systems Publications",
    home_page_url: `${cleanUrl}/`,
    feed_url: `${cleanUrl}/feed.json`,
    description:
      "Production analytics, AWS Bedrock AgentCore, Model Context Protocol (MCP), and open-source AI tooling by Michael Svendsen.",
    authors: [
      {
        name: "Michael Svendsen",
        url: cleanUrl,
        avatar: `${cleanUrl}/og-image.png`,
      },
    ],
    language: "en",
    items: articles.map((art) => ({
      id: `${cleanUrl}/articles/${art.slug}/`,
      url: `${cleanUrl}/articles/${art.slug}/`,
      title: art.title,
      summary: art.summary,
      date_published: new Date(art.date).toISOString(),
      tags: art.tags,
      authors: [{ name: art.author }],
    })),
  };

  return JSON.stringify(feed, null, 2);
}
