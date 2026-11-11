import React from "react";

interface KbdProps {
  children: React.ReactNode;
}

export function Kbd({ children }: KbdProps) {
  return (
    <kbd className="inline-block px-1.5 py-0.5 text-xs font-mono font-semibold text-ink bg-surface border border-border rounded shadow-[0_1px_1px_rgba(0,0,0,0.1)] align-baseline">
      {children}
    </kbd>
  );
}
