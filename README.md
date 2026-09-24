# Train with Zaeem

Personal trainer site for Zaeem. In person and online. This pass is the foundation: design system, GSAP + Lenis, the hero, and a pinned horizontal section for diet, workouts, independence, online training, and online consultations.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required yet. When the booking form is added, create `.env.local`:

```bash
RESEND_API_KEY=
BOOKING_TO_EMAIL=
BOOKING_FROM_EMAIL=
```

## Edit content

- `config/site.ts` — name, tagline, availability, Instagram, WhatsApp, hero copy, CTAs
- `config/content.ts` — “What’s different” points and image paths
- `public/images/` — swap placeholder photos. Each image in `config/content.ts` has a TODO where a real client photo should go.

The secondary hero button says “See results” and currently scrolls to `#difference`. Point it at `#results` once that section exists.

## Motion

- Plugins are registered once in `lib/gsap.ts`.
- Lenis runs on `gsap.ticker` in `lib/lenis.tsx` and updates ScrollTrigger.
- Animations use `@gsap/react` `useGSAP`. Cleanup reverts `gsap.matchMedia()` and kills timelines created in that hook.
- `prefers-reduced-motion` skips the preloader, pinning, and text reveals.
- Desktop pins the approach section. Phones stack the three points with a lighter fade so the page stays usable from Instagram.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
