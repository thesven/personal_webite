"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { trackPgpKeyCopy, trackExternalLinkClick } from "@/lib/analytics";

const CAREER_COMMITS = [
  {
    hash: "a91e48f",
    date: "Sep 2023 - Present",
    role: "Sr. Artificial Intelligence Developer",
    company: "Reactiv (Toronto, ON · Remote)",
    message: "feat(ai-platform): architect Snowflake/dbt e-commerce data platform & AWS Bedrock AgentCore builders",
    details: [
      "Own and architect scalable data, analytics, and AI platform infrastructure supporting high-volume Shopify-based merchants across the Reactiv ecosystem.",
      "Design, build, and operate production-grade ingestion and activation pipelines across AWS (Lambda, Step Functions, EventBridge, Glue, Redshift Serverless) and Snowflake.",
      "Established production analytics foundation using dbt and Snowflake, implementing data-quality testing and query optimizations that reduced core pipeline runtimes by 50%+.",
      "Lead system design and RFCs for multiple LLM-powered platforms, including AI configuration builders, Studio Agent Scheduler on Amazon Bedrock AgentCore, and MCP-based architectures with strict schema validation.",
      "Engineered single source of truth architecture ensuring customer-facing dashboards and autonomous AI agents consume identical metrics.",
      "Drive company-level OKRs focused on merchant sales growth through data and AI, balancing rapid delivery with scalability and operational excellence.",
    ],
  },
  {
    hash: "e72d11b",
    date: "Jan 2010 - Present",
    role: "Senior Software Engineer Consultant",
    company: "thesven (Toronto, ON · Remote)",
    message: "feat(oss): full-stack TypeScript applications, Python ML integrations, and open-source tooling",
    details: [
      "Lead design and development of complex web and mobile applications, high-performance APIs, and data pipelines using TypeScript and Python.",
      "Architected open-source AI tooling: LiteMCP (edge-native Model Context Protocol framework on Cloudflare Workers), GGUF-n-Go (Hugging Face model quantizer), and spypoint_mcp (19 tools, 112 automated tests for trail cameras).",
      "Trained and published instruction-tuned code generation models and preference datasets on Hugging Face (10,000+ community downloads).",
      "Act as trusted technical lead aligning UI/UX, product management, and data engineering to deliver high-performance, fault-tolerant solutions.",
    ],
  },
  {
    hash: "c38a902",
    date: "Dec 2018 - Sep 2023",
    role: "Digital Marketing Director & Engineering Leader",
    company: "Chronic Ink Tattoos (Toronto, ON)",
    message: "feat(scale): build world's first online flash-tattoo portal & scale multi-brand e-commerce",
    details: [
      "Led digital technology and marketing for 3 brands in the tattoo and body art industry with 10+ physical studio locations and 3 e-commerce properties.",
      "Ideated and implemented the world's first portal for the online sale of tattoos from artist-created flash, driving 10%+ revenue growth in 2020.",
      "Drove a 64% growth in organic web traffic and 200% growth in online e-commerce sales through technical SEO audits, custom analytics, and user funnels.",
      "Consolidated fragmented digital platforms, managed developer and creative teams, and maintained daily, weekly, and monthly ROI reporting.",
    ],
  },
  {
    hash: "8f031da",
    date: "Mar 2017 - Dec 2018",
    role: "Global Digital Marketing Manager",
    company: "Cycling Sports Group / Cannondale (Toronto, ON)",
    message: "feat(analytics): global marketing database, conversion testing & digital product launches",
    details: [
      "Increased organic web traffic on cannondale.com by 22% in 2018 through effective technical SEO and digital launch execution.",
      "Boosted email CTR by 7% via systematic A/B testing and behavioral audience segmentation.",
      "Managed global marketing database and reported on multi-channel customer journeys across worldwide retail touchpoints.",
    ],
  },
];

const SKILL_METERS = [
  { name: "Python, SQL & Data Modeling (dbt, Snowflake)", level: 98, bar: "[██████████░]" },
  { name: "AI Platforms & Agentic Systems (AWS Bedrock, MCP)", level: 95, bar: "[█████████░░]" },
  { name: "AWS Cloud Infrastructure (Lambda, Step Functions, Glue)", level: 92, bar: "[█████████░░]" },
  { name: "TypeScript, Node.js & Production SDKs", level: 94, bar: "[█████████░░]" },
  { name: "Deep Learning, LLM Fine-Tuning & Quantization (PEFT/GGUF)", level: 90, bar: "[█████████░░]" },
];

