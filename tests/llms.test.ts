import { describe, it, expect } from "vitest";
import { generateLlmsTxt, generateLlmsFullTxt, computeContentHash } from "@/lib/llms";
import { ARTICLES } from "@/data/articles";
import { PROJECTS } from "@/data/projects";

describe("LLM Standards (llms.txt and llms-full.txt)", () => {
  it("generates markdown formatted llms.txt compliant with specification", () => {
    const txt = generateLlmsTxt(ARTICLES, PROJECTS, "https://michael-svendsen.dev");
    expect(txt).toContain("# Michael Svendsen");
    expect(txt).toContain("https://michael-svendsen.dev/llms-full.txt");
    expect(txt).toContain("## Primary Workspaces & System Overview");
    expect(txt).toContain("## Technical Publications");
    expect(txt).toContain("## Key Systems & Open Source Projects");
    expect(txt).toContain("## Core Competencies & Technical Stack");

    // Every article should be indexed
    ARTICLES.forEach((art) => {
      expect(txt).toContain(`[${art.title}](https://michael-svendsen.dev/articles/${art.slug}/)`);
    });

    // Key projects should be listed
    expect(txt).toContain("LiteMCP");
    expect(txt).toContain("GGUF-n-Go");
    expect(txt).toContain("spypoint_mcp");
  });

  it("generates complete uncompressed llms-full.txt knowledge corpus", () => {
    const full = generateLlmsFullTxt(ARTICLES, PROJECTS, "https://michael-svendsen.dev");
    expect(full).toContain("# Michael Svendsen — Complete Systems & Engineering Knowledge Base");
    expect(full).toContain("## Executive Biography & Background");
    expect(full).toContain("## Systems & Open Source Projects Catalog");
    expect(full).toContain("## Complete Technical Publications Corpus");

    // Full article contents should be embedded
    ARTICLES.forEach((art) => {
      expect(full).toContain(`# ARTICLE: ${art.title}`);
      expect(full).toContain(art.slug);
      // Snippet of actual article content
      expect(full).toContain(art.content.slice(0, 30));
    });

    // Check project details
    PROJECTS.forEach((p) => {
      expect(full).toContain(`### ${p.title}`);
      expect(full).toContain(p.stack.join(", "));
    });
  });

  it("handles custom base URL without trailing slash cleanly", () => {
    const customUrl = "https://example.com/subpath";
    const txt = generateLlmsTxt(ARTICLES.slice(0, 1), PROJECTS.slice(0, 1), customUrl);
    expect(txt).toContain("https://example.com/subpath/articles/");
    expect(txt).not.toContain("https://example.com/subpath//articles/");
  });

  it("computes deterministic SHA-256 content hashes", () => {
    const hash1 = computeContentHash("sample content");
    const hash2 = computeContentHash("sample content");
    const hash3 = computeContentHash("different content");
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1).toHaveLength(8);
  });

  it("handles projects with relative or missing GitHub URLs and no stars", () => {
    const mockProject = {
      ...PROJECTS[0],
      githubUrl: "/projects/sample",
      stars: undefined,
    };
    const txt = generateLlmsTxt(ARTICLES.slice(0, 1), [mockProject], "https://michael-svendsen.dev");
    expect(txt).toContain("https://michael-svendsen.dev/projects/");

    const full = generateLlmsFullTxt(ARTICLES.slice(0, 1), [mockProject], "https://michael-svendsen.dev");
    expect(full).toContain("Stars/Scale**: OSS");
  });
});
