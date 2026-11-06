import { marked } from "marked";

export function renderMarkdown(content: string): string {
  if (!content) return "";

  // Pre-process GitHub-style markdown alerts
  let processed = content
    .replace(
      /> \[!NOTE\]\s*\n((?:> .*\n?)+)/g,
      (_, body) =>
        `<div class="p-4 my-4 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs font-mono"><strong class="text-cyan-400 font-bold block mb-1">ℹ NOTE</strong>${body.replace(/^> /gm, "")}</div>`
    )
    .replace(
      /> \[!TIP\]\s*\n((?:> .*\n?)+)/g,
      (_, body) =>
        `<div class="p-4 my-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs font-mono"><strong class="text-emerald-400 font-bold block mb-1">💡 TIP</strong>${body.replace(/^> /gm, "")}</div>`
    )
    .replace(
      /> \[!IMPORTANT\]\s*\n((?:> .*\n?)+)/g,
      (_, body) =>
        `<div class="p-4 my-4 rounded-lg bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs font-mono"><strong class="text-purple-400 font-bold block mb-1">⚡ IMPORTANT</strong>${body.replace(/^> /gm, "")}</div>`
    )
    .replace(
      /> \[!WARNING\]\s*\n((?:> .*\n?)+)/g,
      (_, body) =>
        `<div class="p-4 my-4 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-mono"><strong class="text-amber-400 font-bold block mb-1">⚠ WARNING</strong>${body.replace(/^> /gm, "")}</div>`
    );

  const html = marked.parse(processed, {
    gfm: true,
    breaks: false,
  });

  return typeof html === "string" ? html : "";
}
