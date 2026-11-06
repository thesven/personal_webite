"use client";

import React from "react";
import { AboutView } from "@/components/about/AboutView";
import { useTheme } from "@/context/ThemeContext";

export function AboutClient() {
  const { themeConfig } = useTheme();

  return (
    <div className="space-y-6 font-mono">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: themeConfig.palette.accent }} className="font-bold">
              [4:user]
            </span>
            <span className="text-white/40">whoami://michael-svendsen</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Biography, Career Journal &amp; Security
          </h1>
        </div>
        <div className="text-xs text-white/40">
          Staff Systems Architect • Low-Latency Infrastructure
        </div>
      </header>

      <AboutView />
    </div>
  );
}
