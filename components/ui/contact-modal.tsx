"use client";

import { useEffect, useId, useRef } from "react";
import { site } from "@/config/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { useContactModal } from "@/lib/contact-modal";

const contacts = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    detail: site.phone,
    href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Zaeem, I’d like to book a session.")}`,
    external: true,
  },
  {
    id: "email",
    label: "Email",
    detail: site.email,
    href: `mailto:${site.email}?subject=${encodeURIComponent("Book a session with Zaeem")}`,
    external: false,
  },
  {
    id: "instagram",
    label: "Instagram",
    detail: site.instagramHandle,
    href: site.instagram,
    external: true,
  },
] as const;

export function ContactModal() {
  const { open, closeModal } = useContactModal();
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useGSAP(
    () => {
      if (!open || !root.current || !panel.current) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const items = panel.current.querySelectorAll("[data-contact-item]");

      if (reduced) {
        gsap.set(root.current, { autoAlpha: 1 });
        gsap.set(panel.current, { y: 0, autoAlpha: 1 });
        gsap.set(items, { y: 0, autoAlpha: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28 })
        .fromTo(
          panel.current,
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.42 },
          0.04,
        )
        .fromTo(
          items,
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.32, stagger: 0.05 },
          0.12,
        );

      return () => {
        tl.kill();
      };
    },
    { scope: root, dependencies: [open] },
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => {
      panel.current?.querySelector<HTMLElement>("button, a")?.focus();
    }, 30);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeModal]);

  if (!open) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[85] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
        aria-label="Close contact options"
        onClick={closeModal}
      />

      <div
        ref={panel}
        className="relative z-10 flex max-h-[min(92svh,720px)] w-full max-w-lg flex-col overflow-hidden border border-line bg-surface sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
          <div>
            <p className="text-[0.65rem] tracking-[0.24em] text-lime uppercase">Book a session</p>
            <h2 id={titleId} className="mt-2 font-display text-2xl tracking-tight text-ink sm:text-3xl">
              How do you want to reach me?
            </h2>
            <p id={descriptionId} className="mt-2 text-sm text-muted">
              Pick one. WhatsApp, email, or Instagram — whichever is easiest for you.
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs tracking-[0.16em] text-ink uppercase"
          >
            Close
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto p-3 sm:p-4">
          {contacts.map((contact) => (
            <li key={contact.id} data-contact-item>
              <a
                href={contact.href}
                {...(contact.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex items-center justify-between gap-4 rounded-xl px-3 py-4 transition-colors hover:bg-bg focus-visible:bg-bg sm:px-4"
                onClick={closeModal}
              >
                <span>
                  <span className="block text-[0.65rem] tracking-[0.2em] text-lime uppercase">
                    {contact.label}
                  </span>
                  <span className="mt-1 block break-all font-display text-lg tracking-tight text-ink sm:text-xl">
                    {contact.detail}
                  </span>
                </span>
                <span className="shrink-0 text-xs tracking-[0.16em] text-muted uppercase group-hover:text-lime">
                  Open
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="border-t border-line px-5 py-4 text-xs text-muted sm:px-6">
          {site.availability}
        </p>
      </div>
    </div>
  );
}
