import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Space_Grotesk } from "next/font/google";
import { site } from "@/config/site";
import { IntroProvider } from "@/lib/intro";
import { SmoothScroll } from "@/lib/lenis";
import { ContactModalProvider } from "@/lib/contact-modal";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { Grain } from "@/components/ui/grain";
import { Preloader } from "@/components/ui/preloader";
import { SiteHeader } from "@/components/ui/site-header";
import { ContactModal } from "@/components/ui/contact-modal";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["500", "600", "700"],
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Personal trainer`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "personal trainer Lahore",
    "personal trainer Islamabad",
    "online training",
    "online fitness consultation",
    "custom diet plan",
    "Train with Zaeem",
  ],
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Personal trainer`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Personal trainer`,
    description: site.description,
  },
  alternates: { canonical: site.url },
};

export const viewport: Viewport = {
  themeColor: "#070807",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description: site.description,
  slogan: site.tagline,
  url: site.url,
  image: `${site.url}/images/hero.jpg`,
  email: site.email,
  telephone: site.phone,
  sameAs: [site.instagram],
  areaServed: site.cities.map((name) => ({ "@type": "City", name })),
  makesOffer: [
    { "@type": "Offer", name: "Custom diet plan" },
    { "@type": "Offer", name: "Custom workout routine" },
    { "@type": "Offer", name: "Personal training" },
    { "@type": "Offer", name: "Online training" },
    { "@type": "Offer", name: "Online consultation" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:bg-lime focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <IntroProvider>
          <SmoothScroll>
            <ContactModalProvider>
              <Grain />
              <CustomCursor />
              <Preloader />
              <SiteHeader />
              {children}
              <ContactModal />
            </ContactModalProvider>
          </SmoothScroll>
        </IntroProvider>
      </body>
    </html>
  );
}
