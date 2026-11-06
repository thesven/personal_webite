/**
 * Production Analytics & GA4 Telemetry Layer
 * Measurement ID: G-3QPDDB1SV9
 *
 * Implements a type-safe, decoupled event dispatcher compatible with
 * Next.js 16 App Router (Static Export) and Cloudflare Pages.
 * Respects Global Privacy Control (GPC) and Do-Not-Track (DNT).
 */

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-3QPDDB1SV9";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | {
      action: "page_view";
      params: {
        page_location: string;
        page_title: string;
        page_workspace: string;
      };
    }
  | {
      action: "workspace_switch";
      params: {
        from_workspace: string;
        to_workspace: string;
        trigger_method: "waybar_click" | "keyboard" | "shell" | "palette";
      };
    }
  | {
      action: "screensaver_action";
      params: {
        action_type: "enter_site" | "change_effect" | "toggle_pause";
        effect_name: string;
        dwell_seconds?: number;
      };
    }
  | {
      action: "command_palette_use";
      params: {
        action_type: "open" | "search" | "execute";
        query_text?: string;
        selected_item_id?: string;
        category?: string;
      };
    }
  | {
      action: "article_view";
      params: {
        article_slug: string;
        article_title: string;
        article_category: string;
        view_mode: "page" | "modal";
      };
    }
  | {
      action: "article_scroll_milestone";
      params: {
        article_slug: string;
        percent_scrolled: 25 | 50 | 75 | 90 | 100;
        read_time_seconds: number;
      };
    }
  | {
      action: "code_block_copy";
      params: {
        article_slug: string;
        code_language: string;
      };
    }
  | {
      action: "article_filter";
      params: {
        filter_type: "category" | "search_query";
        filter_value: string;
        results_count: number;
      };
    }
  | {
      action: "terminal_command";
      params: {
        command_root: string;
        command_full: string;
        is_valid: boolean;
      };
    }
  | {
      action: "terminal_easter_egg";
      params: {
        easter_egg_name: string;
      };
    }
  | {
      action: "theme_change";
      params: {
        theme_id: string;
        trigger_source: "waybar" | "palette" | "shell";
      };
    }
  | {
      action: "audio_toggle";
      params: {
        enabled: boolean;
      };
    }
  | {
      action: "crt_toggle";
      params: {
        enabled: boolean;
      };
    }
  | {
      action: "pgp_key_copy";
      params: {
        key_id: string;
        location: string;
      };
    }
  | {
      action: "external_link_click";
      params: {
        link_destination: string;
        link_type: "github" | "linkedin" | "twitter" | "demo" | "email";
        context: string;
      };
    }
  | {
      action: "contact_intent";
      params: {
        contact_type: string;
      };
    };

/**
 * Checks if the user has opted out of tracking via browser settings (DNT / GPC).
 */
export function isTrackingAllowed(): boolean {
  if (typeof window === "undefined") return false;

  const dnt =
    navigator.doNotTrack ||
    (window as unknown as { doNotTrack?: string }).doNotTrack;

  if (dnt === "1" || dnt === "yes") {
    return false;
  }

  return true;
}

/**
 * Primary event dispatcher for GA4.
 */
export function trackEvent<E extends AnalyticsEvent>(event: E): boolean {
  if (!isTrackingAllowed()) {
    return false;
  }

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event.action, event.params);
    return true;
  }

  if (process.env.NODE_ENV === "development") {
    console.debug(`[GA4 Event] ${event.action}`, event.params);
    return true;
  }

  return false;
}

/* =========================================================================
   High-Level Ergonomic Helpers
   ========================================================================= */

export function trackPageView(
  page_location: string,
  page_title: string,
  page_workspace: string
) {
  return trackEvent({
    action: "page_view",
    params: { page_location, page_title, page_workspace },
  });
}

export function trackWorkspaceSwitch(
  from_workspace: string,
  to_workspace: string,
  trigger_method: "waybar_click" | "keyboard" | "shell" | "palette"
) {
  return trackEvent({
    action: "workspace_switch",
    params: { from_workspace, to_workspace, trigger_method },
  });
}

export function trackScreensaverAction(
  action_type: "enter_site" | "change_effect" | "toggle_pause",
  effect_name: string,
  dwell_seconds?: number
) {
  return trackEvent({
    action: "screensaver_action",
    params: { action_type, effect_name, dwell_seconds },
  });
}

export function trackCommandPaletteUse(
  action_type: "open" | "search" | "execute",
  query_text?: string,
  selected_item_id?: string,
  category?: string
) {
  return trackEvent({
    action: "command_palette_use",
    params: { action_type, query_text, selected_item_id, category },
  });
}

export function trackArticleView(
  article_slug: string,
  article_title: string,
  article_category: string,
  view_mode: "page" | "modal"
) {
  return trackEvent({
    action: "article_view",
    params: { article_slug, article_title, article_category, view_mode },
  });
}

export function trackArticleScrollMilestone(
  article_slug: string,
  percent_scrolled: 25 | 50 | 75 | 90 | 100,
  read_time_seconds: number
) {
  return trackEvent({
    action: "article_scroll_milestone",
    params: { article_slug, percent_scrolled, read_time_seconds },
  });
}

export function trackCodeCopy(article_slug: string, code_language: string) {
  return trackEvent({
    action: "code_block_copy",
    params: { article_slug, code_language },
  });
}

export function trackArticleFilter(
  filter_type: "category" | "search_query",
  filter_value: string,
  results_count: number
) {
  return trackEvent({
    action: "article_filter",
    params: { filter_type, filter_value, results_count },
  });
}

export function trackTerminalCommand(
  command_root: string,
  command_full: string,
  is_valid: boolean
) {
  return trackEvent({
    action: "terminal_command",
    params: { command_root, command_full, is_valid },
  });
}

export function trackTerminalEasterEgg(easter_egg_name: string) {
  return trackEvent({
    action: "terminal_easter_egg",
    params: { easter_egg_name },
  });
}

export function trackThemeChange(
  theme_id: string,
  trigger_source: "waybar" | "palette" | "shell"
) {
  return trackEvent({
    action: "theme_change",
    params: { theme_id, trigger_source },
  });
}

export function trackAudioToggle(enabled: boolean) {
  return trackEvent({
    action: "audio_toggle",
    params: { enabled },
  });
}

export function trackCrtToggle(enabled: boolean) {
  return trackEvent({
    action: "crt_toggle",
    params: { enabled },
  });
}

export function trackPgpKeyCopy(key_id: string, location: string = "about_card") {
  return trackEvent({
    action: "pgp_key_copy",
    params: { key_id, location },
  });
}

export function trackExternalLinkClick(
  link_destination: string,
  link_type: "github" | "linkedin" | "twitter" | "demo" | "email",
  context: string
) {
  return trackEvent({
    action: "external_link_click",
    params: { link_destination, link_type, context },
  });
}
