"use client";

import { useRef } from "react";
import Image from "next/image";
import { difference } from "@/config/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function Difference() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      const viewport = pin.current;
      if (!section || !viewport) return;

      const track = section.querySelector<HTMLElement>("[data-track]");
      const bar = section.querySelector<HTMLElement>("[data-progress]");
      const counter = section.querySelector<HTMLElement>("[data-counter]");
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", section);
      if (!track || panels.length === 0) return;

      const sizes = { dist: 1, hold: 1, width: 1, height: 1 };
      const clamp = gsap.utils.clamp(0, 1);

      const viewportSize = () => {
        const vv = window.visualViewport;
        return {
          width: Math.round(vv?.width ?? document.documentElement.clientWidth ?? window.innerWidth),
          height: Math.round(vv?.height ?? window.innerHeight),
        };
      };

      const measure = () => {
        const { width, height } = viewportSize();
        sizes.width = width;
        sizes.height = height;
        sizes.dist = width * (panels.length - 1);
        sizes.hold = height * (width < 768 ? 0.45 : 0.85);

        viewport.style.height = `${height}px`;
        panels.forEach((panel) => {
          panel.style.width = `${width}px`;
          panel.style.height = `${height}px`;
        });
      };

      const setPanelMotion = (traveled: number) => {
        const mobile = sizes.width < 768;
        const step = sizes.dist / Math.max(1, panels.length - 1);
        const scaleFrom = mobile ? 1.08 : 1.16;
        const shiftFrom = mobile ? 4 : 8;
        const riseFrom = mobile ? 36 : 64;

        panels.forEach((panel, i) => {
          const media = panel.querySelector("[data-panel-media]");
          const copy = panel.querySelector("[data-panel-copy]");
          const index = panel.querySelector("[data-panel-index]");
          const local =
            i === 0 ? 1 : clamp((traveled - (i - 1) * step) / step);

          if (media) {
            gsap.set(media, {
              scale: scaleFrom - local * (scaleFrom - 1),
              xPercent: (1 - local) * shiftFrom,
            });
          }
          if (copy) {
            gsap.set(copy, {
              y: (1 - local) * riseFrom,
              autoAlpha: local,
            });
          }
          if (index) {
            gsap.set(index, {
              yPercent: (1 - local) * 18,
              autoAlpha: 0.2 + local * 0.8,
            });
          }
        });
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        section.dataset.reduced = "true";
        viewport.style.height = "";
        panels.forEach((panel) => {
          panel.style.width = "";
          panel.style.height = "";
        });
        gsap.set(track, { clearProps: "transform" });
        gsap.set(panels.flatMap((panel) => {
          return [
            panel.querySelector("[data-panel-media]"),
            panel.querySelector("[data-panel-copy]"),
            panel.querySelector("[data-panel-index]"),
          ].filter(Boolean);
        }), { clearProps: "all" });
        if (bar) gsap.set(bar, { scaleX: 1 });
        const footer = document.querySelector("footer");
        if (footer) gsap.set(footer, { autoAlpha: 1, clearProps: "visibility" });
      });

      const setupScroll = (mobile: boolean) => {
        delete section.dataset.reduced;
        measure();
        sizes.hold = sizes.height * (mobile ? 0.45 : 0.85);
        setPanelMotion(0);

        const footer = document.querySelector("footer");
        if (footer) gsap.set(footer, { autoAlpha: 0 });

        const state = { trigger: null as ScrollTrigger | null };

        state.trigger = ScrollTrigger.create({
          trigger: section,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          start: "top top",
          end: () => `+=${sizes.dist + sizes.hold}`,
          scrub: mobile ? 0.4 : true,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            measure();
            sizes.hold = sizes.height * (mobile ? 0.45 : 0.85);
          },
          onRefresh: () => {
            const progress = state.trigger?.progress ?? 0;
            const traveled = Math.min(sizes.dist, progress * (sizes.dist + sizes.hold));
            gsap.set(track, { x: -traveled });
            setPanelMotion(traveled);
          },
          onUpdate: (self) => {
            const traveled = Math.min(sizes.dist, self.progress * (sizes.dist + sizes.hold));
            const moved = sizes.dist ? traveled / sizes.dist : 1;

            gsap.set(track, { x: -traveled });
            if (bar) gsap.set(bar, { scaleX: moved });
            if (counter) {
              const index = Math.min(panels.length - 1, Math.round(moved * (panels.length - 1)));
              counter.textContent = difference.points[index]?.index ?? "";
            }
            if (footer) gsap.set(footer, { autoAlpha: self.progress >= 0.98 ? 1 : 0 });
            setPanelMotion(traveled);
          },
        });

        const refresh = () => {
          measure();
          sizes.hold = sizes.height * (mobile ? 0.45 : 0.85);
          ScrollTrigger.refresh();
        };

        let resizeTimer = 0;
        const onResize = () => {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(refresh, 120);
        };

        window.addEventListener("resize", onResize);
        window.addEventListener("orientationchange", refresh);
        window.visualViewport?.addEventListener("resize", onResize);
        requestAnimationFrame(refresh);

        return () => {
          window.clearTimeout(resizeTimer);
          window.removeEventListener("resize", onResize);
          window.removeEventListener("orientationchange", refresh);
          window.visualViewport?.removeEventListener("resize", onResize);
          viewport.style.height = "";
          panels.forEach((panel) => {
            panel.style.width = "";
            panel.style.height = "";
          });
          if (footer) gsap.set(footer, { autoAlpha: 1, clearProps: "visibility" });
        };
      };

      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => setupScroll(true),
      );

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => setupScroll(false),
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id={difference.id} ref={root} className="relative bg-bg text-ink">
      <div ref={pin} className="relative h-svh overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 px-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6 md:px-10 md:pt-8 lg:px-16">
          <p className="text-[0.65rem] tracking-[0.24em] text-lime uppercase sm:text-[0.7rem] sm:tracking-[0.28em]">
            {difference.eyebrow}
          </p>
          <p data-counter className="font-display text-xs tracking-[0.2em] text-ink sm:text-sm sm:tracking-[0.22em]">
            01
          </p>
        </div>

        <div data-track className="flex h-full w-max will-change-transform">
          {difference.points.map((point, i) => (
            <article
              key={point.index}
              data-panel
              className="grid h-svh w-screen shrink-0 grid-rows-[42svh_minmax(0,1fr)] sm:grid-rows-[46svh_minmax(0,1fr)] md:grid-cols-2 md:grid-rows-none"
            >
              <div
                className={`relative min-h-0 overflow-hidden bg-surface ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <div data-panel-media className="absolute inset-[-10%] will-change-transform md:inset-[-12%]">
                  <Image
                    src={point.image}
                    alt={point.imageAlt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    onLoad={() => ScrollTrigger.refresh()}
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/25 to-transparent md:bg-linear-to-r md:from-transparent md:via-transparent md:to-bg/25" />
              </div>

              <div
                className={`relative flex min-h-0 flex-col justify-start overflow-y-auto px-4 pt-5 pb-[max(4.25rem,calc(env(safe-area-inset-bottom)+3.25rem))] sm:px-6 sm:pt-6 md:justify-center md:overflow-visible md:px-10 md:pb-16 lg:px-16 ${
                  i % 2 === 1 ? "md:order-1" : ""
                }`}
              >
                <p
                  data-panel-index
                  className="font-display text-[4.5rem] leading-none tracking-[-0.06em] text-ink/12 sm:text-[6rem] md:text-[9vw]"
                >
                  {point.index}
                </p>
                <div data-panel-copy className="relative -mt-8 sm:-mt-10 md:-mt-[4vw]">
                  <p className="text-[0.65rem] tracking-[0.22em] text-lime uppercase sm:text-[0.7rem] sm:tracking-[0.24em]">
                    {point.kicker}
                  </p>
                  <h2 className="mt-2 max-w-[14ch] font-display text-[clamp(1.85rem,7.2vw,5rem)] leading-[0.94] font-medium tracking-[-0.04em] sm:mt-3 sm:max-w-[12ch]">
                    {point.title}
                  </h2>
                  <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted sm:mt-4 sm:text-base md:mt-5 md:text-lg">
                    {point.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 md:px-10 md:pb-6 lg:px-16">
          <div className="h-px w-full bg-line">
            <div data-progress className="h-px origin-left scale-x-0 bg-lime" />
          </div>
        </div>
      </div>
    </section>
  );
}
