// The motion layer outside the two moments (the voicemail in js/voicemail.js, the Billing Day approval in
// js/work.js; the first screen's pen marks are CSS): press feedback under the hand, landing a visit that opens
// on a fragment, and (round 11, initReveal) what waits below the first screen. The press recipe is adapted from
// Animaxxing (pressFeedback) with the taste skill's rules winning: no overshoot, reduced motion gets none of it.
import { gsap, calm, $, $$ } from "./env.js";

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
  // a control stepped back (aria-disabled, e.g. the form while it sends) takes no press motion
  const press = (x, y) => { if (pressed || control.getAttribute("aria-disabled") === "true") return; pressed = true; gsap.to(control, { scale: squash, duration: 0.12, ease: "power2.out" }); spread(x, y); };
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

// ---- Round 11: the pen's marks on phones, one-shot arrivals below the first screen, and settling.
// The first screen's motion is CSS (styles.css, the motion block); this only decides what waits. Nothing on the screen
// at load is ever hidden, only opacity and transform change (never visibility or layout), and everything settles at
// once on a fragment visit, keyboard focus reaching it, a back-forward cache restore, print, or reduced motion coming
// on. Without IntersectionObserver, or with reduced motion, nothing waits.
// What arrives: section headings, lead copy, the example tiles, Ben's and Zeke's portraits, the steps and the
// question bands. Never the voicemail stage or the Billing Day preview, never a button or a form field.
const ARRIVALS = [
  ".cue__title", ".cue__person",
  ".see__title", ".see__lead", ".tries__top", ".tries__list > li",
  ".work__title", ".work__side",
  ".about__title", ".about__care", ".person__frame",
  ".biz__title", ".biz__line",
  ".how__title", ".steps > li",
  ".coupon__title", ".coupon__text",
  ".faq__title", ".band",
].join(", ");

export function initReveal() {
  const root = document.documentElement;
  const eg = $("header.pz-hero .eg");
  const waiting = new Set();
  const arriving = new Set();
  let io = null;
  let pen = null;

  // An arrival in flight ends at once: no class, no delay, no transform.
  const land = (el) => { el.classList.remove("rv-in"); el.style.removeProperty("--rv-d"); arriving.delete(el); };
  // Everything at once: the first screen's marks stop where they end, waiting marks draw, waiting blocks show,
  // arrivals already under way finish.
  const settle = () => {
    root.classList.add("is-settled");
    eg?.classList.remove("is-waiting");
    pen?.disconnect();
    waiting.forEach((el) => el.classList.remove("rv-wait"));
    waiting.clear();
    [...arriving].forEach(land);
    io?.disconnect();
  };
  if (location.hash.length > 1) settle();
  addEventListener("hashchange", settle);
  addEventListener("beforeprint", settle);
  addEventListener("pageshow", (e) => { if (e.persisted) settle(); });
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => { if (e.matches) settle(); });
  $("header.pz-hero")?.addEventListener("focusin", settle);
  if (root.classList.contains("is-settled") || calm() || !("IntersectionObserver" in window)) return;

  const below = (el) => el.getBoundingClientRect().top >= innerHeight;

  // The Example's marks, where the panel is not beside the poster (phones, tablets, short desktop windows):
  // undrawn while its rows are below the screen, drawn in turn as soon as the rows come into view.
  const rows = eg && $(".eg__rows", eg);
  if (rows && !matchMedia("(min-width: 1001px) and (min-height: 700px)").matches && below(rows)) {
    eg.classList.add("is-waiting");
    pen = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      pen.disconnect();
      eg.classList.remove("is-waiting");
      eg.classList.add("is-drawing");
    });
    pen.observe(rows);
  }

  // Arrivals: a batch that comes into view together arrives in page order, at most 40ms apart and 60ms in all.
  const show = (els, animate) => {
    const list = els.filter((el) => waiting.has(el));
    if (!list.length) return;
    const step = list.length > 1 ? Math.min(40, 60 / (list.length - 1)) : 0;
    list.forEach((el, k) => {
      waiting.delete(el);
      io.unobserve(el);
      el.classList.remove("rv-wait");
      if (!animate) return;
      el.style.setProperty("--rv-d", `${Math.round(k * step)}ms`);
      el.classList.add("rv-in");
      arriving.add(el);
    });
    // nothing left behind once it has arrived: no class, no delay, no transform
    if (animate) setTimeout(() => list.forEach((el) => { if (arriving.has(el)) land(el); }), 450);
  };
  $$(ARRIVALS).forEach((el) => {
    if (el.closest(".vm__stage, .bd, [hidden]") || !below(el)) return;
    el.classList.add("rv-wait");
    waiting.add(el);
  });
  if (!waiting.size) return;
  io = new IntersectionObserver((entries) => {
    const seen = entries.filter((e) => e.isIntersecting).map((e) => e.target);
    seen.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    show(seen, true);
  });
  waiting.forEach((el) => io.observe(el));
  // keyboard focus reaching a section shows everything waiting or arriving in it at once
  document.addEventListener("focusin", (e) => {
    const part = e.target.closest?.("main > section, .page > footer, .page > header");
    if (!part) return;
    show([...waiting].filter((el) => part.contains(el)), false);
    [...arriving].filter((el) => part.contains(el)).forEach(land);
  });
}
