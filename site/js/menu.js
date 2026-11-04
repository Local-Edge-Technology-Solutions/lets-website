// The phone menu is a native <details>: a named toggle that exposes its open state and works without script.
// Script only adds an opening motion, Escape to close, and closing when a link is chosen or the page is tapped.
import { gsap, calm, $, $$ } from "./env.js";

export function initMenu() {
  const menu = $("[data-menu]");
  if (!menu) return;
  const toggle = $("summary", menu);
  const panel = $(".menu__panel", menu);
  const links = $$("a", panel);
  const close = (refocus) => {
    if (!menu.open) return;
    menu.open = false;
    if (refocus) toggle.focus();
  };
  menu.addEventListener("toggle", () => {
    if (!menu.open || calm()) return;
    gsap.timeline()
      .fromTo(panel, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.32, ease: "power3.out", clearProps: "clipPath" })
      .fromTo(links, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out", stagger: 0.035, clearProps: "transform,opacity,visibility" }, 0.08);
  });
  menu.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); close(true); } });
  links.forEach((a) => a.addEventListener("click", () => close(false)));
  document.addEventListener("pointerdown", (e) => { if (menu.open && !menu.contains(e.target)) close(false); });
  matchMedia("(min-width: 1001px)").addEventListener("change", (e) => { if (e.matches) close(false); });
}
