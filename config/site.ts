/**
 * Brand, contact, and SEO copy.
 * Edit this file to change public-facing text without touching components.
 */

export const site = {
  name: "Train with Zaeem",
  tagline: "I train and teach.",
  description:
    "Custom diet plans and workout routines. Online training anywhere. Physical training in Lahore and Islamabad. You learn to run the plan yourself.",
  availability: "Online anywhere · Lahore & Islamabad",
  cities: ["Lahore", "Islamabad"],
  /** TODO: replace with the live domain before launch. */
  url: "https://trainwithzaeem.com",
  email: "zaeem.farooqi@trainwithzaeem.com",
  phone: "+92 321 4600534",
  /** Digits only — WhatsApp only, no phone calls. */
  phoneDigits: "923214600534",
  instagram: "https://www.instagram.com/train_with_zaeem",
  instagramHandle: "@train_with_zaeem",
  /** Same number as phone — WhatsApp only. */
  whatsapp: "923214600534",
  locale: "en",
  logo: "/brand/logo.png",
} as const;

const bookMailto = `mailto:${site.email}?subject=${encodeURIComponent("Book a session with Zaeem")}`;

export const hero = {
  eyebrow: "Online anywhere · Lahore & Islamabad",
  headline: "I train\nand teach.",
  lede: "Online training anywhere. Physical training in Lahore and Islamabad. Custom diet plans and workouts you learn to run yourself.",
  primaryCta: {
    label: "Book a session",
  },
  /**
   * TODO: point this at #results once the results section exists.
   * For this pass it scrolls to the horizontal approach section.
   */
  secondaryCta: { label: "See results", href: "#difference" },
} as const;

export const nav = {
  book: {
    label: "Book a session",
  },
} as const;

export const contactLinks = {
  email: bookMailto,
  whatsapp: `https://wa.me/${site.whatsapp}`,
  instagram: site.instagram,
} as const;
