"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme, THEMES, ThemeId } from "@/context/ThemeContext";
import { ARTICLES } from "@/data/articles";
import { PROJECTS } from "@/data/projects";
import { playSwitchClick } from "@/lib/audio";

interface CommandItem {
  id: string;
  category: "WORKSPACES" | "THEMES" | "SYSTEM" | "ARTICLES" | "PROJECTS";
  title: string;
  subtitle?: string;
  shortcut?: string;
  action: () => void;
}

function CommandPaletteDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { setTheme, toggleCrt, toggleSound, soundEnabled, themeConfig } = useTheme();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = typeof document !== "undefined" ? (document.activeElement as HTMLElement | null) : null;
    inputRef.current?.focus();

    return () => {
      previousFocusRef.current?.focus?.();
    };
  }, []);

  const commands: CommandItem[] = [
    {
      id: "ws-home",
      category: "WORKSPACES",
      title: "Jump to [1:sys] Home Dashboard",
      shortcut: "1",
      action: () => router.push("/sys"),
    },
    {
      id: "ws-articles",
      category: "WORKSPACES",
      title: "Jump to [2:docs] Technical Publications",
      shortcut: "2",
      action: () => router.push("/articles"),
    },
    {
      id: "ws-projects",
      category: "WORKSPACES",
      title: "Jump to [3:work] Systems Showcase",
      shortcut: "3",
      action: () => router.push("/projects"),
    },
    {
      id: "ws-about",
      category: "WORKSPACES",
      title: "Jump to [4:user] Biography & Career",
      shortcut: "4",
      action: () => router.push("/about"),
    },
    {
      id: "screensaver-toggle",
      category: "SYSTEM",
      title: "Launch Delta Corps Priest 1 Screensaver",
      shortcut: "Space",
      action: () => router.push("/"),
    },
    {
      id: "toggle-crt",
      category: "SYSTEM",
      title: "Toggle CRT Scanlines & Screen Curvature",
      action: toggleCrt,
    },
    {
      id: "toggle-sound",
      category: "SYSTEM",
      title: "Toggle Synthesized Mechanical Audio Haptics",
      action: toggleSound,
    },
    ...ARTICLES.map((a) => ({
      id: `article-${a.slug}`,
      category: "ARTICLES" as const,
      title: a.title,
      subtitle: `${a.category} • ${a.readTime}`,
      action: () => router.push(`/articles/${a.slug}`),
    })),
    ...PROJECTS.map((p) => ({
      id: `project-${p.slug}`,
      category: "PROJECTS" as const,
      title: p.title,
      subtitle: `${p.category} • ${p.version}`,
      action: () => router.push("/projects"),
    })),
    ...Object.values(THEMES).map((t) => ({
      id: `theme-${t.id}`,
      category: "THEMES" as const,
      title: `Apply Color Theme: ${t.name}`,
      action: () => setTheme(t.id as ThemeId),
    })),
  ];

  const q = query.toLowerCase().trim();
  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(q) ||
    cmd.category.toLowerCase().includes(q) ||
    (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q))
  );

  const executeCommand = (cmd: CommandItem) => {
    playSwitchClick("down", soundEnabled);
    onClose();
    cmd.action();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
      );
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
        );
      } else {
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filteredCommands[selectedIndex];
      if (target) executeCommand(target);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="w-full max-w-xl rounded-lg border shadow-2xl overflow-hidden font-mono text-xs transition-all"
        style={{
          backgroundColor: themeConfig.palette.card,
          borderColor: themeConfig.palette.border,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/10 bg-black/40">
          <span style={{ color: themeConfig.palette.accent }} className="font-bold text-sm">
            &gt;_
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            aria-label="Search commands, workspaces, articles, or projects"
            placeholder="Type a command, article, or project... (Esc to exit)"
            className="w-full bg-transparent text-white outline-none placeholder:text-white/30 text-xs"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/50 border border-white/10">
            Esc
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
          {filteredCommands.length === 0 ? (
            <div className="px-3 py-6 text-center text-white/40">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition ${
                    isSelected
                      ? "bg-white/10 text-white font-semibold"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                  style={
                    isSelected
                      ? {
                          borderLeft: `2px solid ${themeConfig.palette.accent}`,
                        }
                      : {}
                  }
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-white/30 tracking-wider shrink-0">
                      [{cmd.category}]
                    </span>
                    <span className="truncate">{cmd.title}</span>
                    {cmd.subtitle && (
                      <span className="text-[10px] text-white/40 shrink-0 truncate">
                        — {cmd.subtitle}
                      </span>
                    )}
                  </div>
                  {cmd.shortcut && (
                    <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-white/50 border border-white/10">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useTheme();

  if (!commandPaletteOpen) return null;

  return <CommandPaletteDialog onClose={() => setCommandPaletteOpen(false)} />;
}
