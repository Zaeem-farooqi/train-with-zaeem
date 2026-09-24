"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { hero, site } from "@/config/site";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/lib/intro";
import { Magnetic } from "@/components/animations/magnetic";
import { BookSessionButton } from "@/components/ui/book-session-button";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { phase } = useIntro();
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const headline = section.querySelector<HTMLElement>("[data-headline]");
      const media = section.querySelector<HTMLElement>("[data-media]");
      const fade = section.querySelectorAll<HTMLElement>("[data-fade]");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced || !headline || !media) {
        gsap.set([headline, media, ...fade], { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      let split: SplitText | null = null;
      let parallax: gsap.core.Tween | null = null;
      let cancelled = false;
      let played = false;

      const build = () => {
        if (cancelled || !headline) return;

        split = SplitText.create(headline, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          aria: "none",
          onSplit: (self) => {
            if (played) {
              gsap.set(self.lines, { yPercent: 0 });
              return;
            }

            const timeline = gsap.timeline({
              paused: true,
              defaults: { ease: "power4.out" },
              onStart: () => {
                played = true;
              },
            });

            timeline
              .fromTo(media, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "power3.out" }, 0)
              .from(self.lines, { yPercent: 110, duration: 1.15, stagger: 0.08 }, 0.15)
              .from(fade, { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.06 }, 0.45);

            timelineRef.current = timeline;
            if (phaseRef.current === "reveal" || phaseRef.current === "ready") {
              timeline.play();
            }
            return timeline;
          },
        });

        parallax = gsap.to(media, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      };

      if (document.fonts.status === "loaded") build();
      else document.fonts.ready.then(build);

      return () => {
        cancelled = true;
        parallax?.scrollTrigger?.kill();
        parallax?.kill();
        timelineRef.current?.kill();
        timelineRef.current = null;
        split?.revert();
      };
    },
    { scope: root },
  );

  useEffect(() => {
    if (phase === "reveal" || phase === "ready") {
      timelineRef.current?.play();
    }
  }, [phase]);

  return (
    <section ref={root} className="relative h-svh min-h-[560px] overflow-hidden bg-bg">
      <div className="absolute inset-0 overflow-hidden">
        <div data-media className="absolute inset-0 will-change-transform">
          <Image
            src="/images/hero.jpg"
            alt="A dim gym floor with weights, used as a placeholder until a real photo of Zaeem is added"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_30%]"
            onLoad={() => ScrollTrigger.refresh()}
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/80 to-bg/20" />
        <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-bg/40" />
      </div>

      <div className="relative flex h-full flex-col justify-end px-4 pt-28 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 md:px-10 md:pb-12 lg:px-16">
        <p data-fade className="text-[0.65rem] tracking-[0.24em] text-lime uppercase sm:text-[0.7rem] sm:tracking-[0.28em]">
          {hero.eyebrow}
        </p>

        <h1
          data-headline
          aria-label={hero.headline.replace("\n", " ")}
          className="mt-4 font-display text-[clamp(2.8rem,12vw,8.5rem)] leading-[0.88] font-medium tracking-[-0.045em] text-ink sm:mt-5"
        >
          {hero.headline.split("\n").map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </h1>

        <p data-fade className="mt-5 max-w-md text-sm leading-relaxed text-muted sm:mt-6 sm:text-base md:text-lg">
          {hero.lede}
        </p>

        <div data-fade className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
          <BookSessionButton className="inline-flex h-11 items-center rounded-full bg-lime px-5 text-sm font-medium text-black sm:h-12 sm:px-6">
            {hero.primaryCta.label}
          </BookSessionButton>
          <Magnetic strength={0.28}>
            <a
              href={hero.secondaryCta.href}
              className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm text-ink sm:h-12 sm:px-6"
            >
              {hero.secondaryCta.label}
            </a>
          </Magnetic>
        </div>

        <div
          data-fade
          className="mt-10 flex items-end justify-between text-[0.65rem] tracking-[0.18em] text-muted uppercase sm:mt-12 sm:text-[0.7rem] sm:tracking-[0.22em]"
        >
          <span>{site.availability}</span>
          <span className="hidden items-center gap-3 md:flex">
            <span className="inline-block h-8 w-px bg-line" aria-hidden="true" />
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
