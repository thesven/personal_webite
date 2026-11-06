"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Article } from "@/data/articles";
import { useTheme } from "@/context/ThemeContext";
import { playSwitchClick } from "@/lib/audio";

export function ArticleList({
  articles,
  onSelectArticle,
}: {
  articles: Article[];
  onSelectArticle?: (article: Article) => void;
}) {
  const { themeConfig, soundEnabled } = useTheme();
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const allTags = ["ALL", "#systems", "#architecture", "#performance", "#ebpf"];

  const filtered = articles.filter((a) => {
    const matchesTag =
      selectedTag === "ALL" ||
      a.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Telescope fzf search bar */}
      <div
        className="rounded-lg border p-3.5 shadow-md transition-colors"
        style={{
          backgroundColor: themeConfig.palette.card,
          borderColor: themeConfig.palette.border,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="flex items-center gap-2 flex-1 bg-black/40 px-3 py-2 rounded border border-white/10">
            <span style={{ color: themeConfig.palette.accent }} className="font-bold">
              telescope://
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="fzf filter articles..."
              className="w-full bg-transparent text-white outline-none placeholder:text-white/30 text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Tag Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {allTags.map((t) => {
              const isSelected = selectedTag === t;
              return (
                <button
                  key={t}
                  onClick={() => {
                    setSelectedTag(t);
                    playSwitchClick("down", soundEnabled);
                  }}
                  className={`px-2.5 py-1 rounded transition text-xs whitespace-nowrap ${
                    isSelected
                      ? "bg-white/15 text-white font-bold border border-white/20"
                      : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                  style={
                    isSelected
                      ? {
                          color: themeConfig.palette.accent,
                          borderColor: themeConfig.palette.border,
                        }
                      : {}
                  }
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div
        className="rounded-lg border overflow-hidden shadow-lg transition-colors"
        style={{
          backgroundColor: themeConfig.palette.card,
          borderColor: themeConfig.palette.border,
        }}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-black/40 text-white/40 text-[11px]">
          <span>INDEX // FILENAME</span>
          <div className="flex items-center gap-6">
            <span>READ TIME</span>
            <span className="hidden sm:inline">DATE</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-white/40">
              No matching publications found.
            </div>
          ) : (
            filtered.map((article, idx) => {
              const lineNo = String(idx + 1).padStart(2, "0");
              return (
                <div
                  key={article.slug}
                  className="group flex items-start sm:items-center justify-between p-3.5 sm:px-4 hover:bg-white/5 transition cursor-pointer"
                  onClick={() => {
                    if (onSelectArticle) {
                      onSelectArticle(article);
                      playSwitchClick("down", soundEnabled);
                    }
                  }}
                >
                  <div className="space-y-1 pr-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-white/30 font-bold">{lineNo}</span>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="text-white font-semibold text-sm hover:underline group-hover:text-cyan-300 transition"
                      >
                        {article.title}
                      </Link>
                    </div>
                    <p className="text-white/50 text-xs pl-7 line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center gap-2 pl-7 pt-1">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-white/40 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-6 text-[11px] text-white/40 whitespace-nowrap pt-1 sm:pt-0">
                    <span style={{ color: themeConfig.palette.cyan }}>
                      {article.readTime}
                    </span>
                    <span className="hidden sm:inline">{article.date}</span>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="text-white/50 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-white/30 transition text-xs"
                    >
                      read &rarr;
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
