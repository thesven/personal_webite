import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticleBySlug } from "@/data/articles";
import type { Metadata } from "next";
import { renderMarkdown } from "@/lib/markdown";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticleContent } from "@/components/articles/ArticleContent";
import { ArticleTracker } from "@/components/articles/ArticleTracker";
import { getArticleSchema, getBreadcrumbSchema, SITE_URL } from "@/lib/seo";

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

  const articleUrl = `/articles/${article.slug}/`;

  return {
    title: article.title,
    description: article.summary,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: `${article.title} | Michael Svendsen`,
      description: article.summary,
      url: `${SITE_URL}${articleUrl}`,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: ["Michael Svendsen"],
      section: article.category,
      tags: article.tags,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | Michael Svendsen`,
      description: article.summary,
      creator: "@thesven",
      images: ["/og-image.png"],
    },
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

  const htmlContent = renderMarkdown(article.content);
  const articleSchema = getArticleSchema(article);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Technical Publications", url: "/articles/" },
    { name: article.title, url: `/articles/${article.slug}/` },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={articleSchema} />
      <ArticleTracker article={article} />

      <article
        itemScope
        itemType="https://schema.org/TechArticle"
        className="space-y-6 font-mono"
      >
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-between text-xs text-white/40 pb-3 border-b border-white/10"
        >
          <div className="flex items-center gap-2">
            <Link
              href="/articles/"
              className="hover:text-white transition flex items-center gap-1"
            >
              <span>&larr; [2:docs]</span>
            </Link>
            <span>/</span>
            <span className="text-white/60">{article.slug}.md</span>
          </div>
          <div className="text-[11px] text-emerald-400">NORMAL // READ BUFFER</div>
        </nav>

        {/* Neovim Editorial Buffer */}
        <div className="rounded-lg border border-white/15 bg-[#12141e] shadow-2xl overflow-hidden">
          {/* Neovim Top Tab */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/60 text-white/50 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
              </span>
              <span className="text-white font-bold px-2 py-0.5 rounded bg-white/10 font-mono">
                {article.slug}.md
              </span>
            </div>
            <span className="text-white/30 text-[11px]">buffer #1</span>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-10 space-y-6 text-white/90">
            <header className="border-b border-white/10 pb-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/40 mb-2">
                <span
                  itemProp="articleSection"
                  className="text-cyan-400 font-bold"
                >
                  [{article.category}]
                </span>
                <span>•</span>
                <time
                  itemProp="datePublished"
                  dateTime={article.date}
                >
                  {article.date}
                </time>
                <span>•</span>
                <span className="text-emerald-400">{article.readTime}</span>
                <span>•</span>
                <span itemProp="author">By {article.author}</span>
              </div>
              <h1
                itemProp="headline"
                className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans"
              >
                {article.title}
              </h1>
              <p className="text-white/60 text-sm sm:text-base mt-2 font-sans">
                {article.subtitle}
              </p>
            </header>

            {/* GEO & AEO Executive Summary Box */}
            <aside
              role="doc-abstract"
              aria-label="Executive Summary and Key Architecture Takeaways"
              className="p-4 rounded-lg bg-white/5 border border-cyan-500/30 text-xs sm:text-sm text-white/80 space-y-2 leading-relaxed font-sans"
            >
              <div className="flex items-center gap-2 font-mono text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <span>⚡ Executive Summary &amp; Direct Architecture Answer</span>
              </div>
              <p itemProp="description">{article.summary}</p>
              <div className="pt-2 flex flex-wrap gap-1.5 font-mono text-[11px]">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </aside>

            {/* Article Markdown HTML Content */}
            <ArticleContent
              html={htmlContent}
              itemProp="articleBody"
              articleSlug={article.slug}
            />

            {/* AEO / LLM Citation & Reference Box */}
            <footer className="mt-10 pt-6 border-t border-white/10 text-xs text-white/50 space-y-2 font-mono">
              <div className="text-white/70 font-bold text-[11px] uppercase tracking-wider">
                Citation &amp; Machine-Readable Reference
              </div>
              <div className="p-3 rounded bg-black/50 border border-white/10 text-[11px] text-white/70 overflow-x-auto select-all">
                <code>
                  Svendsen, M. ({article.date.slice(0, 4)}). &quot;{article.title}&quot;. Michael Svendsen Systems Research. Available at: {SITE_URL}/articles/{article.slug}/
                </code>
              </div>
              <div className="text-[10px] text-white/40 flex items-center gap-2">
                <span>LLM ingestion endpoints:</span>
                <Link href="/llms.txt" className="text-cyan-400 hover:underline">
                  /llms.txt
                </Link>
                <span>•</span>
                <Link href="/llms-full.txt" className="text-cyan-400 hover:underline">
                  /llms-full.txt
                </Link>
                <span>•</span>
                <Link href="/feed.xml" className="text-cyan-400 hover:underline">
                  /feed.xml
                </Link>
              </div>
            </footer>
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
      </article>
    </>
  );
}
