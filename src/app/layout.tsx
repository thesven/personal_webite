import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Waybar } from "@/components/layout/Waybar";
import { CommandPalette } from "@/components/layout/CommandPalette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Michael Svendsen — Systems Architecture & Engineering Publication",
  description:
    "High-craft personal website, systems architecture showcase, and technical publication platform by Michael Svendsen.",
  keywords: [
    "Michael Svendsen",
    "Systems Architecture",
    "eBPF",
    "Linux Kernel",
    "Wayland",
    "Rust",
    "Terminal Text Effects",
  ],
  authors: [{ name: "Michael Svendsen" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-white/20 selection:text-white min-h-screen flex flex-col bg-[#07080c] text-[#e0e2ec]`}
      >
        <ThemeProvider>
          <Waybar />
          <CommandPalette />
          <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40 font-mono">
            <div>Michael Svendsen • Independent Systems Architecture & Publication</div>
            <div className="text-[10px] text-white/25 mt-1">
              Static Edge Build • Cloudflare Pages Free Plan Ready • No Database Required
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
