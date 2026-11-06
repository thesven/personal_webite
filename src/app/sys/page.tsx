"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScreensaverCanvas } from "@/components/screensaver/ScreensaverCanvas";
import { FastfetchCard } from "@/components/terminal/FastfetchCard";
import { TelemetryGauges } from "@/components/terminal/TelemetryGauges";
import { InteractiveShell } from "@/components/terminal/InteractiveShell";
import { ARTICLES } from "@/data/articles";
import { useTheme } from "@/context/ThemeContext";
import { playSwitchClick } from "@/lib/audio";

export default function SystemDashboardPage() {
  const router = useRouter();
  const { themeConfig, soundEnabled } = useTheme();

  const openScreensaver = () => {
    playSwitchClick("space", soundEnabled);
    router.push("/");
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Hero Screensaver Window Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/50 px-1">
          <div className="flex items-center gap-2">
            <span style={{ color: themeConfig.palette.accent }} className="font-bold">
              [1:sys]
            </span>
            <span className="text-white/80 font-semibold">
              Delta Corps Priest 1 Hero Screensaver
            </span>
          </div>
          <button
            onClick={openScreensaver}
            className="hover:text-white transition text-[11px] underline cursor-pointer"
            title="Launch Fullscreen Screensaver (Space)"
          >
            fullscreen (Space) &rarr;
          </button>
        </div>

        <ScreensaverCanvas fullscreen={false} />
      </div>

      {/* Main Workspace Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fastfetch Specs & Shell (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <FastfetchCard />
          <InteractiveShell />
        </div>

        {/* Right Column: Live Telemetry & Featured Publications (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <TelemetryGauges />

          {/* Featured Articles Quick Dispatch Box */}
          <div
            className="rounded-lg border p-4 shadow-lg transition-colors space-y-3 text-xs"
            style={{
              backgroundColor: themeConfig.palette.card,
              borderColor: themeConfig.palette.border,
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white/40">
              <span className="font-bold text-white/80">FEATURED PROJECT DISPATCHES</span>
              <Link href="/articles" className="hover:text-white transition">
                all [2:docs] &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {ARTICLES.slice(0, 3).map((art, idx) => (
                <div
                  key={art.slug}
                  className="p-2.5 rounded bg-black/40 border border-white/5 hover:border-white/20 transition group"
                >
                  <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                    <span style={{ color: themeConfig.palette.cyan }}>
                      0{idx + 1} // {art.category}
                    </span>
                    <span>{art.readTime}</span>
                  </div>
                  <Link
                    href={`/articles/${art.slug}`}
                    className="font-bold text-white group-hover:text-cyan-300 transition block text-sm"
                  >
                    {art.title}
                  </Link>
                  <p className="text-white/50 text-xs mt-1 line-clamp-2">
                    {art.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
