// The motion layer. Recipes adapted from Animaxxing (registrationSlip, pressFeedback) with the taste skill's
// rules winning: no overshoot, nothing hidden without script, reduced motion gets the finished page.
// The hero's load sequence is CSS (styles.css). Everything here is built inside one gsap.matchMedia()
// run and torn down with it when the motion preference or the width class changes.
import { gsap, ScrollTrigger, SplitText, calm, $, $$, fontsReady } from "./env.js";

// Has the visitor started moving the page themselves? Listened for from the moment this module loads (before
// the font wait), so a fragment is never re-landed over their own scrolling.
let moved = false;
["wheel", "touchstart", "keydown", "pointerdown"].forEach((t) => addEventListener(t, () => { moved = true; }, { once: true, passive: true }));

// ---- Animaxxing registrationSlip, adapted: a second impression in another ink lands out of register behind a
// heading, then slips true under it and is removed. The heading never moves.
function registrationSlip(heading, ink, { x = 14, y = 6, duration = 0.7, lines: given } = {}) {
  const tl = gsap.timeline();
  if (calm() || !heading) return tl;
  const copy = document.createElement("div");
  copy.className = heading.className;
  const lines = given && given.length ? given : [...heading.querySelectorAll(":scope > .line")];
  (lines.length ? lines : [heading]).forEach((ln) => {
    const row = document.createElement("div");
    row.className = "impression-line";
    row.dataset.t = ln.textContent.replace(/\s+/g, " ").trim();
    copy.append(row);
  });
  copy.setAttribute("aria-hidden", "true");
  copy.style.fontWeight = getComputedStyle(heading).fontWeight;
  const parent = heading.parentElement;
  const parentPos = parent.style.position;
  if (getComputedStyle(parent).position === "static") parent.style.position = "relative";
  const box = heading.getBoundingClientRect();
  const origin = parent.getBoundingClientRect();
  Object.assign(copy.style, {
    position: "absolute", left: `${box.left - origin.left}px`, top: `${box.top - origin.top}px`, width: `${box.width}px`,
    margin: "0", color: ink, pointerEvents: "none", zIndex: "0", animation: "none",
  });
  const saved = [heading.style.position, heading.style.zIndex];
  const cs = getComputedStyle(heading);
  if (cs.position === "static") heading.style.position = "relative";
  if (cs.zIndex === "auto") heading.style.zIndex = "1";
  parent.append(copy);
  let done = false;
  const restore = () => {
    if (done) return;
    done = true;
    liveSlips.delete(stop);
    copy.remove(); [heading.style.position, heading.style.zIndex] = saved; parent.style.position = parentPos;
  };
  // A slip still running when the motion layer is torn down (motion turned off mid-slip) is stopped and removed.
  const stop = () => { tl.kill(); restore(); };
  liveSlips.add(stop);
  tl.fromTo(copy, { x, y }, { x: x * 0.35, y: -y * 0.3, duration: duration * 0.55, ease: "power2.out" })
    .to(copy, { x: 0, y: 0, duration: duration * 0.45, ease: "expo.out" })
    .call(restore);
  tl.eventCallback("onInterrupt", restore);
  return tl;
}
const liveSlips = new Set();

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

// ---- The examples' re-deal: each slip's lines lift off, the new ones print in, row by row.
const rowsOf = (slip) => $$(".slip__top, dl > div, .slip__msg, .slip__foot", slip);
export function redeal(slips, swap) {
  if (calm()) { swap(); return; }
  const out = gsap.timeline();
  slips.forEach((s, i) => out.to(rowsOf(s), { y: -10, autoAlpha: 0, duration: 0.18, ease: "power2.in", stagger: 0.012 }, i * 0.03));
  out.call(() => {
    swap();
    const inn = gsap.timeline();
    slips.forEach((s, i) => inn.fromTo(rowsOf(s), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42, ease: "expo.out", stagger: 0.035, clearProps: "transform,opacity,visibility" }, i * 0.06));
  });
}

