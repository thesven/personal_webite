"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { playSwitchClick } from "@/lib/audio";

export type ThemeId = "tokyonight" | "flexoki" | "oxocarbon" | "catppuccin" | "monochrome";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  dotColor: string;
  palette: {
    bg: string;
    card: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    accentRgb: string;
    cyan: string;
    green: string;
    magenta: string;
    orange: string;
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  tokyonight: {
    id: "tokyonight",
    name: "Tokyo Night",
    dotColor: "#7aa2f7",
    palette: {
      bg: "#090a10",
      card: "#12141e",
      border: "rgba(122, 162, 247, 0.18)",
      text: "#e0e2ec",
      muted: "#787c99",
      accent: "#7aa2f7",
      accentRgb: "122, 162, 247",
      cyan: "#7dcfff",
      green: "#73daca",
      magenta: "#bb9af7",
      orange: "#ff9e64",
    },
  },
  flexoki: {
    id: "flexoki",
    name: "Flexoki Dark",
    dotColor: "#da702c",
    palette: {
      bg: "#100f0f",
      card: "#1c1b1a",
      border: "rgba(218, 112, 44, 0.2)",
      text: "#cecdc3",
      muted: "#878580",
      accent: "#da702c",
      accentRgb: "218, 112, 44",
      cyan: "#205ea6",
      green: "#879a39",
      magenta: "#ce5d97",
      orange: "#da702c",
    },
  },
  oxocarbon: {
    id: "oxocarbon",
    name: "Oxocarbon",
    dotColor: "#3ddbd9",
    palette: {
      bg: "#0b0b0e",
      card: "#16161b",
      border: "rgba(61, 219, 217, 0.22)",
      text: "#ffffff",
      muted: "#737582",
      accent: "#3ddbd9",
      accentRgb: "61, 219, 217",
      cyan: "#78a9ff",
      green: "#42be65",
      magenta: "#ee5396",
      orange: "#ff7eb6",
    },
  },
  catppuccin: {
    id: "catppuccin",
    name: "Catppuccin Mocha",
    dotColor: "#cba6f7",
    palette: {
      bg: "#0d0e15",
      card: "#181825",
      border: "rgba(203, 166, 247, 0.2)",
      text: "#cdd6f4",
      muted: "#6c7086",
      accent: "#89b4fa",
      accentRgb: "137, 180, 250",
      cyan: "#89dceb",
      green: "#a6e3a1",
      magenta: "#cba6f7",
      orange: "#fab387",
    },
  },
  monochrome: {
    id: "monochrome",
    name: "Monochrome Matrix",
    dotColor: "#4ade80",
    palette: {
      bg: "#050505",
      card: "#0d0d0d",
      border: "rgba(74, 222, 128, 0.22)",
      text: "#e0e0e0",
      muted: "#525252",
      accent: "#4ade80",
      accentRgb: "74, 222, 128",
      cyan: "#86efac",
      green: "#4ade80",
      magenta: "#22c55e",
      orange: "#a3e635",
    },
  },
};

interface ThemeContextType {
  theme: ThemeId;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeId) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  crtEnabled: boolean;
  toggleCrt: () => void;
  screensaverActive: boolean;
  setScreensaverActive: (active: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setThemeState] = useState<ThemeId>("tokyonight");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [screensaverActive, setScreensaverActive] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("ms_theme") as ThemeId;
      if (savedTheme && THEMES[savedTheme]) {
        startTransition(() => setThemeState(savedTheme));
      }
      const savedSound = localStorage.getItem("ms_sound");
      if (savedSound !== null) {
        startTransition(() => setSoundEnabled(savedSound === "true"));
      }
      const savedCrt = localStorage.getItem("ms_crt");
      if (savedCrt !== null) {
        startTransition(() => setCrtEnabled(savedCrt === "true"));
      }
    } catch {
      // localStorage unavailable in iframe/sandbox
    }
  }, []);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("ms_theme", newTheme);
    } catch {}
    playSwitchClick("up", soundEnabled);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem("ms_sound", String(next));
    } catch {}
    if (next) playSwitchClick("down", true);
  };

  const toggleCrt = () => {
    const next = !crtEnabled;
    setCrtEnabled(next);
    try {
      localStorage.setItem("ms_crt", String(next));
    } catch {}
    playSwitchClick("down", soundEnabled);
  };

  const themeConfig = THEMES[theme] || THEMES.tokyonight;

  // Global key listener for Command Palette, Space toggle, and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        playSwitchClick("down", soundEnabled);
        return;
      }

      // Escape -> Close Command Palette or wake from root screensaver
      if (e.key === "Escape") {
        if (commandPaletteOpen) {
          setCommandPaletteOpen(false);
          return;
        }
        if (pathname === "/") {
          playSwitchClick("space", soundEnabled);
          router.push("/sys");
          return;
        }
      }

      // Space or Enter -> Navigate between / and /sys when not typing
      if (e.code === "Space" && !commandPaletteOpen) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        playSwitchClick("space", soundEnabled);
        if (pathname === "/") {
          router.push("/sys");
        } else {
          router.push("/");
        }
        return;
      }

      // Enter on root screensaver -> Go to desktop /sys
      if (e.key === "Enter" && pathname === "/" && !commandPaletteOpen) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        playSwitchClick("space", soundEnabled);
        router.push("/sys");
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, soundEnabled, pathname, router]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig,
        setTheme,
        soundEnabled,
        toggleSound,
        crtEnabled,
        toggleCrt,
        screensaverActive,
        setScreensaverActive,
        commandPaletteOpen,
        setCommandPaletteOpen,
      }}
    >
      <div
        className="min-h-screen text-zinc-100 flex flex-col font-mono selection:bg-white/20 selection:text-white"
        style={{
          backgroundColor: themeConfig.palette.bg,
          color: themeConfig.palette.text,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
