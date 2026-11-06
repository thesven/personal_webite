"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScreensaverCanvas } from "@/components/screensaver/ScreensaverCanvas";
import { useTheme } from "@/context/ThemeContext";
import { playSwitchClick } from "@/lib/audio";

export default function RootScreensaverPage() {
  const router = useRouter();
  const { soundEnabled } = useTheme();

  const goToDesktop = () => {
    playSwitchClick("space", soundEnabled);
    router.push("/sys");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "Enter") {
        const target = e.target as HTMLElement;
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        goToDesktop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [soundEnabled]);

  return (
    <div className="w-full h-[calc(100vh-45px)] relative overflow-hidden font-mono select-none">
      <ScreensaverCanvas
        fullscreen={true}
        onExitFullscreen={goToDesktop}
      />
    </div>
  );
}