export function initMotion() {
  const mm = gsap.matchMedia();
  mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 1001px)" }, (ctx) => {
    if (!ctx.conditions.motion) return;
    document.documentElement.classList.add("gsap-press");
    const wide = ctx.conditions.wide;
    const undo = [];
    // Entrances only move, at every width: nothing ever waits invisible (or masked) for a scroll that a
    // visitor, a jump to #contact or a screenshot might skip past (critique cap, 2026-11-05).

    // Hero: the masked lines rise in CSS; then a white second impression slips into register under the black.
    const h1 = $(".hero__title");
    const slipCall = gsap.delayedCall(1.05, () => registrationSlip(h1, "var(--white)", { x: 18, y: 8, duration: 0.8 }));
    undo.push(() => slipCall.kill());

    // Headings are never moved or hidden; where marked, a second impression slips into register as each
    // arrives. Called section by section so every
    // ScrollTrigger is created in page order (the showcase pin adds height).
    const splits = [];
    const splitIn = (el) => {
      if (!el) return;
      let slipped = false;
      splits.push(SplitText.create(el, {
        type: "lines", autoSplit: true,
        // The heading itself never moves (a moving line was clipped by the page edge or crossed what followed,
        // Codex 2026-11-05); where marked, its second impression slips into register as it arrives.
        onSplit(self) {
          return gsap.timeline({ scrollTrigger: { trigger: el, start: "top 92%", once: true } })
            .call(() => { if (el.dataset.slip && !slipped) { slipped = true; registrationSlip(el, el.dataset.slip, { lines: self.lines }); } });
        },
      }));
    };

    // Billing Day: its heading rises; the preview itself only answers the Approve button (js/work.js).
    splitIn($("#work-title"));
    gsap.from(".work__text", { y: 24, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".work__head", start: "top 88%", once: true } });

    // The to-do list ticks itself, once, when it arrives: the words are always there; only the ticks draw.
    const ticks = $$(".done__box svg");
    gsap.set(ticks, { clipPath: "inset(0% 100% 0% 0%)" });
    gsap.to(ticks, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.35, ease: "power2.out", stagger: 0.18, delay: 0.2, scrollTrigger: { trigger: ".done", start: "top 85%", once: true } });
    undo.push(() => gsap.set(ticks, { clearProps: "clipPath" }));

    splitIn($("#intro-title"));
    gsap.from(".intro__words > *", { y: 28, duration: 0.8, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".intro__words", start: "top 90%", once: true } });
    gsap.from(".chip--press", { rotation: 14, scale: 1.2, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".chip--press", start: "top 88%", once: true } });

    // What's eating your week: the picker is dealt in; in the voicemail answer, the card is laid down and the
    // list slid beside it.
    splitIn($("#week-title"));
    gsap.from(".fixes .vm__intro > *, .fixes__picker:not([hidden])", { y: 20, duration: 0.7, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: ".fixes .vm__intro", start: "top 90%", once: true } });
    gsap.timeline({ scrollTrigger: { trigger: ".fix--calls", start: "top 86%", once: true } })
      .from(".vm-card", { y: 60, rotation: -1.5, duration: 0.9, ease: "expo.out" })
      .from(".vm-list", { y: 80, rotation: 4, duration: 0.9, ease: "expo.out" }, 0.12)
      .from(".vm-wave i", { scaleY: 0.1, duration: 0.6, ease: "expo.out", stagger: { each: 0.008, from: "start" } }, 0.2);

    // Showcase: on wide screens the section holds while the six slips print up out of the desk, one by one.
    splitIn($("#examples-title"));
    const show = $(".showcase");
    const slips = $$(".slip", show);
    gsap.from(".showcase__copy .statement, .showcase .picker:not([hidden])", { y: 24, duration: 0.7, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".showcase__copy", start: "top 85%", once: true } });
    if (wide && show.offsetHeight <= innerHeight + 4) {
      gsap.timeline({ scrollTrigger: { trigger: show, start: "top top", end: "+=85%", pin: true, scrub: true, anticipatePin: 1 } })
        .from(slips, { yPercent: 108, ease: "none", stagger: 0.14, duration: 0.5 }, 0)
        .fromTo(".showcase__photo", { scale: 1.12 }, { scale: 1, ease: "none", duration: 1.2 }, 0);
    } else {
      ScrollTrigger.batch(slips, { start: "top 94%", once: true, onEnter: (b) => gsap.from(b, { y: 40, duration: 0.7, ease: "expo.out", stagger: 0.08 }) });
      gsap.fromTo(".showcase__photo", { scale: 1.1 }, { scale: 1, ease: "none", scrollTrigger: { trigger: show, start: "top bottom", end: "bottom top", scrub: true } });
    }

    // Calculator: the tasks are dealt in like rows on a sheet; the figure panel arrives beside them.
    splitIn($("#calc-title"));
    gsap.from(".calc__head .statement", { y: 20, duration: 0.7, ease: "expo.out", scrollTrigger: { trigger: ".calc__head", start: "top 85%", once: true } });
    ScrollTrigger.batch(".chore, .calc__examples li", { start: "top 94%", once: true, onEnter: (b) => gsap.from(b, { x: -28, duration: 0.6, ease: "expo.out", stagger: 0.05 }) });
    gsap.from(".calc__result", { y: 50, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".calc__body", start: "top 85%", once: true } });

    // About: the photo settles in its frame; the bios rise beside it.
    splitIn($("#about-title"));
    gsap.timeline({ scrollTrigger: { trigger: ".about__people", start: "top 85%", once: true } })
      .from(".about__photo img", { scale: 1.12, duration: 1.4, ease: "expo.out", clearProps: "transform" }, 0)
      .from(".person > *", { y: 18, duration: 0.6, ease: "expo.out", stagger: 0.05 }, 0.2);
    gsap.from(".about__line", { y: 18, duration: 0.7, ease: "expo.out", scrollTrigger: { trigger: ".about__line", start: "top 90%", once: true } });

    // How it works: each line steps in along the stair as it climbs the screen.
    splitIn($("#how-title"));
    $$(".stair").forEach((st) => {
      gsap.from(st.children, { y: 18, duration: 0.7, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: st, start: "top 88%", once: true } });
    });

    gsap.from(".week-slip", { y: 60, rotation: -8, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".week-slip", start: "top 90%", once: true } });

    splitIn($("#faq-title"));
    // Questions: each band's question rises, its answer a beat after; the storefronts are pinned up.
    $$(".band").forEach((b) => {
      gsap.timeline({ scrollTrigger: { trigger: b, start: "top 88%", once: true } })
        .from($(".band__q", b), { y: 22, duration: 0.7, ease: "expo.out" })
        .from($(".band__a", b), { y: 18, duration: 0.7, ease: "expo.out" }, 0.09);
    });
    ScrollTrigger.batch(".storefronts li", { start: "top 94%", once: true, onEnter: (b) => gsap.from(b, { y: 50, rotation: (i) => (i % 2 ? 4 : -4), duration: 0.8, ease: "expo.out", stagger: 0.07 }) });

    splitIn($("#contact-title"), { moveOnly: true });
    // Contact: the coupon is handed over, then its cells fill in.
    gsap.timeline({ scrollTrigger: { trigger: ".coupon", start: "top 88%", once: true } })
      .from(".coupon", { y: 70, rotation: -2.5, duration: 0.9, ease: "expo.out" })
      .from(".coupon__right > :not(.hp):not(:empty)", { y: 14, duration: 0.5, ease: "expo.out", stagger: 0.06 }, 0.2)
      .from(".coupon__text", { y: 14, duration: 0.6, ease: "expo.out" }, 0.3);

    // Footer: the four blocks are set like wood type, rising from the baseline as the close arrives.
    gsap.from(".mark__block", { yPercent: 30, duration: 0.9, ease: "expo.out", stagger: 0.11, scrollTrigger: { trigger: ".mark", start: "top 94%", once: true } });
    gsap.from(".footer__grid > *, .footer__last", { y: 16, duration: 0.6, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: ".footer__grid", start: "top 94%", once: true } });

    // Feedback under the hand.
    $$(".button, .picker label, .menu__toggle, .bd-btn").forEach((c) => undo.push(pressFeedback(c)));

    return () => {
      undo.forEach((f) => f());
      [...liveSlips].forEach((f) => f());
      splits.forEach((s) => s.revert());
      document.documentElement.classList.remove("gsap-press");
    };
  });

  // A visit that opens on a fragment (#contact, #work): the showcase pin adds height above it after the
  // browser has already jumped, so once measurements settle, land on the fragment again, unless the
  // visitor has started scrolling themselves (Codex review, 2026-11-05).
  const refresh = () => {
    ScrollTrigger.refresh();
    const target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && !moved) target.scrollIntoView({ block: "start" });
  };
  if (document.readyState === "complete") refresh();
  else addEventListener("load", refresh, { once: true });
  // If the face arrived after the bounded wait, measure the letters again in the real face.
  document.fonts?.ready.then(refresh);
  return mm;
}

export { fontsReady };
