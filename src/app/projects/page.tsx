import React from "react";
import type { Metadata } from "next";
import { PROJECTS } from "@/data/projects";
import { ProjectsClient } from "@/components/projects/ProjectsClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getProjectsListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Systems & Infrastructure Portfolio",
  description:
    "Production platforms and open-source systems: Reactiv E-Commerce Data & AI Platform, LiteMCP (Model Context Protocol for Cloudflare Workers), GGUF-n-Go, spypoint_mcp, and telemetry SDKs by Michael Svendsen.",
  alternates: {
    canonical: "/projects/",
  },
  openGraph: {
    title: "Systems & Infrastructure Portfolio | Michael Svendsen",
    description:
      "Production platforms, architecture diagrams, and open-source systems: Reactiv, LiteMCP, GGUF-n-Go, and spypoint_mcp.",
    url: "https://michael-svendsen.dev/projects/",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Systems & Infrastructure Portfolio — Michael Svendsen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Systems & Infrastructure Portfolio | Michael Svendsen",
    description:
      "Production platforms, architecture diagrams, and open-source systems: Reactiv, LiteMCP, GGUF-n-Go, and spypoint_mcp.",
    creator: "@thesven",
    images: ["/og-image.png"],
  },
};

export default function ProjectsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Systems Portfolio", url: "/projects/" },
  ]);

  const projectsSchema = getProjectsListSchema(PROJECTS);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={projectsSchema} />
      <ProjectsClient />
    </>
  );
}
