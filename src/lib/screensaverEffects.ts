export type EffectType =
  | "decrypt"
  | "matrix"
  | "beams"
  | "burn"
  | "waves"
  | "spotlights"
  | "vhstape"
  | "binarypath";

export const ALL_EFFECTS: EffectType[] = [
  "decrypt",
  "matrix",
  "beams",
  "burn",
  "waves",
  "spotlights",
  "vhstape",
  "binarypath",
];

export interface BurnParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color?: string;
}

export function computeBurnParticle(p: BurnParticle): BurnParticle & { color: string } {
  const updatedLife = Math.max(0, p.life - 1 / p.maxLife);
  const updatedX = p.x + p.vx + (Math.random() - 0.5) * 0.4;
  const updatedY = p.y + p.vy;

  // Thermal gradient ramp:
  // life > 0.7: gold/white (#fff59d)
  // life > 0.4: bright orange (#ff9800)
  // life <= 0.4: crimson / dark red (#d32f2f)
  let color = "#d32f2f";
  if (updatedLife > 0.7) {
    color = "#fff59d";
  } else if (updatedLife > 0.35) {
    color = "#ff9800";
  }

  return {
    ...p,
    x: updatedX,
    y: updatedY,
    life: updatedLife,
    color,
  };
}

export function createInitialParticles(count: number, width: number, height: number): BurnParticle[] {
  const particles: BurnParticle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: height - Math.random() * (height * 0.4),
      vx: (Math.random() - 0.5) * 1.2,
      vy: -(1.0 + Math.random() * 2.5),
      life: 0.5 + Math.random() * 0.5,
      maxLife: 40 + Math.floor(Math.random() * 40),
    });
  }
  return particles;
}

export function computeSpotlightVisibility(
  px: number,
  py: number,
  spot1: { x: number; y: number; radius: number },
  spot2: { x: number; y: number; radius: number }
): number {
  const dist1 = Math.hypot(px - spot1.x, py - spot1.y);
  const dist2 = Math.hypot(px - spot2.x, py - spot2.y);

  const vis1 = dist1 <= spot1.radius ? Math.max(0, 1 - dist1 / spot1.radius) : 0;
  const vis2 = dist2 <= spot2.radius ? Math.max(0, 1 - dist2 / spot2.radius) : 0;

  // Max visibility from either light cone
  return Math.min(1, vis1 + vis2);
}

export function computeVhsGlitchOffsets(
  frame: number,
  row: number
): { rgbSplit: number; scanlineJitter: number; hasTrackingGlitch: boolean } {
  // Periodic tracking roll every 90 frames
  const isTracking = (frame + row * 4) % 90 < 8;
  const scanlineJitter = isTracking ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 1.5;
  const rgbSplit = isTracking ? 4 : 1.5;

  return {
    rgbSplit,
    scanlineJitter,
    hasTrackingGlitch: isTracking,
  };
}

export function computeBinaryPathToken(
  frame: number,
  row: number,
  col: number
): { char: string; alpha: number; isNode: boolean } {
  const seed = (frame * 0.2 + row * 7 + col * 13) % 20;
  if (seed < 4) {
    return { char: "1", alpha: 0.9, isNode: true };
  } else if (seed < 8) {
    return { char: "0", alpha: 0.7, isNode: false };
  } else if (seed < 12) {
    return { char: "•", alpha: 0.5, isNode: false };
  }
  return { char: " ", alpha: 0.2, isNode: false };
}

export function computeWaveColor(
  frame: number,
  row: number,
  col: number,
  palette: { accent: string; cyan: string; magenta: string }
): string {
  const wave = Math.sin(frame * 0.05 + col * 0.2 + row * 0.3);
  if (wave > 0.4) {
    return palette.cyan;
  } else if (wave < -0.4) {
    return palette.magenta;
  }
  return palette.accent;
}
