import { describe, it, expect } from "vitest";
import { renderMarkdown } from "@/lib/markdown";

describe("Markdown Rendering Engine", () => {
  it("should return empty string for null or empty content", () => {
    expect(renderMarkdown("")).toBe("");
  });

  it("should render standard markdown paragraphs and headings", () => {
    const raw = "# Heading 1\n\nThis is a paragraph.";
    const html = renderMarkdown(raw);
    expect(html).toContain("<h1>Heading 1</h1>");
    expect(html).toContain("<p>This is a paragraph.</p>");
  });

  it("should transform GitHub-style [!NOTE] callouts into styled alert boxes", () => {
    const raw = "> [!NOTE]\n> This is an important system note.";
    const html = renderMarkdown(raw);
    expect(html).toContain("NOTE");
    expect(html).toContain("This is an important system note.");
    expect(html).toContain("border-cyan-500/40");
  });

  it("should transform GitHub-style [!TIP] callouts into styled alert boxes", () => {
    const raw = "> [!TIP]\n> Use zero-allocation buffers for speed.";
    const html = renderMarkdown(raw);
    expect(html).toContain("TIP");
    expect(html).toContain("Use zero-allocation buffers for speed.");
    expect(html).toContain("border-emerald-500/40");
  });

  it("should transform GitHub-style [!IMPORTANT] callouts into styled alert boxes", () => {
    const raw = "> [!IMPORTANT]\n> Ensure Snowflake credentials use secret manager.";
    const html = renderMarkdown(raw);
    expect(html).toContain("IMPORTANT");
    expect(html).toContain("border-purple-500/40");
  });

  it("should transform GitHub-style [!WARNING] callouts into styled alert boxes", () => {
    const raw = "> [!WARNING]\n> Never run destructive operations in production.";
    const html = renderMarkdown(raw);
    expect(html).toContain("WARNING");
    expect(html).toContain("border-amber-500/40");
  });

  it("should wrap code blocks with copy-ready pre blocks and language metadata", () => {
    const raw = "```python\ndef handler():\n    return 42\n```";
    const html = renderMarkdown(raw);
    expect(html).toContain("<pre");
    expect(html).toContain("<code");
    expect(html).toContain("language-python");
    expect(html).toContain("copy-code-btn");
  });

  it("should handle code blocks without explicit language", () => {
    const raw = "```\nplain text content\n```";
    const html = renderMarkdown(raw);
    expect(html).toContain("language-text");
    expect(html).toContain("copy-code-btn");
  });
});
