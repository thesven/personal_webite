import { describe, it, expect } from "vitest";
import {
  getPersonSchema,
  getWebsiteSchema,
  getBreadcrumbSchema,
  getArticleSchema,
  getArticlesListSchema,
  getProjectsListSchema,
  getAboutFaqSchema,
  SITE_URL,
} from "@/lib/seo";
import { ARTICLES } from "@/data/articles";
import { PROJECTS } from "@/data/projects";

describe("SEO, Schema.org and JSON-LD Structured Data", () => {
  it("generates valid Person schema with verified credentials and profiles", () => {
    const person = getPersonSchema();
    expect(person["@context"]).toBe("https://schema.org");
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe("Michael Svendsen");
    expect(person.url).toBe(SITE_URL);
    expect(person.worksFor.name).toBe("Reactiv");
    expect(person.sameAs).toContain("https://github.com/thesven");
    expect(person.sameAs).toContain("https://huggingface.co/thesven");
    expect(person.knowsAbout).toContain("Snowflake Data Warehousing");
    expect(person.knowsAbout).toContain("Model Context Protocol (MCP)");
  });

  it("generates valid WebSite schema linked to Person author", () => {
    const website = getWebsiteSchema();
    expect(website["@context"]).toBe("https://schema.org");
    expect(website["@type"]).toBe("WebSite");
    expect(website.name).toBe("Michael Svendsen");
    expect(website.url).toBe(SITE_URL);
    expect(website.author["@id"]).toBe(`${SITE_URL}/#person`);
  });

  it("generates valid BreadcrumbList schema with relative and absolute URLs", () => {
    const breadcrumb = getBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Technical Publications", url: "/articles/" },
      { name: "Sample Article", url: "/articles/sample/" },
    ]);
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement).toHaveLength(3);
    expect(breadcrumb.itemListElement[0].name).toBe("Home");
    expect(breadcrumb.itemListElement[0].item).toBe(`${SITE_URL}/`);
    expect(breadcrumb.itemListElement[1].name).toBe("Technical Publications");
    expect(breadcrumb.itemListElement[1].item).toBe(`${SITE_URL}/articles/`);
    expect(breadcrumb.itemListElement[2].item).toBe(`${SITE_URL}/articles/sample/`);
  });

  it("generates valid TechArticle schema for an article", () => {
    const article = ARTICLES[0];
    const schema = getArticleSchema(article);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("TechArticle");
    expect(schema.headline).toBe(article.title);
    expect(schema.description).toBe(article.summary);
    expect(schema.datePublished).toBe(article.date);
    expect(schema.proficiencyLevel).toBe("Expert");
    expect(schema.mainEntityOfPage["@id"]).toBe(`${SITE_URL}/articles/${article.slug}/`);
    expect(schema.wordCount).toBeGreaterThan(50);
    expect(schema.speakable).toEqual({
      "@type": "SpeakableSpecification",
      cssSelector: ["[role='doc-abstract']", "h1"],
    });
  });

  it("generates valid ItemList schema for articles list", () => {
    const listSchema = getArticlesListSchema(ARTICLES);
    expect(listSchema["@type"]).toBe("ItemList");
    expect(listSchema.itemListElement).toHaveLength(ARTICLES.length);
    expect(listSchema.itemListElement[0].name).toBe(ARTICLES[0].title);
    expect(listSchema.itemListElement[0].url).toContain(ARTICLES[0].slug);
  });

  it("generates valid ItemList schema with SoftwareApplication for projects", () => {
    const projectsSchema = getProjectsListSchema(PROJECTS);
    expect(projectsSchema["@type"]).toBe("ItemList");
    expect(projectsSchema.itemListElement).toHaveLength(PROJECTS.length);
    expect(projectsSchema.itemListElement[0]["@type"]).toBe("SoftwareApplication");
    expect(projectsSchema.itemListElement[0].name).toBe(PROJECTS[0].title);
    expect(projectsSchema.itemListElement[0].url).toBe(PROJECTS[0].githubUrl);
  });

  it("generates valid FAQPage schema for Answer Engine Optimization (AEO)", () => {
    const faq = getAboutFaqSchema();
    expect(faq["@type"]).toBe("FAQPage");
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(4);
    faq.mainEntity.forEach((item) => {
      expect(item["@type"]).toBe("Question");
      expect(item.name.length).toBeGreaterThan(5);
      expect(item.acceptedAnswer["@type"]).toBe("Answer");
      expect(item.acceptedAnswer.text.length).toBeGreaterThan(20);
    });
  });

  it("handles breadcrumb relative URLs without leading slash and empty article content", () => {
    const breadcrumb = getBreadcrumbSchema([
      { name: "Docs", url: "docs" },
    ]);
    expect(breadcrumb.itemListElement[0].item).toBe(`${SITE_URL}/docs`);

    const emptyArticleSchema = getArticleSchema({
      ...ARTICLES[0],
      content: "",
    });
    expect(emptyArticleSchema.wordCount).toBe(0);
  });
});
