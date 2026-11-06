# Michael Svendsen — Personal Publication & Website

> High-craft personal website, systems architecture showcase, and technical publication platform inspired by opinionated terminal and tiling-desktop aesthetics. Built with **Next.js 16 (App Router)** and pre-rendered as a **pure static export (`out/`)** tailored for the **Cloudflare Pages Free Plan** (zero database, zero edge compute costs).

[![Build Status](https://img.shields.io/badge/Build-Static_Export_Passed-brightgreen)](package.json)
[![Hosting](https://img.shields.io/badge/Hosting-Cloudflare_Pages_Free-orange)](wrangler.jsonc)
[![Typography](https://img.shields.io/badge/FIGlet-Delta_Corps_Priest_1-blue)](#screensaver-hero)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](README.md)

---

## ⚡ Highlights

- **Terminal Screensaver Landing Hero**:
  - Full procedural **Delta Corps Priest 1** block font rasterization on HTML5 Canvas.
  - **4-Phase Graphics Lifecycle**: `INTRO` (procedural build), `SETTLED` (radial phosphor bloom), `GLINT` (specular 45° gleam), and `OUTRO` (particle decay).
  - **8 Terminal Effects**: `decrypt`, `matrix`, `beams`, `burn`, `waves`, `spotlights`, `vhstape`, `binarypath`.
  - CRT screen scanlines, curvature vignette, and ambient phosphor bloom.
  - Web Audio API synthesized mechanical keyboard audio feedback.
- **Tiling-Desktop Interior Workspaces**:
  - **Waybar Navigation**: Keyboard-first workspace switching (`[1:sys]`, `[2:docs]`, `[3:work]`, `[4:user]`), system clock, theme switcher, and command palette (`⌘K`).
  - **`[1:sys]` Home / Dashboard**: Fastfetch system specifications card with custom `MS` monogram, real-time `btop`/`htop` telemetry sparklines, and an interactive TUI command shell (`help`, `whoami`, `articles`, `projects`, `screensaver`).
  - **`[2:docs]` Publications**: Telescope / fzf fuzzy search file browser with line numbers, category filtering, and dedicated static article reader pages (`/articles/[slug]`) styled like Neovim editor buffers with `lualine` status.
  - **`[3:work]` Systems Showcase**: Terminal `tree -L 2` hierarchy view, git delta chips, and ASCII architecture schemas.
  - **`[4:user]` Biography & Career**: `git log --graph` commit timeline, terminal capacity gauges (`[████████░░]`), and direct-copy PGP keycard.
  - **Walker-Style Command Palette (`⌘K` / `Ctrl+K`)**: Instant fuzzy jumping across workspaces, themes, and screensaver triggers.
- **5 Curated Color Themes**:
  - Tokyo Night
  - Flexoki Dark
  - Oxocarbon
  - Catppuccin Mocha
  - Monochrome Matrix

---

## ✍️ How to Manually Add New Articles (No Database)

All articles are statically managed in [`src/data/articles.ts`](src/data/articles.ts).

To add a new article:
1. Open [`src/data/articles.ts`](src/data/articles.ts).
2. Append a new article object to the `ARTICLES` array:

```typescript
{
  slug: "my-new-systems-article",
  title: "Title of Your Technical Article",
  subtitle: "Secondary explanatory subtitle or research abstract",
  date: "2026-11-06",
  readTime: "6 min read",
  tags: ["#systems", "#rust", "#architecture"],
  category: "Systems",
  author: "Michael Svendsen",
  summary: "A concise 1-2 sentence preview for search index cards.",
  content: `
### 1. Introduction
Your markdown content with code blocks and notes.

> [!NOTE]
> Callout boxes render automatically with specialized styling.

\`\`\`rust
fn main() {
    println!("Zero-allocation telemetry!");
}
\`\`\`
  `.trim(),
}
```

3. Run `npm run build` or push to `main`. Next.js automatically generates the static route `/articles/my-new-systems-article/index.html` at build time!

---

## ☁️ Deploying to Cloudflare Pages (100% Free Plan)

### Method 1: Git Integration (Recommended — Auto-deploy on Push)
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) ➔ **Workers & Pages** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git**.
2. Select repository: `thesven/personal_webite`.
3. Set the build settings:
   - **Framework preset**: `None` or `Next.js (Static HTML Export)`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
4. Click **Save and Deploy**. Every time you push a commit or new article to `main`, Cloudflare automatically builds and deploys your site globally in seconds.

### Method 2: Direct CLI Deploy via Wrangler
```bash
# Build the static export
npm run build

# Deploy the static out/ folder directly
npx wrangler pages deploy out --project-name=personal-website
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local Next.js dev server
npm run dev

# Or test the production static export
npm run build
npx serve out
```

---

## ⌨️ Keyboard Navigation Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `1` | Jump to Workspace `[1:sys]` |
| `2` | Jump to Workspace `[2:docs]` |
| `3` | Jump to Workspace `[3:work]` |
| `4` | Jump to Workspace `[4:user]` |
| `Space` | Toggle Fullscreen Screensaver |
| `⌘K` / `Ctrl+K` | Open Walker Command Palette |
| `Esc` | Close Active Modal / Dismiss Screensaver |
