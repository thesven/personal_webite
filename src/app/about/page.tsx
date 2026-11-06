import React from "react";
import type { Metadata } from "next";
import { AboutClient } from "@/components/about/AboutClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getAboutFaqSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Biography, Career Journal & Security",
  description:
    "Career journal, technical leadership, verified credentials, and PGP security key for Michael Svendsen — Senior Backend & AI Platform Engineer.",
  alternates: {
    canonical: "/about/",
  },
  openGraph: {
    title: "Biography, Career Journal & Security | Michael Svendsen",
    description:
      "Career timeline at Reactiv, Chronic Ink, Cannondale, verified credentials, skills, and PGP keycard for Michael Svendsen.",
    url: "https://michael-svendsen.dev/about/",
    type: "profile",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Biography, Career Journal & Security — Michael Svendsen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Biography, Career Journal & Security | Michael Svendsen",
    description:
      "Career timeline at Reactiv, verified credentials, skills, and PGP keycard for Michael Svendsen.",
    creator: "@thesven",
    images: ["/og-image.png"],
  },
};

export default function AboutPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Biography & Career", url: "/about/" },
  ]);

  const faqSchema = getAboutFaqSchema();

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={faqSchema} />
      <AboutClient />
    </>
  );
}
