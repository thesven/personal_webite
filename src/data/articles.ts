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
  return Array.from(set);
}
