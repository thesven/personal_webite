"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { playSwitchClick } from "@/lib/audio";
import {
  EffectType,
  BurnParticle,
  computeBurnParticle,
  createInitialParticles,
  computeSpotlightVisibility,
  computeVhsGlitchOffsets,
  computeBinaryPathToken,
  computeWaveColor,
} from "@/lib/screensaverEffects";

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

  // Keep stateRef without calling performance.now() during render to satisfy React 19 purity rules
  const stateRef = useRef({
    effect: "decrypt" as EffectType,
    autoCycle: true,
    lifecycle: "INTRO" as "INTRO" | "SETTLED" | "GLINT" | "OUTRO",
    animFrame: 0,
    settledTimer: 0,
    glintProgress: 0,
    lastTime: 0,
    frameCount: 0,
    lastFpsUpdate: 0,
    grid: [] as Cell[][],
    gridRows: 0,
    gridCols: 0,
    matrixDrops: [] as { col: number; row: number; speed: number; len: number }[],
    beamX: 0,
    spotlight1: { x: 150, y: 120, vx: 2.2, vy: 1.6, radius: 140 },
    spotlight2: { x: 450, y: 180, vx: -1.8, vy: 2.1, radius: 150 },
    width: 900,
    height: 300,
    isTabVisible: true,
    prefersReducedMotion: false,
    burnParticles: [] as BurnParticle[],
  });

  // Reset grid state for a newly selected effect (declared before callbacks to satisfy lint)
  const resetGridForEffect = useCallback(
    (eff: EffectType) => {
      const s = stateRef.current;
      s.lifecycle = "INTRO";
      setLifecycleState("INTRO");
      s.animFrame = 0;
      s.settledTimer = 0;
      s.glintProgress = 0;
      s.beamX = 0;

      // Re-seed particles if burn
      if (eff === "burn") {
        s.burnParticles = createInitialParticles(45, 900, 300);
      }

      for (let r = 0; r < s.gridRows; r++) {
        for (let c = 0; c < s.gridCols; c++) {
          const cell = s.grid[r]?.[c];
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
          } else if (eff === "burn") {
            cell.char = cell.targetChar;
            cell.color = "#ff9800";
            cell.alpha = 0.2;
          } else {
            cell.char = cell.targetChar;
            cell.color = themeConfig.palette.accent;
            cell.alpha = 0.1;
          }
        }
      }
    },
    [themeConfig.palette]
  );

  const nextEffect = useCallback(() => {
    const list: EffectType[] = [
      "decrypt",
      "matrix",
      "beams",
      "burn",
      "waves",
      "spotlights",
      "vhstape",
      "binarypath",
    ];
    const currIdx = list.indexOf(stateRef.current.effect);
    const nextIdx = (currIdx + 1) % list.length;
    const next = list[nextIdx];
    stateRef.current.effect = next;
    setCurrentEffect(next);
    resetGridForEffect(next);
    playSwitchClick("up", soundEnabled);
  }, [soundEnabled, resetGridForEffect]);

  const selectEffect = useCallback(
    (eff: EffectType) => {
      stateRef.current.effect = eff;
      setCurrentEffect(eff);
      resetGridForEffect(eff);
      playSwitchClick("down", soundEnabled);
    },
    [soundEnabled, resetGridForEffect]
  );

  // Sync autoCycle toggle to ref
  useEffect(() => {
    stateRef.current.autoCycle = autoCycle;
  }, [autoCycle]);

  // Main Canvas & Graphics Animation Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    // Initialize animation timestamps safely inside effect
    stateRef.current.lastTime = performance.now();
    stateRef.current.lastFpsUpdate = performance.now();

    const setupDimensionsAndGrid = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(rect.width, 320);
      const h = Math.max(rect.height, 240);
      stateRef.current.width = w;
      stateRef.current.height = h;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);

      // Raw Delta Corps Priest 1 block font representation
      const rawLines = [
        ...ASCII_MICHAEL,
        "                                                                                             ",
        ...ASCII_SVENDSEN,
      ];

      const rows = rawLines.length;
      const cols = Math.max(...rawLines.map((l) => l.length));

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

      // Burn initial particles
      stateRef.current.burnParticles = createInitialParticles(50, w, h);

      resetGridForEffect(stateRef.current.effect);
    };

    setupDimensionsAndGrid();
    window.addEventListener("resize", setupDimensionsAndGrid);

    // Animation Loop
    const render = (time: number) => {
      const s = stateRef.current;
      if (!s.isTabVisible) return;
      animId = requestAnimationFrame(render);
      s.animFrame++;
      s.frameCount++;

      if (time - s.lastFpsUpdate >= 1000) {
        setFps(Math.round((s.frameCount * 1000) / (time - s.lastFpsUpdate)));
        s.frameCount = 0;
        s.lastFpsUpdate = time;
      }

      const w = s.width;
      const h = s.height;

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

      const eff = s.effect;

      // 2. Effect Specific State Updates
      if (eff === "beams") {
        s.beamX = (s.beamX + 1.2) % (cols + 15);
      } else if (eff === "matrix") {
        s.matrixDrops.forEach((drop) => {
          drop.row += drop.speed;
          if (drop.row - drop.len > rows) {
            drop.row = -Math.floor(Math.random() * 5);
          }
        });
      } else if (eff === "spotlights") {
        // Bounce dual searchlight cones
        s.spotlight1.x += s.spotlight1.vx;
        s.spotlight1.y += s.spotlight1.vy;
        if (s.spotlight1.x < 50 || s.spotlight1.x > w - 50) s.spotlight1.vx *= -1;
        if (s.spotlight1.y < 40 || s.spotlight1.y > h - 40) s.spotlight1.vy *= -1;

        s.spotlight2.x += s.spotlight2.vx;
        s.spotlight2.y += s.spotlight2.vy;
        if (s.spotlight2.x < 50 || s.spotlight2.x > w - 50) s.spotlight2.vx *= -1;
        if (s.spotlight2.y < 40 || s.spotlight2.y > h - 40) s.spotlight2.vy *= -1;
      } else if (eff === "burn") {
        // Evolve burn particles
        s.burnParticles = s.burnParticles
          .map((p) => computeBurnParticle(p))
          .filter((p) => p.life > 0);
        if (s.burnParticles.length < 50) {
          s.burnParticles.push(...createInitialParticles(15, w, h));
        }

        // Draw embers
        s.burnParticles.forEach((p) => {
          ctx.fillStyle = p.color || "#ff9800";
          ctx.globalAlpha = p.life * 0.8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, 2.5 * p.life), 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
      }

      // 3. Render Text Cells
      ctx.font = `bold ${Math.round(cellH * 0.9)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = s.grid[r]?.[c];
          if (!cell || cell.targetChar === " ") continue;

          let charToDraw = cell.targetChar;
          let color = themeConfig.palette.accent;
          let alpha = 1;
          let drawOffsetX = 0;

          const posX = startX + c * cellW + cellW / 2;
          const posY = startY + r * cellH + cellH / 2;

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
            color = computeWaveColor(s.animFrame, r, c, themeConfig.palette);
          }

          // Spotlights effect: only illuminate characters inside light fields
          if (eff === "spotlights") {
            const vis = computeSpotlightVisibility(posX, posY, s.spotlight1, s.spotlight2);
            alpha = Math.max(0.06, vis);
            if (vis > 0.6) {
              color = "#ffffff";
            }
          }

          // VHS tape effect: chromatic aberration and scanline jitter
          if (eff === "vhstape") {
            const glitch = computeVhsGlitchOffsets(s.animFrame, r);
            drawOffsetX = glitch.scanlineJitter;
            if (glitch.hasTrackingGlitch) {
              color = themeConfig.palette.magenta;
            }
          }

          // Binary path effect: PCB circuit bit pulses
          if (eff === "binarypath") {
            const token = computeBinaryPathToken(s.animFrame, r, c);
            if (token.isNode) {
              charToDraw = token.char;
              color = themeConfig.palette.cyan;
              alpha = token.alpha;
            }
          }

          if (alpha > 0) {
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha;
            ctx.fillText(charToDraw, posX + drawOffsetX, posY);
          }
        }
      }
      ctx.globalAlpha = 1.0;

      if (!isReducedMotion && !document.hidden) {
        animId = requestAnimationFrame(render);
      }
    };

    const prefersReducedMotionQuery = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    let isReducedMotion = prefersReducedMotionQuery?.matches ?? false;

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        cancelAnimationFrame(animId);
        render(0);
      } else if (!document.hidden) {
        animId = requestAnimationFrame(render);
      }
    };
    prefersReducedMotionQuery?.addEventListener("change", handleReducedMotionChange);

    const handleVisibilityChange = () => {
      if (document.hidden || isReducedMotion) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (isReducedMotion) {
      render(0);
    } else {
      animId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", setupDimensionsAndGrid);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      prefersReducedMotionQuery?.removeEventListener("change", handleReducedMotionChange);
    };
  }, [themeConfig.palette, themeConfig.palette.accentRgb, resetGridForEffect, nextEffect]);

  // Fullscreen keyboard shortcut: N or Tab to cycle effect
  useEffect(() => {
    if (!fullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "n" || e.key === "Tab") {
        e.preventDefault();
        nextEffect();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreen, nextEffect]);

  return (
    <div
      className={`relative select-none overflow-hidden ${
        fullscreen
          ? "fixed inset-0 z-40 bg-[#07080c] flex flex-col items-center justify-center cursor-pointer"
          : "w-full h-80 sm:h-96 md:h-[420px] rounded-lg border border-white/10 bg-black/40"
      }`}
      onClick={() => {
        if (fullscreen && onExitFullscreen) {
          onExitFullscreen();
        }
      }}
    >
      {/* Ambient Dynamic Glow Behind ASCII */}
      {fullscreen && (
        <div
          className="absolute w-[85vw] max-w-[1100px] h-[380px] rounded-full blur-[140px] opacity-25 pointer-events-none -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-colors duration-700"
          style={{ backgroundColor: themeConfig.palette.accent }}
        />
      )}

      <canvas ref={canvasRef} className="w-full h-full block relative z-10" />

      {/* Interactive Wake Instruction Badge */}
      {fullscreen && onExitFullscreen && (
        <div className="absolute bottom-14 sm:bottom-16 left-0 right-0 z-30 flex flex-col items-center gap-3 font-mono text-center pointer-events-none">
          <div className="flex items-center gap-2.5 text-xs tracking-widest text-white/75 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
            <span style={{ color: themeConfig.palette.accent }} className="font-bold">&gt;</span>
            <span className="uppercase tracking-widest font-medium">Michael Svendsen // Senior Backend & AI Platform Engineer</span>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full animate-ping"
              style={{ backgroundColor: themeConfig.palette.accent }}
            />
          </div>

          <div className="flex items-center gap-2 mt-1 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExitFullscreen();
              }}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-xs text-white/90 hover:text-white flex items-center gap-2.5 transition cursor-pointer shadow-xl backdrop-blur-md group"
            >
              <span style={{ color: themeConfig.palette.accent }} className="font-bold group-hover:translate-x-0.5 transition">↵</span>
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[11px] border border-white/30">Space</kbd> or click to open desktop</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextEffect();
              }}
              title="Switch Animation Effect (Press N or Tab)"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 hover:border-white/30 text-xs text-white/70 hover:text-white transition cursor-pointer backdrop-blur-md"
            >
              <span className="text-white/40">Effect:</span>
              <span className="text-white font-semibold">{currentEffect}</span>
              <span className="text-white/40 ml-0.5">(N)</span>
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Bottom OS Status Badges */}
      {fullscreen && (
        <div className="absolute bottom-3 left-6 right-6 z-20 hidden sm:flex items-center justify-between text-[11px] font-mono text-white/35 pointer-events-none">
          <div className="flex items-center gap-2">
            <span>Terminal Graphics Engine // TTE Web</span>
            <span>•</span>
            <span style={{ color: themeConfig.palette.cyan }}>delta-corps-priest-1</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400/80">{fps} FPS</span>
            <span>•</span>
            <span>hyprland 0.41</span>
            <span>•</span>
            <span>wayland compositor</span>
          </div>
        </div>
      )}

      {/* CRT Scanline Grid Overlay */}
      {crtEnabled && (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 255, 0, 0.03))",
            backgroundSize: "100% 3px, 6px 100%",
          }}
        />
      )}

      {/* Top Banner Status Bar (Only in inline desktop hero card) */}
      {!fullscreen && (
        <div
          className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between pointer-events-none"
          onClick={(e) => e.stopPropagation()}
        >
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

          <div className="flex items-center gap-1.5 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            {/* Effect Selector */}
            <select
              value={currentEffect}
              onChange={(e) => selectEffect(e.target.value as EffectType)}
              className="bg-black/60 backdrop-blur-md text-xs text-white/80 border border-white/10 px-2 py-1 rounded outline-none cursor-pointer hover:border-white/20 font-mono"
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
              className="bg-black/60 backdrop-blur-md text-xs text-white/70 hover:text-white px-2 py-1 rounded border border-white/10 hover:border-white/30 transition cursor-pointer"
            >
              ⇥
            </button>

            {/* Auto Cycle Toggle */}
            <button
              onClick={() => setAutoCycle(!autoCycle)}
              className={`text-xs px-2 py-1 rounded border backdrop-blur-md transition cursor-pointer ${
                autoCycle
                  ? "bg-white/10 border-white/30 text-white"
                  : "bg-black/60 border-white/10 text-white/40"
              }`}
              title="Auto Cycle Mode"
            >
              ⟳ {autoCycle ? "auto" : "manual"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
