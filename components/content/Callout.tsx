import React from "react";
import { Info, Lightbulb, AlertTriangle, AlertCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalloutType =
  | "note"
  | "info"
  | "tip"
  | "warning"
  | "danger"
  | "caution";

interface CalloutProps {
  type?: CalloutType | string;
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "note", title, children }: CalloutProps) {
  const configs: Record<
    string,
    { border: string; icon: React.ReactNode; defaultTitle: string }
  > = {
    note: {
      border: "border-brand/40 bg-surface-tint/60 text-ink",
      icon: <Info className="w-5 h-5 text-brand shrink-0" />,
      defaultTitle: "Note",
    },
    info: {
      border: "border-focus/40 bg-focus/10 text-ink",
      icon: <AlertCircle className="w-5 h-5 text-focus shrink-0" />,
      defaultTitle: "Information",
    },
    tip: {
      border: "border-success/40 bg-success/10 text-ink",
      icon: <Lightbulb className="w-5 h-5 text-success shrink-0" />,
      defaultTitle: "Tip",
    },
    warning: {
      border: "border-accent/60 bg-accent/15 text-ink",
      icon: <AlertTriangle className="w-5 h-5 text-accent shrink-0" />,
      defaultTitle: "Important",
    },
    danger: {
      border: "border-danger/40 bg-danger/10 text-ink",
      icon: <ShieldAlert className="w-5 h-5 text-danger shrink-0" />,
      defaultTitle: "Warning",
    },
    caution: {
      border: "border-danger/40 bg-danger/10 text-ink",
      icon: <ShieldAlert className="w-5 h-5 text-danger shrink-0" />,
      defaultTitle: "Caution",
    },
  };

  const normalizedType = (type || "note").toLowerCase();
  const current = configs[normalizedType] || configs.note;

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

