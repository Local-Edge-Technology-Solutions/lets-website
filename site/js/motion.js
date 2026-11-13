// The motion layer outside the three moments (the hero's signature in js/hero.js, the voicemail in
// js/voicemail.js, the Billing Day approval in js/work.js): press feedback under the hand, and landing a visit
// that opens on a fragment. Nothing on the page moves because it scrolled. The press recipe is adapted from
// Animaxxing (pressFeedback) with the taste skill's rules winning: no overshoot, reduced motion gets none of it.
import { gsap } from "./env.js";

// Has the visitor started moving the page themselves? Listened for from the moment this module loads (before
// the font wait), so a fragment is never re-landed over their own scrolling.
let moved = false;
["wheel", "touchstart", "keydown", "pointerdown"].forEach((t) => addEventListener(t, () => { moved = true; }, { once: true, passive: true }));

// ---- Animaxxing pressFeedback, adapted: squash on press and an ink ripple from the press point. Release eases
// out without the recipe's elastic spring. Returns a remover for its listeners and styles.
export function pressFeedback(control, { squash = 0.95, ink = 0.28 } = {}) {
  const savedPos = control.style.position;
  const savedOverflow = control.style.overflow;
  const savedTap = control.style.getPropertyValue("-webkit-tap-highlight-color");
  control.style.setProperty("-webkit-tap-highlight-color", "transparent");
  const cs = getComputedStyle(control);
  if (cs.position === "static") control.style.position = "relative";
  if (cs.overflow === "visible") control.style.overflow = "clip";
  let pressed = false;
  const spread = (x, y) => {
    const b = control.getBoundingClientRect();
    const reach = Math.hypot(Math.max(x, b.width - x), Math.max(y, b.height - y));
    const drop = document.createElement("span");
    drop.dataset.ripple = "";
    drop.setAttribute("aria-hidden", "true");
    Object.assign(drop.style, { position: "absolute", left: `${x - reach}px`, top: `${y - reach}px`, width: `${reach * 2}px`, height: `${reach * 2}px`, borderRadius: "50%", pointerEvents: "none" });
    control.append(drop);
    gsap.fromTo(drop, { scale: 0.02, opacity: ink }, { scale: 1, opacity: 0, duration: 0.6, ease: "power2.out", onComplete: () => drop.remove() });
  };
  const press = (x, y) => { if (pressed) return; pressed = true; gsap.to(control, { scale: squash, duration: 0.12, ease: "power2.out" }); spread(x, y); };
  const release = () => { if (!pressed) return; pressed = false; gsap.to(control, { scale: 1, duration: 0.4, ease: "expo.out" }); };
  const onDown = (e) => { if (e.button !== 0) return; const b = control.getBoundingClientRect(); press(e.clientX - b.left, e.clientY - b.top); };
  const onKey = (e) => { if (e.repeat || (e.key !== "Enter" && e.key !== " ")) return; const b = control.getBoundingClientRect(); press(b.width / 2, b.height / 2); };
  const ups = ["pointerup", "pointercancel", "pointerleave", "keyup", "blur"];
  control.addEventListener("pointerdown", onDown);
  control.addEventListener("keydown", onKey);
  ups.forEach((t) => control.addEventListener(t, release));
  return () => {
    control.removeEventListener("pointerdown", onDown);
    control.removeEventListener("keydown", onKey);
    ups.forEach((t) => control.removeEventListener(t, release));
    gsap.killTweensOf(control);
    gsap.set(control, { clearProps: "transform" });
    control.querySelectorAll("[data-ripple]").forEach((d) => d.remove());
    control.style.position = savedPos;
    control.style.overflow = savedOverflow;
    if (savedTap) control.style.setProperty("-webkit-tap-highlight-color", savedTap);
    else control.style.removeProperty("-webkit-tap-highlight-color");
  };
}

export function initMotion() {
  // Built inside one gsap.matchMedia() run and torn down with it when the motion preference changes.
  const mm = gsap.matchMedia();
  mm.add({ motion: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
    if (!ctx.conditions.motion) return;
    document.documentElement.classList.add("gsap-press");
    const undo = [...document.querySelectorAll(".button, .menu__toggle, .bd-btn")].map((c) => pressFeedback(c));
    return () => {
      undo.forEach((f) => f());
      document.documentElement.classList.remove("gsap-press");
    };
  });

  // A visit that opens on a fragment (#contact, #work): late fonts and images can move it after the browser has
  // already jumped, so once the page has loaded, land on the fragment again, unless the visitor has started
  // scrolling themselves (Codex review, 2026-11-05).
  const land = () => {
    const target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && !moved) target.scrollIntoView({ block: "start" });
  };
  if (document.readyState === "complete") land();
  else addEventListener("load", land, { once: true });
  document.fonts?.ready.then(land);
  return mm;
}
