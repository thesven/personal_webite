"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const CAREER_COMMITS = [
  {
    hash: "f4a81c2",
    date: "2024 - Present",
    role: "AI Systems & Edge Protocol Engineer",
    company: "Open Source AI & Cloudflare Edge",
    message: "feat(mcp): architect LiteMCP edge framework & automated GGUF quantization pipelines",
    details: [
      "Engineered LiteMCP, a Cloudflare Worker-native Model Context Protocol framework supporting JSON-RPC 2.0 and Server-Sent Events.",
      "Built GGUF-n-Go to automate Hugging Face model quantization for local inference on llama.cpp and Ollama.",
      "Fine-tuned code generation models (Aether-Qwen, CodeBagel) using PEFT/LoRA and curated community preference datasets.",
    ],
  },
  {
    hash: "b9e2301",
    date: "2020 - 2024",
    role: "Staff Software & Infrastructure Engineer",
    company: "Distributed Systems & Telemetry Labs",
    message: "feat(sdk): build typed telemetry clients and edge streaming infrastructures",
    details: [
      "Designed iracing-data-sdk, providing end-to-end typed schemas and rate-limit managers for high-frequency telemetry.",
      "Architected serverless edge pipelines and automated deployments with Cloudflare Pages and SST Ion.",
      "Implemented zero-dependency binary parsers for multimedia streams and CIELAB perceptual color spaces.",
    ],
  },
  {
    hash: "6d10fa4",
    date: "2015 - 2020",
    role: "Senior Full-Stack & Systems Developer",
    company: "Modern Web & Data Solutions",
    message: "refactor(data): develop real-time event parsers, SDKs, and interactive client runtimes",
    details: [
      "Constructed modular TypeScript utilities, token replacement engines, and high-performance client libraries.",
      "Developed robust state management and event brokers for real-time applications and simulation tooling.",
    ],
  },
];

const SKILL_METERS = [
  { name: "Model Context Protocol (MCP) & Edge Workers", level: 96, bar: "[██████████░]" },
  { name: "TypeScript, Node.js & Production SDKs", level: 94, bar: "[█████████░░]" },
  { name: "LLM Fine-Tuning & GGUF Quantization (PEFT/TRL)", level: 90, bar: "[█████████░░]" },
  { name: "Python, PyTorch & Data Pipelines", level: 88, bar: "[████████░░░]" },
  { name: "Edge Web Architecture (Next.js, SST, Cloudflare)", level: 92, bar: "[█████████░░]" },
];

const PGP_FINGERPRINT = "4A92 F81C 023E B7D8 99A1 7F04 5356 454E 4D53 2026";

export function AboutView() {
  const { themeConfig } = useTheme();
  const [copied, setCopied] = useState(false);

  const copyPgp = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(PGP_FINGERPRINT);
      setCopied(true);
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
          <span className="font-bold text-white/80">BIO // ENGINEERING PHILOSOPHY</span>
          <span>MICHAEL SVENDSEN • TORONTO, CA</span>
        </div>
        <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-sans">
          I am a software engineer and systems architect based in Toronto, Ontario, dedicated to building resilient edge computing systems, Model Context Protocol (MCP) integrations, and developer tooling. My recent work focuses on serverless AI runtimes on Cloudflare Workers, automated LLM quantization pipelines, and instruction-tuned code generation models on Hugging Face. Beyond computing, I am a wildlife and astrophotographer documenting Ontario’s skies and natural ecosystems.
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
          <span className="text-emerald-400">● 3 COMMITS</span>
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
                    <span className="text-white/40">@ {item.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-[11px]">
                    <span className="text-white/30">{item.hash}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
                <div className="text-white/60 text-xs italic">{item.message}</div>
                <ul className="list-disc list-inside space-y-0.5 text-white/70 pl-1 text-[11px]">
                  {item.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
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
          <div className="space-y-2">
            {SKILL_METERS.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-[11px]">
                <span className="text-white/60">{s.name}</span>
                <span style={{ color: themeConfig.palette.cyan }}>
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
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition text-xs cursor-pointer"
            >
              {copied ? "✓ Copied Key" : "Copy PGP Key"}
            </button>
            <div className="flex flex-wrap items-center gap-2 text-white/60 text-[11px]">
              <a
                href="https://www.linkedin.com/in/mikesven/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition"
              >
                LinkedIn
              </a>
              <span>•</span>
              <a
                href="https://github.com/thesven"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition"
              >
                GitHub
              </a>
              <span>•</span>
              <a
                href="https://huggingface.co/thesven"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition"
              >
                Hugging Face
              </a>
              <span>•</span>
              <a
                href="https://photography.mikesvendsen.net"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition"
              >
                Photography
              </a>
              <span>•</span>
              <a
                href="mailto:michael@mikesvendsen.net"
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
