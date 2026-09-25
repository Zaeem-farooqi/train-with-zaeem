"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { nav, site } from "@/config/site";
import { BookSessionButton } from "@/components/ui/book-session-button";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`pointer-events-none fixed top-0 z-50 flex w-full items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 sm:px-6 md:px-10 ${
        scrolled
          ? "border-b border-white/10 bg-bg/40 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <a href="#top" className="pointer-events-auto inline-flex items-center" aria-label="Train with Zaeem home">
        <Image
          src={site.logo}
          alt="Train with Zaeem"
          width={220}
          height={64}
          priority
          className="h-9 w-auto sm:h-10 md:h-11"
        />
      </a>
      <BookSessionButton className="pointer-events-auto inline-flex h-9 items-center rounded-full bg-lime px-3.5 text-sm font-medium text-black sm:h-10 sm:px-4">
        {nav.book.label}
      </BookSessionButton>
    </header>
  );
}
