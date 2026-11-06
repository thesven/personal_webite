import { describe, it, expect } from "vitest";
import {
  renderAsciiBar,
  generateProcessList,
  formatUptime,
} from "@/lib/telemetry";

describe("Telemetry & Kernel Monitor Engine", () => {
  it("should render ASCII progress bars with accurate filled and empty chars", () => {
    const half = renderAsciiBar(50, 100, 10);
    expect(half).toBe("[█████░░░░░]");

    const full = renderAsciiBar(100, 100, 10);
    expect(full).toBe("[██████████]");

    const empty = renderAsciiBar(0, 100, 10);
    expect(empty).toBe("[░░░░░░░░░░]");
  });

  it("should clamp progress bar between 0 and max", () => {
    const over = renderAsciiBar(150, 100, 10);
    expect(over).toBe("[██████████]");

    const under = renderAsciiBar(-20, 100, 10);
    expect(under).toBe("[░░░░░░░░░░]");

    const zeroMax = renderAsciiBar(10, 0, 10);
    expect(zeroMax).toBe("[██████████]");
  });

  it("should generate simulated Linux kernel threads and process lists", () => {
    const procs = generateProcessList();
    expect(procs.length).toBeGreaterThanOrEqual(4);
    expect(procs.some((p) => p.name === "waybar")).toBe(true);
    expect(procs.some((p) => p.name === "hyprland")).toBe(true);
    expect(procs[0].pid).toBeGreaterThan(0);
  });

  it("should format uptime into human readable days, hours, minutes", () => {
    const formatted = formatUptime(3640200);
    expect(formatted).toContain("42d");
    expect(formatted).toContain("3h");
  });
});
