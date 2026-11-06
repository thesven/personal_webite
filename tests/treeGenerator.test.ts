import { describe, it, expect } from "vitest";
import { generateAsciiTree, getFileIcon } from "@/lib/treeGenerator";

describe("ASCII Terminal Tree Generator", () => {
  it("should return root line for empty paths", () => {
    const tree = generateAsciiTree([], "my-repo");
    expect(tree).toBe("my-repo\n\n0 directories, 0 files");
  });

  it("should generate valid tree hierarchy for single level files", () => {
    const paths = ["README.md", "package.json"];
    const tree = generateAsciiTree(paths, "root", { includeIcons: false });
    expect(tree).toContain("root");
    expect(tree).toContain("├── package.json");
    expect(tree).toContain("└── README.md");
    expect(tree).toContain("0 directories, 2 files");
  });

  it("should generate valid tree hierarchy for nested directory paths", () => {
    const paths = [
      "dbt/models/marts/fct_orders.sql",
      "aws/lambda/handler.py",
      "README.md",
    ];
    const tree = generateAsciiTree(paths, "reactiv-platform");
    expect(tree).toContain("reactiv-platform");
    expect(tree).toContain("aws");
    expect(tree).toContain("dbt");
    expect(tree).toContain("README.md");
    expect(tree).toMatch(/\d+ directories, \d+ files/);
  });

  it("should return appropriate file icons based on file extension", () => {
    expect(getFileIcon("handler.py")).toBe("🐍");
    expect(getFileIcon("model.sql")).toBe("📊");
    expect(getFileIcon("index.ts")).toBe("📘");
    expect(getFileIcon("config.yaml")).toBe("⚙");
    expect(getFileIcon("readme.md")).toBe("📝");
    expect(getFileIcon("package.json")).toBe("⚙");
    expect(getFileIcon("unknown.xyz")).toBe("📄");
    expect(getFileIcon("no_extension")).toBe("📄");
  });
});
