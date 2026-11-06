import { Article } from "@/data/articles";

export function generateRssFeed(
  articles: Article[],
  siteUrl: string = "https://michael-svendsen.dev"
): string {
  const cleanUrl = siteUrl.replace(/\/$/, "");

  const itemsXml = articles
    .map((art) => {
      const artUrl = `${cleanUrl}/articles/${art.slug}`;
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