const CERTIFICATIONS_AND_HONORS = [
  {
    category: "CERTIFICATION",
    title: "Snowflake Northstar: Ingestion, Transformation & Delivery",
    issuer: "Snowflake",
    date: "Apr 2025",
    badge: "VERIFIED",
  },
  {
    category: "CERTIFICATION",
    title: "Certificate in Scotch Whisky",
    issuer: "Edinburgh Whisky Academy",
    date: "Jun 2022",
    badge: "CREDENTIAL a4hn0jm0cd",
  },
  {
    category: "HONOR & AWARD",
    title: "FWA - Site of the Day (Lexus IS)",
    issuer: "Favourite Website Awards (with Jam3media)",
    date: "Oct 2010",
    badge: "FWA SOTD",
  },
  {
    category: "HONOR & AWARD",
    title: "ADCC Bronze (Few Were Chosen)",
    issuer: "Advertising and Design Club of Canada",
    date: "ADCC",
    badge: "BRONZE",
  },
  {
    category: "EDUCATION",
    title: "Web Design, Development & Maintenance",
    issuer: "Humber College",
    date: "Toronto, ON",
    badge: "CERTIFICATE",
  },
  {
    category: "EDUCATION",
    title: "Digital Media Arts",
    issuer: "Seneca Polytechnic",
    date: "2005 - 2007",
    badge: "DIPLOMA",
  },
  {
    category: "VOLUNTEERING",
    title: "Acting Communications Director",
    issuer: "York Country Bowmen",
    date: "Jun 2020 - Present",
    badge: "COMMUNITY",
  },
];

const PGP_FINGERPRINT = "4A92 F81C 023E B7D8 99A1 7F04 5356 454E 4D53 2026";

