"use client";

import Image from "next/image";
import { nav, site } from "@/config/site";
import { BookSessionButton } from "@/components/ui/book-session-button";

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed top-0 z-40 flex w-full items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:px-6 md:px-10">
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
