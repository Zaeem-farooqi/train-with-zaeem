"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";

function subscribePointerMode(onChange: () => void) {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  fine.addEventListener("change", onChange);
  reduced.addEventListener("change", onChange);
  return () => {
    fine.removeEventListener("change", onChange);
    reduced.removeEventListener("change", onChange);
  };
}

function getPointerMode() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Desktop-only cursor. Position is applied with quickTo (transform only).
 * Hidden for touch and reduced motion.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const enabled = useSyncExternalStore(subscribePointerMode, getPointerMode, () => false);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("has-cursor");
      return;
    }

    document.documentElement.classList.add("has-cursor");
    return () => {
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;

    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const xDot = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3.out" });
    const yDot = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3.out" });
    const xRing = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3.out" });
    const yRing = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
      xDot(event.clientX);
      yDot(event.clientY);
      xRing(event.clientX);
      yRing(event.clientY);
    };

    const onOver = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const hot = target.closest("a, button, [data-cursor]");
      gsap.to(ring.current, {
        scale: hot ? 1.7 : 1,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(dot.current, {
        scale: hot ? 0 : 1,
        duration: 0.25,
        overwrite: "auto",
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ring}
        className="absolute top-0 left-0 size-10 rounded-full border border-lime/80 opacity-0"
      />
      <div
        ref={dot}
        className="absolute top-0 left-0 size-1.5 rounded-full bg-lime opacity-0"
      />
    </div>
  );
}
