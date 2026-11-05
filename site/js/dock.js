// The "Let's talk" button that stays in reach on phones and tablets: it slides in once the hero's own button has
// scrolled away, steps aside while the form or the footer is on screen (so it never sits on the form), steps
// aside for a moment while a heading passes through the bottom of the screen (so it never covers one), and gets
// out of the way at once while someone is typing in any field. Without script it stays hidden (the nav and each
// section's own links still lead to the form).
import { $, $$ } from "./env.js";

const FIELD = "input, textarea, select";

export function initDock() {
  const dock = $("[data-dock]");
  const act = $(".hero__act");
  const contact = $("#contact");
  const foot = $(".footer");
  if (!dock || !act || !contact || !("IntersectionObserver" in window)) return;
  const away = new Map([[act, true], [contact, false]]);
  if (foot) away.set(foot, false);
  const passing = new Set();
  let typing = false;
  const update = (instant) => {
    const on = !typing && passing.size === 0 && ![...away.values()].some(Boolean);
    if (!on && instant && dock.classList.contains("is-on")) {
      // Leave at once, without the slide, so a focused field is never covered even for a moment.
      dock.classList.add("is-instant");
      requestAnimationFrame(() => requestAnimationFrame(() => dock.classList.remove("is-instant")));
    }
    dock.classList.toggle("is-on", on);
  };

  const sections = new IntersectionObserver((entries) => {
    entries.forEach((e) => away.set(e.target, e.isIntersecting));
    update(false);
  });
  away.forEach((_, el) => sections.observe(el));

  // Only the bottom 18% of the window counts: the band the button sits in.
  const headings = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? passing.add(e.target) : passing.delete(e.target)));
    update(false);
  }, { rootMargin: "-82% 0px 0px 0px" });
  $$("main h2, main h3").forEach((h) => headings.observe(h));

  document.addEventListener("focusin", (e) => {
    typing = e.target instanceof Element && e.target.matches(FIELD);
    update(true);
  });
  document.addEventListener("focusout", () => {
    setTimeout(() => {
      const now = document.activeElement;
      typing = now instanceof Element && now.matches(FIELD);
      update(false);
    }, 0);
  });

  dock.hidden = false;
}
