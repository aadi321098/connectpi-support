import React from "react";
import { AlertCircle } from "lucide-react";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
  children: (props: {
    id: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
  }) => React.ReactNode;
}

export function Field({
  id,
  label,
  required = false,
  description,
  error,
  children,
}: FieldProps) {
  const descId = description ? `${id}-desc` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="font-heading font-semibold text-sm text-ink select-none"
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      </div>

      {description && (
        <p id={descId} className="text-xs text-ink-muted">
          {description}
        </p>
      )}

      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
      })}

      {error && (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
          className="flex items-center gap-1.5 text-xs text-danger font-medium mt-0.5 animate-in fade-in"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
