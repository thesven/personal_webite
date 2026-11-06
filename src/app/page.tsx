import React from "react";
import Link from "next/link";
import { RootScreensaverClient } from "@/components/screensaver/RootScreensaverClient";
import { ARTICLES } from "@/data/articles";
import { PROJECTS } from "@/data/projects";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo";

export default function RootScreensaverPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />

      {/* Interactive Terminal Screensaver Canvas */}
      <RootScreensaverClient />

      {/* Semantic Crawlable Content for Search Engines & LLM Ingestion (AEO / GEO / SEO) */}
      <section
        className="sr-only"
        aria-label="Michael Svendsen — Senior Backend & AI Platform Engineer Overview"
      >
        <header>
          <h1>Michael Svendsen — Senior Backend &amp; AI Platform Engineer</h1>
          <p>
            Welcome to the official personal website and systems engineering
            publication of Michael Svendsen (thesven). Based in Aurora /
            Toronto, Canada, Michael specializes in high-throughput data lakes,
            Snowflake, dbt, AWS Bedrock AgentCore multi-agent systems, and
            open-source Model Context Protocol (MCP) tooling.
          </p>
        </header>

        <nav aria-label="Primary Workspaces">
          <h2>Site Navigation &amp; Workspaces</h2>
          <ul>
            <li>
              <Link href="/sys/">
                [1:sys] System Telemetry Dashboard &amp; Interactive Shell
              </Link>
            </li>
            <li>
              <Link href="/articles/">
                [2:docs] Technical Publications &amp; Systems Research
              </Link>
            </li>
            <li>
              <Link href="/projects/">
                [3:work] Systems &amp; Infrastructure Portfolio
              </Link>
            </li>
            <li>
              <Link href="/about/">
                [4:user] Biography, Career Journal &amp; PGP Security
              </Link>
            </li>
            <li>
              <Link href="/llms.txt">
                LLM Index (llms.txt standard)
              </Link>
            </li>
            <li>
              <Link href="/llms-full.txt">
                Complete LLM Markdown Knowledge Corpus (llms-full.txt)
              </Link>
            </li>
            <li>
              <Link href="/feed.xml">
                RSS 2.0 Feed
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2>Featured Technical Publications</h2>
          <ul>
            {ARTICLES.map((art) => (
              <li key={art.slug}>
                <article>
                  <h3>
                    <Link href={`/articles/${art.slug}/`}>{art.title}</Link>
                  </h3>
                  <p>{art.summary}</p>
                  <p>
                    Category: {art.category} | Tags: {art.tags.join(", ")} | Read
                    Time: {art.readTime}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Systems &amp; Open Source Projects</h2>
          <ul>
            {PROJECTS.map((proj) => (
              <li key={proj.slug}>
                <div>
                  <h3>{proj.title}</h3>
                  <p>{proj.tagline}</p>
                  <p>{proj.description}</p>
                  <p>Tech Stack: {proj.stack.join(", ")}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
