"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { playSwitchClick } from "@/lib/audio";

const ASCII_MICHAEL = [
  "   ▄▄▄▄███▄▄▄▄    ▄█   ▄████████    ▄█    █▄       ▄████████    ▄████████  ▄█    ",
  " ▄██▀▀▀███▀▀▀██▄ ███  ███    ███   ███    ███     ███    ███   ███    ███ ███    ",
  " ███   ███   ███ ███▌ ███    █▀    ███    ███     ███    ███   ███    █▀  ███    ",
  " ███   ███   ███ ███▌ ███         ▄███▄▄▄▄███▄▄   ███    ███  ▄███▄▄▄     ███    ",
  " ███   ███   ███ ███▌ ███        ▀▀███▀▀▀▀███▀  ▀███████████ ▀▀███▀▀▀     ███    ",
  " ███   ███   ███ ███  ███    █▄    ███    ███     ███    ███   ███    █▄  ███    ",
  " ███   ███   ███ ███  ███    ███   ███    ███     ███    ███   ███    ███ ███▌  ▄",
  "  ▀█   ███   █▀  █▀   ████████▀    ███    █▀      ███    █▀    ██████████ █████▄▄██",
  "                                                                          ▀      ",
];

const ASCII_SVENDSEN = [
  "   ▄████████  ▄█    █▄     ▄████████ ███▄▄▄▄   ████████▄     ▄████████    ▄████████ ███▄▄▄▄ ",
  "  ███    ███ ███    ███   ███    ███ ███▀▀▀██▄ ███   ▀███   ███    ███   ███    ███ ███▀▀▀██▄",
  "  ███    █▀  ███    ███   ███    █▀  ███   ███ ███    ███   ███    █▀    ███    █▀  ███   ███",
  "  ███        ███    ███  ▄███▄▄▄     ███   ███ ███    ███   ███         ▄███▄▄▄     ███   ███",
  "▀███████████ ███    ███ ▀▀███▀▀▀     ███   ███ ███    ███ ▀███████████ ▀▀███▀▀▀     ███   ███",
  "         ███ ███    ███   ███    █▄  ███   ███ ███    ███          ███   ███    █▄  ███   ███",
  "   ▄█    ███ ███    ███   ███    ███ ███   ███ ███   ▄███    ▄█    ███   ███    ███ ███   ███",
  " ▄████████▀   ▀██████▀    ██████████  ▀█   █▀  ████████▀   ▄████████▀    ██████████  ▀█   █▀ ",
  "                                                                                             ",
];

export type EffectType =
  | "decrypt"
  | "matrix"
  | "beams"
  | "burn"
  | "waves"
  | "spotlights"
  | "vhstape"
  | "binarypath";

export const EFFECTS_LIST: { id: EffectType; label: string }[] = [
  { id: "decrypt", label: "Cryptographic Decrypt" },
  { id: "matrix", label: "Matrix Rain Cascade" },
  { id: "beams", label: "Precision Laser Beam" },
  { id: "burn", label: "Thermodynamic Ember Burn" },
  { id: "waves", label: "Harmonic Color Waves" },
  { id: "spotlights", label: "Nocturnal Dual Spotlights" },
  { id: "vhstape", label: "VHS Glitch & Tracking" },
  { id: "binarypath", label: "Binary PCB Trace" },
];

interface Cell {
  char: string;
  targetChar: string;
  active: boolean;
  color: string;
  origColor: string;
  alpha: number;
  row: number;
  col: number;
  revealed: boolean;
  timer: number;
  phase: number;
}

