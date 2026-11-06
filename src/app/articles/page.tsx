import React from "react";
import type { Metadata } from "next";
import { ARTICLES } from "@/data/articles";
import { ArticlesClient } from "@/components/articles/ArticlesClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getArticlesListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Technical Publications & Systems Research",
  description:
    "Technical essays and engineering research on Snowflake, dbt, AWS Bedrock AgentCore, Model Context Protocol (MCP) on Cloudflare Workers, GGUF quantization, and telemetry systems by Michael Svendsen.",
  alternates: {
    canonical: "/articles/",
  },
  openGraph: {
    title: "Technical Publications & Systems Research | Michael Svendsen",
    description:
      "Deep dives into Snowflake, dbt, Bedrock AgentCore multi-agent systems, Model Context Protocol on Cloudflare Workers, and low-latency systems.",
    url: "https://michael-svendsen.dev/articles/",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Technical Publications & Systems Research — Michael Svendsen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Publications & Systems Research | Michael Svendsen",
    description:
      "Deep dives into Snowflake, dbt, Bedrock AgentCore multi-agent systems, and MCP on Cloudflare Workers.",
    creator: "@thesven",
    images: ["/og-image.png"],
  },
};

export default function ArticlesPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Technical Publications", url: "/articles/" },
  ]);

  const articlesSchema = getArticlesListSchema(ARTICLES);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={articlesSchema} />
      <ArticlesClient />
    </>
  );
}
