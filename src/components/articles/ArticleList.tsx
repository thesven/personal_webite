"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Article, getAllTags, getAllCategories, getTagCounts, filterArticles } from "@/data/articles";
import { useTheme } from "@/context/ThemeContext";
import { playSwitchClick } from "@/lib/audio";
import { trackArticleFilter } from "@/lib/analytics";

export function ArticleList({
  articles,
  onSelectArticle,
}: {
  articles: Article[];
  onSelectArticle?: (article: Article) => void;
}) {
  const { themeConfig, soundEnabled } = useTheme();
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 150);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const allTags = useMemo(() => ["ALL", ...getAllTags()], []);
  const allCategories = useMemo(() => ["ALL", ...getAllCategories()], []);
  const tagCounts = useMemo(() => getTagCounts(articles), [articles]);

  const filtered = useMemo(
    () => filterArticles(articles, debouncedQuery, selectedTag, selectedCategory),
    [articles, debouncedQuery, selectedTag, selectedCategory]
  );

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      trackArticleFilter("search_query", debouncedQuery.trim(), filtered.length);
    }
  }, [debouncedQuery, filtered.length]);

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Telescope fzf search & category filter bar */}
      <div
        className="rounded-lg border p-3.5 shadow-md transition-colors space-y-3"
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
              placeholder="fzf filter by title, summary, tag, or technology..."
              className="w-full bg-transparent text-white outline-none placeholder:text-white/30 text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-white/40 hover:text-white"
                title="Clear filter"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Dropdown/Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-white/40 text-[10px] uppercase tracking-wider">Category:</span>
            {allCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    playSwitchClick("down", soundEnabled);
                    trackArticleFilter("category", cat, articles.length);
                  }}
                  className={`px-2 py-0.5 rounded transition text-[11px] whitespace-nowrap ${
                    isSelected
                      ? "bg-white/20 text-white font-bold border border-white/30"
                      : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                  style={isSelected ? { color: themeConfig.palette.cyan } : {}}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tag Filter Pills with Counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-white/5">
          <span className="text-white/40 text-[10px] uppercase tracking-wider whitespace-nowrap">Tags:</span>
          {allTags.map((t) => {
            const isSelected = selectedTag === t;
            const count = t === "ALL" ? articles.length : tagCounts[t] || 0;
            return (
              <button
                key={t}
                onClick={() => {
                  setSelectedTag(t);
                  playSwitchClick("down", soundEnabled);
                  trackArticleFilter("category", `tag:${t}`, count);
                }}
                className={`px-2 py-0.5 rounded transition text-[11px] whitespace-nowrap flex items-center gap-1 ${
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
                <span>{t}</span>
                <span className="text-[10px] opacity-60">({count})</span>
              </button>
            );
          })}
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
          <span>INDEX // PUBLICATION BUFFER</span>
          <div className="flex items-center gap-6">
            <span>READ TIME</span>
            <span className="hidden sm:inline">DATE</span>
            <span>ACTIONS</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-white/40">
              No matching publications found for current filter criteria.
            </div>
          ) : (
            filtered.map((article, idx) => {
              const lineNo = String(idx + 1).padStart(2, "0");
              return (
                <div
                  key={article.slug}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:px-4 hover:bg-white/5 transition gap-3"
                >
                  <div className="space-y-1 pr-3 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-white/30 font-bold">{lineNo}</span>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="text-white font-semibold text-sm hover:underline group-hover:text-cyan-300 transition"
                      >
                        {article.title}
                      </Link>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-cyan-400 border border-white/10">
                        {article.category}
                      </span>
                    </div>
                    <p className="text-white/50 text-xs pl-7 line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center gap-1.5 pl-7 pt-1 flex-wrap">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-white/40 border border-white/5 hover:text-white hover:border-white/20 cursor-pointer transition"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 text-[11px] text-white/40 whitespace-nowrap pl-7 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                    <span style={{ color: themeConfig.palette.cyan }}>
                      {article.readTime}
                    </span>
                    <span className="hidden sm:inline">{article.date}</span>
                    <div className="flex items-center gap-2">
                      {onSelectArticle && (
                        <button
                          onClick={() => {
                            onSelectArticle(article);
                            playSwitchClick("down", soundEnabled);
                          }}
                          className="text-white/70 hover:text-white px-2 py-1 rounded bg-black/40 border border-white/10 hover:border-white/30 transition text-[11px] cursor-pointer"
                          title="Quick preview in floating Neovim buffer"
                        >
                          [nvim]
                        </button>
                      )}
                      <Link
                        href={`/articles/${article.slug}`}
                        className="text-white hover:text-cyan-300 px-2 py-1 rounded bg-white/10 border border-white/20 hover:border-white/40 transition text-[11px]"
                      >
                        read &rarr;
                      </Link>
                    </div>
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
