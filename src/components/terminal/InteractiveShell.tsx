"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { playSwitchClick } from "@/lib/audio";
import { processShellCommand, getShellCompletions } from "@/lib/shellCommands";

interface HistoryEntry {
  command: string;
  output: React.ReactNode;
}

export function InteractiveShell() {
  const router = useRouter();
  const { themeConfig, setTheme, soundEnabled } = useTheme();

  const [inputVal, setInputVal] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "welcome",
      output: (
        <div className="text-white/60 space-y-1">
          <div>Michael Svendsen Systems Terminal v2.4 (x86_64-linux)</div>
          <div>
            Type <span className="text-cyan-300 font-bold">help</span> to list utilities,{" "}
            <span className="text-emerald-400 font-bold">theme &lt;name&gt;</span> to customize, or navigate workspaces directly.
          </div>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Arrow Up: Cycle backwards through command history
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx]);
      return;
    }

    // Arrow Down: Cycle forward through command history
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(null);
        setInputVal("");
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
      return;
    }

    // Tab: Autocomplete command name
    if (e.key === "Tab") {
      e.preventDefault();
      const completions = getShellCompletions(inputVal);
      if (completions.length === 1) {
        setInputVal(completions[0] + " ");
        playSwitchClick("up", soundEnabled);
      } else if (completions.length > 1) {
        setHistory((prev) => [
          ...prev,
          {
            command: inputVal,
            output: (
              <div className="text-cyan-300 flex gap-3 text-[11px]">
                {completions.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            ),
          },
        ]);
        playSwitchClick("down", soundEnabled);
      }
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    playSwitchClick("down", soundEnabled);
    setInputVal("");
    setHistoryIndex(null);
    setCommandHistory((prev) => [...prev, raw]);

    const result = processShellCommand(raw);

    if (result.type === "CLEAR") {
      setHistory([]);
      return;
    }

    let outputNode: React.ReactNode = null;

    if (result.type === "NAVIGATE") {
      outputNode = <div className="text-emerald-400">{result.message}</div>;
      setTimeout(() => router.push(result.path), 350);
    } else if (result.type === "THEME_CHANGE") {
      setTheme(result.themeId);
      outputNode = <div className="text-emerald-400">{result.text}</div>;
    } else if (result.type === "ERROR") {
      outputNode = <div className="text-red-400">{result.text}</div>;
    } else {
      outputNode = (
        <pre className="text-white/80 whitespace-pre-wrap font-mono text-xs leading-relaxed">
          {result.text}
        </pre>
      );
    }

    setHistory((prev) => [...prev, { command: raw, output: outputNode }]);
  };

  return (
    <div
      className="rounded-lg border p-4 font-mono text-xs shadow-lg transition-colors"
      style={{
        backgroundColor: themeConfig.palette.card,
        borderColor: themeConfig.palette.border,
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Shell Titlebar */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-white/50 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
          </span>
          <span className="text-white/70 font-semibold ml-1">sh // interactive workspace terminal</span>
        </div>
        <span className="text-white/30 hidden sm:inline">bash (Tab: complete, ↑/↓: history)</span>
      </div>

      {/* Terminal Output Stream */}
      <div className="space-y-3 max-h-72 sm:max-h-80 overflow-y-auto pr-1">
        {history.map((h, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2 text-white/40">
              <span style={{ color: themeConfig.palette.accent }} className="font-bold">
                svendsen@workstation:~$
              </span>
              <span className="text-white font-medium">{h.command}</span>
            </div>
            <div className="pl-2 border-l border-white/10">{h.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Prompt */}
      <form onSubmit={handleCommand} className="mt-3 flex items-center gap-2 border-t border-white/10 pt-2">
        <span style={{ color: themeConfig.palette.accent }} className="font-bold whitespace-nowrap">
          svendsen@workstation:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="help, whoami, theme catppuccin, cat spypoint-mcp..."
          className="flex-1 bg-transparent text-white outline-none placeholder:text-white/20 text-xs"
          autoFocus
        />
      </form>
    </div>
  );
}
