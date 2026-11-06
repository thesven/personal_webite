import { describe, it, expect } from "vitest";
import { resolveNavigationKey, isEditableElement } from "@/lib/navigation";

describe("Hyprland Keyboard Navigation Controller", () => {
  it("should ignore keys when typing inside input or textarea", () => {
    const input = { tagName: "INPUT", isContentEditable: false } as HTMLElement;
    expect(isEditableElement(input)).toBe(true);
    const action = resolveNavigationKey({ key: "1", code: "Digit1", target: input }, { pathname: "/" });
    expect(action).toBeNull();
  });

  it("should ignore keys when element is contentEditable", () => {
    const div = { tagName: "DIV", isContentEditable: true } as HTMLElement;
    expect(isEditableElement(div)).toBe(true);
  });

  it("should map 1 to /sys workspace", () => {
    const action = resolveNavigationKey({ key: "1", code: "Digit1" }, { pathname: "/articles" });
    expect(action).toEqual({ type: "NAVIGATE", path: "/sys" });
  });

  it("should map 2 to /articles workspace", () => {
    const action = resolveNavigationKey({ key: "2", code: "Digit2" }, { pathname: "/sys" });
    expect(action).toEqual({ type: "NAVIGATE", path: "/articles" });
  });

  it("should map 3 to /projects workspace", () => {
    const action = resolveNavigationKey({ key: "3", code: "Digit3" }, { pathname: "/sys" });
    expect(action).toEqual({ type: "NAVIGATE", path: "/projects" });
  });

  it("should map 4 to /about workspace", () => {
    const action = resolveNavigationKey({ key: "4", code: "Digit4" }, { pathname: "/sys" });
    expect(action).toEqual({ type: "NAVIGATE", path: "/about" });
  });

  it("should map Space to screensaver toggle or wake", () => {
    const fromRoot = resolveNavigationKey({ key: " ", code: "Space" }, { pathname: "/" });
    expect(fromRoot).toEqual({ type: "NAVIGATE", path: "/sys" });

    const fromSys = resolveNavigationKey({ key: " ", code: "Space" }, { pathname: "/sys" });
    expect(fromSys).toEqual({ type: "NAVIGATE", path: "/" });
  });

  it("should map Escape to close command palette or return to /sys", () => {
    const closePalette = resolveNavigationKey({ key: "Escape" }, { pathname: "/sys", commandPaletteOpen: true });
    expect(closePalette).toEqual({ type: "CLOSE_COMMAND_PALETTE" });

    const fromScreensaver = resolveNavigationKey({ key: "Escape" }, { pathname: "/" });
    expect(fromScreensaver).toEqual({ type: "NAVIGATE", path: "/sys" });
  });

  it("should map meta+k or ctrl+k to command palette toggle", () => {
    const metaK = resolveNavigationKey({ key: "k", metaKey: true }, { pathname: "/sys" });
    expect(metaK).toEqual({ type: "TOGGLE_COMMAND_PALETTE" });

    const ctrlK = resolveNavigationKey({ key: "K", ctrlKey: true }, { pathname: "/sys" });
    expect(ctrlK).toEqual({ type: "TOGGLE_COMMAND_PALETTE" });
  });

  it("should return null for unmatched keys or when command palette is open", () => {
    expect(resolveNavigationKey({ key: "z" }, { pathname: "/sys" })).toBeNull();
    expect(resolveNavigationKey({ key: "1" }, { pathname: "/sys", commandPaletteOpen: true })).toBeNull();
    expect(resolveNavigationKey({ key: "Escape" }, { pathname: "/articles", commandPaletteOpen: false })).toBeNull();
  });

  it("should safely handle null or non-object targets in isEditableElement", () => {
    expect(isEditableElement(null)).toBe(false);
    expect(isEditableElement(undefined as unknown as EventTarget)).toBe(false);
    expect(isEditableElement("string" as unknown as EventTarget)).toBe(false);
    expect(isEditableElement({} as unknown as EventTarget)).toBe(false);
    expect(isEditableElement({ tagName: "SELECT" } as unknown as EventTarget)).toBe(true);
  });
});
