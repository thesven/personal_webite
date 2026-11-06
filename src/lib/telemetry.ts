export interface ProcessItem {
  pid: number;
  name: string;
  cpu: number;
  mem: number;
  state: "R" | "S";
}

export function renderAsciiBar(val: number, max: number, totalChars: number = 14): string {
  const safeMax = max <= 0 ? 1 : max;
  const pct = Math.min(100, Math.max(0, (val / safeMax) * 100));
  const filled = Math.round((pct / 100) * totalChars);
  const empty = Math.max(0, totalChars - filled);
  return `[${"█".repeat(filled)}${"░".repeat(empty)}]`;
}

export function generateProcessList(): ProcessItem[] {
  return [
    { pid: 1420, name: "hyprland", cpu: +(1.2 + Math.random() * 0.8).toFixed(1), mem: 340, state: "R" },
    { pid: 1582, name: "waybar", cpu: +(0.4 + Math.random() * 0.3).toFixed(1), mem: 68, state: "S" },
    { pid: 2190, name: "turbopack", cpu: +(2.1 + Math.random() * 1.5).toFixed(1), mem: 512, state: "R" },
    { pid: 2844, name: "ollama-runner", cpu: +(4.5 + Math.random() * 3.0).toFixed(1), mem: 1240, state: "S" },
    { pid: 3012, name: "kitty", cpu: 0.2, mem: 42, state: "S" },
  ];
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}
