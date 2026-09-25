/**
 * Ambient looping fitness line-art.
 * Decorative only — hidden from assistive tech.
 */

import type { CSSProperties } from "react";

type MotifProps = {
  className?: string;
  style?: CSSProperties;
};

function Dumbbell({ className }: MotifProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="motif-dumbbell origin-center">
        <rect x="18" y="28" width="10" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="32" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <rect x="92" y="28" width="10" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="104" y="32" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <path d="M28 40h64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Runner({ className }: MotifProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="motif-runner origin-center">
        <circle cx="58" cy="18" r="8" stroke="currentColor" strokeWidth="2" />
        <path
          d="M54 28c-2 10-6 18-14 26"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          className="motif-runner-arm-f"
          d="M48 36c8 4 16 2 22-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="motif-runner-arm-b"
          d="M48 38c-8 2-14 10-12 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="motif-runner-leg-f"
          d="M40 54c-2 14 2 28 10 36"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          className="motif-runner-leg-b"
          d="M42 54c8 10 6 24-4 34"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M12 100h76"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
        />
      </g>
    </svg>
  );
}

function JumpRope({ className }: MotifProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 110 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="motif-rope origin-center">
        <circle cx="55" cy="22" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M55 30v28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path
          className="motif-rope-arms"
          d="M40 48h30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="motif-rope-cord"
          d="M28 48C18 70 22 100 55 108C88 100 92 70 82 48"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="motif-rope-legs"
          d="M48 58v22M62 58v22"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function HeartPulse({ className }: MotifProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        className="motif-pulse"
        d="M4 24h28l8-14 12 28 10-20 8 12h66"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Single weight plate that drops and hits the floor. */
function DropPlate({
  className,
  delay = "0s",
  label,
}: MotifProps & { delay?: string; label?: string }) {
  return (
    <div className={`plate-drop ${className ?? ""}`} style={{ animationDelay: delay }}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g className="plate-drop-body">
          <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
          <circle cx="32" cy="32" r="7" stroke="currentColor" strokeWidth="2" />
          {label ? (
            <text
              x="32"
              y="36"
              textAnchor="middle"
              fill="currentColor"
              fontSize="9"
              fontFamily="var(--font-display), sans-serif"
              opacity="0.8"
            >
              {label}
            </text>
          ) : null}
        </g>
        <ellipse
          className="plate-impact"
          cx="32"
          cy="58"
          rx="18"
          ry="4"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );
}

/** Banner of plates dropping onto a gym floor behind section content. */
function PlateFloorBanner({ className }: MotifProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`} aria-hidden="true">
      <div className="absolute inset-x-0 bottom-[8%] h-px bg-lime/15" />
      <div className="absolute inset-x-0 bottom-[8%] h-24 bg-linear-to-t from-lime/[0.04] to-transparent" />

      <DropPlate className="absolute bottom-[8%] left-[8%] h-16 w-16 text-lime/30 sm:h-20 sm:w-20" delay="0s" label="20" />
      <DropPlate className="absolute bottom-[8%] left-[22%] h-12 w-12 text-ink/25 sm:h-14 sm:w-14" delay="0.7s" label="10" />
      <DropPlate className="absolute bottom-[8%] left-[38%] h-20 w-20 text-lime/22 sm:h-24 sm:w-24" delay="1.4s" label="45" />
      <DropPlate className="absolute bottom-[8%] right-[28%] h-14 w-14 text-ink/20 sm:h-16 sm:w-16" delay="2.1s" label="15" />
      <DropPlate className="absolute bottom-[8%] right-[12%] h-16 w-16 text-lime/28 sm:h-20 sm:w-20" delay="2.8s" label="25" />

      {/* Soft floating twin that never fully rests — keeps motion alive mid-banner */}
      <Dumbbell className="motif absolute top-[18%] right-[18%] h-14 w-20 text-lime/18 sm:h-16 sm:w-24" />
      <Runner className="motif absolute top-[28%] left-[6%] hidden h-28 w-24 text-lime/14 lg:block" />
      <JumpRope className="motif absolute top-[12%] left-[42%] hidden h-24 w-20 text-ink/12 xl:block" />
      <HeartPulse className="motif absolute top-[8%] right-[8%] h-7 w-28 text-lime/16" />
    </div>
  );
}

export function FitnessMotifs({
  variant = "default",
}: {
  variant?: "default" | "footer" | "plans";
}) {
  if (variant === "plans") {
    return <PlateFloorBanner />;
  }

  if (variant === "footer") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <Dumbbell className="motif absolute top-[20%] left-[8%] h-12 w-[4.5rem] text-lime/20 sm:h-14 sm:w-20" />
        <Runner className="motif absolute right-[6%] bottom-[10%] h-20 w-16 text-lime/15 sm:h-24 sm:w-20" />
        <HeartPulse className="motif absolute top-[55%] left-[40%] hidden h-7 w-24 text-ink/12 md:block" />
        <DropPlate className="absolute right-[20%] bottom-[12%] h-12 w-12 text-lime/20" delay="0.4s" label="20" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Dumbbell className="motif absolute top-[12%] right-[6%] h-14 w-20 text-lime/25 sm:h-16 sm:w-24 md:right-[10%] md:h-20 md:w-28" />
      <Runner className="motif absolute bottom-[18%] left-[4%] h-24 w-20 text-lime/20 sm:h-28 sm:w-24 md:left-[8%] md:h-32 md:w-28" />
      <JumpRope className="motif absolute top-[42%] left-[48%] hidden h-28 w-24 text-ink/15 lg:block" />
      <HeartPulse className="motif absolute right-[12%] bottom-[8%] h-8 w-28 text-lime/20 sm:h-9 sm:w-32" />
    </div>
  );
}
