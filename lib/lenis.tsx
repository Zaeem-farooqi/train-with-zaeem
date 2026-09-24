"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIntro } from "@/lib/intro";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Smooth scroll driven by gsap.ticker so Lenis and ScrollTrigger
 * share one frame loop. Native scroll is used (no transform hijack),
 * which keeps pinning accurate.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const { phase } = useIntro();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const instance = new Lenis({
      autoRaf: false,
      lerp: reduced ? 1 : 0.085,
      smoothWheel: !reduced,
      syncTouch: false,
      touchMultiplier: 1.1,
      anchors: reduced ? false : { offset: 0 },
    });

    instance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    setLenis(instance);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(onTick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (phase === "ready" || phase === "reveal") lenis.start();
    else lenis.stop();
  }, [lenis, phase]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
