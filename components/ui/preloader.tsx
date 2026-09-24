"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { site } from "@/config/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/lib/intro";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const { phase, setPhase } = useIntro();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      if (!mounted || phase === "ready") return;

      const el = root.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        setPhase("ready");
        return;
      }

      const brand = el.querySelector("[data-brand]");
      const line = el.querySelector("[data-line]");

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => setPhase("ready"),
      });

      tl.from(brand, { autoAlpha: 0, y: 18, duration: 0.7 })
        .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, "-=0.25")
        .add(() => setPhase("reveal"), "exit")
        .to(el, { yPercent: -100, duration: 1.05, ease: "power4.inOut" }, "exit+=0.15");

      return () => {
        tl.kill();
      };
    },
    { scope: root, dependencies: [mounted, phase] },
  );

  if (phase === "ready") return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-bg text-ink"
      role="dialog"
      aria-label="Intro"
    >
      <div className="flex flex-col items-center gap-5 px-6">
        <div data-brand>
          <Image
            src={site.logo}
            alt="Train with Zaeem"
            width={320}
            height={96}
            priority
            className="h-16 w-auto sm:h-20"
          />
        </div>
        <div data-line className="h-px w-40 origin-center bg-lime" />
      </div>
      <button
        type="button"
        className="absolute right-5 bottom-6 text-xs tracking-[0.18em] text-muted uppercase underline-offset-4 hover:text-ink focus-visible:text-ink"
        onClick={() => setPhase("ready")}
      >
        Skip intro
      </button>
    </div>
  );
}
