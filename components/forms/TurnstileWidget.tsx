"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { ShieldCheck } from "lucide-react";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: (error: string) => void;
          size?: "normal" | "compact" | "flexible";
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({ onVerify, onError }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // If no site key configured (local development / testing)
    if (!siteKey) {
      onVerify("dev_turnstile_mock_token");
      return;
    }

    if (isScriptLoaded && window.turnstile && containerRef.current) {
      try {
        window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          size: "flexible",
          callback: (token: string) => onVerify(token),
          "error-callback": (err: string) => {
            setLoadError(true);
            onError?.(err);
          },
        });
      } catch (err) {
        console.error("Turnstile render error:", err);
        setLoadError(true);
      }
    }
  }, [siteKey, isScriptLoaded, onVerify, onError]);

  // If no Turnstile key is set, render a subtle security badge in dev
  if (!siteKey) {
    return (
      <div className="p-3 rounded-r-md bg-surface border border-border flex items-center gap-2 text-xs text-ink-muted">
        <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
        <span>Spam protection active (Development bypass enabled)</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setIsScriptLoaded(true)}
        onError={() => setLoadError(true)}
      />

      <div ref={containerRef} className="min-h-[65px] w-full" />

      {loadError && (
        <p className="text-xs text-danger mt-1">
          Security verification widget could not load. If you use an ad-blocker, please allow challenges.cloudflare.com.
        </p>
      )}
    </div>
  );
}
