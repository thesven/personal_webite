"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { renderAsciiBar, generateProcessList, ProcessItem } from "@/lib/telemetry";
import { playSwitchClick } from "@/lib/audio";

export function TelemetryGauges() {
  const { themeConfig, soundEnabled } = useTheme();

  const [activeTab, setActiveTab] = useState<"gauges" | "procs">("gauges");
  const [isPaused, setIsPaused] = useState(false);
  const [procs, setProcs] = useState<ProcessItem[]>(generateProcessList());

  const [metrics, setMetrics] = useState({
    cpu: 18,
    ram: 4.2,
    ebpfEvents: 2420,
    drmFPS: 144,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const startTimer = () => {
      if (timer || isPaused || document.hidden) return;
      timer = setInterval(() => {
        setMetrics({
          cpu: Math.floor(12 + Math.random() * 15),
          ram: +(4.1 + Math.random() * 0.3).toFixed(1),
          ebpfEvents: Math.floor(2200 + Math.random() * 500),
          drmFPS: 143 + Math.floor(Math.random() * 2),
        });
        setProcs(generateProcessList());
      }, 2000);
    };

    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    if (!isPaused && !document.hidden) {
      startTimer();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPaused]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-lg border p-4 font-mono text-xs shadow-lg transition-colors"
      style={{
        backgroundColor: themeConfig.palette.card,
        borderColor: themeConfig.palette.border,
      }}
    >
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-white/40">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white/70">btop // Kernel Telemetry</span>
          <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-white/10 text-[10px]">
            <button
              onClick={() => {
                setActiveTab("gauges");
                playSwitchClick("up", soundEnabled);
              }}
              className={`px-1.5 py-0.2 rounded ${
                activeTab === "gauges" ? "text-cyan-400 font-bold bg-white/10" : "text-white/40 hover:text-white"
              }`}
            >
              gauges
            </button>
            <button
              onClick={() => {
                setActiveTab("procs");
                playSwitchClick("down", soundEnabled);
              }}
              className={`px-1.5 py-0.2 rounded ${
                activeTab === "procs" ? "text-cyan-400 font-bold bg-white/10" : "text-white/40 hover:text-white"
              }`}
            >
              procs
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setIsPaused(!isPaused);
            playSwitchClick("space", soundEnabled);
          }}
          className={`text-[10px] px-2 py-0.5 rounded border transition cursor-pointer ${
            isPaused
              ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
              : "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
          }`}
          title="Click to pause/resume real-time telemetry polling"
        >
          {isPaused ? "❚❚ PAUSED" : "● ONLINE"}
        </button>
      </div>

      {activeTab === "gauges" ? (
        <div className="space-y-2.5 text-white/80">
          {/* CPU */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white/40 w-12">CPU:</span>
              <span style={{ color: themeConfig.palette.cyan }}>{renderAsciiBar(metrics.cpu, 100)}</span>
            </div>
            <span>{metrics.cpu}% (32 Cores)</span>
          </div>

          {/* RAM */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white/40 w-12">RAM:</span>
              <span style={{ color: themeConfig.palette.accent }}>{renderAsciiBar(metrics.ram, 64)}</span>
            </div>
            <span>{metrics.ram} GB / 64 GB</span>
          </div>

          {/* eBPF */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white/40 w-12">eBPF:</span>
              <span style={{ color: themeConfig.palette.green }}>{renderAsciiBar(metrics.ebpfEvents, 4000)}</span>
            </div>
            <span>{metrics.ebpfEvents} evt/sec</span>
          </div>

          {/* DRM KMS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white/40 w-12">DRM:</span>
              <span className="text-emerald-400">{metrics.drmFPS} Hz Direct Scanout</span>
            </div>
            <span className="text-white/40">wlroots v0.18</span>
          </div>
        </div>
      ) : (
        <div className="space-y-1 text-[11px] font-mono">
          <div className="flex items-center justify-between text-white/40 border-b border-white/5 pb-1">
            <span>PID // PROCESS</span>
            <div className="flex gap-4">
              <span>CPU%</span>
              <span>MEM (MB)</span>
              <span>STAT</span>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {procs.map((p) => (
              <div key={p.pid} className="flex items-center justify-between py-1 text-white/80">
                <span className="text-cyan-300 font-semibold">{p.pid} {p.name}</span>
                <div className="flex gap-4 text-white/60">
                  <span className="w-10 text-right">{p.cpu}%</span>
                  <span className="w-16 text-right">{p.mem} MB</span>
                  <span className="w-8 text-right text-emerald-400">{p.state}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
