"use client";

import React, { useEffect, useRef } from "react";
import { trackCodeCopy } from "@/lib/analytics";

export function ArticleContent({
  html,
  itemProp,
  articleSlug,
}: {
  html: string;
  itemProp?: string;
  articleSlug?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = async (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLButtonElement>(
        "button[data-code-copy='true']"
      );
      if (!target) return;

      const codeWrapper = target.closest(".code-block-wrapper");
      const codeEl = codeWrapper?.querySelector("code");
      const textToCopy = codeEl?.textContent || "";
      const langMatch = codeEl?.className?.match(/language-([a-z0-9_-]+)/i);
      const language = langMatch ? langMatch[1] : "plaintext";

      let success = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(textToCopy);
          success = true;
        } catch {
          success = false;
        }
      }

      if (!success) {
        try {
          const textArea = document.createElement("textarea");
          textArea.value = textToCopy;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          success = document.execCommand("copy");
          document.body.removeChild(textArea);
        } catch {
          success = false;
        }
      }

      if (success) {
        trackCodeCopy(articleSlug || "unknown", language);
        const originalText = target.innerText;
        target.innerText = "COPIED ✓";
        target.classList.add("text-emerald-400", "border-emerald-500/40");
        setTimeout(() => {
          target.innerText = originalText || "COPY";
          target.classList.remove("text-emerald-400", "border-emerald-500/40");
        }, 2000);
      }
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [articleSlug]);

  return (
    <div
      ref={containerRef}
      itemProp={itemProp}
      className="article-prose space-y-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
