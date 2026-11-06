"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { playSwitchClick } from "@/lib/audio";

interface HistoryEntry {
  command: string;
  output: React.ReactNode;
}

export function InteractiveShell() {
  const router = useRouter();
  const { themeConfig, setScreensaverActive, soundEnabled } = useTheme();

  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "welcome",
      output: (
        <div className="text-white/60 space-y-1">
          <div>Michael Svendsen Systems Terminal v2.4</div>
          <div>Type <span className="text-cyan-300 font-bold">help</span> to list commands, or navigate workspaces directly.</div>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    playSwitchClick("down", soundEnabled);
    const cmd = raw.toLowerCase();
    setInputVal("");

    let output: React.ReactNode = null;

    switch (cmd) {
      case "help":
        output = (
          <div className="space-y-1 text-white/70">
            <div>Available shell utilities:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 pt-1 text-white/90">
              <div><span className="text-cyan-300">whoami</span> — Identity</div>
              <div><span className="text-cyan-300">skills</span> — Tech stack</div>
              <div><span className="text-cyan-300">certs</span> — Credentials</div>
              <div><span className="text-cyan-300">articles</span> — Publications</div>
              <div><span className="text-cyan-300">projects</span> — Systems portfolio</div>
              <div><span className="text-cyan-300">about</span> — Career journal</div>
              <div><span className="text-cyan-300">screensaver</span> — Graphics engine</div>
              <div><span className="text-cyan-300">clear</span> — Clear output</div>
            </div>
          </div>
        );
        break;
      case "whoami":
        output = (
          <div className="text-white/80 space-y-1">
            <div className="font-bold text-white">Michael Svendsen (Aurora, Ontario, Canada)</div>
            <div className="text-cyan-300">Senior Backend & AI Platform Engineer @ Reactiv</div>
            <div className="text-white/60">
              Architecting production analytics, personalization, and data infrastructure across AWS and Snowflake with dbt. Creator of LiteMCP, SPYPOINT MCP, GGUF-n-Go, and open-source models on Hugging Face.
            </div>
          </div>
        );
        break;
      case "skills":
      case "stack":
        output = (
          <div className="text-white/80 space-y-1">
            <div><span className="text-cyan-300">Languages & Data:</span> Python, SQL, TypeScript, Bash, Go</div>
            <div><span className="text-cyan-300">Data Platform:</span> Snowflake, dbt, AWS (Lambda, Step Functions, Glue, Redshift Serverless)</div>
            <div><span className="text-cyan-300">AI & Agents:</span> Amazon Bedrock AgentCore, Model Context Protocol (MCP), Deep Learning, LLM Fine-Tuning</div>
          </div>
        );
        break;
      case "certs":
      case "certifications":
        output = (
          <div className="text-white/80 space-y-1">
            <div>• <span className="text-cyan-300">Snowflake Northstar</span> — Data Ingestion, Transformation, and Delivery (Issued Apr 2025)</div>
            <div>• <span className="text-amber-300">Edinburgh Whisky Academy</span> — Certificate in Scotch Whisky</div>
            <div>• <span className="text-emerald-400">Honors:</span> FWA Site of the Day (Lexus IS with Jam3) & ADCC Bronze</div>
          </div>
        );
        break;
      case "articles":
      case "docs":
        output = <div>Navigating to [2:docs] Publications...</div>;
        setTimeout(() => router.push("/articles"), 400);
        break;
      case "projects":
      case "work":
        output = <div>Navigating to [3:work] Projects...</div>;
        setTimeout(() => router.push("/projects"), 400);
        break;
      case "about":
      case "user":
        output = <div>Navigating to [4:user] Biography & Career...</div>;
        setTimeout(() => router.push("/about"), 400);
        break;
      case "screensaver":
      case "tte":
        output = <div>Activating Delta Corps Priest 1 Screensaver...</div>;
        setTimeout(() => router.push("/"), 300);
        break;
      case "uname":
      case "uname -a":
        output = <div>Linux workstation 6.12.1-zen #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux</div>;
        break;
      case "uptime":
        output = <div>14:35:12 up 42 days, 3:18, 1 user, load average: 0.12, 0.08, 0.05</div>;
        break;
      case "clear":
        setHistory([]);
        return;
      default:
        output = (
          <div className="text-red-400">
            command not found: {raw}. Type <span className="text-white underline">help</span> for valid commands.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: raw, output }]);
  };

  return (
    <div
      className="rounded-lg border p-4 font-mono text-xs shadow-lg transition-colors"
      style={{
        backgroundColor: themeConfig.palette.card,
        borderColor: themeConfig.palette.border,
      }}
    >
      {/* Shell Titlebar */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-white/40">
        <div className="flex items-center gap-2">
          <span className="text-white/70 font-bold">&gt;_ TUI Shell Prompt</span>
        </div>
        <span className="text-[10px]">zsh 5.9</span>
      </div>

      {/* Terminal History */}
      <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-white/50">
              <span style={{ color: themeConfig.palette.accent }}>svendsen@workstation:~$</span>
              <span className="text-white font-medium">{entry.command}</span>
            </div>
            <div className="pl-4">{entry.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Active Input Line */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 pt-3 mt-2 border-t border-white/10">
        <span style={{ color: themeConfig.palette.accent }} className="font-bold select-none">
          svendsen@workstation:~$
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="help..."
          className="w-full bg-transparent text-white outline-none placeholder:text-white/20 font-mono text-xs"
        />
      </form>
    </div>
  );
}
