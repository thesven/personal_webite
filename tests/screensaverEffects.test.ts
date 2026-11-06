import { describe, it, expect } from "vitest";
import {
  ALL_EFFECTS,
  computeBurnParticle,
  computeSpotlightVisibility,
  computeVhsGlitchOffsets,
  computeBinaryPathToken,
  computeWaveColor,
  createInitialParticles,
} from "@/lib/screensaverEffects";

describe("Procedural Screensaver Effects Engine", () => {
  it("should support all 8 official terminal effects", () => {
    expect(ALL_EFFECTS.length).toBe(8);
    expect(ALL_EFFECTS).toContain("decrypt");
    expect(ALL_EFFECTS).toContain("matrix");
    expect(ALL_EFFECTS).toContain("beams");
    expect(ALL_EFFECTS).toContain("burn");
    expect(ALL_EFFECTS).toContain("waves");
    expect(ALL_EFFECTS).toContain("spotlights");
    expect(ALL_EFFECTS).toContain("vhstape");
    expect(ALL_EFFECTS).toContain("binarypath");
  });

  it("should compute thermodynamic burn particles correctly", () => {
    const particle = {
      x: 50,
      y: 100,
      vx: 0.2,
      vy: -1.5,
      life: 1.0,
      maxLife: 60,
    };
    const updated = computeBurnParticle(particle);
    expect(updated.y).toBeLessThan(100); // Rises upwards
    expect(updated.life).toBeLessThan(1.0); // Decays
    expect(updated.color).toBeDefined();
    expect(updated.color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("should compute spotlight visibility based on dual searchlight cones", () => {
    const spot1 = { x: 50, y: 50, radius: 100 };
    const spot2 = { x: 200, y: 200, radius: 100 };

    // Point close to spot1
    const visInside = computeSpotlightVisibility(55, 55, spot1, spot2);
    expect(visInside).toBeGreaterThan(0.5);

    // Point far away from both
    const visOutside = computeSpotlightVisibility(1000, 1000, spot1, spot2);
    expect(visOutside).toBe(0);
  });

  it("should compute VHS tape jitter and chromatic aberration offsets", () => {
    const glitch = computeVhsGlitchOffsets(120, 10);
    expect(glitch.rgbSplit).toBeDefined();
    expect(glitch.scanlineJitter).toBeDefined();
    expect(typeof glitch.rgbSplit).toBe("number");
  });

  it("should compute binary path logic tokens and circuit traces", () => {
    const token = computeBinaryPathToken(15, 4, 3);
    expect(["0", "1", "•", " "]).toContain(token.char);
    expect(token.alpha).toBeGreaterThanOrEqual(0);
    expect(token.alpha).toBeLessThanOrEqual(1);
  });

  it("should compute wave oscillation colors across grid coordinates", () => {
    const color = computeWaveColor(10, 5, 20, {
      accent: "#7aa2f7",
      cyan: "#7dcfff",
      magenta: "#bb9af7",
    });
    expect(color).toBeDefined();
    expect(["#7aa2f7", "#7dcfff", "#bb9af7"]).toContain(color);
  });

  it("should initialize burn particle emitters", () => {
    const particles = createInitialParticles(20, 800, 600);
    expect(particles.length).toBe(20);
    expect(particles[0].life).toBeGreaterThan(0);
  });

  it("should cover all burn particle life branches", () => {
    const pGold = computeBurnParticle({ x: 0, y: 0, vx: 0, vy: 0, life: 0.9, maxLife: 100 });
    expect(pGold.color).toBe("#fff59d");

    const pOrange = computeBurnParticle({ x: 0, y: 0, vx: 0, vy: 0, life: 0.5, maxLife: 100 });
    expect(pOrange.color).toBe("#ff9800");

    const pCrimson = computeBurnParticle({ x: 0, y: 0, vx: 0, vy: 0, life: 0.2, maxLife: 100 });
    expect(pCrimson.color).toBe("#d32f2f");
  });

  it("should cover spotlight2 visibility when spot1 is distant", () => {
    const spot1 = { x: 0, y: 0, radius: 50 };
    const spot2 = { x: 300, y: 300, radius: 100 };
    const vis2 = computeSpotlightVisibility(310, 310, spot1, spot2);
    expect(vis2).toBeGreaterThan(0.5);
  });

  it("should cover all binary path token seed branches", () => {
    const token0 = computeBinaryPathToken(1, 0, 1);
    const tokenDot = computeBinaryPathToken(2, 1, 1);
    const tokenSpace = computeBinaryPathToken(4, 2, 2);
    expect(["0", "1", "•", " "]).toContain(token0.char);
    expect(["0", "1", "•", " "]).toContain(tokenDot.char);
    expect(["0", "1", "•", " "]).toContain(tokenSpace.char);
  });

  it("should cover wave colors when wave is in neutral range", () => {
    const neutral = computeWaveColor(0, 0, 0, {
      accent: "#7aa2f7",
      cyan: "#7dcfff",
      magenta: "#bb9af7",
    });
    expect(neutral).toBe("#7aa2f7");
  });
});
