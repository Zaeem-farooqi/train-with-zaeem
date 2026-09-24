"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type SplitRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Seconds before the reveal starts. */
  delay?: number;
  trigger?: "load" | "scroll";
};

/**
 * Masked line-by-line reveal. Scroll triggers are created inside useGSAP
 * so they are killed on unmount. Reduced motion shows the text immediately.
 */
export function SplitReveal({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  trigger = "scroll",
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { autoAlpha: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let split: SplitText | null = null;
        let tween: gsap.core.Tween | null = null;
        let cancelled = false;

        const play = () => {
          if (cancelled || !ref.current) return;
          split = SplitText.create(ref.current, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            aria: "auto",
            onSplit: (self) => {
              tween?.kill();
              tween = gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.05,
                ease: "power4.out",
                stagger: 0.07,
                delay,
                scrollTrigger:
                  trigger === "scroll"
                    ? { trigger: ref.current, start: "top 86%" }
                    : undefined,
              });
              return tween;
            },
          });
        };

        if (document.fonts?.status === "loaded") play();
        else document.fonts.ready.then(play);

        return () => {
          cancelled = true;
          tween?.scrollTrigger?.kill();
          tween?.kill();
          split?.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [text, delay, trigger] },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {text}
    </Tag>
  );
}
