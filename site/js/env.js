// Shared by every module: the registered GSAP, and the reduced-motion question asked fresh each time.
// (Round 8: no scroll-linked motion is left on the page, so ScrollTrigger and SplitText are no longer loaded.)
import gsap from "gsap";

gsap.defaults({ overwrite: "auto" });

export { gsap };

const reduce = matchMedia("(prefers-reduced-motion: reduce)");
export const calm = () => reduce.matches;
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/** Resolves when the page's own face has loaded, or after `ms`, whichever is first. */
export const fontsReady = (ms = 1500) =>
  document.fonts && document.fonts.ready
    ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, ms))])
    : Promise.resolve();
