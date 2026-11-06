"use client";

import React, { useState } from "react";
import { PROJECTS, Project } from "@/data/projects";
import { useTheme } from "@/context/ThemeContext";
import { generateAsciiTree } from "@/lib/treeGenerator";
import { playSwitchClick } from "@/lib/audio";
import { trackExternalLinkClick } from "@/lib/analytics";

const ASCII_SPYPOINT_MCP_SCHEMA = `
┌────────────────────────────────────────────────────────┐
│             spypoint_mcp IoT Architecture              │
└────────────────────────────────────────────────────────┘
          ┌────────────────────────────────────┐
          │    Cellular Trail Cameras (Field)  │
          └─────────────────┬──────────────────┘
                            │ (Cellular Uplink)
                            ▼
          ┌────────────────────────────────────┐
          │      SPYPOINT Cloud Telemetry      │
          └─────────────────┬──────────────────┘
                            │ (Read-Only REST API)
                            ▼
          ┌────────────────────────────────────┐
          │    spypoint_mcp (19 Tools / 112 Tests)│
          │  - 15-Min Burst Clustering Engine  │
          │  - In-Memory Contact Sheets (Pillow)│
          └─────────────────┬──────────────────┘
                            ▼
          ┌────────────────────────────────────┐
          │ Claude / Autonomous Agent Scouting │
          └────────────────────────────────────┘
`.trim();

export function ProjectsView() {
  const { themeConfig, soundEnabled } = useTheme();
  const [flagshipMode, setFlagshipMode] = useState<"schema" | "tree">("schema");
  const [expandedTrees, setExpandedTrees] = useState<Record<string, boolean>>({});

  const toggleTree = (slug: string) => {
    playSwitchClick("down", soundEnabled);
    setExpandedTrees((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const flagshipProject = PROJECTS.find((p) => p.slug === "spypoint-mcp") || PROJECTS[1];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Flagship Project Card with ASCII Architecture & Tree View */}
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
              spypoint_mcp
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70">
              {flagshipProject.version}
            </span>
            <span className="text-emerald-400 text-[11px] font-bold">{flagshipProject.gitDelta}</span>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-[11px]">
            <span>19 tools • 112 tests</span>
            <span>•</span>
            <a
              href={flagshipProject.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackExternalLinkClick(
                  flagshipProject.githubUrl,
                  "github",
                  "flagship_spypoint"
                )
              }
              className="text-white hover:underline"
            >
              github.com/thesven/spypoint_mcp &rarr;
            </a>
          </div>
        </div>

        <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
          Specialized Model Context Protocol server enabling LLM agents to monitor, query, and analyze photo capture streams from remote SpyPoint cellular trail cameras. Features 19 tools, 112 automated tests, read-only account security boundaries, and time-window burst clustering that groups multi-shot captures into discrete wildlife visits to predict dawn scouting windows.
        </p>

        {/* View Mode Switcher */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded border border-white/10 text-[11px]">
            <button
              onClick={() => {
                setFlagshipMode("schema");
                playSwitchClick("up", soundEnabled);
              }}
              className={`px-2.5 py-1 rounded transition ${
                flagshipMode === "schema"
                  ? "bg-white/15 text-white font-bold"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Architecture Schema
            </button>
            <button
              onClick={() => {
                setFlagshipMode("tree");
                playSwitchClick("down", soundEnabled);
              }}
              className={`px-2.5 py-1 rounded transition ${
                flagshipMode === "tree"
                  ? "bg-white/15 text-white font-bold"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Terminal tree -L 2
            </button>
          </div>
          <span className="text-white/30 text-[10px] hidden sm:inline">
            {flagshipMode === "schema" ? "ASCII System Dataflow" : "Repository File Hierarchy"}
          </span>
        </div>

        {/* Embedded View Box */}
        <div className="bg-black/60 rounded p-4 border border-white/10 overflow-x-auto">
          {flagshipMode === "schema" ? (
            <pre
              className="leading-snug select-none text-center sm:text-left text-xs"
              style={{ color: themeConfig.palette.cyan }}
            >
              {ASCII_SPYPOINT_MCP_SCHEMA}
            </pre>
          ) : (
            <pre
              className="leading-snug text-xs font-mono text-emerald-400"
            >
              {generateAsciiTree(flagshipProject.treePaths, "spypoint_mcp")}
            </pre>
          )}
        </div>

        {/* Stack Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {["Python", "MCP Protocol", "IoT Telemetry", "pytest (112 tests)", "Pillow", "Computer Vision"].map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10 text-[11px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Supporting Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECTS.filter((p) => p.slug !== "spypoint-mcp").map((p: Project) => {
          const isTreeOpen = !!expandedTrees[p.slug];
          return (
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

              {/* Tree Expansion Preview if toggled */}
              {isTreeOpen && p.treePaths && (
                <div className="bg-black/70 rounded p-3 border border-white/10 text-[11px] overflow-x-auto text-emerald-400 font-mono">
                  <pre>{generateAsciiTree(p.treePaths, p.slug)}</pre>
                </div>
              )}

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
                  <div className="flex items-center gap-2">
                    <span>{p.version}</span>
                    {p.treePaths && p.treePaths.length > 0 && (
                      <button
                        onClick={() => toggleTree(p.slug)}
                        className="text-cyan-400 hover:text-white underline cursor-pointer text-[10px]"
                      >
                        {isTreeOpen ? "hide tree" : "tree -L 2"}
                      </button>
                    )}
                  </div>
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackExternalLinkClick(
                        p.githubUrl,
                        "github",
                        `project_${p.slug}`
                      )
                    }
                    className="hover:text-white transition"
                  >
                    repo &rarr;
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
