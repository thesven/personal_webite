export interface NavigationState {
  pathname: string;
  commandPaletteOpen?: boolean;
}

export type NavigationAction =
  | { type: "NAVIGATE"; path: string }
  | { type: "TOGGLE_COMMAND_PALETTE" }
  | { type: "CLOSE_COMMAND_PALETTE" }
  | { type: "NEXT_EFFECT" }
  | null;

export function isEditableElement(target: EventTarget | null): boolean {
  if (!target || typeof target !== "object") return false;
  const el = target as { tagName?: string; isContentEditable?: boolean };
  if (el.isContentEditable) return true;
  if (!el.tagName) return false;
  const tag = el.tagName.toUpperCase();
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export function resolveNavigationKey(
  e: {
    key: string;
    code?: string;
    metaKey?: boolean;
    ctrlKey?: boolean;
    target?: EventTarget | null;
  },
  state: NavigationState
): NavigationAction {
  // 1. Guard against typing inside form controls
  if (isEditableElement(e.target ?? null)) {
    return null;
  }

  // 2. ⌘K or Ctrl+K -> Command Palette Toggle
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    return { type: "TOGGLE_COMMAND_PALETTE" };
  }

  // 3. Escape key handling
  if (e.key === "Escape") {
    if (state.commandPaletteOpen) {
      return { type: "CLOSE_COMMAND_PALETTE" };
    }
    if (state.pathname === "/") {
      return { type: "NAVIGATE", path: "/sys" };
    }
    return null;
  }

  // If command palette is open, don't trigger workspace jumps
  if (state.commandPaletteOpen) {
    return null;
  }

  // 4. Hyprland Workspace numbers 1-4
  if (e.key === "1") {
    return { type: "NAVIGATE", path: "/sys" };
  }
  if (e.key === "2") {
    return { type: "NAVIGATE", path: "/articles" };
  }
  if (e.key === "3") {
    return { type: "NAVIGATE", path: "/projects" };
  }
  if (e.key === "4") {
    return { type: "NAVIGATE", path: "/about" };
  }

  // 5. Space / Enter toggle
  if (e.code === "Space" || e.key === " ") {
    return { type: "NAVIGATE", path: state.pathname === "/" ? "/sys" : "/" };
  }

  return null;
}
