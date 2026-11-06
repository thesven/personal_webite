"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { GA_MEASUREMENT_ID, trackPageView } from "@/lib/analytics";

function resolveWorkspace(pathname: string): string {
  if (pathname === "/") return "root";
  if (pathname.startsWith("/sys")) return "sys";
  if (pathname.startsWith("/articles")) return "docs";
  if (pathname.startsWith("/projects")) return "work";
  if (pathname.startsWith("/about")) return "user";
  return "custom";
}

function RouteObserver() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const queryString = searchParams?.toString();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

    if (previousUrlRef.current !== fullPath) {
      previousUrlRef.current = fullPath;
      const workspace = resolveWorkspace(pathname);
      const title = typeof document !== "undefined" ? document.title : "";
      const fullUrl =
        typeof window !== "undefined" ? window.location.href : fullPath;

      trackPageView(fullUrl, title, workspace);
    }
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsTracker() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <RouteObserver />
      </Suspense>
    </>
  );
}
