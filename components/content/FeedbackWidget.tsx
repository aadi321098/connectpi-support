"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";

interface FeedbackWidgetProps {
  articlePath: string;
}

export function FeedbackWidget({ articlePath }: FeedbackWidgetProps) {
  const [feedbackState, setFeedbackState] = useState<"idle" | "yes" | "no">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (helpful: boolean) => {
    setIsSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: articlePath, helpful }),
      }).catch(() => {
        // Silent fail in dev or when API is stubbed
      });
      setFeedbackState(helpful ? "yes" : "no");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (feedbackState !== "idle") {
    return (
      <div
        aria-live="polite"
        className="my-8 p-5 rounded-r-lg bg-surface-tint border border-brand/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-ink"
      >
        <div className="flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-5 h-5 text-brand shrink-0" />
          <span>Thank you for your feedback! It helps us improve our guides.</span>
        </div>
        {feedbackState === "no" && (
          <Link
            href="/contact"
            className="text-xs sm:text-sm font-semibold text-brand underline underline-offset-2 hover:text-brand-hover"
          >
            Still need help? Contact Support →
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="my-8 p-5 rounded-r-lg bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
      <span className="font-heading font-semibold text-sm sm:text-base text-ink">
        Was this article helpful?
      </span>
      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        <button
          onClick={() => handleVote(true)}
          disabled={isSubmitting}
          className="touch-target flex-1 sm:flex-initial px-4 py-2 rounded-r-md border border-border hover:border-brand hover:bg-surface-tint text-sm font-medium text-ink transition-colors flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
          aria-label="Yes, this article was helpful"
        >
          <ThumbsUp className="w-4 h-4 text-brand" />
          <span>Yes</span>
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={isSubmitting}
          className="touch-target flex-1 sm:flex-initial px-4 py-2 rounded-r-md border border-border hover:border-brand hover:bg-surface-tint text-sm font-medium text-ink transition-colors flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
          aria-label="No, this article was not helpful"
        >
          <ThumbsDown className="w-4 h-4 text-ink-muted" />
          <span>No</span>
        </button>
      </div>
    </div>
  );
}

