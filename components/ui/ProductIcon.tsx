import React from "react";
import { AppWindow, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductIconProps extends React.SVGProps<SVGSVGElement> {
  slug?: string;
  type?: string;
  size?: number | string;
  className?: string;
}

export function AndroidIcon({
  size = 16,
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...props}
    >
      <path d="M17.52 14.34c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m-11.04 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m11.4-6.02 2-3.46c.12-.21.05-.48-.15-.57a.42.42 0 0 0-.57.15l-2.02 3.5c-1.56-.54-3.3-.87-5.14-.87s-3.58.33-5.14.87l-2.02-3.5a.42.42 0 0 0-.57-.15c-.21.1-.28.36-.15.57l2 3.46C2.69 10.19.34 13.66 0 17.76h24c-.34-4.1-2.69-7.57-6.12-9.44" />
    </svg>
  );
}

export function BrowserIcon({
  size = 16,
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <AppWindow
      size={size}
      strokeWidth={2}
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function GamepadIcon({
  size = 16,
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <Gamepad2
      size={size}
      strokeWidth={2}
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function ProductIcon({
  slug,
  type,
  size = 16,
  className,
  ...props
}: ProductIconProps) {
  const identifier = (slug || type || "").toLowerCase();

  if (identifier.includes("game") || identifier.includes("blade")) {
    return <GamepadIcon size={size} className={className} {...props} />;
  }

  if (identifier.includes("app") || identifier.includes("android")) {
    return <AndroidIcon size={size} className={className} {...props} />;
  }

  return <BrowserIcon size={size} className={className} {...props} />;
}

