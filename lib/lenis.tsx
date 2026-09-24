"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIntro } from "@/lib/intro";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

type LenisListener = () => void;

const lenisStore = {
  instance: null as Lenis | null,
  listeners: new Set<LenisListener>(),
  get() {
    return this.instance;
  },
  set(next: Lenis | null) {
    this.instance = next;
    this.listeners.forEach((listener) => listener());
  },
  subscribe(listener: LenisListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  },
};

/**
 * Smooth scroll driven by gsap.ticker so Lenis and ScrollTrigger
 * share one frame loop. Native scroll is used (no transform hijack),
 * which keeps pinning accurate.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const { phase } = useIntro();
  const started = useRef(false);

  const lenis = useSyncExternalStore(
    (onStoreChange) => lenisStore.subscribe(onStoreChange),
    () => lenisStore.get(),
    () => null,
  );

  useEffect(() => {
    if (started.current) return;
    started.current = true;

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

    lenisStore.set(instance);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(onTick);
      instance.destroy();
      lenisStore.set(null);
      started.current = false;
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (phase === "ready" || phase === "reveal") lenis.start();
    else lenis.stop();
  }, [lenis, phase]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
