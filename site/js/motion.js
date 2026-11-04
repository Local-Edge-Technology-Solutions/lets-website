// The motion layer. Recipes adapted from Animaxxing (registrationSlip, pressFeedback) with the taste skill's
// rules winning: no overshoot, nothing hidden without script, reduced motion gets the finished page.
// The hero's load sequence is CSS (styles.css). Everything here is built inside one gsap.matchMedia()
// run and torn down with it when the motion preference or the width class changes.
import { gsap, ScrollTrigger, SplitText, calm, $, $$, fontsReady } from "./env.js";

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
  const restore = () => { copy.remove(); [heading.style.position, heading.style.zIndex] = saved; parent.style.position = parentPos; };
  tl.fromTo(copy, { x, y }, { x: x * 0.35, y: -y * 0.3, duration: duration * 0.55, ease: "power2.out" })
    .to(copy, { x: 0, y: 0, duration: duration * 0.45, ease: "expo.out" })
    .call(restore);
  tl.eventCallback("onInterrupt", restore);
  return tl;
}

// ---- Animaxxing pressFeedback, adapted: squash on press and an ink ripple from the press point. Release eases
// out without the recipe's elastic spring. Returns a remover for its listeners and styles.
function pressFeedback(control, { squash = 0.95, ink = 0.28 } = {}) {
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
const rowsOf = (slip) => $$(".slip__top, .slip__rule, dl > div, .slip__msg, .slip__foot", slip);
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

// ---- Showpiece 1: the busywork shatter. As the hero leaves, the letters of THE BUSYWORK break off, scatter,
// and settle into the ticked to-do list in the next section, then crossfade into its real text.
// The real heading and the real list never leave the HTML; the letters are aria-hidden copies in an
// overlay that lives outside every clipped box, measured from the real glyphs (so kerning matches).
function shatter() {
  const source = $("[data-shatter-source]");
  const layer = $("[data-shatter]");
  const list = $("[data-done]");
  if (!source || !layer || !list) return () => {};
  const text = source.firstChild;
  if (!text || text.nodeType !== 3) return () => {};
  const rows = $$(".done__row", list);
  const words = rows.map((r) => $(".done__text", r));
  const ticks = rows.map((r) => $(".done__box svg", r));
  const glyphs = [...text.data].map((c, i) => ({ c, i })).filter((g) => g.c.trim());
  const frags = glyphs.map((g) => {
    const s = document.createElement("span");
    s.className = "shatter__char";
    s.textContent = g.c;
    layer.append(s);
    return s;
  });
  // Letters are dealt to the four rows in reading order: THE / BUS / YW / ORK.
  const groups = rows.map(() => []);
  frags.forEach((_, k) => groups[Math.min(rows.length - 1, Math.floor((k * rows.length) / frags.length))].push(k));
  const rowOf = frags.map((_, k) => groups.findIndex((g) => g.includes(k)));
  // Fixed scatter, so the move is the same on every visit and on the way back up.
  const rnd = gsap.utils.random(-1, 1, 0.001, true);
  const scatter = frags.map(() => ({ x: rnd(), y: rnd(), r: rnd() }));
  const geom = { start: [], end: [], scale: [], mid: [], size: 0, W: innerWidth, H: innerHeight };
  const picture = $(".hero__picture");

  const measure = () => {
    const cs = getComputedStyle(source);
    const size = parseFloat(cs.fontSize);
    geom.size = size;
    geom.W = innerWidth;
    geom.H = innerHeight;
    // The inner line may still be rising (its CSS load animation); its wrapper never moves.
    const wrap = source.parentElement.getBoundingClientRect();
    const inner = source.getBoundingClientRect();
    const offX = inner.left - wrap.left;
    const offY = inner.top - wrap.top;
    const range = document.createRange();
    glyphs.forEach((g, k) => {
      range.setStart(text, g.i);
      range.setEnd(text, g.i + 1);
      const r = range.getBoundingClientRect();
      geom.start[k] = { x: r.left - offX + scrollX, y: r.top - offY + scrollY, w: r.width, h: r.height };
      Object.assign(frags[k].style, {
        left: `${geom.start[k].x}px`, top: `${geom.start[k].y}px`,
        fontFamily: cs.fontFamily, fontSize: cs.fontSize, letterSpacing: cs.letterSpacing, lineHeight: `${r.height}px`,
      });
    });
    // The scatter lands the letters on the till's pile of paper: inside the hero picture, not over the words.
    const pic = picture.getBoundingClientRect();
    frags.forEach((_, k) => {
      const u = (scatter[k].x + 1) / 2, v = (scatter[k].y + 1) / 2;
      const w = geom.start[k].w, h = geom.start[k].h;
      geom.mid[k] = {
        x: pic.left + scrollX + pic.width * 0.06 + u * Math.max(0, pic.width * 0.88 - w) - geom.start[k].x,
        y: pic.top + scrollY + pic.height * 0.08 + v * Math.max(0, pic.height * 0.7 - h) - geom.start[k].y,
      };
    });
    let bottom = 0;
    groups.forEach((group, j) => {
      const t = words[j].getBoundingClientRect();
      const ts = parseFloat(getComputedStyle(words[j]).fontSize);
      const s = (ts * 1.05) / size;
      let x = t.left + scrollX;
      group.forEach((k) => {
        const h = geom.start[k].h * s;
        geom.end[k] = { x, y: t.top + scrollY + (t.height - h) / 2 };
        geom.scale[k] = s;
        x += geom.start[k].w * s;
      });
      bottom = Math.max(bottom, t.bottom + scrollY);
    });
    layer.style.height = `${Math.ceil(bottom + geom.H)}px`;
  };
  measure();
  ScrollTrigger.addEventListener("refreshInit", measure);

  const ink = getComputedStyle(source).color;
  const teal = getComputedStyle(document.documentElement).getPropertyValue("--teal").trim();
  gsap.set(frags, { autoAlpha: 0, x: 0, y: 0, color: ink });
  gsap.set(words, { opacity: 0 });
  gsap.set(ticks, { clipPath: "inset(0% 100% 0% 0%)" });

  const tl = gsap.timeline({
    defaults: { immediateRender: false },
    scrollTrigger: { trigger: ".hero", start: "top top", endTrigger: list, end: "center 58%", scrub: true, invalidateOnRefresh: true },
  });
  // The hero itself recedes as it goes: the till tilts and lifts, the sentence drifts up.
  tl.fromTo(".hero__picture", { rotation: 4, y: 0 }, { rotation: 10, y: () => -geom.H * 0.12, ease: "none", duration: 0.5 }, 0)
    .fromTo(".hero__copy, .hero__fact", { y: 0 }, { y: () => -geom.H * 0.08, ease: "none", duration: 0.5 }, 0);
  // The swap: the real line goes, its letters stand in exactly where it was.
  tl.set(source, { opacity: 0 }, 0.02).set(frags, { autoAlpha: 1 }, 0.02);
  // Break and scatter.
  tl.fromTo(frags, { x: 0, y: 0, rotation: 0, color: ink }, {
    x: (k) => geom.mid[k].x,
    y: (k) => geom.mid[k].y,
    rotation: (k) => scatter[k].r * 120,
    duration: 0.38, ease: "power2.out", stagger: { each: 0.008, from: "center" },
  }, 0.03);
  // Settle into the list, a row at a time.
  tl.fromTo(frags, {
    x: (k) => geom.mid[k].x,
    y: (k) => geom.mid[k].y,
    rotation: (k) => scatter[k].r * 120,
    scale: 1,
  }, {
    x: (k) => geom.end[k].x - geom.start[k].x,
    y: (k) => geom.end[k].y - geom.start[k].y,
    rotation: 0,
    scale: (k) => geom.scale[k],
    duration: 0.42, ease: "power3.inOut", stagger: (k) => rowOf[k] * 0.03,
  }, 0.44);
  // Ink: black over the teal hero, teal across the black section, black again on the white list.
  tl.fromTo(frags, { color: ink }, { color: teal, duration: 0.08, ease: "none" }, 0.46)
    .fromTo(frags, { color: teal }, { color: ink, duration: 0.06, ease: "none" }, 0.8);
  // Crossfade into the real words; the ticks draw in.
  tl.to(frags, { autoAlpha: 0, duration: 0.06, ease: "none", stagger: (k) => rowOf[k] * 0.02 }, 0.92)
    .to(words, { opacity: 1, duration: 0.06, ease: "none", stagger: 0.02 }, 0.92)
    .to(ticks, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.07, ease: "none", stagger: 0.025 }, 0.93);

  return () => {
    ScrollTrigger.removeEventListener("refreshInit", measure);
    tl.scrollTrigger?.kill();
    tl.kill();
    frags.forEach((f) => f.remove());
    layer.style.height = "";
    gsap.set(source, { clearProps: "opacity" });
    gsap.set(words, { clearProps: "opacity" });
    gsap.set(ticks, { clearProps: "clipPath" });
    gsap.set(".hero__picture, .hero__copy, .hero__fact", { clearProps: "transform" });
  };
}

