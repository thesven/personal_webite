"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export function TelemetryGauges() {
  const { themeConfig } = useTheme();

  const [metrics, setMetrics] = useState({
    cpu: 18,
    ram: 4.2,
    ebpfEvents: 2420,
    drmFPS: 144,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics({
        cpu: Math.floor(12 + Math.random() * 15),
        ram: +(4.1 + Math.random() * 0.3).toFixed(1),
        ebpfEvents: Math.floor(2200 + Math.random() * 500),
        drmFPS: 143 + Math.floor(Math.random() * 2),
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const renderBar = (val: number, max: number) => {
    const pct = Math.min(100, Math.max(0, (val / max) * 100));
    const totalChars = 14;
    const filled = Math.round((pct / 100) * totalChars);
    const empty = totalChars - filled;
    return `[${"█".repeat(filled)}${"░".repeat(empty)}]`;
  };

  return (
    <div
      className="rounded-lg border p-4 font-mono text-xs shadow-lg transition-colors"
      style={{
        backgroundColor: themeConfig.palette.card,
        borderColor: themeConfig.palette.border,
      }}
    >
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-white/40">
        <span className="font-bold text-white/70">btop // Kernel Telemetry</span>
        <span className="text-emerald-400">● ONLINE</span>
      </div>

      <div className="space-y-2.5 text-white/80">
        {/* CPU */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white/40 w-12">CPU:</span>
            <span style={{ color: themeConfig.palette.cyan }}>{renderBar(metrics.cpu, 100)}</span>
          </div>
          <span>{metrics.cpu}% (32 Cores)</span>
        </div>

        {/* RAM */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white/40 w-12">RAM:</span>
            <span style={{ color: themeConfig.palette.accent }}>{renderBar(metrics.ram, 64)}</span>
          </div>
          <span>{metrics.ram} GB / 64 GB</span>
        </div>

        {/* eBPF */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white/40 w-12">eBPF:</span>
            <span style={{ color: themeConfig.palette.green }}>{renderBar(metrics.ebpfEvents, 4000)}</span>
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
    </div>
  );
}
