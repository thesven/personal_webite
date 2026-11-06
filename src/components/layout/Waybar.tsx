"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme, THEMES, ThemeId } from "@/context/ThemeContext";
import { playSwitchClick } from "@/lib/audio";

const WORKSPACES = [
  { href: "/sys", label: "[1:sys]", title: "System Dashboard (1)" },
  { href: "/articles", label: "[2:docs]", title: "Technical Publications (2)" },
  { href: "/projects", label: "[3:work]", title: "Systems Showcase (3)" },
  { href: "/about", label: "[4:user]", title: "Biography & Career (4)" },
];

export function Waybar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    theme,
    setTheme,
    themeConfig,
    soundEnabled,
    toggleSound,
    crtEnabled,
    toggleCrt,
    setCommandPaletteOpen,
  } = useTheme();

  const [clock, setClock] = useState("00:00:00");
  const isRootScreensaver = pathname === "/";

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const updateTime = () => {
      const now = new Date();
      setClock(now.toTimeString().split(" ")[0]);
    };

    const startClock = () => {
      if (interval || document.hidden) return;
      updateTime();
      interval = setInterval(updateTime, 1000);
    };

    const stopClock = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopClock();
      } else {
        startClock();
      }
    };

    startClock();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopClock();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleModeToggle = () => {
    playSwitchClick("space", soundEnabled);
    if (isRootScreensaver) {
      router.push("/sys");
    } else {
      router.push("/");
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md px-3 sm:px-4 py-2 transition-colors duration-300"
      style={{
        backgroundColor: "rgba(10, 11, 16, 0.9)",
        borderColor: themeConfig.palette.border,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
        {/* Left: Brand Moniker + Workspace Nav */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Brand Moniker Badge */}
          <button
            onClick={() => {
              playSwitchClick("space", soundEnabled);
              router.push("/");
            }}
            title="Return to Screensaver Landing (Space / Super+Esc)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded transition border cursor-pointer group"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              borderColor: themeConfig.palette.border,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: themeConfig.palette.accent }}
            />
            <span className="font-bold tracking-wider text-white group-hover:text-cyan-300 transition">
              SVENDSEN
            </span>
          </button>

          {/* Workspace Tabs */}
          <nav className="flex items-center gap-0.5 bg-black/60 p-0.5 rounded border border-white/10">
            {WORKSPACES.map((ws) => {
              const isActive =
                ws.href === "/sys"
                  ? pathname === "/sys"
                  : pathname?.startsWith(ws.href);
              return (
                <Link
                  key={ws.href}
                  href={ws.href}
                  onClick={() => {
                    playSwitchClick("down", soundEnabled);
                  }}
                  title={ws.title}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    isActive
                      ? "bg-white/15 text-white font-semibold border border-white/20 shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                  style={
                    isActive
                      ? {
                          color: "#ffffff",
                          borderColor: themeConfig.palette.accent,
                        }
                      : {}
                  }
                >
                  {ws.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center: Command Palette Pill (Desktop) */}
        <div className="hidden md:flex items-center gap-2 text-white/50">
          <button
            onClick={() => {
              setCommandPaletteOpen(true);
              playSwitchClick("down", soundEnabled);
            }}
            className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition text-xs cursor-pointer"
          >
            <span style={{ color: themeConfig.palette.accent }} className="font-bold">
              &gt;_
            </span>
            <span>run launcher</span>
            <kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px] text-white/80 border border-white/20">
              ⌘K
            </kbd>
          </button>
          <span className="text-white/20">•</span>
          <span
            className="font-medium font-mono text-[11px]"
            style={{
              color: isRootScreensaver
                ? themeConfig.palette.cyan
                : themeConfig.palette.accent,
            }}
          >
            {isRootScreensaver
              ? "screensaver [intro]"
              : pathname === "/sys"
              ? "sys [active]"
              : `${pathname?.replace("/", "")} [active]`}
          </span>
          <span className="text-white/20">•</span>
          <span className="text-white/40">hyprland/wayland</span>
        </div>

        {/* Right: Environment & Theme Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Selector */}
          <div className="flex items-center bg-black/50 px-2 py-0.5 rounded border border-white/10">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeId)}
              className="bg-transparent text-white/80 outline-none cursor-pointer text-xs font-mono"
            >
              {Object.values(THEMES).map((t) => (
                <option key={t.id} value={t.id} className="bg-zinc-900 text-white">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* RSS Feed */}
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 rounded border transition font-mono bg-black/50 border-white/10 text-white/50 hover:text-white hover:border-white/20 text-xs"
            title="RSS 2.0 Publication Feed"
          >
            RSS
          </a>

          {/* CRT Filter Toggle */}
          <button
            onClick={toggleCrt}
            className={`px-2 py-0.5 rounded border transition font-mono cursor-pointer ${
              crtEnabled
                ? "bg-white/10 border-white/30 text-cyan-300"
                : "bg-black/50 border-white/10 text-white/40"
            }`}
            title="Toggle CRT Scanline Overlay"
          >
            CRT
          </button>

          {/* Audio Haptics Toggle */}
          <button
            onClick={toggleSound}
            className={`px-2 py-0.5 rounded border transition cursor-pointer ${
              soundEnabled
                ? "bg-white/10 border-white/30 text-white"
                : "bg-black/50 border-white/10 text-white/40"
            }`}
            title="Toggle Mechanical Key Sounds"
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>

          {/* Mode Toggle Button (Screensaver <-> Desktop) */}
          <button
            onClick={handleModeToggle}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 hover:bg-white/15 border border-white/20 text-white transition cursor-pointer font-mono text-[11px]"
            title="Toggle Mode (Space / Super+Esc)"
          >
            <span className="hidden sm:inline text-[10px] bg-white/10 px-1 py-0.2 rounded border border-white/20 text-cyan-300">
              Space
            </span>
            <span>{isRootScreensaver ? "Desktop" : "Screensaver"}</span>
          </button>

          {/* Live System Clock */}
          <div className="hidden sm:flex items-center px-2 py-0.5 rounded bg-black/60 border border-white/10 text-white/70 font-mono tracking-wider">
            {clock}
          </div>
        </div>
      </div>
    </header>
  );
}
