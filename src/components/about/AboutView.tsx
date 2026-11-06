"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const CAREER_COMMITS = [
  {
    hash: "a9f82d1",
    date: "2023 - Present",
    role: "Principal Systems Architect",
    company: "Distributed Telemetry Infrastructure",
    message: "feat(core): architect zero-copy kernel ingestion engine processing 10M+ pkts/sec",
    details: [
      "Designed eBPF-based distributed observability daemon reducing node memory footprint by 65%.",
      "Unified Wayland desktop telemetry protocol for real-time fleet diagnostics.",
    ],
  },
  {
    hash: "c41e809",
    date: "2020 - 2023",
    role: "Staff Infrastructure Engineer",
    company: "Cloud Native Systems Lab",
    message: "refactor(k8s): deploy bare-metal Kubernetes clusters with Cilium eBPF mesh",
    details: [
      "Eliminated iptables kube-proxy overhead via eBPF XDP socket acceleration.",
      "Engineered lock-free message ring buffers for multi-tenant streaming services.",
    ],
  },
  {
    hash: "7b23aa4",
    date: "2017 - 2020",
    role: "Senior Systems Engineer",
    company: "Low-Latency Networks",
    message: "perf(ipc): implement shared-memory zero-copy RPC framework",
    details: [
      "Built deterministic event loops in Rust and C with strict sub-microsecond jitter budgets.",
      "Optimized cache-line alignment and false-sharing mitigation across AMD EPYC sockets.",
    ],
  },
];

const SKILL_METERS = [
  { name: "Distributed Systems & Ingestion", level: 95, bar: "[██████████░]" },
  { name: "Linux Kernel, eBPF & Systems C/Rust", level: 92, bar: "[█████████░░]" },
  { name: "Wayland IPC, DRM & Compositor Tech", level: 88, bar: "[████████░░░]" },
  { name: "TypeScript, Canvas & TUI Tooling", level: 90, bar: "[█████████░░]" },
  { name: "Bare-Metal Linux, NixOS & Cilium", level: 86, bar: "[████████░░░]" },
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
          <span className="font-bold text-white/80">BIO // ARCHITECTURAL PHILOSOPHY</span>
          <span>MICHAEL SVENDSEN</span>
        </div>
        <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-sans">
          I am a systems architect and software engineer dedicated to building low-latency, deterministic, and resilient infrastructure. My craft spans kernel-level observability via eBPF, lock-free concurrency geometry, and minimalist terminal aesthetics. I believe the best software is fast, transparent, and built to endure without unnecessary dependencies or runtime bloat.
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
              <span>PGP SECURITY KEYCARD</span>
              <span className="text-emerald-400 text-[10px]">VERIFIED</span>
            </div>
            <div className="mt-2 text-white/50 text-[11px]">
              Fingerprint:
            </div>
            <div className="p-2.5 rounded bg-black/60 border border-white/10 font-mono text-[11px] text-white/80 break-all select-all mt-1">
              {PGP_FINGERPRINT}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <button
              onClick={copyPgp}
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition text-xs"
            >
              {copied ? "✓ Copied Key" : "Copy PGP Key"}
            </button>
            <div className="flex items-center gap-3 text-white/40">
              <a
                href="https://github.com/thesven"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                GitHub
              </a>
              <span>•</span>
              <a
                href="mailto:contact@thesven.dev"
                className="hover:text-white transition"
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
