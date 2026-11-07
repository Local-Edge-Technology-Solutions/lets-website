// See one job happen: a sample voicemail becomes a line on the call-back list. A scripted illustration with an
// invented caller: no audio, no recording. The transcript and the finished row are in the HTML, so without script,
// or with reduced motion, the finished example is all there is. With motion, the row starts empty and, once the
// example is on screen, each detail is picked out of the transcript and flies into its place on the row, once
// (about two seconds), then rests. Replay runs it again; only a replay is announced.
import { gsap, calm, $, $$ } from "./env.js";

const FIELDS = ["name", "phone", "need", "urgency", "town"];

export function initVoicemail() {
  const root = $("[data-vm]");
  if (!root || calm() || !("IntersectionObserver" in window)) return;
  const controls = $("[data-vm-controls]", root);
  const replay = $("[data-vm-replay]", root);
  const status = $("[data-vm-status]", root);
  const transcript = $("[data-vm-transcript]", root);
  const row = $("[data-vm-rows] .cb", root);
  if (!controls || !replay || !status || !transcript || !row) return;
  const marks = FIELDS.map((f) => $(`mark[data-field="${f}"]`, transcript));
  const cells = FIELDS.map((f) => $(`[data-cell="${f}"]`, row));
  if (marks.some((m) => !m) || cells.some((c) => !c)) return;

  let run = null;
  const flights = new Set();
  const copies = new Set();

  const arm = () => {
    marks.forEach((m) => m.classList.add("is-plain"));
    cells.forEach((c) => gsap.set(c, { opacity: 0 }));
  };
  // Land everything at once: the finished example, nothing left in the air.
  const land = () => {
    run?.kill();
    run = null;
    flights.forEach((t) => t.kill());
    flights.clear();
    copies.forEach((c) => c.remove());
    copies.clear();
    marks.forEach((m) => m.classList.remove("is-plain"));
    cells.forEach((c) => gsap.set(c, { clearProps: "opacity" }));
    replay.removeAttribute("aria-disabled");
  };

  // A copy of the marked words travels from the transcript to its cell, shrinking to the cell's size.
  const fly = (mark, cell) => {
    const from = mark.getClientRects()[0] || mark.getBoundingClientRect();
    const to = cell.getBoundingClientRect();
    const copy = document.createElement("span");
    copy.className = "vm-fly";
    copy.setAttribute("aria-hidden", "true");
    copy.textContent = mark.textContent;
    const ms = getComputedStyle(mark);
    Object.assign(copy.style, { fontSize: ms.fontSize, lineHeight: `${from.height}px`, letterSpacing: ms.letterSpacing, left: `${from.left}px`, top: `${from.top}px` });
    document.body.append(copy);
    copies.add(copy);
    const s = Math.min(1, parseFloat(getComputedStyle(cell).fontSize) / parseFloat(ms.fontSize));
    const t = gsap.timeline({ onComplete: () => { copy.remove(); copies.delete(copy); flights.delete(t); } })
      .to(copy, { y: -10, duration: 0.14, ease: "power2.out" })
      .to(copy, { x: to.left - from.left, y: to.top - from.top, scale: s, duration: 0.5, ease: "power3.inOut" })
      .to(cell, { opacity: 1, duration: 0.18, ease: "none" }, "-=0.08")
      .to(copy, { autoAlpha: 0, duration: 0.14, ease: "none" }, "<");
    flights.add(t);
  };

  const play = (announce) => {
    land();
    arm();
    replay.setAttribute("aria-disabled", "true");
    status.textContent = "";
    const tl = gsap.timeline();
    run = tl;
    FIELDS.forEach((f, k) => {
      tl.call(() => {
        marks[k].classList.remove("is-plain");
        fly(marks[k], cells[k]);
      }, null, 0.2 + k * 0.3);
    });
    tl.call(() => {
      land();
      if (announce) status.textContent = "Example finished: Dana Reyes, change Friday’s order to 3 dozen, today, added to the call-back list.";
    }, null, 0.2 + FIELDS.length * 0.3 + 0.8);
  };

  replay.addEventListener("click", () => { if (!run) play(true); });
  controls.hidden = false;

  // The row starts empty and fills once, the first time the example is properly on screen.
  arm();
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    play(false);
  }, { threshold: 0.5 });
  // Watch the list itself: the stage is display: contents on wide screens, and such a box never intersects.
  io.observe($(".vm-list", root) || root);

  // Reduced motion switched on, or the layout changed width class mid-run: show the finished example now.
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => { if (e.matches) { io.disconnect(); land(); controls.hidden = true; } });
  ["(max-width: 640px)", "(max-width: 1000px)"].forEach((q) => matchMedia(q).addEventListener("change", () => { if (run) land(); }));
}
