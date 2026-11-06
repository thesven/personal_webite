import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Waybar } from "@/components/layout/Waybar";
import { CommandPalette } from "@/components/layout/CommandPalette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Michael Svendsen — Senior Backend & AI Platform Engineer",
  description:
    "Production analytics, personalization, data infrastructure (Snowflake, dbt, AWS Bedrock AgentCore), Model Context Protocol (MCP), and open-source AI tooling by Michael Svendsen.",
  keywords: [
    "Michael Svendsen",
    "Senior Backend Engineer",
    "AI Platform Engineer",
    "Snowflake",
    "dbt",
    "AWS Bedrock",
    "AgentCore",
    "Model Context Protocol",
    "MCP",
    "Analytics",
    "Personalization",
    "Data Infrastructure",
    "Python",
    "TypeScript",
    "Reactiv",
  ],
  authors: [{ name: "Michael Svendsen" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-white/20 selection:text-white min-h-screen flex flex-col bg-[#07080c] text-[#e0e2ec]`}
      >
        <ThemeProvider>
          <Waybar />
          <CommandPalette />
          <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40 font-mono">
            <div>Michael Svendsen • Senior Backend & AI Platform Engineer • Aurora / Toronto, ON</div>
            <div className="text-[10px] text-white/25 mt-1">
              Static Edge Build • Cloudflare Pages • zero-database architecture
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
