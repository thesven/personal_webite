"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Waybar } from "@/components/layout/Waybar";
import { CommandPalette } from "@/components/layout/CommandPalette";

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRootScreensaver = pathname === "/";

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-400 focus:text-black focus:font-mono focus:text-xs focus:font-bold focus:rounded focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>
      <Waybar />
      <CommandPalette />

      {isRootScreensaver ? (
        <main id="main-content" className="flex-1 w-full relative overflow-hidden">
          {children}
        </main>
      ) : (
        <>
          <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-white/10 py-6 text-center text-xs text-white/50 font-mono space-y-2">
            <div>
              Michael Svendsen • Senior Backend &amp; AI Platform Engineer • Aurora / Toronto, ON
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-white/40">
              <Link href="/llms.txt" className="hover:text-cyan-300 transition underline underline-offset-2">
                llms.txt
              </Link>
              <span>•</span>
              <Link href="/llms-full.txt" className="hover:text-cyan-300 transition underline underline-offset-2">
                llms-full.txt
              </Link>
              <span>•</span>
              <Link href="/feed.xml" className="hover:text-cyan-300 transition underline underline-offset-2">
                RSS Feed
              </Link>
              <span>•</span>
              <Link href="/feed.json" className="hover:text-cyan-300 transition underline underline-offset-2">
                JSON Feed
              </Link>
              <span>•</span>
              <a
                href="https://github.com/thesven"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition underline underline-offset-2"
              >
                GitHub
              </a>
              <span>•</span>
              <a
                href="https://huggingface.co/thesven"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition underline underline-offset-2"
              >
                Hugging Face
              </a>
            </div>
            <div className="text-[10px] text-white/25">
              Static Export • Cloudflare Pages • zero-database architecture
            </div>
          </footer>
        </>
      )}
    </>
  );
}
