"use client";

import React from "react";
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

  return (
    <div className="w-full h-[calc(100vh-45px)] relative overflow-hidden font-mono select-none">
      <ScreensaverCanvas
        fullscreen={true}
        onExitFullscreen={goToDesktop}
      />
    </div>
  );
}
