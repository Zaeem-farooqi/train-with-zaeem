"use client";

import { useRef } from "react";
import { plansContent } from "@/config/plans";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePricingLocation } from "@/lib/use-pricing-location";
import { BookSessionButton } from "@/components/ui/book-session-button";
import { FitnessMotifs } from "@/components/animations/fitness-motifs";

export function Plans() {
  const root = useRef<HTMLElement>(null);
  const { visiblePlans } = usePricingLocation();
  // Only re-arm when the set of plans changes (e.g. personal appears).
  const planKey = visiblePlans.map((plan) => plan.id).join("|");

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-plan-card]", section);
      const intro = gsap.utils.toArray<HTMLElement>("[data-plan-intro]", section);
      const accent = section.querySelector<HTMLElement>("[data-plan-accent]");

      if (cards.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([...intro, ...cards], { clearProps: "all" });
        cards.forEach((card) => {
          gsap.set(
            card.querySelectorAll(
              "[data-plan-meta], [data-plan-feature], [data-plan-price], [data-plan-cta], [data-plan-rule]",
            ),
            { clearProps: "all" },
          );
        });
        if (accent) gsap.set(accent, { clearProps: "all" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const mobile = window.matchMedia("(max-width: 1023px)").matches;

        const playIfPast = (animation: gsap.core.Animation, trigger: Element) => {
          const st = animation.scrollTrigger;
          if (!st) return;
          if (st.progress > 0 || st.isActive) return;
          const rect = trigger.getBoundingClientRect();
          // Already in view but ScrollTrigger hasn't started (pin/layout lag).
          if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
            animation.play(0);
          }
        };

        gsap.set(intro, { y: mobile ? 32 : 24, autoAlpha: 0 });
        gsap.set(cards, {
          y: mobile ? 48 : 32,
          x: mobile ? 0 : 40,
          autoAlpha: 0,
          scale: mobile ? 0.97 : 1,
        });
        if (accent) gsap.set(accent, { scaleX: 0, transformOrigin: "left center" });

        cards.forEach((card) => {
          gsap.set(card.querySelectorAll("[data-plan-meta]"), { y: 14, autoAlpha: 0 });
          gsap.set(card.querySelectorAll("[data-plan-feature]"), {
            y: mobile ? 0 : 10,
            x: mobile ? -12 : 0,
            autoAlpha: 0,
          });
          gsap.set(card.querySelectorAll("[data-plan-price]"), { y: 20, autoAlpha: 0 });
          gsap.set(card.querySelectorAll("[data-plan-cta]"), { y: 12, autoAlpha: 0 });
          const rule = card.querySelector("[data-plan-rule]");
          if (rule) gsap.set(rule, { scaleY: 0, transformOrigin: "top center" });
        });

        const introTl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        });

        if (accent) {
          introTl.to(accent, { scaleX: 1, duration: 0.9, ease: "power3.inOut" }, 0);
        }

        introTl.to(
          intro,
          {
            y: 0,
            autoAlpha: 1,
            duration: mobile ? 0.7 : 0.85,
            stagger: 0.1,
          },
          0.05,
        );

        playIfPast(introTl, section);

        cards.forEach((card, index) => {
          const meta = card.querySelectorAll("[data-plan-meta]");
          const features = card.querySelectorAll("[data-plan-feature]");
          const price = card.querySelector("[data-plan-price]");
          const cta = card.querySelector("[data-plan-cta]");
          const rule = card.querySelector("[data-plan-rule]");

          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
            },
          });

          tl.to(card, {
            y: 0,
            x: 0,
            autoAlpha: 1,
            scale: 1,
            duration: mobile ? 0.75 : 0.9,
            delay: index * 0.04,
          });

          if (rule && !mobile) {
            tl.to(rule, { scaleY: 1, duration: 0.65, ease: "power2.out" }, "-=0.65");
          }

          tl.to(meta, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.05 }, "-=0.45").to(
            features,
            {
              y: 0,
              x: 0,
              autoAlpha: 1,
              duration: 0.4,
              stagger: 0.05,
            },
            "-=0.25",
          );

          if (price) {
            tl.to(price, { y: 0, autoAlpha: 1, duration: 0.5 }, "-=0.3");
          }
          if (cta) {
            tl.to(cta, { y: 0, autoAlpha: 1, duration: 0.4 }, "-=0.25");
          }

          playIfPast(tl, card);
        });

        const refresh = () => ScrollTrigger.refresh();
        requestAnimationFrame(refresh);
        const t1 = window.setTimeout(refresh, 200);
        const t2 = window.setTimeout(refresh, 600);

        return () => {
          window.clearTimeout(t1);
          window.clearTimeout(t2);
        };
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [planKey] },
  );

  return (
    <section
      id={plansContent.id}
      ref={root}
      className="relative border-t border-line bg-bg text-ink"
    >
      <FitnessMotifs variant="plans" />
      <div
        data-plan-accent
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-4 z-[1] h-px origin-left bg-lime sm:left-6 md:left-10 lg:left-16"
        style={{ width: "min(12rem, 40vw)" }}
      />

      <div className="relative z-[1] mx-auto w-full max-w-[1440px] px-4 py-20 sm:px-6 md:px-10 md:py-28 lg:px-16">
        <div className="lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16">
          <div
            data-plan-intro-col
            className="mb-10 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:mb-0 lg:self-start"
          >
            <p
              data-plan-intro
              className="text-[0.65rem] tracking-[0.24em] text-lime uppercase sm:text-[0.7rem] sm:tracking-[0.28em]"
            >
              {plansContent.eyebrow}
            </p>
            <h2
              data-plan-intro
              className="mt-4 max-w-[12ch] font-display text-[clamp(2.4rem,5.5vw,4.8rem)] leading-[0.92] font-medium tracking-[-0.045em]"
            >
              {plansContent.title}
            </h2>
            <p
              data-plan-intro
              className="mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-base"
            >
              {plansContent.lede}
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5">
            {visiblePlans.map((plan, index) => (
              <article
                key={plan.id}
                data-plan-card
                className={`group relative grid gap-6 overflow-hidden border border-line px-5 py-6 transition-[border-color,background-color] duration-300 sm:grid-cols-[1fr_auto] sm:items-end sm:px-7 sm:py-8 ${
                  plan.featured
                    ? "border-lime/50 bg-surface"
                    : "bg-transparent hover:border-ink/25 hover:bg-surface/60"
                }`}
              >
                <span
                  data-plan-rule
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-0 hidden h-full w-px origin-top bg-lime lg:block"
                />

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p data-plan-meta className="text-[0.65rem] tracking-[0.22em] text-lime uppercase">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    {plan.featured ? (
                      <span
                        data-plan-meta
                        className="rounded-full border border-lime/40 px-2.5 py-0.5 text-[0.6rem] tracking-[0.16em] text-lime uppercase"
                      >
                        Most chosen
                      </span>
                    ) : null}
                    {plan.personalOnly ? (
                      <span
                        data-plan-meta
                        className="rounded-full border border-line px-2.5 py-0.5 text-[0.6rem] tracking-[0.16em] text-muted uppercase"
                      >
                        In person
                      </span>
                    ) : null}
                  </div>

                  <h3 data-plan-meta className="mt-3 font-display text-2xl tracking-tight sm:text-3xl">
                    {plan.name}
                  </h3>
                  <p
                    data-plan-meta
                    className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base"
                  >
                    {plan.summary}
                  </p>

                  <ul className="mt-5 flex flex-col gap-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        data-plan-feature
                        className="flex items-start gap-3 text-sm text-ink/90"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 inline-block size-1 shrink-0 rounded-full bg-lime"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col items-start gap-4 sm:items-end sm:text-right">
                  <p
                    data-plan-price
                    className="font-display text-[clamp(2rem,4vw,3rem)] leading-none tracking-tight"
                  >
                    {plan.priceLabel}
                  </p>
                  <div data-plan-cta>
                    <BookSessionButton
                      className={`inline-flex h-11 items-center rounded-full px-5 text-sm font-medium ${
                        plan.featured
                          ? "bg-lime text-black"
                          : "border border-line text-ink hover:border-lime hover:text-lime"
                      }`}
                    >
                      Book this plan
                    </BookSessionButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
