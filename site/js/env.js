// Shared by every module: the registered GSAP, and the reduced-motion question asked fresh each time.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ overwrite: "auto" });

export { gsap, ScrollTrigger, SplitText };

const reduce = matchMedia("(prefers-reduced-motion: reduce)");
export const calm = () => reduce.matches;
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/** Resolves when the page's own face has loaded, or after `ms`, whichever is first. */
export const fontsReady = (ms = 1500) =>
  document.fonts && document.fonts.ready
    ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, ms))])
    : Promise.resolve();
