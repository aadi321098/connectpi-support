import React from "react";
import { Button } from "@/components/ui/Button";
import { HelpCircle, ArrowRight } from "lucide-react";

interface ContactCTAProps {
  title?: string;
  description?: string;
  app?: string;
}

export function ContactCTA({
  title = "Still stuck?",
  description = "If these steps did not resolve your issue, our support team can help investigate.",
  app,
}: ContactCTAProps) {
  const href = app ? `/contact?app=${encodeURIComponent(app)}` : "/contact";

  return (
    <div className="my-8 p-5 sm:p-6 rounded-r-xl bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-r-lg bg-surface-tint text-brand flex items-center justify-center shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-heading font-bold text-base text-ink mb-1">
            {title}
          </h4>
          <p className="text-sm text-ink-muted leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <Button
        href={href}
        variant="primary"
        size="small"
        className="shrink-0 w-full sm:w-auto"
        rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
      >
        Contact Support
      </Button>
    </div>
  );
}