export function ScreensaverCanvas({
  fullscreen = false,
  onExitFullscreen,
}: {
  fullscreen?: boolean;
  onExitFullscreen?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { themeConfig, crtEnabled, soundEnabled } = useTheme();

  const [currentEffect, setCurrentEffect] = useState<EffectType>("decrypt");
  const [autoCycle, setAutoCycle] = useState(true);
  const [lifecycleState, setLifecycleState] = useState<"INTRO" | "SETTLED" | "GLINT" | "OUTRO">("INTRO");
  const [fps, setFps] = useState(120);

  const stateRef = useRef({
    effect: "decrypt" as EffectType,
    autoCycle: true,
    lifecycle: "INTRO" as "INTRO" | "SETTLED" | "GLINT" | "OUTRO",
    animFrame: 0,
    settledTimer: 0,
    glintProgress: 0,
    lastTime: performance.now(),
    frameCount: 0,
    lastFpsUpdate: performance.now(),
    grid: [] as Cell[][],
    gridRows: 0,
    gridCols: 0,
    matrixDrops: [] as { col: number; row: number; speed: number; len: number }[],
    beamX: 0,
    spotlight1: { x: 0, y: 0, vx: 2, vy: 1.5 },
    spotlight2: { x: 0, y: 0, vx: -1.8, vy: 2.2 },
    burnParticles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
  });

  const nextEffect = useCallback(() => {
    const list: EffectType[] = ["decrypt", "matrix", "beams", "burn", "waves", "spotlights", "vhstape", "binarypath"];
    const currIdx = list.indexOf(stateRef.current.effect);
    const nextIdx = (currIdx + 1) % list.length;
    const next = list[nextIdx];
    stateRef.current.effect = next;
    setCurrentEffect(next);
    resetGridForEffect(next);
    playSwitchClick("up", soundEnabled);
  }, [soundEnabled]);

  const selectEffect = (eff: EffectType) => {
    stateRef.current.effect = eff;
    setCurrentEffect(eff);
    resetGridForEffect(eff);
    playSwitchClick("down", soundEnabled);
  };

  const resetGridForEffect = (eff: EffectType) => {
    const s = stateRef.current;
    s.lifecycle = "INTRO";
    setLifecycleState("INTRO");
    s.animFrame = 0;
    s.settledTimer = 0;
    s.glintProgress = 0;
    s.beamX = 0;

    for (let r = 0; r < s.gridRows; r++) {
      for (let c = 0; c < s.gridCols; c++) {
        const cell = s.grid[r][c];
        if (!cell) continue;
        cell.revealed = false;
        cell.timer = Math.random() * 40;
        cell.phase = Math.random() * Math.PI * 2;
        if (eff === "decrypt") {
          cell.char = cell.targetChar !== " " ? String.fromCharCode(33 + Math.floor(Math.random() * 90)) : " ";
          cell.color = themeConfig.palette.muted;
          cell.alpha = 0.5;
        } else if (eff === "matrix") {
          cell.char = " ";
          cell.color = themeConfig.palette.green;
          cell.alpha = 0;
        } else if (eff === "beams") {
          cell.char = " ";
          cell.color = themeConfig.palette.cyan;
          cell.alpha = 0;
        } else if (eff === "burn") {
          cell.char = " ";
          cell.color = themeConfig.palette.orange;
          cell.alpha = 0;
        } else {
          cell.char = cell.targetChar;
          cell.color = themeConfig.palette.accent;
          cell.alpha = 1;
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const setupDimensionsAndGrid = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Determine single vs dual row
      const isDual = width < 880;
      let rawLines: string[] = [];
      if (isDual) {
        rawLines = [
          ...ASCII_MICHAEL,
          " ".repeat(ASCII_MICHAEL[0].length),
          ...ASCII_SVENDSEN,
        ];
      } else {
        const maxLen = Math.max(ASCII_MICHAEL.length, ASCII_SVENDSEN.length);
        rawLines = [];
        for (let i = 0; i < maxLen; i++) {
          const l1 = i < ASCII_MICHAEL.length ? ASCII_MICHAEL[i] : " ".repeat(ASCII_MICHAEL[0].length);
          const l2 = i < ASCII_SVENDSEN.length ? ASCII_SVENDSEN[i] : " ".repeat(ASCII_SVENDSEN[0].length);
          rawLines.push(l1 + "    " + l2);
        }
      }

      const rows = rawLines.length;
      const cols = rawLines[0]?.length || 1;

      stateRef.current.gridRows = rows;
      stateRef.current.gridCols = cols;

      const newGrid: Cell[][] = [];
      for (let r = 0; r < rows; r++) {
        newGrid[r] = [];
        for (let c = 0; c < cols; c++) {
          const char = rawLines[r][c] || " ";
          newGrid[r][c] = {
            char: char !== " " ? char : " ",
            targetChar: char,
            active: char !== " ",
            color: themeConfig.palette.accent,
            origColor: themeConfig.palette.accent,
            alpha: 1,
            row: r,
            col: c,
            revealed: false,
            timer: Math.random() * 30,
            phase: Math.random() * Math.PI * 2,
          };
        }
      }
      stateRef.current.grid = newGrid;

      // Matrix drops
      const drops: { col: number; row: number; speed: number; len: number }[] = [];
      for (let c = 0; c < cols; c += 2) {
        drops.push({
          col: c,
          row: Math.floor(Math.random() * -rows),
          speed: 0.3 + Math.random() * 0.4,
          len: 4 + Math.floor(Math.random() * 8),
        });
      }
      stateRef.current.matrixDrops = drops;

      resetGridForEffect(stateRef.current.effect);
    };

    setupDimensionsAndGrid();
    window.addEventListener("resize", setupDimensionsAndGrid);

    // Animation Loop
    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      const s = stateRef.current;
      s.animFrame++;
      s.frameCount++;

      if (time - s.lastFpsUpdate >= 1000) {
        setFps(Math.round((s.frameCount * 1000) / (time - s.lastFpsUpdate)));
        s.frameCount = 0;
        s.lastFpsUpdate = time;
      }

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const rows = s.gridRows;
      const cols = s.gridCols;
      if (!rows || !cols) return;

      const cellW = Math.min(w / (cols + 4), 11);
      const cellH = cellW * 1.6;
      const totalW = cols * cellW;
      const totalH = rows * cellH;
      const startX = Math.max(0, (w - totalW) / 2);
      const startY = Math.max(10, (h - totalH) / 2);

      // Lifecycle progression
      if (s.lifecycle === "INTRO") {
        if (s.animFrame > 90) {
          s.lifecycle = "SETTLED";
          setLifecycleState("SETTLED");
        }
      } else if (s.lifecycle === "SETTLED") {
        s.settledTimer++;
        if (s.settledTimer % 240 === 0) {
          s.lifecycle = "GLINT";
          setLifecycleState("GLINT");
          s.glintProgress = 0;
        } else if (s.autoCycle && s.settledTimer > 600) {
          s.lifecycle = "OUTRO";
          setLifecycleState("OUTRO");
        }
      } else if (s.lifecycle === "GLINT") {
        s.glintProgress += 0.02;
        if (s.glintProgress >= 1) {
          s.lifecycle = "SETTLED";
          setLifecycleState("SETTLED");
        }
      } else if (s.lifecycle === "OUTRO") {
        if (s.animFrame % 60 === 0) {
          nextEffect();
        }
      }

      // 1. Phosphor Bloom Background
      const radialGlow = ctx.createRadialGradient(
        w / 2,
        h / 2,
        20,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.6
      );
      radialGlow.addColorStop(0, `rgba(${themeConfig.palette.accentRgb}, 0.12)`);
      radialGlow.addColorStop(0.6, `rgba(${themeConfig.palette.accentRgb}, 0.03)`);
      radialGlow.addColorStop(1, "transparent");
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, w, h);

      // 2. Render Text Cells
      ctx.font = `bold ${Math.round(cellH * 0.9)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      const eff = s.effect;

      // Effect specific updates
      if (eff === "beams") {
        s.beamX = (s.beamX + 1.2) % (cols + 15);
      } else if (eff === "matrix") {
        s.matrixDrops.forEach((drop) => {
          drop.row += drop.speed;
          if (drop.row - drop.len > rows) {
            drop.row = -Math.floor(Math.random() * 5);
          }
        });
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = s.grid[r][c];
          if (!cell || cell.targetChar === " ") continue;

          let charToDraw = cell.targetChar;
          let color = themeConfig.palette.accent;
          let alpha = 1;

          if (s.lifecycle === "INTRO") {
            if (eff === "decrypt") {
              if (s.animFrame < cell.timer) {
                charToDraw = String.fromCharCode(33 + Math.floor(Math.random() * 90));
                color = themeConfig.palette.muted;
                alpha = 0.4;
              } else if (s.animFrame < cell.timer + 15) {
                charToDraw = cell.targetChar;
                color = themeConfig.palette.cyan;
                alpha = 0.9;
              }
            } else if (eff === "matrix") {
              let hit = false;
              s.matrixDrops.forEach((d) => {
                if (Math.abs(d.col - c) <= 1 && d.row >= r && d.row - d.len <= r) {
                  hit = true;
                  if (Math.floor(d.row) === r) {
                    charToDraw = String.fromCharCode(33 + Math.floor(Math.random() * 90));
                    color = "#ffffff";
                    alpha = 1;
                  } else {
                    color = themeConfig.palette.green;
                    alpha = 0.8;
                  }
                }
              });
              if (!hit && s.animFrame < 60) {
                alpha = 0;
              }
            } else if (eff === "beams") {
              if (c > s.beamX) {
                alpha = 0;
              } else if (Math.abs(c - s.beamX) < 2) {
                color = "#ffffff";
                alpha = 1;
              }
            }
          }

          // Specular Glint wave across characters
          if (s.lifecycle === "GLINT") {
            const glintX = s.glintProgress * (cols + 10);
            const dist = Math.abs(c - glintX + r * 0.5);
            if (dist < 3) {
              color = "#ffffff";
              alpha = 1;
            }
          }

          // Waves effect modulation
          if (eff === "waves") {
            const wave = Math.sin(s.animFrame * 0.05 + c * 0.2 + r * 0.3);
            if (wave > 0.5) {
              color = themeConfig.palette.cyan;
            } else if (wave < -0.5) {
              color = themeConfig.palette.magenta;
            }
          }

          if (alpha > 0) {
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha;
            const posX = startX + c * cellW + cellW / 2;
            const posY = startY + r * cellH + cellH / 2;
            ctx.fillText(charToDraw, posX, posY);
          }
        }
      }
      ctx.globalAlpha = 1.0;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", setupDimensionsAndGrid);
    };
  }, [themeConfig, nextEffect]);

  return (
    <div
      className={`relative select-none overflow-hidden ${
        fullscreen
          ? "fixed inset-0 z-50 bg-[#07080c] flex flex-col"
          : "w-full h-80 sm:h-96 md:h-[420px] rounded-lg border border-white/10 bg-black/40"
      }`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* CRT Scanline Grid Overlay */}
      {crtEnabled && (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
            backgroundSize: "100% 3px, 6px 100%",
          }}
        />
      )}

      {/* Top Banner Status Bar */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-xs text-white/70">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: themeConfig.palette.accent }}
          />
          <span className="font-semibold tracking-wider text-white">SVENDSEN</span>
          <span className="text-white/20">|</span>
          <span className="text-white/50">{currentEffect}</span>
          <span className="text-white/20">•</span>
          <span className="text-white/40">{lifecycleState.toLowerCase()}</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Effect Selector */}
          <select
            value={currentEffect}
            onChange={(e) => selectEffect(e.target.value as EffectType)}
            className="bg-black/60 backdrop-blur-md text-xs text-white/80 border border-white/10 px-2 py-1 rounded outline-none cursor-pointer hover:border-white/20"
          >
            {EFFECTS_LIST.map((eff) => (
              <option key={eff.id} value={eff.id} className="bg-zinc-900 text-white">
                {eff.label}
              </option>
            ))}
          </select>

          {/* Next Button */}
          <button
            onClick={nextEffect}
            title="Next Effect (N)"
            className="bg-black/60 backdrop-blur-md text-xs text-white/70 hover:text-white px-2 py-1 rounded border border-white/10 hover:border-white/30 transition"
          >
            ⇥
          </button>

          {/* Auto Cycle Toggle */}
          <button
            onClick={() => setAutoCycle(!autoCycle)}
            className={`text-xs px-2 py-1 rounded border backdrop-blur-md transition ${
              autoCycle
                ? "bg-white/10 border-white/30 text-white"
                : "bg-black/60 border-white/10 text-white/40"
            }`}
            title="Auto Cycle Mode"
          >
            ⟳ {autoCycle ? "auto" : "manual"}
          </button>

          {fullscreen && onExitFullscreen && (
            <button
              onClick={onExitFullscreen}
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1 rounded border border-white/20 transition"
            >
              ✕ Exit (Esc)
            </button>
          )}
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-2 left-4 right-4 z-20 flex items-center justify-between text-[11px] text-white/40 pointer-events-none">
        <div className="flex items-center gap-2">
          <span>FIGlet: Delta Corps Priest 1</span>
          <span>•</span>
          <span>TTE Procedural Engine</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400/80">{fps} FPS</span>
          <span>•</span>
          <span>Canvas 2D Batching</span>
        </div>
      </div>
    </div>
  );
}
