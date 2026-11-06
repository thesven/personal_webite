import { articleSnowflakeDbtShopify } from "./articles/snowflake-dbt-shopify";
import { articleSpypointMcp } from "./articles/spypoint-mcp";
import { articleLiteMcpCloudflare } from "./articles/litemcp-cloudflare";
import { articleBedrockAgentcore } from "./articles/bedrock-agentcore";
import { articleGgufQuantization } from "./articles/gguf-quantization";
import { articleIracingTelemetrySdk } from "./articles/iracing-telemetry-sdk";
import { articleGifParserCielab } from "./articles/gif-parser-cielab";
import { articleServerlessPhotography } from "./articles/serverless-photography";

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
  summary: string;
  author: string;
  content: string;
}

export const ARTICLES: Article[] = [
  articleSnowflakeDbtShopify,
  articleSpypointMcp,
  articleLiteMcpCloudflare,
  articleBedrockAgentcore,
  articleGgufQuantization,
  articleIracingTelemetrySdk,
  articleGifParserCielab,
  articleServerlessPhotography,
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  ARTICLES.forEach((a) => a.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

export function getAllCategories(): string[] {
  const set = new Set<string>();
  ARTICLES.forEach((a) => set.add(a.category));
  return Array.from(set).sort();
}

export function getTagCounts(articles: Article[]): Record<string, number> {
  const counts: Record<string, number> = {};
  articles.forEach((art) => {
    art.tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });
  return counts;
}

export function filterArticles(
  articles: Article[],
  query: string,
  selectedTag: string = "ALL",
  selectedCategory: string = "ALL"
): Article[] {
  const q = query.trim().toLowerCase();
  return articles.filter((art) => {
    const matchesTag =
      selectedTag === "ALL" ||
      art.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" ||
      art.category.toLowerCase() === selectedCategory.toLowerCase();

    if (!matchesTag || !matchesCategory) return false;

    if (!q) return true;

    return (
      art.title.toLowerCase().includes(q) ||
      art.subtitle.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q) ||
      art.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

