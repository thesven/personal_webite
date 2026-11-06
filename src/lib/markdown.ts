import { marked } from "marked";

export function renderMarkdown(content: string): string {
  if (!content) return "";

  // Pre-process GitHub-style markdown alerts
  const processed = content
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

  const rawHtml = marked.parse(processed, {
    gfm: true,
    breaks: false,
  });

  const html = typeof rawHtml === "string" ? rawHtml : "";

  // Enhance code blocks with Neovim-style top bar and Copy Code button
  return html.replace(
    /<pre><code(?: class="language-([^"]*)")?>([\s\S]*?)<\/code><\/pre>/g,
    (_, lang, code) => {
      const displayLang = lang || "text";
      return `<div class="code-block-wrapper my-5 rounded-lg border border-white/10 bg-[#06070a] overflow-hidden shadow-xl"><div class="flex items-center justify-between px-3 py-1.5 bg-black/60 border-b border-white/10 text-[11px] font-mono text-white/50"><span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-cyan-400/80 inline-block"></span><span class="text-white/70 uppercase tracking-wider font-semibold">${displayLang}</span></span><button class="copy-code-btn text-[10px] text-white/60 hover:text-white px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer" onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').innerText);this.innerText='COPIED ✓';setTimeout(()=>this.innerText='COPY',2000)">COPY</button></div><pre><code class="language-${displayLang}">${code}</code></pre></div>`;
    }
  );
}
