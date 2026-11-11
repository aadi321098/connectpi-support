import React from "react";

interface StepsProps {
  children: React.ReactNode;
}

interface StepProps {
  title: string;
  children: React.ReactNode;
}

export function Steps({ children }: StepsProps) {
  return (
    <ol className="my-6 space-y-6 list-none p-0 counter-reset-step">
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<{ stepNumber?: number }>, {
          stepNumber: index + 1,
        });
      })}
    </ol>
  );
}

export function Step({
  title,
  children,
  stepNumber,
}: StepProps & { stepNumber?: number }) {
  return (
    <li className="relative pl-12">
      {/* Number Badge */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0.5 w-8 h-8 rounded-full bg-brand text-white font-heading font-bold text-sm flex items-center justify-center shadow-sm select-none"
      >
        {stepNumber}
      </span>
      <div>
        <h4 className="font-heading font-bold text-base sm:text-lg text-ink mb-1.5">
          {title}
        </h4>
        <div className="text-ink-body text-sm sm:text-base leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </li>
  );
}

