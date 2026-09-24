"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

/**
 * Register every plugin once. Import animations from this module
 * so route components never call registerPlugin themselves.
 * This file is client-only — do not import it from a Server Component.
 */
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
