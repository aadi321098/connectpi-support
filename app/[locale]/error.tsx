"use client";

import React, { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring (e.g. Sentry if configured)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 safe-padding-inline">
      <Container className="text-center max-w-lg">
        <div className="w-16 h-16 rounded-r-xl bg-danger/10 text-danger flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-ink">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm sm:text-base text-ink-muted leading-relaxed">
          An unexpected error occurred while loading this page. Our team has been notified.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs font-mono text-ink-muted/80">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={reset}
            variant="primary"
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Try Again
          </Button>
          <Button href="/" variant="secondary" leftIcon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </div>
      </Container>
    </div>
  );
}

