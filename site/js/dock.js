// The "Let's talk" button that stays in reach on phones and tablets: it slides in once the hero's own button has
// scrolled away, and steps aside while the form or the footer is on screen, so it never sits on the form. Without
// script it stays hidden (the nav and each section's own links still lead to the form).
import { $ } from "./env.js";

export function initDock() {
  const dock = $("[data-dock]");
  const act = $(".hero__act");
  const contact = $("#contact");
  const foot = $(".footer");
  if (!dock || !act || !contact || !("IntersectionObserver" in window)) return;
  const inView = new Map([[act, true], [contact, false], [foot, false]]);
  const update = () => dock.classList.toggle("is-on", ![...inView.values()].some(Boolean));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => inView.set(e.target, e.isIntersecting));
    update();
  });
  [act, contact, foot].filter(Boolean).forEach((el) => io.observe(el));
  dock.hidden = false;
}
