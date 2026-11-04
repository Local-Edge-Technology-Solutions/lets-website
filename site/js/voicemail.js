// Showpiece 2: a sample voicemail becomes a call-back list. A scripted illustration with made-up callers:
// no audio, no recording. Without script the first transcript and its row are already on the page.
// Each press runs one sample once; Next and Replay follow. Only completion is announced.
import { gsap, SplitText, calm, $, $$ } from "./env.js";

const SAMPLES = [
  {
    when: "Tue 7:12 a.m.", length: "0:21",
    html: "“Hi, this is <mark data-field=\"name\">Dana Reyes</mark> over in <mark data-field=\"town\">Smyrna</mark>. Our <mark data-field=\"problem\">heat went out</mark> last night and it’s about fifty degrees in here, so <mark data-field=\"urgency\">as soon as you can</mark>, please. Call me back at <mark data-field=\"phone\">615-555-0142</mark>. Thanks.”",
    row: { name: "Dana Reyes", phone: "(615) 555-0142", problem: "No heat", urgency: "Today", town: "Smyrna" },
  },
  {
    when: "Tue 7:40 a.m.", length: "0:17",
    html: "“Hey, it’s <mark data-field=\"name\">Keisha Moore</mark>. I need to <mark data-field=\"problem\">move my Thursday color appointment</mark>, any day <mark data-field=\"urgency\">next week</mark> works. I’m in <mark data-field=\"town\">Franklin</mark>. My number’s <mark data-field=\"phone\">629-555-0187</mark>. No rush.”",
    row: { name: "Keisha Moore", phone: "(629) 555-0187", problem: "Move Thursday appointment", urgency: "Next week", town: "Franklin" },
  },
  {
    when: "Tue 8:05 a.m.", length: "0:19",
    html: "“Good morning, <mark data-field=\"name\">Walt Pruitt</mark> from <mark data-field=\"town\">Lebanon</mark>. I got a <mark data-field=\"problem\">letter from the state about my sales tax</mark> and I don’t understand it. It’s <mark data-field=\"urgency\">due Friday</mark>. You can reach me at <mark data-field=\"phone\">615-555-0119</mark>.”",
    row: { name: "Walt Pruitt", phone: "(615) 555-0119", problem: "Sales tax letter", urgency: "By Friday", town: "Lebanon" },
  },
];
const FIELDS = ["name", "phone", "problem", "urgency", "town"];
const BARS = 48;

