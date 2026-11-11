import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

export type IconName = keyof typeof LucideIcons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
  className?: string;
  ariaLabel?: string;
}

export function Icon({
  name,
  size = 20,
  className,
  ariaLabel,
  ...props
}: IconProps) {
  // Convert kebab-case or lowercase to PascalCase if needed
  const pascalName = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const IconComponent =
    (LucideIcons[pascalName as IconName] as React.ElementType) ||
    (LucideIcons[name as IconName] as React.ElementType) ||
    LucideIcons.HelpCircle;

  return (
    <IconComponent
      size={size}
      strokeWidth={2}
      className={cn("shrink-0", className)}
      aria-hidden={ariaLabel ? undefined : "true"}
      aria-label={ariaLabel}
      {...props}
    />
  );
}
