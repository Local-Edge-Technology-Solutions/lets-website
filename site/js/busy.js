// "Automate the busywork": the Monday-night phone full of busywork clears one notification at a time, and the
// screen turns to Tuesday morning with one summary of what was handled. An illustration with invented names:
// nothing is sent anywhere. It plays once on its own when the phone first comes into view (never under reduced
// motion); the buttons play it again or go back. Without script both screens are shown, one under the other.
import { gsap, ScrollTrigger, calm, $, $$ } from "./env.js";

const SAID = "Tuesday morning: the busywork is handled. Dana Reyes is on the call-back list, Elm Studio got a friendly reminder, three inquiries were answered and one call booked, and last week’s numbers are in the inbox.";

export function initBusy() {
  const root = $("[data-busy]");
  if (!root) return;
  const before = $("[data-busy-before]", root);
  const after = $("[data-busy-after]", root);
  const go = $("[data-busy-go]", root);
  const back = $("[data-busy-back]", root);
  const controls = $("[data-busy-controls]", root);
  const status = $("[data-busy-status]", root);
  if (!before || !after || !go || !back || !controls || !status) return;
  const notes = $$(".note", before);
  const clockBefore = $(".phone__time", before);
  const clockAfter = $(".phone__time", after);
  const card = $(".note--done", after);
  const rows = $$(".note__list li", after);
  const moved = [...notes, clockBefore, clockAfter, after, card, ...rows].filter(Boolean);

  let tl = null;
  let pending = null;
  // Any run in progress jumps to its end (a second press, a resize, motion turned off mid-run).
  const settle = () => {
    pending?.kill();
    pending = null;
    if (!tl) return;
    const t = tl;
    tl = null;
    t.progress(1).kill();
  };
  const tidy = () => gsap.set(moved, { clearProps: "transform,opacity,visibility,clipPath" });
  const show = (done, said) => {
    root.classList.toggle("is-done", done);
    go.hidden = done;
    back.hidden = !done;
    if (said) status.textContent = said;
  };

  const play = (announce) => {
    settle();
    const keep = document.activeElement === go;
    const finish = () => {
      tl = null;
      tidy();
      show(true, announce ? SAID : "");
      if (keep) back.focus();
    };
    if (calm()) { finish(); return; }
    tl = gsap.timeline({ onComplete: finish });
    tl.to(notes, { x: "115%", rotation: 4, autoAlpha: 0, duration: 0.42, ease: "power3.in", stagger: 0.13 }, 0);
    tl.to(clockBefore, { y: -18, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0.55);
    tl.call(() => root.classList.add("is-done"), undefined, 0.85);
    tl.fromTo(after, { clipPath: "circle(0% at 50% 14%)" }, { clipPath: "circle(150% at 50% 14%)", duration: 0.75, ease: "power2.inOut" }, 0.85);
    tl.fromTo(clockAfter, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "expo.out" }, 1.1);
    tl.fromTo(card, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out" }, 1.25);
    tl.fromTo(rows, { x: -12, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, ease: "expo.out", stagger: 0.14 }, 1.45);
  };

  const rewind = () => {
    settle();
    tidy();
    show(false, "Back to Monday night.");
    if (document.activeElement === back || !back.isConnected) go.focus();
    if (!calm()) gsap.from(notes, { y: -14, autoAlpha: 0, duration: 0.45, ease: "expo.out", stagger: 0.06, clearProps: "transform,opacity,visibility" });
  };

  go.addEventListener("click", () => play(true));
  back.addEventListener("click", rewind);

  // Once, on its own, the first time the phone is well into view.
  ScrollTrigger.create({
    trigger: root, start: "top 60%", once: true,
    onEnter: () => {
      if (calm() || root.classList.contains("is-done")) return;
      pending = gsap.delayedCall(0.7, () => { pending = null; if (!root.classList.contains("is-done")) play(false); });
    },
  });

  matchMedia("(prefers-reduced-motion: reduce)").addEventListener?.("change", settle);
  let width = innerWidth;
  addEventListener("resize", () => { if (innerWidth !== width) { width = innerWidth; settle(); } }, { passive: true });

  controls.hidden = false;
}
