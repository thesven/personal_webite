"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

const MONOGRAM_MS = `
 ▄▄▄▄███▄▄▄▄     ▄████████ 
▄██▀▀▀███▀▀▀██▄  ███    ███ 
███   ███   ███  ███    █▀  
███   ███   ███  ███        
███   ███   ███▀███████████ 
███   ███   ███         ███ 
███   ███   ███   ▄█    ███ 
 ▀█   ███   █▀  ▄████████▀  
`.trim();

export function FastfetchCard() {
  const { themeConfig } = useTheme();

  return (
    <div
      className="rounded-lg border p-4 sm:p-5 font-mono text-xs shadow-lg transition-colors"
      style={{
        backgroundColor: themeConfig.palette.card,
        borderColor: themeConfig.palette.border,
      }}
    >
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-white/50">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
          </span>
          <span className="text-white/80 font-bold ml-1">svendsen@workstation</span>
        </div>
        <span className="text-[10px] text-white/40 tracking-wider">fastfetch --config personal</span>
      </div>

      {/* Split Monogram & Specs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Monogram */}
        <div className="md:col-span-5 flex justify-center items-center bg-black/40 rounded p-3 border border-white/5">
          <pre
            className="leading-tight font-bold select-none text-center"
            style={{ color: themeConfig.palette.accent }}
          >
            {MONOGRAM_MS}
          </pre>
        </div>

        {/* Specs Table */}
        <div className="md:col-span-7 space-y-1.5 text-white/80">
          <div className="flex items-center justify-between border-b border-white/5 pb-1">
            <span className="text-white/40">Architect:</span>
            <span className="text-white font-semibold">Michael Svendsen</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-1">
            <span className="text-white/40">Role:</span>
            <span style={{ color: themeConfig.palette.cyan }}>Sr. Backend & AI Platform Engineer @ Reactiv</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-1">
            <span className="text-white/40">Focus:</span>
            <span>Analytics • Personalization • Data Infrastructure</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-1">
            <span className="text-white/40">Core Stack:</span>
            <span style={{ color: themeConfig.palette.green }}>Python • SQL • Snowflake • dbt • AWS • MCP</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-1">
            <span className="text-white/40">Open Source:</span>
            <span>github.com/thesven (45+ Repos) • @mikesven</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-white/40">Location:</span>
            <span>Aurora, Ontario, Canada (GTA / EST)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
