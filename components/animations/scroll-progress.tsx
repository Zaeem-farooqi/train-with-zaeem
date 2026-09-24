"use client";

import { forwardRef } from "react";

type ScrollProgressProps = {
  className?: string;
  label?: string;
};

/**
 * Vertical progress track. The parent timeline scales the inner bar
 * with transform only (scaleY, origin top).
 */
export const ScrollProgress = forwardRef<HTMLDivElement, ScrollProgressProps>(
  function ScrollProgress({ className, label = "Section progress" }, ref) {
    return (
      <div className={className} role="presentation">
        <div className="relative h-full w-px bg-line" aria-hidden="true">
          <div
            ref={ref}
            className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-lime"
          />
        </div>
        <span className="sr-only">{label}</span>
      </div>
    );
  },
);
