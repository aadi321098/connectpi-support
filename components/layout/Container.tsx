import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function Container({
  as: Component = "div",
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "w-full max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
