// The phone menu is a native <details>: a named toggle that exposes its open state and works without script.
// Script only adds an opening motion, Escape to close, and closing when a link is chosen, the page is tapped, or
// keyboard focus moves on past it (focus is never moved for that). The panel scrolls inside itself when the
// screen is shorter than it (its room is measured when it opens and whenever the screen changes).
import { gsap, calm, $, $$ } from "./env.js";

export function initMenu() {
  const menu = $("[data-menu]");
  if (!menu) return;
  const toggle = $("summary", menu);
  const panel = $(".menu__panel", menu);
  const links = $$("a", panel);
  let tl = null;
  // the panel's room: from its top to the screen's foot, measured on opening and again whenever the screen changes
  const fit = () => panel.style.setProperty("--menu-room", `${Math.max(160, Math.floor(innerHeight - panel.getBoundingClientRect().top))}px`);
  addEventListener("resize", () => { if (menu.open) fit(); }, { passive: true });
  const close = (refocus) => {
    if (!menu.open) return;
    menu.open = false;
    if (refocus) toggle.focus();
  };
  menu.addEventListener("toggle", () => {
    // a rapid open-close-open never leaves a half-run opening behind
    if (tl) { tl.kill(); tl = null; gsap.set([panel, ...links], { clearProps: "clipPath,transform,opacity,visibility" }); }
    if (!menu.open) return;
    fit();
    if (calm()) return;
    tl = gsap.timeline({ onComplete: () => { tl = null; } })
      .fromTo(panel, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.32, ease: "power3.out", clearProps: "clipPath" })
      .fromTo(links, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out", stagger: 0.035, clearProps: "transform,opacity,visibility" }, 0.08);
  });
  menu.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); close(true); } });
  menu.addEventListener("focusout", (e) => { if (e.relatedTarget && !menu.contains(e.relatedTarget)) close(false); });
  links.forEach((a) => a.addEventListener("click", () => close(false)));
  document.addEventListener("pointerdown", (e) => { if (menu.open && !menu.contains(e.target)) close(false); });
  matchMedia("(min-width: 1001px)").addEventListener("change", (e) => { if (e.matches) close(false); });
}
