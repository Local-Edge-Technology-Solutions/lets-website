// See one job happen: a sample voicemail becomes a line on the call-back list. A scripted illustration with an
// invented caller: no audio, no recording. The transcript and the finished row are in the HTML, so without script,
// or with reduced motion, the finished example is all there is, and the row stays finished until the run starts.
// With motion, once the example is properly on screen (about two seconds, once): each detail in turn lights and
// pulses in the transcript while its slot on the row fills in place: a teal chip the exact size of that slot wipes
// across it, then gives way to the written detail. Nothing travels between the two cards, so nothing ever crosses
// other words or leaves the cards; a slot waiting for its detail shows its shape, never an empty box.
// Replay runs it again; only a replay is announced. A missing part means no run at all (the finished example stays),
// and a failure mid-run lands the finished example.
import { gsap, calm, $ } from "./env.js";

const FIELDS = ["name", "phone", "need", "urgency", "town"];

export function initVoicemail() {
  const root = $("[data-vm]");
  if (!root || calm() || !("IntersectionObserver" in window)) return;
  const stage = $("[data-vm-stage]", root);
  const card = $(".vm-card", root);
  const controls = $("[data-vm-controls]", root);
  const replay = $("[data-vm-replay]", root);
  const status = $("[data-vm-status]", root);
  const transcript = $("[data-vm-transcript]", root);
  const row = $("[data-vm-rows] .cb", root);
  if (!stage || !card || !controls || !replay || !status || !transcript || !row) return;
  const marks = FIELDS.map((f) => $(`mark[data-field="${f}"]`, transcript));
  const cells = FIELDS.map((f) => $(`[data-cell="${f}"]`, row));
  if (marks.some((m) => !m) || cells.some((c) => !c)) return;

  let run = null;
  let layer = null;

  // Land everything at once: the finished example, nothing left in the air.
  const land = () => {
    if (run) { const t = run; run = null; t.kill(); }
    gsap.set(marks, { clearProps: "boxShadow" });
    layer?.remove();
    layer = null;
    marks.forEach((m) => m.classList.remove("is-plain"));
    cells.forEach((c) => c.classList.remove("is-pending"));
    replay.removeAttribute("aria-disabled");
  };

  // Each detail: its phrase pulses in the transcript, and its slot on the row fills where it stands (0.75 s).
  const fill = (k, s) => {
    const mark = marks[k];
    const cell = cells[k];
    const to = cell.getBoundingClientRect();
    const cs = getComputedStyle(cell);
    const chip = document.createElement("span");
    chip.className = "vm-fly";
    chip.dataset.field = FIELDS[k];
    chip.textContent = cell.textContent;
    Object.assign(chip.style, {
      left: `${to.left - s.left}px`, top: `${to.top - s.top}px`, width: `${to.width}px`, height: `${to.height}px`,
      font: cs.font, letterSpacing: cs.letterSpacing, padding: cs.padding, textAlign: cs.textAlign,
    });
    layer.append(chip);
    gsap.set(chip, { clipPath: "inset(0% 100% 0% 0%)" });
    return gsap.timeline()
      .fromTo(mark, { boxShadow: "0 0 0 0px rgba(46, 230, 207, 0.95)" }, { boxShadow: "0 0 0 10px rgba(46, 230, 207, 0)", duration: 0.55, ease: "power2.out", clearProps: "boxShadow" }, 0)
      .to(chip, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.35, ease: "power3.inOut" }, 0.25)
      .call(() => cell.classList.remove("is-pending"), undefined, 0.6)
      .to(chip, { autoAlpha: 0, duration: 0.15, ease: "none" }, 0.6);
  };

  const play = (announce) => {
    land();
    // the chips sit over their own slots: positions taken before any slot changes
    const s = stage.getBoundingClientRect();
    width = s.width;
    layer = document.createElement("div");
    layer.className = "vm-flight";
    layer.setAttribute("aria-hidden", "true");
    stage.append(layer);
    marks.forEach((m) => m.classList.add("is-plain"));
    cells.forEach((c) => c.classList.add("is-pending"));
    replay.setAttribute("aria-disabled", "true");
    status.textContent = "";
    const tl = gsap.timeline({ onComplete: () => { land(); if (announce) status.textContent = "Example finished: Dana Reyes, change Friday’s order to 3 dozen, today, added to the call-back list."; } });
    run = tl;
    FIELDS.forEach((f, k) => {
      tl.call(() => marks[k].classList.remove("is-plain"), undefined, 0.2 + k * 0.3);
      tl.add(fill(k, s), 0.2 + k * 0.3);
    });
    tl.to({}, { duration: 0.3 });
  };

  // Any failure mid-way lands the finished example instead of leaving it half done.
  const start = (announce) => {
    try { play(announce); } catch (error) { land(); console.error("LETS: voicemail run stopped", error); }
  };

  replay.addEventListener("click", () => { if (!run) start(true); });
  controls.hidden = false;

  // The row stays finished until the example is properly on screen, then fills once.
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    start(false);
  }, { threshold: 0.5 });
  io.observe(stage);

  // Reduced motion switched on mid-run: show the finished example now.
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => { if (e.matches) { io.disconnect(); land(); controls.hidden = true; } });
  // Any change in the stage's width mid-run (a resize, a rotation, a text-size change) lands it too: the fill chips
  // are measured once at the start, so they would no longer sit on their slots.
  let width = stage.getBoundingClientRect().width;
  if ("ResizeObserver" in window) new ResizeObserver(() => { const w = stage.getBoundingClientRect().width; if (run && Math.abs(w - width) > 0.5) land(); width = w; }).observe(stage);
  else ["(min-width: 641px)", "(min-width: 1001px)"].forEach((q) => matchMedia(q).addEventListener("change", () => { if (run) land(); }));
}
