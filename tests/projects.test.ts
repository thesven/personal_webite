import { describe, it, expect } from "vitest";
import { PROJECTS } from "@/data/projects";

describe("Projects Data Repository", () => {
  it("should have all key projects loaded", () => {
    expect(PROJECTS.length).toBeGreaterThanOrEqual(6);
  });

  it("should have valid schema for each project", () => {
    PROJECTS.forEach((proj) => {
      expect(proj.slug).toBeDefined();
      expect(proj.title).toBeDefined();
      expect(proj.category).toBeDefined();
      expect(proj.stack.length).toBeGreaterThan(0);
      expect(proj.githubUrl).toMatch(/^https?:\/\//);
      expect(proj.treePaths).toBeDefined();
      expect(proj.treePaths.length).toBeGreaterThan(0);
    });
  });

  it("should include flagship projects Reactiv, LiteMCP and spypoint_mcp", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(slugs).toContain("reactiv-platform");
    expect(slugs).toContain("litemcp");
    expect(slugs).toContain("spypoint-mcp");
    expect(slugs).toContain("gguf-n-go");
  });
});
