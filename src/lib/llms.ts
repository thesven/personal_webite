import { Article, ARTICLES } from "@/data/articles";
import { Project, PROJECTS } from "@/data/projects";
import { SITE_URL } from "@/lib/seo";

export function generateLlmsTxt(
  articles: Article[] = ARTICLES,
  projects: Project[] = PROJECTS,
  baseUrl: string = SITE_URL
): string {
  const cleanUrl = baseUrl.replace(/\/$/, "");

  const articleEntries = articles
    .map(
      (art) =>
        `- [${art.title}](${cleanUrl}/articles/${art.slug}/): ${art.summary} (Category: ${art.category}, Read Time: ${art.readTime})`
    )
    .join("\n");

  const projectEntries = projects
    .map((p) => {
      const link = p.githubUrl.startsWith("http")
        ? p.githubUrl
        : `${cleanUrl}/projects/`;
      return `- [${p.title}](${link}): ${p.tagline}. ${p.description} (Stack: ${p.stack.join(", ")})`;
    })
    .join("\n");

  return `# Michael Svendsen

> Senior Backend & AI Platform Engineer specializing in Snowflake, dbt, AWS Bedrock AgentCore, Model Context Protocol (MCP), and open-source AI tooling.

- Website: ${cleanUrl}/
- GitHub: https://github.com/thesven
- Hugging Face: https://huggingface.co/thesven
- Photography: https://photography.mikesvendsen.net
- RSS Feed: ${cleanUrl}/feed.xml
- Full LLM Corpus: ${cleanUrl}/llms-full.txt

## Primary Workspaces & System Overview
- [System Telemetry Dashboard](${cleanUrl}/sys/): Live system specifications, Fastfetch profile, real-time telemetry sparklines, and interactive TUI shell.
- [Technical Publications](${cleanUrl}/articles/): In-depth engineering research on data architecture, AI agents, MCP, and systems programming.
- [Systems & Infrastructure Portfolio](${cleanUrl}/projects/): Production platforms, architecture schemas, and open-source tooling.
- [Biography & Career Journal](${cleanUrl}/about/): Career timeline, engineering leadership, verified certifications, and PGP keycard.

## Technical Publications
${articleEntries}

## Key Systems & Open Source Projects
${projectEntries}

## Core Competencies & Technical Stack
- Data Platforms: Snowflake, dbt, SQL Data Modeling, Reverse ETL, Real-time Shopify Pipelines
- AI & Agentic Infrastructure: AWS Bedrock AgentCore, Model Context Protocol (MCP), LiteMCP, Cloudflare Workers
- Languages & Tooling: Python, TypeScript, Rust, Node.js, Next.js, Linux / Hyprland
- Machine Learning & Optimization: Hugging Face PEFT, LoRA, GGUF Quantization, llama.cpp, CIELAB Color Science
`.trim();
}

export function generateLlmsFullTxt(
  articles: Article[] = ARTICLES,
  projects: Project[] = PROJECTS,
  baseUrl: string = SITE_URL
): string {
  const cleanUrl = baseUrl.replace(/\/$/, "");

  const articlesFullMarkdown = articles
    .map((art) => {
      return `---

# ARTICLE: ${art.title}
- **URL**: ${cleanUrl}/articles/${art.slug}/
- **Author**: ${art.author}
- **Date**: ${art.date}
- **Category**: ${art.category}
- **Read Time**: ${art.readTime}
- **Tags**: ${art.tags.join(", ")}
- **Executive Summary**: ${art.summary}
- **Subtitle**: ${art.subtitle}

## Content:

${art.content}
`;
    })
    .join("\n\n");

  const projectsFullMarkdown = projects
    .map((p) => {
      return `### ${p.title} (${p.category})
- **Version**: ${p.version} | **Stars/Scale**: ${p.stars || "OSS"} | **Git Delta**: ${p.gitDelta}
- **URL**: ${p.githubUrl}
- **Stack**: ${p.stack.join(", ")}
- **Description**: ${p.description}
- **Sample Source Hierarchy**:
${p.treePaths.map((tp) => `  - ${tp}`).join("\n")}
`;
    })
    .join("\n");

  return `# Michael Svendsen — Complete Systems & Engineering Knowledge Base

> Comprehensive technical documentation, architecture essays, project specifications, and professional background for Michael Svendsen (thesven). Designed for LLMs, agentic search systems, and automated reasoning engines.

- Canonical URL: ${cleanUrl}/
- Updated: 2026-11-06
- Author: Michael Svendsen (Senior Backend & AI Platform Engineer)
- Location: Aurora / Toronto, Ontario, Canada
- Current Role: Sr. Artificial Intelligence Developer at Reactiv (https://www.reactiv.ai)
- GitHub: https://github.com/thesven
- Hugging Face: https://huggingface.co/thesven
- PGP Fingerprint: 4A92 F81C 023E B7D8 99A1 7F04 5356 454E 4D53 2026

---

## Executive Biography & Background
Michael Svendsen is a Senior Backend & AI Platform Engineer with 16+ years of engineering and consulting experience. He architects and operates production analytics, personalization, and data infrastructure for high-growth SaaS and consumer platforms.

At Reactiv, Michael owns end-to-end data pipelines across AWS (Bedrock AgentCore, Lambda, Step Functions, EventBridge, Glue, Redshift Serverless) and Snowflake with dbt—establishing the single-source-of-truth data layer that makes both merchant dashboards and autonomous AI Studio agents trustworthy.

---

## Systems & Open Source Projects Catalog

${projectsFullMarkdown}

---

## Complete Technical Publications Corpus (${articles.length} In-Depth Essays)

${articlesFullMarkdown}
`.trim();
}
