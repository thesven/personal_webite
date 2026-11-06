import { getArticleBySlug } from "@/data/articles";
import { ThemeId } from "@/context/ThemeContext";

export const SHELL_COMMANDS = [
  "help",
  "whoami",
  "skills",
  "certs",
  "articles",
  "projects",
  "about",
  "screensaver",
  "uname",
  "uptime",
  "clear",
  "theme",
  "cat",
];

const VALID_THEMES: ThemeId[] = [
  "tokyonight",
  "flexoki",
  "oxocarbon",
  "catppuccin",
  "monochrome",
];

export type ShellResult =
  | { type: "OUTPUT"; text: string }
  | { type: "NAVIGATE"; path: string; message: string }
  | { type: "THEME_CHANGE"; themeId: ThemeId; text: string }
  | { type: "CLEAR" }
  | { type: "ERROR"; text: string };

export function getShellCompletions(partial: string): string[] {
  const p = partial.trim().toLowerCase();
  if (!p) return [];
  return SHELL_COMMANDS.filter((cmd) => cmd.startsWith(p));
}

export function processShellCommand(rawInput: string): ShellResult {
  const input = rawInput.trim();
  if (!input) {
    return { type: "OUTPUT", text: "" };
  }

  const parts = input.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case "help":
      return {
        type: "OUTPUT",
        text: `Available shell utilities:
  whoami       - Developer identity and career profile
  skills       - Core stack: Python, SQL, Snowflake, dbt, AWS, Bedrock
  certs        - Professional credentials, Snowflake Northstar, FWA SOTD
  articles     - Navigate to [2:docs] Publications
  projects     - Navigate to [3:work] Systems Showcase
  about        - Navigate to [4:user] Biography & Career
  screensaver  - Return to root Delta Corps Priest 1 screensaver
  theme <name> - Switch theme (tokyonight, flexoki, oxocarbon, catppuccin, monochrome)
  cat <slug>   - Read technical publication synopsis
  uname -a     - Display workstation kernel architecture
  uptime       - Display simulated system uptime
  clear        - Clear terminal scrollback`,
      };

    case "whoami":
      return {
        type: "OUTPUT",
        text: `Michael Svendsen (Aurora / Toronto, Ontario, Canada)
Senior Backend & AI Platform Engineer @ Reactiv
Architecting production analytics, personalization, and data infrastructure across AWS and Snowflake with dbt. Creator of LiteMCP, SPYPOINT MCP, GGUF-n-Go, and open-source models on Hugging Face.`,
      };

    case "skills":
    case "stack":
      return {
        type: "OUTPUT",
        text: `Languages & Data: Python, SQL, TypeScript, Bash, Go
Data Platform: Snowflake, dbt, AWS (Lambda, Step Functions, Glue, Redshift Serverless)
AI & Agents: Amazon Bedrock AgentCore, Model Context Protocol (MCP), Deep Learning, LLM Fine-Tuning`,
      };

    case "certs":
    case "certifications":
      return {
        type: "OUTPUT",
        text: `• Snowflake Northstar — Data Ingestion, Transformation, and Delivery (Issued Apr 2025)
• Edinburgh Whisky Academy — Certificate in Scotch Whisky (Credential a4hn0jm0cd)
• Honors: FWA Site of the Day (Lexus IS with Jam3) & ADCC Bronze`,
      };

    case "articles":
    case "docs":
      return {
        type: "NAVIGATE",
        path: "/articles",
        message: "Navigating to [2:docs] Publications...",
      };

    case "projects":
    case "work":
      return {
        type: "NAVIGATE",
        path: "/projects",
        message: "Navigating to [3:work] Systems Showcase...",
      };

    case "about":
    case "user":
      return {
        type: "NAVIGATE",
        path: "/about",
        message: "Navigating to [4:user] Biography & Career...",
      };

    case "screensaver":
    case "tte":
      return {
        type: "NAVIGATE",
        path: "/",
        message: "Activating Delta Corps Priest 1 Screensaver...",
      };

    case "uname":
    case "uname -a":
      return {
        type: "OUTPUT",
        text: "Linux workstation 6.12.1-zen #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux",
      };

    case "uptime":
      return {
        type: "OUTPUT",
        text: "14:35:12 up 42 days, 3:18, 1 user, load average: 0.12, 0.08, 0.05",
      };

    case "clear":
      return { type: "CLEAR" };

    case "theme": {
      const targetTheme = args[0]?.toLowerCase() as ThemeId;
      if (!targetTheme || !VALID_THEMES.includes(targetTheme)) {
        return {
          type: "ERROR",
          text: `Unknown theme: ${args[0] || "(empty)"}. Valid options: ${VALID_THEMES.join(", ")}`,
        };
      }
      return {
        type: "THEME_CHANGE",
        themeId: targetTheme,
        text: `Switched system desktop theme to ${targetTheme}.`,
      };
    }

    case "cat": {
      const slug = args[0]?.trim();
      if (!slug) {
        return {
          type: "ERROR",
          text: "Usage: cat <article-slug> (e.g. cat spypoint-mcp-trail-camera-ai)",
        };
      }
      const article = getArticleBySlug(slug);
      if (!article) {
        return {
          type: "ERROR",
          text: `cat: ${slug}: No such publication buffer found.`,
        };
      }
      return {
        type: "OUTPUT",
        text: `=== ${article.title} ===
Category: ${article.category} | Date: ${article.date} | Read: ${article.readTime}
Tags: ${article.tags.join(" ")}
Summary: ${article.summary}`,
      };
    }

    default:
      return {
        type: "ERROR",
        text: `command not found: ${cmd}. Type help for valid commands.`,
      };
  }
}
