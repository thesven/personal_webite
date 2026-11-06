import { describe, it, expect } from "vitest";
import {
  processShellCommand,
  getShellCompletions,
  SHELL_COMMANDS,
} from "@/lib/shellCommands";

describe("Interactive TUI Shell Command Engine", () => {
  it("should have registered shell commands", () => {
    expect(SHELL_COMMANDS.length).toBeGreaterThanOrEqual(10);
    expect(SHELL_COMMANDS).toContain("help");
    expect(SHELL_COMMANDS).toContain("whoami");
    expect(SHELL_COMMANDS).toContain("theme");
    expect(SHELL_COMMANDS).toContain("cat");
  });

  it("should provide tab completion candidates for partial strings", () => {
    expect(getShellCompletions("wh")).toEqual(["whoami"]);
    expect(getShellCompletions("art")).toEqual(["articles"]);
    expect(getShellCompletions("th")).toEqual(["theme"]);
    expect(getShellCompletions("nonexistent")).toEqual([]);
  });

  it("should execute help command", () => {
    const result = processShellCommand("help");
    expect(result.type).toBe("OUTPUT");
    if (result.type === "OUTPUT") {
      expect(result.text).toContain("Available shell utilities");
    }
  });

  it("should execute whoami command", () => {
    const result = processShellCommand("whoami");
    expect(result.type).toBe("OUTPUT");
    if (result.type === "OUTPUT") {
      expect(result.text).toContain("Michael Svendsen");
      expect(result.text).toContain("Reactiv");
    }
  });

  it("should execute clear command", () => {
    const result = processShellCommand("clear");
    expect(result.type).toBe("CLEAR");
  });

  it("should execute workspace navigation commands", () => {
    expect(processShellCommand("articles")).toEqual({
      type: "NAVIGATE",
      path: "/articles",
      message: "Navigating to [2:docs] Publications...",
    });

    expect(processShellCommand("projects")).toEqual({
      type: "NAVIGATE",
      path: "/projects",
      message: "Navigating to [3:work] Systems Showcase...",
    });

    expect(processShellCommand("about")).toEqual({
      type: "NAVIGATE",
      path: "/about",
      message: "Navigating to [4:user] Biography & Career...",
    });

    expect(processShellCommand("screensaver")).toEqual({
      type: "NAVIGATE",
      path: "/",
      message: "Activating Delta Corps Priest 1 Screensaver...",
    });
  });

  it("should handle theme switching command with valid and invalid themes", () => {
    const valid = processShellCommand("theme catppuccin");
    expect(valid.type).toBe("THEME_CHANGE");
    if (valid.type === "THEME_CHANGE") {
      expect(valid.themeId).toBe("catppuccin");
    }

    const invalid = processShellCommand("theme neon-synth");
    expect(invalid.type).toBe("ERROR");
    if (invalid.type === "ERROR") {
      expect(invalid.text).toContain("Unknown theme");
    }
  });

  it("should handle cat <slug> to read article metadata", () => {
    const cat = processShellCommand("cat spypoint-mcp-trail-camera-ai");
    expect(cat.type).toBe("OUTPUT");
    if (cat.type === "OUTPUT") {
      expect(cat.text).toContain("SPYPOINT MCP");
    }

    const notFound = processShellCommand("cat non-existent-article");
    expect(notFound.type).toBe("ERROR");
    if (notFound.type === "ERROR") {
      expect(notFound.text).toContain("No such publication");
    }
  });

  it("should return error for unrecognized commands", () => {
    const res = processShellCommand("fizzbuzz");
    expect(res.type).toBe("ERROR");
    if (res.type === "ERROR") {
      expect(res.text).toContain("command not found: fizzbuzz");
    }
  });

  it("should handle empty or whitespace-only inputs", () => {
    const empty = processShellCommand("   ");
    expect(empty.type).toBe("OUTPUT");
    if (empty.type === "OUTPUT") {
      expect(empty.text).toBe("");
    }
  });

  it("should handle skills, certs, uname, and uptime commands", () => {
    const skills = processShellCommand("skills");
    if (skills.type === "OUTPUT") expect(skills.text).toContain("Languages & Data");

    const certs = processShellCommand("certs");
    if (certs.type === "OUTPUT") expect(certs.text).toContain("Snowflake Northstar");

    const uname = processShellCommand("uname -a");
    if (uname.type === "OUTPUT") expect(uname.text).toContain("Linux");

    const uptime = processShellCommand("uptime");
    if (uptime.type === "OUTPUT") expect(uptime.text).toContain("up");
  });

  it("should handle cat command when no slug is provided", () => {
    const noArg = processShellCommand("cat");
    expect(noArg.type).toBe("ERROR");
    if (noArg.type === "ERROR") {
      expect(noArg.text).toContain("Usage: cat <article-slug>");
    }
  });

  it("should return empty list when autocompleting empty string", () => {
    expect(getShellCompletions("")).toEqual([]);
  });
});
