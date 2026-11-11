// See one job happen: a sample voicemail becomes a line on the call-back list. A scripted illustration with an
// invented caller: no audio, no recording. The transcript and the finished row are in the HTML, so without script,
// or with reduced motion, the finished example is all there is, and the row stays finished until the run starts.
// With motion, once the example is properly on screen (about two seconds, once): each detail lights in the
// transcript, a copy of it slides out from under the voicemail's edge (below it on a phone, beside it on a wide
// screen) and lands in its slot on the row. The copies travel only outside the voicemail, clipped to that side, so
// they never cross the transcript's words; a slot waiting for its detail shows its shape, never an empty box.
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
    layer?.remove();
    layer = null;
    marks.forEach((m) => m.classList.remove("is-plain"));
    cells.forEach((c) => c.classList.remove("is-pending"));
    replay.removeAttribute("aria-disabled");
  };

  // Which side of the voicemail the list is on decides where the copies come out and what clips them.
  const geometry = () => {
    const s = stage.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const l = row.getBoundingClientRect();
    const below = l.top >= c.bottom - 1;
    return { s, c, below };
  };

  const fly = (k, g) => {
    const mark = marks[k];
    const cell = cells[k];
    const from = mark.getClientRects()[0] || mark.getBoundingClientRect();
    const to = cell.getBoundingClientRect();
    const ms = getComputedStyle(mark);
    const copy = document.createElement("span");
    copy.className = "vm-fly";
    copy.textContent = mark.textContent;
    Object.assign(copy.style, { fontSize: ms.fontSize, lineHeight: `${from.height}px`, letterSpacing: ms.letterSpacing });
    layer.append(copy);
    // A long phrase starts scaled to fit the voicemail's width, so it never runs off the page.
    const s0 = Math.min(1, (g.c.width - 8) / copy.offsetWidth);
    const w = copy.offsetWidth * s0;
    const h = copy.offsetHeight * s0;
    // Start tucked under the voicemail's edge, level with (or in line with) the word it came from.
    const x0 = g.below ? Math.max(g.c.left, Math.min(from.left, g.c.right - w)) - g.s.left : g.c.right - w - g.s.left;
    const y0 = g.below ? g.c.bottom - h - g.s.top : from.top - g.s.top;
    const s = Math.min(1, parseFloat(getComputedStyle(cell).fontSize) / parseFloat(ms.fontSize));
    gsap.set(copy, { x: x0, y: y0, scale: s0 });
    return gsap.timeline()
      .to(copy, g.below ? { y: y0 + h + 6, duration: 0.18, ease: "power2.out" } : { x: x0 + w + 6, duration: 0.18, ease: "power2.out" })
      .to(copy, { x: to.left - g.s.left, y: to.top - g.s.top, scale: s, duration: 0.45, ease: "power3.inOut" })
      .call(() => cell.classList.remove("is-pending"))
      .to(copy, { autoAlpha: 0, duration: 0.12, ease: "none" });
  };

  const play = (announce) => {
    land();
    const g = geometry();
    layer = document.createElement("div");
    layer.className = "vm-flight";
    layer.setAttribute("aria-hidden", "true");
    // Clip the copies to the list's side of the voicemail.
    layer.style.clipPath = g.below ? `inset(${Math.round(g.c.bottom - g.s.top)}px 0 0 0)` : `inset(0 0 0 ${Math.round(g.c.right - g.s.left)}px)`;
    stage.append(layer);
    marks.forEach((m) => m.classList.add("is-plain"));
    cells.forEach((c) => c.classList.add("is-pending"));
    replay.setAttribute("aria-disabled", "true");
    status.textContent = "";
    const tl = gsap.timeline({ onComplete: () => { land(); if (announce) status.textContent = "Example finished: Dana Reyes, change Friday’s order to 3 dozen, today, added to the call-back list."; } });
    run = tl;
    FIELDS.forEach((f, k) => {
      tl.call(() => marks[k].classList.remove("is-plain"), undefined, 0.2 + k * 0.3);
      tl.add(fly(k, g), 0.2 + k * 0.3);
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

  // Reduced motion switched on, or the layout changed width class mid-run: show the finished example now.
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => { if (e.matches) { io.disconnect(); land(); controls.hidden = true; } });
  ["(min-width: 641px)", "(min-width: 1001px)"].forEach((q) => matchMedia(q).addEventListener("change", () => { if (run) land(); }));
}
