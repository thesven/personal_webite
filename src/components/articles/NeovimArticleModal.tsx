"use client";

import React from "react";
import { Article } from "@/data/articles";
import { useTheme } from "@/context/ThemeContext";
import { playSwitchClick } from "@/lib/audio";

export function NeovimArticleModal({
  article,
  onClose,
}: {
  article: Article | null;
  onClose: () => void;
}) {
  const { themeConfig, soundEnabled } = useTheme();

  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm"
      onClick={() => {
        onClose();
        playSwitchClick("up", soundEnabled);
      }}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg border shadow-2xl overflow-hidden font-mono text-xs"
        style={{
          backgroundColor: themeConfig.palette.card,
          borderColor: themeConfig.palette.border,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Neovim Tab Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/60 text-white/50">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            </span>
            <div className="px-2 py-0.5 rounded bg-white/10 text-white font-bold flex items-center gap-1">
              <span>nvim</span>
              <span className="text-white/40">/</span>
              <span style={{ color: themeConfig.palette.accent }}>{article.slug}.md</span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              playSwitchClick("up", soundEnabled);
            }}
            className="text-white/50 hover:text-white px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition"
          >
            ✕ Esc
          </button>
        </div>

        {/* Buffer Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 text-white/90">
          {/* Metadata Block */}
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <span style={{ color: themeConfig.palette.cyan }}>[{article.category}]</span>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span style={{ color: themeConfig.palette.green }}>{article.readTime}</span>
              <span>•</span>
              <span>By {article.author}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
              {article.title}
            </h1>
            <p className="text-white/60 text-sm mt-1">{article.subtitle}</p>
          </div>

          {/* Markdown Content */}
          <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
            <div
              className="space-y-4 whitespace-pre-wrap font-sans text-white/85"
              dangerouslySetInnerHTML={{
                __html: formatMarkdownContent(article.content, themeConfig.palette.accent),
              }}
            />
          </div>
        </div>

        {/* Lualine Status Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/10 bg-black/80 text-[11px] text-white/60">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.2 rounded font-bold text-black"
              style={{ backgroundColor: themeConfig.palette.accent }}
            >
              NORMAL
            </span>
            <span className="text-white/40">utf-8</span>
            <span className="text-white/20">|</span>
            <span className="text-white/70">markdown</span>
          </div>

          <div className="flex items-center gap-3">
            <span>ln 1, col 1</span>
            <span className="text-white/20">|</span>
            <span className="text-emerald-400">100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMarkdownContent(raw: string, accentColor: string): string {
  // Simple markdown renderer for code blocks, headers, and callouts
  return raw
    .replace(/### (.*)/g, '<h3 class="text-base font-bold text-white pt-3 font-mono">$1</h3>')
    .replace(/## (.*)/g, '<h2 class="text-lg font-bold text-white pt-4 font-mono">$1</h2>')
    .replace(
      /> \[!NOTE\]\n> (.*)/g,
      '<div class="p-3 my-2 rounded bg-cyan-950/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono"><strong>[NOTE]:</strong> $1</div>'
    )
    .replace(
      /> \[!TIP\]\n> (.*)/g,
      '<div class="p-3 my-2 rounded bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs font-mono"><strong>[TIP]:</strong> $1</div>'
    )
    .replace(
      /> \[!IMPORTANT\]\n> (.*)/g,
      '<div class="p-3 my-2 rounded bg-purple-950/30 border border-purple-500/40 text-purple-200 text-xs font-mono"><strong>[IMPORTANT]:</strong> $1</div>'
    )
    .replace(
      /```([a-z]*)\n([\s\S]*?)```/g,
      `<div class="rounded bg-black/80 border border-white/10 p-4 font-mono text-xs text-white/90 overflow-x-auto my-3"><div class="text-[10px] text-white/30 mb-1">$1</div><pre><code>$2</code></pre></div>`
    );
}