export function AboutView() {
  const { themeConfig } = useTheme();
  const [copied, setCopied] = useState(false);

  const copyPgp = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(PGP_FINGERPRINT);
      setCopied(true);
      trackPgpKeyCopy(PGP_FINGERPRINT, "about_view");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Executive Bio */}
      <div
        className="rounded-lg border p-5 shadow-lg transition-colors space-y-3"
        style={{
          backgroundColor: themeConfig.palette.card,
          borderColor: themeConfig.palette.border,
        }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white/40">
          <span className="font-bold text-white/80">BIO // ENGINEERING LEADERSHIP</span>
          <span>MICHAEL SVENDSEN • AURORA, ON</span>
        </div>
        <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-sans">
          Senior Backend & AI Platform Engineer with extensive experience designing and operating production analytics, personalization, and data infrastructure for high-growth SaaS and consumer platforms. Currently at Reactiv, I own and architect end-to-end data pipelines across AWS (Bedrock AgentCore, Lambda, Step Functions, EventBridge, Glue, Redshift Serverless) and Snowflake with dbt—establishing the unified, single-source-of-truth data layer that makes both merchant dashboards and autonomous AI agents trustworthy.
        </p>
        <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-sans">
          With 16+ years of consulting and technical leadership through <span className="font-mono text-cyan-300">thesven</span>, I specialize in translating ambiguous product requirements into scalable, reliable systems in fast-paced environments—from edge Model Context Protocol (MCP) servers and LLM fine-tuning pipelines to high-throughput data engines. Beyond computing, I am an avid wildlife and astrophotographer documenting Ontario’s wilderness and night skies.
        </p>
      </div>

      {/* git log --graph Career Timeline */}
      <div
        className="rounded-lg border p-5 shadow-lg transition-colors space-y-4"
        style={{
          backgroundColor: themeConfig.palette.card,
          borderColor: themeConfig.palette.border,
        }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white/40">
          <span className="font-bold text-white/80">git log --graph --oneline // CAREER JOURNAL</span>
          <span className="text-emerald-400">● 4 COMMITS</span>
        </div>

        <div className="space-y-4">
          {CAREER_COMMITS.map((item, idx) => (
            <div key={item.hash} className="flex gap-3 items-start">
              <div className="text-white/30 select-none pt-0.5">
                {idx === 0 ? "●" : "├"}
                <div className="w-px h-full bg-white/10 mx-auto my-1" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span style={{ color: themeConfig.palette.accent }} className="font-bold">
                      {item.role}
                    </span>
                    <span className="text-white/50">@ {item.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-[11px]">
                    <span className="text-white/30">{item.hash}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
                <div className="text-white/60 text-xs italic">{item.message}</div>
                <ul className="list-disc list-inside space-y-1 text-white/75 pl-1 text-[11px] leading-relaxed">
                  {item.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications, Honors & Education Grid */}
      <div
        className="rounded-lg border p-5 shadow-lg transition-colors space-y-3"
        style={{
          backgroundColor: themeConfig.palette.card,
          borderColor: themeConfig.palette.border,
        }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white/40">
          <span className="font-bold text-white/80">CREDENTIALS, HONORS & EDUCATION</span>
          <span className="text-white/40">ACCREDITATIONS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {CERTIFICATIONS_AND_HONORS.map((c, i) => (
            <div
              key={i}
              className="p-3 rounded bg-black/40 border border-white/5 hover:border-white/15 transition space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] text-white/40">
                <span style={{ color: themeConfig.palette.cyan }}>{c.category}</span>
                <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-white/60 text-[9px]">
                  {c.badge}
                </span>
              </div>
              <div className="font-bold text-white text-xs">{c.title}</div>
              <div className="text-white/50 text-[11px]">
                {c.issuer} • <span className="text-white/40">{c.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competencies & PGP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Competency Meters */}
        <div
          className="rounded-lg border p-4 shadow-md transition-colors space-y-3"
          style={{
            backgroundColor: themeConfig.palette.card,
            borderColor: themeConfig.palette.border,
          }}
        >
          <div className="font-bold text-white pb-2 border-b border-white/10">
            TECHNICAL PROFICIENCY GAUGES
          </div>
          <div className="space-y-2.5">
            {SKILL_METERS.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-[11px]">
                <span className="text-white/70">{s.name}</span>
                <span style={{ color: themeConfig.palette.cyan }} className="font-mono">
                  {s.bar} {s.level}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PGP & Security Card */}
        <div
          className="rounded-lg border p-4 shadow-md transition-colors space-y-3 flex flex-col justify-between"
          style={{
            backgroundColor: themeConfig.palette.card,
            borderColor: themeConfig.palette.border,
          }}
        >
          <div>
            <div className="font-bold text-white pb-2 border-b border-white/10 flex items-center justify-between">
              <span>SECURITY & VERIFIED PROFILES</span>
              <span className="text-emerald-400 text-[10px]">VERIFIED</span>
            </div>
            <div className="mt-2 text-white/50 text-[11px]">
              PGP Key Fingerprint:
            </div>
            <div className="p-2.5 rounded bg-black/60 border border-white/10 font-mono text-[11px] text-white/80 break-all select-all mt-1">
              {PGP_FINGERPRINT}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5">
            <button
              onClick={copyPgp}
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition text-xs cursor-pointer font-mono"
            >
              {copied ? "✓ Copied Key" : "Copy PGP Key"}
            </button>
            <div className="flex flex-wrap items-center gap-2 text-white/60 text-[11px]">
              <a
                href="https://www.linkedin.com/in/mikesven/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackExternalLinkClick(
                    "https://www.linkedin.com/in/mikesven/",
                    "linkedin",
                    "about_footer"
                  )
                }
                className="hover:text-cyan-300 transition"
              >
                LinkedIn
              </a>
              <span>•</span>
              <a
                href="https://github.com/thesven"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackExternalLinkClick(
                    "https://github.com/thesven",
                    "github",
                    "about_footer"
                  )
                }
                className="hover:text-cyan-300 transition"
              >
                GitHub
              </a>
              <span>•</span>
              <a
                href="https://huggingface.co/thesven"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackExternalLinkClick(
                    "https://huggingface.co/thesven",
                    "demo",
                    "about_footer"
                  )
                }
                className="hover:text-cyan-300 transition"
              >
                Hugging Face
              </a>
              <span>•</span>
              <a
                href="https://photography.mikesvendsen.net"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackExternalLinkClick(
                    "https://photography.mikesvendsen.net",
                    "demo",
                    "about_footer"
                  )
                }
                className="hover:text-cyan-300 transition"
              >
                Photography
              </a>
              <span>•</span>
              <a
                href="mailto:michael@mikesvendsen.net"
                onClick={() =>
                  trackExternalLinkClick(
                    "mailto:michael@mikesvendsen.net",
                    "email",
                    "about_footer"
                  )
                }
                className="hover:text-cyan-300 transition"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
