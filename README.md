# Michael Svendsen — Personal Publication & Website

> High-craft personal website, systems architecture showcase, and technical publication platform inspired by opinionated terminal and tiling-desktop aesthetics.

[![Preview Status](https://img.shields.io/badge/Status-Prototype_Active-brightgreen)](index.html)
[![Typography](https://img.shields.io/badge/FIGlet-Delta_Corps_Priest_1-blue)](#typography--screensaver)
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
  - **`[2:docs]` Publications**: Telescope / fzf fuzzy search file browser with line numbers, category filtering, and an in-depth Neovim editor buffer modal with `lualine` statusbar.
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

## 🚀 Quick Start (Local Preview)

Run a local HTTP server in the repository directory:

```bash
# Using Python 3
python3 -m http.server 3000

# Or using Node.js / npx
npx serve .
```

Open `http://localhost:3000` in your web browser.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `1` | Jump to Workspace `[1:sys]` |
| `2` | Jump to Workspace `[2:docs]` |
| `3` | Jump to Workspace `[3:work]` |
| `4` | Jump to Workspace `[4:user]` |
| `Space` | Toggle Fullscreen Screensaver |
| `⌘K` / `Ctrl+K` | Open Walker Command Palette |
| `Esc` | Close Active Modal / Dismiss Screensaver |

---

## 📁 Repository Structure

```text
.
├── README.md        # Project documentation and quick start
├── brainstorm.md    # Comprehensive architecture and design notes
└── index.html       # Self-contained, zero-dependency interactive prototype
```

---

## 🛠️ Deployment

This prototype is self-contained in `index.html` with zero external build dependencies:
- **GitHub Pages**: Head to **Settings > Pages** in this repository and select `Deploy from a branch: main / (root)`.
- **Cloudflare Pages / Vercel**: Connect the repository with zero build configuration needed.
