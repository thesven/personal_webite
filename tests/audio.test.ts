import { describe, it, expect, vi, beforeEach } from "vitest";
import { playSwitchClick } from "@/lib/audio";

describe("Web Audio API Synthesizer", () => {
  const mockSetValueAtTime = vi.fn();
  const mockExponentialRampToValueAtTime = vi.fn();
  const mockConnect = vi.fn();
  const mockStart = vi.fn();
  const mockStop = vi.fn();

  beforeEach(() => {
    mockSetValueAtTime.mockClear();
    mockExponentialRampToValueAtTime.mockClear();
    mockConnect.mockClear();
    mockStart.mockClear();
    mockStop.mockClear();

    class MockAudioContext {
      currentTime = 0;
      state = "running";
      async resume() {}
      destination = {};
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
});
