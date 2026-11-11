import React from "react";
import { Info, Lightbulb, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  type?: "note" | "tip" | "warning";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "note", title, children }: CalloutProps) {
  const configs = {
    note: {
      border: "border-brand/40 bg-surface-tint/60 text-ink",
      icon: <Info className="w-5 h-5 text-brand shrink-0" />,
      defaultTitle: "Note",
    },
    tip: {
      border: "border-success/40 bg-success/10 text-ink",
      icon: <Lightbulb className="w-5 h-5 text-success shrink-0" />,
      defaultTitle: "Tip",
    },
    warning: {
      border: "border-danger/40 bg-danger/10 text-ink",
      icon: <AlertTriangle className="w-5 h-5 text-danger shrink-0" />,
      defaultTitle: "Important",
    },
  };

  const current = configs[type];

  return (
    <aside
      className={cn(
        "my-6 p-4 sm:p-5 rounded-r-lg border-l-4 flex gap-3.5 shadow-sm",
        current.border
      )}
      role="note"
      aria-label={title || current.defaultTitle}
    >
      <div className="mt-0.5">{current.icon}</div>
      <div className="flex-1 text-sm sm:text-base leading-relaxed">
        {title && (
          <h4 className="font-heading font-bold text-ink mb-1.5 text-base">
            {title}
          </h4>
        )}
        <div className="text-ink-body [&>p]:mb-2 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </aside>
  );
}
