import React from "react";
import type { Metadata } from "next";
import { SysClient } from "@/components/sys/SysClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "System Telemetry & Architecture Dashboard",
  description:
    "Live system specs, Fastfetch profile, real-time telemetry sparklines, and interactive TUI shell showcasing Michael Svendsen's systems engineering stack.",
  alternates: {
    canonical: "/sys/",
  },
  openGraph: {
    title: "System Telemetry & Architecture Dashboard | Michael Svendsen",
    description:
      "Fastfetch specifications, real-time telemetry sparklines, and interactive TUI shell showcasing Michael Svendsen's systems engineering environment.",
    url: "https://michael-svendsen.dev/sys/",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "System Telemetry & Architecture Dashboard — Michael Svendsen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "System Telemetry & Architecture Dashboard | Michael Svendsen",
    description:
      "Fastfetch specifications, real-time telemetry sparklines, and interactive TUI shell.",
    creator: "@thesven",
    images: ["/og-image.png"],
  },
};

export default function SystemDashboardPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "System Dashboard", url: "/sys/" },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <SysClient />
    </>
  );
}
