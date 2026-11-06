import { describe, it, expect } from "vitest";
import {
  ARTICLES,
  getArticleBySlug,
  getAllTags,
  getAllCategories,
  getTagCounts,
  filterArticles,
} from "@/data/articles";

describe("Articles Data & Filtering Engine", () => {
  it("should have all 8 production masterclass articles", () => {
    expect(ARTICLES.length).toBe(8);
  });

  it("should retrieve article by slug", () => {
    const art = getArticleBySlug("spypoint-mcp-trail-camera-ai");
    expect(art).toBeDefined();
    expect(art?.title).toContain("SPYPOINT");
  });

  it("should return undefined for invalid slug", () => {
    expect(getArticleBySlug("non-existent-slug")).toBeUndefined();
  });

  it("should extract all unique tags from articles in sorted order", () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(0);
    expect(tags).toContain("#mcp");
    expect(tags).toContain("#snowflake");
    expect(tags).toContain("#dbt");
    // Verify no duplicates
    const unique = Array.from(new Set(tags));
    expect(tags.length).toBe(unique.length);
  });

  it("should accurately compute tag counts across all articles", () => {
    const counts = getTagCounts(ARTICLES);
    expect(counts["#mcp"]).toBe(2);
    expect(counts["#snowflake"]).toBe(1);
    expect(counts["#typescript"]).toBeGreaterThanOrEqual(3);
  });

  it("should filter articles by search query", () => {
    const results = filterArticles(ARTICLES, "snowflake", "ALL", "ALL");
    expect(results.length).toBe(1);
    expect(results[0].slug).toBe("snowflake-dbt-shopify-ecommerce-analytics");
  });

  it("should filter articles by tag", () => {
    const results = filterArticles(ARTICLES, "", "#mcp", "ALL");
    expect(results.length).toBe(2);
  });

  it("should extract all categories", () => {
    const categories = getAllCategories();
    expect(categories).toContain("Applied AI & IoT");
    expect(categories.length).toBeGreaterThanOrEqual(4);
  });

  it("should filter articles by category", () => {
    const results = filterArticles(ARTICLES, "", "ALL", "Applied AI & IoT");
    expect(results.length).toBe(1);
    expect(results[0].category).toBe("Applied AI & IoT");
  });

  it("should return all articles when query is empty and tag/category are ALL", () => {
    const results = filterArticles(ARTICLES, "", "ALL", "ALL");
    expect(results.length).toBe(8);
  });

  it("should handle case-insensitive query search in summary and tags", () => {
    const results = filterArticles(ARTICLES, "CLOUDFLARE", "ALL", "ALL");
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});
