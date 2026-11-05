// "Watch it get handled": the Monday-night phone fills with busywork, then clears one notification at a time,
// and the screen turns to Tuesday morning with one summary of what was handled. An illustration with invented
// names: nothing is sent anywhere. The notifications pile up as the phone arrives; once the whole phone has been
// in view for a moment it clears on its own (never under reduced motion). After that the main control is the
// contact link, with a small Replay beside it. Without script both screens are shown, one under the other.
import { gsap, ScrollTrigger, calm, $, $$ } from "./env.js";

const SAID = "Tuesday morning: the busywork is handled. Dana Reyes is on the call-back list, Thistlecove Studio got a friendly reminder, three inquiries were answered and one call booked, and last week’s numbers are in the inbox.";

export function initBusy() {
  const root = $("[data-busy]");
  if (!root) return;
  const before = $("[data-busy-before]", root);
  const after = $("[data-busy-after]", root);
  const go = $("[data-busy-go]", root);
  const talk = $("[data-busy-talk]", root);
  const replay = $("[data-busy-back]", root);
  const controls = $("[data-busy-controls]", root);
  const status = $("[data-busy-status]", root);
  if (!before || !after || !go || !talk || !replay || !controls || !status) return;
  const notes = $$(".note", before);
  const clockBefore = $(".phone__time", before);
  const clockAfter = $(".phone__time", after);
  const card = $(".note--done", after);
  const rows = $$(".note__list li", after);
  const moved = [...notes, clockBefore, clockAfter, after, card, ...rows].filter(Boolean);

  let tl = null;
  let pending = null;
  let pile = null;
  let piled = false;
  // Anything in progress jumps to its end (a second press, a resize, motion turned off mid-run): the waiting
  // auto-play, a pile-up still dropping in (its notifications land, fully visible), and a run.
  const settle = () => {
    pending?.kill();
    pending = null;
    if (pile) {
      pile.kill();
      pile = null;
      gsap.set(notes, { clearProps: "transform,opacity,visibility" });
    }
    if (!tl) return;
    const t = tl;
    tl = null;
    t.progress(1).kill();
  };
  const tidy = () => gsap.set(moved, { clearProps: "transform,opacity,visibility,clipPath" });
  const show = (done, said) => {
    root.classList.toggle("is-done", done);
    go.hidden = done;
    talk.hidden = !done;
    replay.hidden = !done;
    if (said) status.textContent = said;
  };
  // The week piles up: each notification drops in, newest last.
  const pileUp = () => {
    piled = true;
    if (calm()) return null;
    pile = gsap.from(notes, { y: -18, autoAlpha: 0, duration: 0.5, ease: "expo.out", stagger: 0.22, clearProps: "transform,opacity,visibility", onComplete: () => { pile = null; } });
    return pile;
  };

  const play = (announce) => {
    settle();
    const finish = () => {
      tl = null;
      tidy();
      // Only a control that is about to disappear hands its focus on, and only if it still has it now.
      const hadFocus = document.activeElement === go;
      show(true, announce ? SAID : "");
      if (hadFocus) talk.focus();
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

  // Replay: back to Monday night, the week piles up again, then it clears.
  const again = () => {
    settle();
    tidy();
    const keep = document.activeElement === replay;
    show(false, "");
    if (keep) go.focus();
    if (calm()) { play(true); return; }
    const dropping = pileUp();
    pending = gsap.delayedCall(dropping ? dropping.duration() + 0.9 : 0, () => { pending = null; play(true); });
  };

  go.addEventListener("click", () => play(true));
  replay.addEventListener("click", again);

  // As the phone arrives, the week piles up; once all of it has been in view for a moment, it clears.
  ScrollTrigger.create({ trigger: root, start: "top 80%", once: true, onEnter: () => { if (!piled && !root.classList.contains("is-done")) pileUp(); } });
  ScrollTrigger.create({
    trigger: before, start: "bottom 96%", once: true,
    onEnter: () => {
      if (calm() || root.classList.contains("is-done") || tl) return;
      pending = gsap.delayedCall(2.6, () => { pending = null; if (!root.classList.contains("is-done")) play(false); });
    },
  });

  matchMedia("(prefers-reduced-motion: reduce)").addEventListener?.("change", settle);
  let width = innerWidth;
  addEventListener("resize", () => { if (innerWidth !== width) { width = innerWidth; settle(); } }, { passive: true });

  controls.hidden = false;
}
