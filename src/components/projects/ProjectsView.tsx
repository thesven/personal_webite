"use client";

import React from "react";
import { PROJECTS } from "@/data/projects";
import { useTheme } from "@/context/ThemeContext";

const ASCII_SYS_TOOLKIT_SCHEMA = `
┌────────────────────────────────────────────────────────┐
│                   sys-toolkit Architecture             │
└────────────────────────────────────────────────────────┘
          ┌──────────────────────────────────┐
          │  Kernel Space: eBPF Probes / DRM │
          └─────────────────┬────────────────┘
                            │ (BPF_MAP_TYPE_RINGBUF)
                            ▼
          ┌──────────────────────────────────┐
          │ Lock-Free Single-Producer Buffer │
          └─────────────────┬────────────────┘
                            │ Zero-Copy IPC
                            ▼
          ┌──────────────────────────────────┐
          │  Wayland Client / wlroots Comps  │
          └─────────────────┬────────────────┘
                            ▼
       ┌────────────────────┴────────────────────┐
       ▼                                         ▼
 ┌───────────────┐                       ┌───────────────┐
 │ TUI Terminal  │                       │ 144Hz Overlay │
 └───────────────┘                       └───────────────┘
`.trim();

export function ProjectsView() {
  const { themeConfig } = useTheme();

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Flagship Project Card with ASCII Architecture */}
      <div
        className="rounded-lg border p-5 shadow-lg transition-colors space-y-4"
        style={{
          backgroundColor: themeConfig.palette.card,
          borderColor: themeConfig.palette.border,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
          <div className="flex items-center gap-2">
            <span style={{ color: themeConfig.palette.accent }} className="font-bold text-base">
              sys-toolkit
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70">
              v1.4.2
            </span>
            <span className="text-emerald-400 text-[11px] font-bold">+420 -18</span>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-[11px]">
            <span>★ 1.2k stars</span>
            <span>•</span>
            <a
              href="https://github.com/thesven/personal_webite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              github.com/thesven/sys-toolkit &rarr;
            </a>
          </div>
        </div>

        <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
          Low-overhead eBPF event tracer coupled with a lock-free ring buffer and zero-copy Wayland IPC connector. Provides microsecond-level system metrics to desktop overlays and CLI monitors without impacting host throughput.
        </p>

        {/* Embedded ASCII Schema Box */}
        <div className="bg-black/60 rounded p-4 border border-white/10 overflow-x-auto">
          <pre
            className="leading-snug select-none text-center sm:text-left"
            style={{ color: themeConfig.palette.cyan }}
          >
            {ASCII_SYS_TOOLKIT_SCHEMA}
          </pre>
        </div>

        {/* Tree paths & Stack */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {["Rust", "eBPF", "C", "Wayland IPC", "Linux 6.x"].map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10 text-[11px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Supporting Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECTS.filter((p) => p.slug !== "sys-toolkit").map((p) => (
          <div
            key={p.slug}
            className="rounded-lg border p-4 shadow-md transition-colors space-y-3 flex flex-col justify-between"
            style={{
              backgroundColor: themeConfig.palette.card,
              borderColor: themeConfig.palette.border,
            }}
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="font-bold text-white text-sm">{p.title}</span>
                <span className="text-emerald-400 font-bold text-[11px]">{p.gitDelta}</span>
              </div>
              <div className="text-[10px] text-white/40 mb-1">[{p.category}]</div>
              <p className="text-white/60 text-xs leading-relaxed">{p.description}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex flex-wrap gap-1">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 border border-white/5"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
                <span>{p.version}</span>
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  repo &rarr;
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
