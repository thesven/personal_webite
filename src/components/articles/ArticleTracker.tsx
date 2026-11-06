"use client";

import { useEffect, useRef } from "react";
import { Article } from "@/data/articles";
import { trackArticleView, trackArticleScrollMilestone } from "@/lib/analytics";

export function ArticleTracker({ article }: { article: Article }) {
  const firedRef = useRef<Set<number>>(new Set());
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    trackArticleView(article.slug, article.title, article.category, "page");
    firedRef.current.clear();
    startTimeRef.current = Date.now();

    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight <= 0) return;

      const progress = Math.min(
        100,
        Math.round((scrollTop / scrollHeight) * 100)
      );
      const milestones: (25 | 50 | 75 | 90 | 100)[] = [25, 50, 75, 90, 100];

      for (const m of milestones) {
        if (progress >= m && !firedRef.current.has(m)) {
          firedRef.current.add(m);
          const start = startTimeRef.current || Date.now();
          const elapsedSec = Math.round((Date.now() - start) / 1000);
          trackArticleScrollMilestone(article.slug, m, elapsedSec);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [article.slug, article.title, article.category]);

  return null;
}
