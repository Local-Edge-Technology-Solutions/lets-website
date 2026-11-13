// The hero's signature: four everyday inputs run into one LETS node and come out as four finished pieces of work.
// Every label is text in the HTML and readable in every frame; only the drawing moves. With script and motion
// allowed, CSS shows the outcomes as outlines from the first paint (.js, no .is-done); once the figure is on
// screen this plays once (about 2.2 s). For each job in turn: its input tile lights as it sends, a glowing packet
// runs the wire through the node, a teal fill wipes across the outcome (an aria-hidden copy laid over it, so no
// frame mixes inks), then the outcome's own detail builds (the tag lands, the reply types, the bars grow, the bell
// rings); last, the check draws. It then marks the figure .is-done and removes every copy and light.
// Reduced motion (also switched on mid-run), no script, a missing part, or any failure: the finished figure.
import { gsap, calm, $, $$ } from "./env.js";

export function initHero() {
  const sig = $("[data-sig]");
  if (!sig) return;
  const done = () => sig.classList.add("is-done");
  if (calm() || !("IntersectionObserver" in window)) { done(); return; }

  // Every part the run touches must be there; otherwise the figure simply rests, finished.
  const lanes = $$(".lane", sig);
  const parts = lanes.map((lane) => ({ lane, input: $(".lane__in", lane), run: $(".wire__run", lane), out: $(".out", lane) }));
  const tick = $(".sig__check svg", sig);
  if (!lanes.length || !tick || parts.some((p) => !p.input || !p.run || !p.out || !$(".out__label", p.out))) { done(); return; }

  const fills = [];
  let tl = null;
  let io = null;

  // Land everything at once: the finished figure, nothing left in the air.
  const finish = () => {
    io?.disconnect();
    if (tl) { const t = tl; tl = null; t.kill(); }
    fills.forEach((f) => f.remove());
    fills.length = 0;
    gsap.set([...parts.flatMap((p) => [p.input, p.run]), tick], { clearProps: "all" });
    parts.forEach((p) => { p.lane.classList.remove("is-lit"); p.input.classList.remove("is-sent"); });
    done();
  };

  const play = () => {
    tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
    parts.forEach(({ lane, input, run, out }, k) => {
      const at = 0.15 + k * 0.18;
      // The finished outcome, laid over the outline and uncovered left to right.
      const fill = out.cloneNode(true);
      fill.classList.add("out__fill");
      fill.setAttribute("aria-hidden", "true");
      fill.querySelectorAll(".sr-only").forEach((e) => e.remove());
      out.append(fill);
      fills.push(fill);
      gsap.set(fill, { clipPath: "inset(0% 100% 0% 0%)" });

      // send: the tile lights and nudges toward the wire
      tl.call(() => input.classList.add("is-sent"), undefined, at)
        .to(input, { x: 6, duration: 0.14, ease: "power2.out", yoyo: true, repeat: 1 }, at)
        // the packet runs the whole wire, through the node
        .set(run, { visibility: "visible" }, at + 0.08)
        .fromTo(run, { xPercent: 0 }, { xPercent: 100, duration: 0.42, ease: "power1.inOut" }, at + 0.08)
        .call(() => lane.classList.add("is-lit"), undefined, at + 0.48)
        .set(run, { visibility: "hidden" }, at + 0.52)
        // the outcome fills
        .to(fill, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.34, ease: "power3.inOut" }, at + 0.46)
        // uncovered: drop the clip, so the tag that sits over the card's top edge is never cut
        .set(fill, { clipPath: "none" }, at + 0.8);

      // then its own detail builds, after the fill, so it is seen happening
      const build = at + 0.82;
      const tag = $(".out__tag", fill);
      if (tag) tl.fromTo(tag, { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.34, ease: "expo.out" }, build);
      const bars = $$(".glyph--bars rect", fill);
      if (bars.length) tl.fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: 0.42, stagger: 0.1, ease: "expo.out" }, build);
      const typed = $$(".out__type i", fill);
      if (typed.length) tl.fromTo(typed, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.24, stagger: 0.12, ease: "power2.out" }, build);
      const ring = $(".glyph--bell, .out--call .glyph", fill);
      if (ring) tl.to(ring, { keyframes: { rotation: [0, 16, -12, 8, 0] }, duration: 0.55, ease: "power1.inOut", transformOrigin: "50% 15%" }, build);
    });
    tl.fromTo(tick, { strokeDashoffset: 30 }, { strokeDashoffset: 0, duration: 0.36, ease: "power2.out" }, 0.15 + (parts.length - 1) * 0.18 + 1.2);
  };

  try {
    io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      try { play(); } catch (error) { finish(); console.error("LETS: hero run stopped", error); }
    }, { threshold: 0.4 });
    io.observe(sig);
  } catch (error) { finish(); console.error("LETS: hero did not start", error); return; }

  // Reduced motion switched on, or the layout changed width class mid-run: show the finished figure now.
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => { if (e.matches) finish(); });
  ["(min-width: 641px)", "(min-width: 1001px)"].forEach((q) => matchMedia(q).addEventListener("change", () => { if (tl) finish(); }));
}
