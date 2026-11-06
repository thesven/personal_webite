"use client";

import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScreensaverCanvas } from "@/components/screensaver/ScreensaverCanvas";
import { useTheme } from "@/context/ThemeContext";
import { playSwitchClick } from "@/lib/audio";
import { trackScreensaverAction } from "@/lib/analytics";

export function RootScreensaverClient() {
  const router = useRouter();
  const { soundEnabled } = useTheme();
  const mountTimeRef = useRef<number | null>(null);

  useEffect(() => {
    mountTimeRef.current = Date.now();
  }, []);

  const goToDesktop = () => {
    playSwitchClick("space", soundEnabled);
    const start = mountTimeRef.current || Date.now();
    const dwell = Math.round((Date.now() - start) / 1000);
    trackScreensaverAction("enter_site", "hero", dwell);
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
