import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticleBySlug } from "@/data/articles";
import type { Metadata } from "next";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} — Michael Svendsen`,
    description: article.summary,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-white/40 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Link href="/articles" className="hover:text-white transition flex items-center gap-1">
            <span>&larr; [2:docs]</span>
          </Link>
          <span>/</span>
          <span className="text-white/60">{article.slug}.md</span>
        </div>
        <div className="text-[11px] text-emerald-400">NORMAL // READ BUFFER</div>
      </div>

      {/* Neovim Editorial Buffer */}
      <div className="rounded-lg border border-white/15 bg-[#12141e] shadow-2xl overflow-hidden">
        {/* Neovim Top Tab */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/60 text-white/50 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            </span>
            <span className="text-white font-bold px-2 py-0.5 rounded bg-white/10">
              {article.slug}.md
            </span>
          </div>
          <span className="text-white/30 text-[11px]">buffer #1</span>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-6 text-white/90">
          <div className="border-b border-white/10 pb-5">
            <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
              <span className="text-cyan-400 font-bold">[{article.category}]</span>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span className="text-emerald-400">{article.readTime}</span>
              <span>•</span>
              <span>By {article.author}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
              {article.title}
            </h1>
            <p className="text-white/60 text-sm sm:text-base mt-2 font-sans">
              {article.subtitle}
            </p>
          </div>

          {/* Article Text Content */}
          <div
            className="space-y-4 font-sans text-sm sm:text-base leading-relaxed text-white/85"
            dangerouslySetInnerHTML={{
              __html: formatMarkdownContent(article.content),
            }}
          />
        </div>

        {/* Lualine Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-black/80 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-bold text-black bg-cyan-400">
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

function formatMarkdownContent(raw: string): string {
  return raw
    .replace(/### (.*)/g, '<h3 class="text-lg font-bold text-white pt-4 font-mono">$1</h3>')
    .replace(/## (.*)/g, '<h2 class="text-xl font-bold text-white pt-6 font-mono">$1</h2>')
    .replace(
      /> \[!NOTE\]\n> (.*)/g,
      '<div class="p-3.5 my-3 rounded bg-cyan-950/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono"><strong>[NOTE]:</strong> $1</div>'
    )
    .replace(
      /> \[!TIP\]\n> (.*)/g,
      '<div class="p-3.5 my-3 rounded bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs font-mono"><strong>[TIP]:</strong> $1</div>'
    )
    .replace(
      /> \[!IMPORTANT\]\n> (.*)/g,
      '<div class="p-3.5 my-3 rounded bg-purple-950/30 border border-purple-500/40 text-purple-200 text-xs font-mono"><strong>[IMPORTANT]:</strong> $1</div>'
    )
    .replace(
      /```([a-z]*)\n([\s\S]*?)```/g,
      `<div class="rounded bg-black/80 border border-white/10 p-4 font-mono text-xs text-white/90 overflow-x-auto my-4"><div class="text-[10px] text-white/30 mb-1">$1</div><pre><code>$2</code></pre></div>`
    );
}
