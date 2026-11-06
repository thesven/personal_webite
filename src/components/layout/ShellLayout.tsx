"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Waybar } from "@/components/layout/Waybar";
import { CommandPalette } from "@/components/layout/CommandPalette";

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRootScreensaver = pathname === "/";

  return (
    <>
      <Waybar />
      <CommandPalette />

      {isRootScreensaver ? (
        <main className="flex-1 w-full relative overflow-hidden">
          {children}
        </main>
      ) : (
        <>
          <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40 font-mono">
            <div>
              Michael Svendsen • Senior Backend & AI Platform Engineer • Aurora / Toronto, ON
            </div>
            <div className="text-[10px] text-white/25 mt-1">
              Static Edge Build • Cloudflare Pages • zero-database architecture
            </div>
          </footer>
        </>
      )}
    </>
  );
}
