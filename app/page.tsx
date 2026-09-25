import Image from "next/image";
import { Hero } from "@/components/sections/hero";
import { Difference } from "@/components/sections/difference";
import { Plans } from "@/components/sections/plans";
import { FitnessMotifs } from "@/components/animations/fitness-motifs";
import { site } from "@/config/site";

export default function Home() {
  return (
    <main id="content" tabIndex={-1}>
      <div id="top">
        <Hero />
      </div>
      <Difference />
      <Plans />
      <footer
        id="booking"
        className="relative overflow-hidden border-t border-line px-4 py-14 text-sm text-muted sm:px-6 md:px-10 md:py-16 lg:px-16"
      >
        <FitnessMotifs variant="footer" />
        <div className="relative z-[1]">
          <Image
            src={site.logo}
            alt="Train with Zaeem"
            width={280}
            height={80}
            className="h-12 w-auto sm:h-14"
          />
          <p className="mt-6 text-[0.7rem] tracking-[0.24em] text-lime uppercase">Contact</p>
          <p className="mt-3">{site.availability}</p>
          <ul className="mt-8 flex flex-col gap-3 text-ink">
            <li>
              <a className="link-underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a
                className="link-underline"
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp · {site.phone}
              </a>
            </li>
            <li>
              <a
                className="link-underline"
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </main>
  );
}
