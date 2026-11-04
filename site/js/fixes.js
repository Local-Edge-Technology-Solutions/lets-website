// "What's eating your week?": the visitor taps the problem that sounds like theirs and sees the kind of thing
// we'd build for it. Without script every answer is listed in full; with it, a picker shows one at a time.
import { gsap, ScrollTrigger, calm, $, $$ } from "./env.js";

export function initFixes() {
  const root = $("[data-fixes]");
  if (!root) return;
  const picker = $("[data-fix-picker]", root);
  const status = $("[data-fix-status]", root);
  const items = $$("[data-fix]", root);
  if (!picker || !items.length) return;
  let current = items[0].dataset.fix;
  let tl = null;

  const pieces = (item) => $$(".fix__problem, .fix__build, .fix__note, .fix__card, .vm__intro, .vm__stage, .fix__go", item);
  const show = (key, animate) => {
    // A second tap while the last swap is still moving finishes that swap first, so state never splits.
    tl?.progress(1);
    const next = items.find((i) => i.dataset.fix === key);
    const prev = items.find((i) => i.dataset.fix === current);
    if (!next) return;
    // Leaving the voicemail sample mid-run lands it at once, so nothing flies over a hidden panel.
    if (prev && prev !== next) (prev.matches("[data-vm]") ? prev : $("[data-vm]", prev))?.dispatchEvent(new Event("vm:land"));
    if (animate && prev === next) return;
    const swap = () => {
      // Land it again here: Replay might have been pressed while the old answer was fading out.
      if (prev && prev !== next) (prev.matches("[data-vm]") ? prev : $("[data-vm]", prev))?.dispatchEvent(new Event("vm:land"));
      items.forEach((i) => { i.hidden = i !== next; });
      current = key;
      status.textContent = `Showing what we’d build for ${$(".fix__problem", next).textContent.toLowerCase()}.`;
      ScrollTrigger.refresh();
    };
    if (!animate || calm() || !prev || prev.hidden) { swap(); return; }
    tl = gsap.timeline({ onComplete: () => { tl = null; } })
      .to(pieces(prev), { y: -10, autoAlpha: 0, duration: 0.16, ease: "power2.in", stagger: 0.02 })
      .call(() => {
        gsap.set(pieces(prev), { clearProps: "transform,opacity,visibility" });
        swap();
      })
      .fromTo(pieces(next), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: "expo.out", stagger: 0.06, clearProps: "transform,opacity,visibility" });
  };

  picker.addEventListener("change", (e) => { if (e.target.name === "fix") show(e.target.value, true); });
  show(current, false);
  picker.hidden = false;
  root.classList.add("is-picking");
}
