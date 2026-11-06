import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  GA_MEASUREMENT_ID,
  isTrackingAllowed,
  trackEvent,
  trackPageView,
  trackWorkspaceSwitch,
  trackScreensaverAction,
  trackCommandPaletteUse,
  trackArticleView,
  trackArticleScrollMilestone,
  trackCodeCopy,
  trackArticleFilter,
  trackTerminalCommand,
  trackTerminalEasterEgg,
  trackThemeChange,
  trackAudioToggle,
  trackCrtToggle,
  trackPgpKeyCopy,
  trackExternalLinkClick,
} from "@/lib/analytics";

describe("Analytics Module (GA4)", () => {
  const originalWindow = (global as unknown as { window?: unknown }).window;
  const originalDnt = (navigator as unknown as { doNotTrack?: string }).doNotTrack;

  let mockGtag: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    mockGtag = vi.fn();

    (global as unknown as { window: unknown }).window = {
      gtag: mockGtag,
      dataLayer: [],
    };

    Object.defineProperty(navigator, "doNotTrack", {
      value: "0",
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    (global as unknown as { window?: unknown }).window = originalWindow;
    Object.defineProperty(navigator, "doNotTrack", {
      value: originalDnt,
      configurable: true,
      writable: true,
    });
  });

  it("exports correct default Measurement ID", () => {
    expect(GA_MEASUREMENT_ID).toBe("G-3QPDDB1SV9");
  });

  describe("isTrackingAllowed", () => {
    it("returns true when DNT is not active", () => {
      Object.defineProperty(navigator, "doNotTrack", {
        value: "0",
        configurable: true,
      });
      expect(isTrackingAllowed()).toBe(true);
    });

    it("returns false when DNT is '1'", () => {
      Object.defineProperty(navigator, "doNotTrack", {
        value: "1",
        configurable: true,
      });
      expect(isTrackingAllowed()).toBe(false);
    });

    it("returns false when DNT is 'yes'", () => {
      Object.defineProperty(navigator, "doNotTrack", {
        value: "yes",
        configurable: true,
      });
      expect(isTrackingAllowed()).toBe(false);
    });

    it("returns false when window is undefined", () => {
      delete (global as unknown as { window?: unknown }).window;
      expect(isTrackingAllowed()).toBe(false);
    });
  });

  describe("trackEvent core dispatcher", () => {
    it("dispatches event to window.gtag when allowed", () => {
      const result = trackEvent({
        action: "article_view",
        params: {
          article_slug: "test-slug",
          article_title: "Test Title",
          article_category: "Systems",
          view_mode: "page",
        },
      });

      expect(result).toBe(true);
      expect(mockGtag).toHaveBeenCalledWith("event", "article_view", {
        article_slug: "test-slug",
        article_title: "Test Title",
        article_category: "Systems",
        view_mode: "page",
      });
    });

    it("suppresses event when DNT is enabled", () => {
      Object.defineProperty(navigator, "doNotTrack", {
        value: "1",
        configurable: true,
      });

      const result = trackEvent({
        action: "page_view",
        params: {
          page_location: "https://example.com/sys",
          page_title: "Sys",
          page_workspace: "sys",
        },
      });

      expect(result).toBe(false);
      expect(mockGtag).not.toHaveBeenCalled();
    });

    it("handles missing window.gtag gracefully", () => {
      (global as unknown as { window: unknown }).window = {};

      const result = trackEvent({
        action: "audio_toggle",
        params: { enabled: true },
      });

      expect(result).toBe(false);
    });

    it("logs to console in development environment when gtag is not defined", () => {
      (global as unknown as { window: unknown }).window = {};
      const originalEnv = process.env.NODE_ENV;
      const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

      try {
        (process.env as Record<string, string | undefined>).NODE_ENV = "development";
        const result = trackEvent({
          action: "audio_toggle",
          params: { enabled: true },
        });

        expect(result).toBe(true);
        expect(debugSpy).toHaveBeenCalledWith("[GA4 Event] audio_toggle", { enabled: true });
      } finally {
        (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
        debugSpy.mockRestore();
      }
    });
  });

  describe("Ergonomic helper functions", () => {
    it("trackPageView formats page_view event correctly", () => {
      trackPageView("https://example.com/sys", "System Dashboard", "sys");
      expect(mockGtag).toHaveBeenCalledWith("event", "page_view", {
        page_location: "https://example.com/sys",
        page_title: "System Dashboard",
        page_workspace: "sys",
      });
    });

    it("trackWorkspaceSwitch formats workspace_switch event", () => {
      trackWorkspaceSwitch("sys", "docs", "waybar_click");
      expect(mockGtag).toHaveBeenCalledWith("event", "workspace_switch", {
        from_workspace: "sys",
        to_workspace: "docs",
        trigger_method: "waybar_click",
      });
    });

    it("trackScreensaverAction formats screensaver_action event", () => {
      trackScreensaverAction("enter_site", "matrix", 15);
      expect(mockGtag).toHaveBeenCalledWith("event", "screensaver_action", {
        action_type: "enter_site",
        effect_name: "matrix",
        dwell_seconds: 15,
      });
    });

    it("trackCommandPaletteUse formats command_palette_use event", () => {
      trackCommandPaletteUse("execute", "theme", "theme-tokyonight", "THEMES");
      expect(mockGtag).toHaveBeenCalledWith("event", "command_palette_use", {
        action_type: "execute",
        query_text: "theme",
        selected_item_id: "theme-tokyonight",
        category: "THEMES",
      });
    });

    it("trackArticleView formats article_view event", () => {
      trackArticleView("bedrock-agentcore", "Bedrock AgentCore", "AI / Agents", "modal");
      expect(mockGtag).toHaveBeenCalledWith("event", "article_view", {
        article_slug: "bedrock-agentcore",
        article_title: "Bedrock AgentCore",
        article_category: "AI / Agents",
        view_mode: "modal",
      });
    });

    it("trackArticleScrollMilestone formats article_scroll_milestone event", () => {
      trackArticleScrollMilestone("bedrock-agentcore", 90, 142);
      expect(mockGtag).toHaveBeenCalledWith("event", "article_scroll_milestone", {
        article_slug: "bedrock-agentcore",
        percent_scrolled: 90,
        read_time_seconds: 142,
      });
    });

    it("trackCodeCopy formats code_block_copy event", () => {
      trackCodeCopy("iracing-sdk", "typescript");
      expect(mockGtag).toHaveBeenCalledWith("event", "code_block_copy", {
        article_slug: "iracing-sdk",
        code_language: "typescript",
      });
    });

    it("trackArticleFilter formats article_filter event", () => {
      trackArticleFilter("category", "Systems", 4);
      expect(mockGtag).toHaveBeenCalledWith("event", "article_filter", {
        filter_type: "category",
        filter_value: "Systems",
        results_count: 4,
      });
    });

    it("trackTerminalCommand formats terminal_command event", () => {
      trackTerminalCommand("whoami", "whoami --all", true);
      expect(mockGtag).toHaveBeenCalledWith("event", "terminal_command", {
        command_root: "whoami",
        command_full: "whoami --all",
        is_valid: true,
      });
    });

    it("trackTerminalEasterEgg formats terminal_easter_egg event", () => {
      trackTerminalEasterEgg("matrix");
      expect(mockGtag).toHaveBeenCalledWith("event", "terminal_easter_egg", {
        easter_egg_name: "matrix",
      });
    });

    it("trackThemeChange formats theme_change event", () => {
      trackThemeChange("oxocarbon", "waybar");
      expect(mockGtag).toHaveBeenCalledWith("event", "theme_change", {
        theme_id: "oxocarbon",
        trigger_source: "waybar",
      });
    });

    it("trackAudioToggle formats audio_toggle event", () => {
      trackAudioToggle(true);
      expect(mockGtag).toHaveBeenCalledWith("event", "audio_toggle", {
        enabled: true,
      });
    });

    it("trackCrtToggle formats crt_toggle event", () => {
      trackCrtToggle(false);
      expect(mockGtag).toHaveBeenCalledWith("event", "crt_toggle", {
        enabled: false,
      });
    });

    it("trackPgpKeyCopy formats pgp_key_copy event", () => {
      trackPgpKeyCopy("4A92 F81C", "about_view");
      expect(mockGtag).toHaveBeenCalledWith("event", "pgp_key_copy", {
        key_id: "4A92 F81C",
        location: "about_view",
      });
    });

    it("trackExternalLinkClick formats external_link_click event", () => {
      trackExternalLinkClick("https://github.com/thesven", "github", "about_footer");
      expect(mockGtag).toHaveBeenCalledWith("event", "external_link_click", {
        link_destination: "https://github.com/thesven",
        link_type: "github",
        context: "about_footer",
      });
    });
  });
});