export function initVoicemail() {
  const root = $("[data-vm]");
  if (!root) return;
  const controls = $("[data-vm-controls]", root);
  const play = $("[data-vm-play]", root);
  const next = $("[data-vm-next]", root);
  const replay = $("[data-vm-replay]", root);
  const status = $("[data-vm-status]", root);
  const transcript = $("[data-vm-transcript]", root);
  const when = $("[data-vm-when]", root);
  const length = $("[data-vm-length]", root);
  const wave = $("[data-vm-wave]", root);
  const list = $("[data-vm-rows]", root);

  // The waveform: a fixed, voice-like envelope, drawn once.
  const shape = gsap.utils.random(0, 1, 0.01, true);
  for (let i = 0; i < BARS; i++) {
    const bar = document.createElement("i");
    const envelope = Math.sin((Math.PI * (i + 0.5)) / BARS) ** 0.6;
    bar.style.setProperty("--a", Math.round(22 + 70 * envelope * (0.45 + 0.55 * shape())));
    wave.append(bar);
  }
  const bars = $$("i", wave);

  let index = 0;
  let busy = false;
  let run = null;
  let split = null;
  let current = null; // { sample, i, row } while a run is in flight
  const children = new Set(); // row and flying-copy timelines started from the run
  const copies = new Set();
  const track = (t) => {
    children.add(t);
    const done = t.eventCallback("onComplete");
    t.eventCallback("onComplete", () => { children.delete(t); done?.(); });
    return t;
  };

  const rowFor = (sample, hidden) => {
    const li = document.createElement("li");
    li.className = "cb";
    li.dataset.sample = SAMPLES.indexOf(sample);
    FIELDS.forEach((f) => {
      const cell = document.createElement("span");
      cell.className = `cb__${f}`;
      cell.dataset.cell = f;
      cell.textContent = sample.row[f];
      if (hidden) cell.style.opacity = "0";
      li.append(cell);
    });
    return li;
  };
  const setBusy = (on) => {
    busy = on;
    [play, next, replay].forEach((b) => (on ? b.setAttribute("aria-disabled", "true") : b.removeAttribute("aria-disabled")));
  };
  const showNextControls = () => {
    const hadFocus = document.activeElement === play;
    play.hidden = true;
    next.hidden = false;
    replay.hidden = false;
    if (hadFocus) next.focus();
  };
  const announce = (sample, i) => {
    status.textContent = `Sample ${i + 1} of ${SAMPLES.length} finished: ${sample.row.name}, ${sample.row.problem}, ${sample.row.urgency}, added to the call-back list.`;
  };
  const prepare = (sample) => {
    when.textContent = sample.when;
    length.textContent = sample.length;
    transcript.innerHTML = sample.html;
  };
  const finish = (sample, i) => {
    run = null;
    split = null;
    transcript.classList.remove("is-typing");
    $$("mark", transcript).forEach((m) => m.classList.remove("is-plain"));
    wave.classList.remove("is-quiet");
    gsap.set(bars, { clearProps: "transform,backgroundColor" });
    setBusy(false);
    showNextControls();
    announce(sample, i);
  };

  const start = (i) => {
    if (busy) return;
    const sample = SAMPLES[i];
    index = i;
    status.textContent = "";
    // A fresh cycle starts an empty list; a replay takes its own row off first.
    if (i === 0) list.replaceChildren();
    $$(`[data-sample="${i}"]`, list).forEach((r) => r.remove());
    prepare(sample);

    if (calm()) {
      list.append(rowFor(sample, false));
      finish(sample, i);
      return;
    }
    setBusy(true);
    transcript.classList.add("is-typing");
    $$("mark", transcript).forEach((m) => m.classList.add("is-plain"));
    wave.classList.add("is-quiet");
    split = SplitText.create(transcript, { type: "words,chars", aria: "none" });
    const chars = split.chars;
    // About three seconds of typing, a little uneven, slower after a space and after punctuation.
    const beats = chars.map((c, k) => {
      const before = k ? chars[k - 1].textContent : "";
      return gsap.utils.random(0.6, 1.4) + (/[.,!?]/.test(before) ? 4 : /\s/.test(c.textContent) ? 0.6 : 0);
    });
    const total = beats.reduce((a, b) => a + b, 0);
    const at = [];
    beats.reduce((t, b, k) => ((at[k] = (t * 3) / total), t + b), 0);
    gsap.set(chars, { autoAlpha: 0 });

    const tl = gsap.timeline();
    run = tl;
    tl.to(chars, { autoAlpha: 1, duration: 0.01, ease: "none", stagger: (k) => at[k] }, 0);
    // The voice plays: bars light up left to right and twitch while it does.
    tl.to(bars, { backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--teal").trim(), duration: 0.05, ease: "none", stagger: 3 / BARS }, 0);
    tl.fromTo(bars, { scaleY: 1 }, { scaleY: () => gsap.utils.random(0.35, 1.25), duration: 0.14, ease: "sine.inOut", repeat: 19, yoyo: true, stagger: { each: 0.01, from: "random" } }, 0);
    tl.to(bars, { scaleY: 1, duration: 0.3, ease: "expo.out" }, 3.05);
    tl.call(() => { split.revert(); split = null; transcript.classList.remove("is-typing"); }, null, 3.1);

    // Each detail is picked out, then lifts off the text and flies into a new row on the list.
    const row = rowFor(sample, true);
    current = { sample, i, row };
    tl.call(() => {
      list.append(row);
      track(gsap.fromTo(row, { y: -16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: "expo.out", clearProps: "transform,opacity,visibility" }));
    }, null, 3.25);
    FIELDS.forEach((f, k) => {
      const t = 3.45 + k * 0.32;
      tl.call(() => {
        const mark = $(`mark[data-field="${f}"]`, transcript);
        const cell = $(`[data-cell="${f}"]`, row);
        if (!mark || !cell) return;
        mark.classList.remove("is-plain");
        fly(mark, cell);
      }, null, t);
    });
    tl.call(() => { current = null; finish(sample, i); }, null, 3.45 + FIELDS.length * 0.32 + 0.75);
  };

  // A copy of the marked words travels from the transcript to its cell, shrinking to the cell's size.
  const fly = (mark, cell) => {
    // A detail that wraps onto two lines flies from where it starts.
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
    track(gsap.timeline({ onComplete: () => { copy.remove(); copies.delete(copy); } }))
      .to(copy, { y: -14, duration: 0.16, ease: "power2.out" })
      .to(copy, { x: to.left - from.left, y: to.top - from.top, scale: s, duration: 0.55, ease: "power3.inOut" })
      .to(cell, { opacity: 1, duration: 0.2, ease: "none" }, "-=0.08")
      .to(copy, { autoAlpha: 0, duration: 0.15, ease: "none" }, "<");
  };

  const guard = (fn) => () => { if (!busy) fn(); };
  play.addEventListener("click", guard(() => start(0)));
  next.addEventListener("click", guard(() => start((index + 1) % SAMPLES.length)));
  replay.addEventListener("click", guard(() => start(index)));
  // The controls appear only now that they work.
  controls.hidden = false;
  root.dataset.vmReady = "";

  // If reduced motion switches on mid-run: stop the run and everything it started, clear what was in flight,
  // show the finished sample fully visible, and only then announce it.
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
    if (!e.matches || !run || !current) return;
    const { sample, i, row } = current;
    run.kill();
    children.forEach((t) => t.kill());
    children.clear();
    copies.forEach((c) => c.remove());
    copies.clear();
    split?.revert();
    split = null;
    prepare(sample);
    gsap.set(bars, { clearProps: "transform,backgroundColor" });
    if (!row.isConnected) list.append(row);
    gsap.set(row, { clearProps: "transform,opacity,visibility" });
    $$("[data-cell]", row).forEach((c) => gsap.set(c, { clearProps: "opacity" }));
    current = null;
    finish(sample, i);
  });
}
