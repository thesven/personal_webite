// Web Audio API synthesized mechanical keyboard click feedback

let audioCtx: AudioContext | null = null;
let masterCompressor: DynamicsCompressorNode | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      if (typeof audioCtx.createDynamicsCompressor === "function") {
        try {
          masterCompressor = audioCtx.createDynamicsCompressor();
          masterCompressor.threshold.setValueAtTime(-20, audioCtx.currentTime);
          masterCompressor.knee.setValueAtTime(10, audioCtx.currentTime);
          masterCompressor.ratio.setValueAtTime(12, audioCtx.currentTime);
          masterCompressor.attack.setValueAtTime(0, audioCtx.currentTime);
          masterCompressor.release.setValueAtTime(0.1, audioCtx.currentTime);
          masterCompressor.connect(audioCtx.destination);
        } catch {
          masterCompressor = null;
        }
      }
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function _resetAudioForTesting() {
  audioCtx = null;
  masterCompressor = null;
}

export function syncAudioState(enabled: boolean) {
  if (audioCtx) {
    if (!enabled && audioCtx.state === "running") {
      audioCtx.suspend().catch(() => {});
    } else if (enabled && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
  }
}

export function playSwitchClick(type: "down" | "up" | "space" = "down", enabled: boolean = true) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const targetNode = masterCompressor || ctx.destination;

    if (type === "space") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(targetNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "up") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(targetNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(targetNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    }
  } catch {
    // audio context suppressed or unsupported
  }
}
