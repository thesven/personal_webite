"use client";

import React, { useState } from "react";
import { ARTICLES, Article } from "@/data/articles";
import { ArticleList } from "@/components/articles/ArticleList";
import { NeovimArticleModal } from "@/components/articles/NeovimArticleModal";
import { useTheme } from "@/context/ThemeContext";

export default function ArticlesPage() {
  const { themeConfig } = useTheme();
  const [activeModalArticle, setActiveModalArticle] = useState<Article | null>(null);

  return (
    <div className="space-y-6 font-mono">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: themeConfig.palette.accent }} className="font-bold">
              [2:docs]
            </span>
            <span className="text-white/40">publication://systems-engineering</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Technical Publications & Systems Research
          </h1>
        </div>
        <div className="text-xs text-white/40">
          {ARTICLES.length} Essays • Zero Database • Static Fast Delivery
        </div>
      </div>

      {/* Telescope Search & List */}
      <ArticleList
        articles={ARTICLES}
        onSelectArticle={(article) => setActiveModalArticle(article)}
      />

      {/* Quick-view Neovim Modal */}
      <NeovimArticleModal
        article={activeModalArticle}
        onClose={() => setActiveModalArticle(null)}
      />
    </div>
  );
}
