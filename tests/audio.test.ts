import { describe, it, expect, vi, beforeEach } from "vitest";
import { playSwitchClick, syncAudioState, getAudioContext, _resetAudioForTesting } from "@/lib/audio";

describe("Web Audio API Synthesizer", () => {
  const mockSetValueAtTime = vi.fn();
  const mockExponentialRampToValueAtTime = vi.fn();
  const mockConnect = vi.fn();
  const mockStart = vi.fn();
  const mockStop = vi.fn();
  const mockSuspend = vi.fn();
  const mockResume = vi.fn();

  beforeEach(() => {
    _resetAudioForTesting();
    mockSetValueAtTime.mockClear();
    mockExponentialRampToValueAtTime.mockClear();
    mockConnect.mockClear();
    mockStart.mockClear();
    mockStop.mockClear();
    mockSuspend.mockClear();
    mockResume.mockClear();

    class MockAudioContext {
      currentTime = 0;
      state: AudioContextState = "running";
      destination = {};
      async resume() {
        this.state = "running";
        mockResume();
      }
      async suspend() {
        this.state = "suspended";
        mockSuspend();
      }
      createDynamicsCompressor() {
        return {
          threshold: { setValueAtTime: mockSetValueAtTime },
          knee: { setValueAtTime: mockSetValueAtTime },
          ratio: { setValueAtTime: mockSetValueAtTime },
          attack: { setValueAtTime: mockSetValueAtTime },
          release: { setValueAtTime: mockSetValueAtTime },
          connect: mockConnect,
        };
      }
      createOscillator() {
        return {
          type: "sine",
          frequency: {
            setValueAtTime: mockSetValueAtTime,
            exponentialRampToValueAtTime: mockExponentialRampToValueAtTime,
          },
          connect: mockConnect,
          start: mockStart,
          stop: mockStop,
        };
      }
      createGain() {
        return {
          gain: {
            setValueAtTime: mockSetValueAtTime,
            exponentialRampToValueAtTime: mockExponentialRampToValueAtTime,
          },
          connect: mockConnect,
        };
      }
    }

    (global as unknown as { window: unknown }).window = {
      AudioContext: MockAudioContext,
    };
  });

  it("should do nothing when enabled is false", () => {
    playSwitchClick("down", false);
    expect(mockStart).not.toHaveBeenCalled();
  });

  it("should synthesize down switch click", () => {
    playSwitchClick("down", true);
    expect(mockStart).toHaveBeenCalled();
    expect(mockStop).toHaveBeenCalled();
  });

  it("should synthesize up switch click", () => {
    playSwitchClick("up", true);
    expect(mockStart).toHaveBeenCalled();
    expect(mockStop).toHaveBeenCalled();
  });

  it("should synthesize space switch click", () => {
    playSwitchClick("space", true);
    expect(mockStart).toHaveBeenCalled();
    expect(mockStop).toHaveBeenCalled();
  });

  it("should suspend or resume audio context based on syncAudioState", () => {
    const ctx = getAudioContext();
    expect(ctx).toBeTruthy();

    syncAudioState(false);
    expect(mockSuspend).toHaveBeenCalled();

    syncAudioState(true);
    expect(mockResume).toHaveBeenCalled();
  });

  it("should resume context on getAudioContext if initially suspended", () => {
    _resetAudioForTesting();
    class SuspendedAudioContext {
      currentTime = 0;
      state = "suspended";
      destination = {};
      async resume() {
        mockResume();
      }
    }
    (global as unknown as { window: unknown }).window = {
      AudioContext: SuspendedAudioContext,
    };
    const ctx = getAudioContext();
    expect(ctx).toBeTruthy();
    expect(mockResume).toHaveBeenCalled();
  });

  it("should handle syncAudioState when no context is instantiated", () => {
    _resetAudioForTesting();
    expect(() => syncAudioState(false)).not.toThrow();
    expect(() => syncAudioState(true)).not.toThrow();
  });
});
