import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ShellLayout } from "@/components/layout/ShellLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { getPersonSchema, getWebsiteSchema } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#07080c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://michael-svendsen.dev"),
  title: {
    default: "Michael Svendsen — Senior Backend & AI Platform Engineer",
    template: "%s | Michael Svendsen",
  },
  description:
    "Production analytics, personalization, data infrastructure (Snowflake, dbt, AWS Bedrock AgentCore), Model Context Protocol (MCP), and open-source AI tooling by Michael Svendsen.",
  applicationName: "Michael Svendsen Personal Website",
  authors: [{ name: "Michael Svendsen", url: "https://michael-svendsen.dev" }],
  creator: "Michael Svendsen",
  publisher: "Michael Svendsen",
  keywords: [
    "Michael Svendsen",
    "thesven",
    "Senior Backend Engineer",
    "AI Platform Engineer",
    "Snowflake",
    "dbt",
    "AWS Bedrock",
    "AgentCore",
    "Model Context Protocol",
    "MCP",
    "LiteMCP",
    "Cloudflare Workers",
    "Analytics",
    "Personalization",
    "Data Infrastructure",
    "Python",
    "TypeScript",
    "Rust",
    "GGUF Quantization",
    "Reactiv",
    "Toronto Software Engineer",
  ],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
      "application/feed+json": "/feed.json",
    },
  },
  openGraph: {
    title: "Michael Svendsen — Senior Backend & AI Platform Engineer",
    description:
      "Production analytics, personalization, data infrastructure (Snowflake, dbt, AWS Bedrock AgentCore), Model Context Protocol (MCP), and open-source AI tooling by Michael Svendsen.",
    url: "https://michael-svendsen.dev",
    siteName: "Michael Svendsen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Michael Svendsen — Senior Backend & AI Platform Engineer",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael Svendsen — Senior Backend & AI Platform Engineer",
    description:
      "Production analytics, personalization, data infrastructure (Snowflake, dbt, AWS Bedrock AgentCore), Model Context Protocol (MCP), and open-source AI tooling.",
    creator: "@thesven",
    site: "@thesven",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/og-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = getPersonSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("ms_theme");if(t){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`,
          }}
        />
        <JsonLd schema={personSchema} />
        <JsonLd schema={websiteSchema} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-white/20 selection:text-white min-h-screen flex flex-col bg-[#07080c] text-[#e0e2ec]`}
      >
        <AnalyticsTracker />
        <ThemeProvider>
          <ShellLayout>{children}</ShellLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