export function initMotion() {
  const mm = gsap.matchMedia();
  mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 1001px)" }, (ctx) => {
    if (!ctx.conditions.motion) return;
    document.documentElement.classList.add("gsap-press");
    const wide = ctx.conditions.wide;
    const undo = [];
    // On narrower screens a page runs to many screens; there, entrances only move and never fade, so nothing
    // ever waits invisible for a scroll that a visitor (or a jump to #contact) might skip past.
    const hide = wide ? 0 : 1;
    // The close of the page (questions, the form, the footer) is where every "Let's talk" button jumps to,
    // so there nothing fades in after the jump: those entrances only move. Entrances use opacity, never
    // visibility, so a control that has not arrived yet can still take keyboard focus.

    // Hero: the masked lines rise in CSS; then a white second impression slips into register under the black.
    const h1 = $(".hero__title");
    const slipCall = gsap.delayedCall(1.05, () => registrationSlip(h1, "var(--white)", { x: 18, y: 8, duration: 0.8 }));
    undo.push(() => slipCall.kill());

    // Headings: lines rise out of their masks once, then a second impression slips into register where marked.
    // Called section by section so every ScrollTrigger is created in page order (the showcase pin adds height).
    const splits = [];
    const splitIn = (el, { moveOnly = !wide } = {}) => {
      if (!el) return;
      let slipped = false;
      splits.push(SplitText.create(el, {
        type: "lines", mask: moveOnly ? undefined : "lines", autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: moveOnly ? 35 : 110, duration: 0.75, ease: "expo.out", stagger: 0.09,
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            onComplete: () => { if (el.dataset.slip && !slipped) { slipped = true; registrationSlip(el, el.dataset.slip, { lines: self.lines }); } },
          });
        },
      }));
    };

    // Showpiece 1 replaces the old hero scroll timeline.
    undo.push(shatter());

    splitIn($("#intro-title"));
    gsap.from(".intro__words > *", { y: 28, opacity: hide, duration: 0.8, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".intro__words", start: "top 90%", once: true } });
    gsap.from(".chip--press", { rotation: 14, scale: 1.2, opacity: hide, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".chip--press", start: "top 88%", once: true } });

    // What's eating your week: the picker is dealt in; in the voicemail answer, the card is laid down and the
    // list slid beside it.
    splitIn($("#week-title"));
    gsap.from(".fixes .vm__intro > *, .fixes__picker:not([hidden])", { y: 20, opacity: hide, duration: 0.7, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: ".fixes .vm__intro", start: "top 90%", once: true } });
    gsap.timeline({ scrollTrigger: { trigger: ".fix--calls", start: "top 86%", once: true } })
      .from(".vm-card", { y: 60, rotation: -1.5, opacity: hide, duration: 0.9, ease: "expo.out" })
      .from(".vm-list", { y: 80, rotation: 4, opacity: hide, duration: 0.9, ease: "expo.out" }, 0.12)
      .from(".vm-wave i", { scaleY: 0.1, duration: 0.6, ease: "expo.out", stagger: { each: 0.008, from: "start" } }, 0.2);

    // Showcase: on wide screens the section holds while the six slips print up out of the desk, one by one.
    splitIn($("#examples-title"));
    const show = $(".showcase");
    const slips = $$(".slip", show);
    gsap.from(".showcase__copy .statement, .showcase .picker:not([hidden])", { y: 24, opacity: hide, duration: 0.7, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".showcase__copy", start: "top 85%", once: true } });
    if (wide && show.offsetHeight <= innerHeight + 4) {
      gsap.timeline({ scrollTrigger: { trigger: show, start: "top top", end: "+=85%", pin: true, scrub: true, anticipatePin: 1 } })
        .from(slips, { yPercent: 108, ease: "none", stagger: 0.14, duration: 0.5 }, 0)
        .fromTo(".showcase__photo", { scale: 1.12 }, { scale: 1, ease: "none", duration: 1.2 }, 0);
    } else {
      ScrollTrigger.batch(slips, { start: "top 94%", once: true, onEnter: (b) => gsap.from(b, { y: 40, opacity: hide, duration: 0.7, ease: "expo.out", stagger: 0.08 }) });
      gsap.fromTo(".showcase__photo", { scale: 1.1 }, { scale: 1, ease: "none", scrollTrigger: { trigger: show, start: "top bottom", end: "bottom top", scrub: true } });
    }

    // Calculator: the tasks are dealt in like rows on a sheet; the figure panel arrives beside them.
    splitIn($("#calc-title"));
    gsap.from(".calc__head .statement", { y: 20, opacity: hide, duration: 0.7, ease: "expo.out", scrollTrigger: { trigger: ".calc__head", start: "top 85%", once: true } });
    ScrollTrigger.batch(".chore, .calc__examples li", { start: "top 94%", once: true, onEnter: (b) => gsap.from(b, { x: -28, opacity: hide, duration: 0.6, ease: "expo.out", stagger: 0.05 }) });
    gsap.from(".calc__result", { y: 50, opacity: hide, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".calc__body", start: "top 85%", once: true } });

    // About: the two type cards open from the bottom edge like a shutter; names and lines follow.
    splitIn($("#about-title"));
    $$(".person").forEach((p) => {
      gsap.timeline({ scrollTrigger: { trigger: p, start: "top 88%", once: true } })
        .fromTo($(".person__card", p), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.inOut" })
        .from($(".person__mark", p), { yPercent: 14, duration: 1.2, ease: "expo.out" }, 0.1)
        .from($$(".person__name, .person__role, .person__text", p), { y: 18, opacity: hide, duration: 0.6, ease: "expo.out", stagger: 0.08 }, 0.4);
    });
    gsap.from(".about__line", { y: 18, opacity: hide, duration: 0.7, ease: "expo.out", scrollTrigger: { trigger: ".about__line", start: "top 90%", once: true } });

    // How it works: each line steps in along the stair as it climbs the screen.
    $$(".stair").forEach((st) => {
      const line = $(".stair__line", st);
      splitIn(line);
      if (wide) gsap.fromTo(line, { x: () => -innerWidth * 0.1 }, { x: 0, ease: "none", scrollTrigger: { trigger: st, start: "top bottom", end: "top 55%", scrub: true } });
      gsap.from($("p", st), { y: 18, opacity: hide, duration: 0.7, ease: "expo.out", scrollTrigger: { trigger: st, start: "top 86%", once: true } });
    });

    gsap.from(".week-slip", { y: 60, rotation: -8, opacity: hide, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".week-slip", start: "top 90%", once: true } });

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
    $$(".button, .picker label, .menu__toggle").forEach((c) => undo.push(pressFeedback(c)));

    return () => {
      undo.forEach((f) => f());
      splits.forEach((s) => s.revert());
      document.documentElement.classList.remove("gsap-press");
    };
  });

  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === "complete") refresh();
  else addEventListener("load", refresh, { once: true });
  // If the face arrived after the bounded wait, measure the letters again in the real face.
  document.fonts?.ready.then(refresh);
  return mm;
}

export { fontsReady };
