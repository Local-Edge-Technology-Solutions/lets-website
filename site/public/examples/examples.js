(() => {
// /examples/: one demo player. Nothing here makes a request or sends anything; every button changes this page only.
// Without script, or if this file fails before the end, all three examples show one after another, finished (the
// player only hides the others once .is-ready is set, at the very end of a clean start).
// A plain script served as it is (no GSAP, no module chunk shared with the front page), so the front page's files
// are unchanged by it. It loads in the head, without defer, only so it can name the chosen tab before the first
// paint; everything else waits for the page to be read (start(), at the end). Motion: Web Animations. One cause-and-effect movement per example, and it is
// the payoff: details carried from the email fill the quote's lines; the reminder itself travels into Jordan's
// phone; an approved reply becomes the message in the thread. Nothing ever approves on its own.

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const LOOKS = ["is-done", "is-chosen", "is-off"];
// A button is ready (no aria-disabled) or stepped back (aria-disabled, still focusable, so focus never jumps).
const off = (b, look, words) => {
  b.setAttribute("aria-disabled", "true");
  b.classList.remove(...LOOKS);
  if (look) b.classList.add(look);
  if (words) b.textContent = words;
};
const on = (b, words) => {
  b.removeAttribute("aria-disabled");
  b.classList.remove(...LOOKS);
  if (words) b.textContent = words;
};
const isOff = (b) => b.getAttribute("aria-disabled") === "true";

/* ---------- motion: helpers, and settling everything at once ---------- */
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const motionOK = () => !reduce.matches && "animate" in Element.prototype;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const running = new Set();
const copies = new Set();
const veiled = new Set();
const timers = new Set();
const track = (a) => { if (a) { running.add(a); a.finished.then(() => running.delete(a), () => running.delete(a)); } return a; };
const anim = (el, frames, opts) => (el && motionOK() ? track(el.animate(frames, { easing: EASE, fill: "backwards", ...opts })) : null);
const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };
// A part waiting for its moment is hidden (still in the layout, so nothing moves); settle() always shows it again.
const veil = (el) => { if (el) { el.style.opacity = "0"; veiled.add(el); } };
const unveil = (el) => { if (el) { el.style.opacity = ""; veiled.delete(el); } };
// Each settle starts a new generation; a flight from an earlier one lands silently (its onLand never runs late).
let gen = 0;
// Land everything: every running animation jumps to its end, every flying copy goes, every hidden part shows.
function settle() {
  gen += 1;
  timers.forEach(clearTimeout);
  timers.clear();
  running.forEach((a) => { try { a.finish(); } catch { a.cancel(); } });
  running.clear();
  copies.forEach((c) => c.remove());
  copies.clear();
  veiled.forEach((el) => { el.style.opacity = ""; });
  veiled.clear();
}
// A copy flies from one place to another and lands at full size. A "chip" is a short labelled detail; a "bubble" is a
// message at its own width. Copies sit in page coordinates (scrolling carries them) and are kept inside the screen.
function fly(fromEl, toEl, { delay = 0, text, kind = "chip", onLand } = {}) {
  const from = fromEl.getClientRects()[0] || fromEl.getBoundingClientRect();
  const to = toEl.getBoundingClientRect();
  if (!from.width || !to.width) { onLand?.(); return; }
  const copy = document.createElement("span");
  copy.className = `ex-fly ex-fly--${kind}`;
  copy.setAttribute("aria-hidden", "true");
  copy.textContent = text ?? fromEl.textContent;
  if (kind === "bubble") copy.style.width = `${Math.min(from.width, to.width)}px`;
  document.body.append(copy);
  const w = copy.offsetWidth;
  const left = Math.max(8, Math.min(from.left, innerWidth - w - 8));
  const toLeft = Math.max(8, Math.min(to.left, innerWidth - w - 8));
  Object.assign(copy.style, { left: `${left + scrollX}px`, top: `${from.top + scrollY}px` });
  copies.add(copy);
  const dx = toLeft - left;
  const dy = to.top - from.top;
  const a = track(copy.animate([
    { transform: "translate(0, 0) scale(0.9)", opacity: 0 },
    { transform: "translate(0, -8px) scale(1.04)", opacity: 1, offset: 0.2 },
    { transform: `translate(${dx}px, ${dy}px) scale(1)`, opacity: 1, offset: 0.88 },
    { transform: `translate(${dx}px, ${dy}px) scale(1)`, opacity: 0 },
  ], { duration: kind === "bubble" ? 820 : 760, delay, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "both" }));
  const g = gen;
  const done = () => { copy.remove(); copies.delete(copy); };
  a.finished.then(() => { done(); if (g === gen) onLand?.(); }, done);
}
const flash = (el) => anim(el, [{ backgroundColor: "rgb(46 230 207 / 0.6)" }, { backgroundColor: "rgb(46 230 207 / 0)" }], { duration: 800, easing: "ease-out", fill: "none" });
const pop = (el, delay = 0) => anim(el, [{ transform: "scale(0.86)", opacity: 0 }, { transform: "scale(1.03)", opacity: 1, offset: 0.7 }, { transform: "none", opacity: 1 }], { duration: 380, delay });
const pulse = (el) => anim(el, [{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }], { duration: 320, fill: "none" });
const arrive = (el) => anim(el, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 340 });

// Each example's opening plays once, the first time its moving part is properly on screen while it is shown.
function whenSeen(el, run) {
  if (!el || !("IntersectionObserver" in window)) { run(false); return () => {}; }
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    run(true);
  }, { threshold: 0.5 });
  io.observe(el);
  return () => io.disconnect();
}
const inView = (el, part = 0.6) => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight * part; };

/* ---------- 1. replies drafted ---------- */
function initReplies() {
  const root = $("[data-replies]");
  if (!root) return null;
  const tabs = $$("[data-reply-tab]", root);
  const panels = $$("[data-reply-panel]", root);
  const buttons = $$("[data-reply-approve]", root);
  const status = $("[data-reply-status]", root);
  const count = $("[data-reply-count]", root);
  if (tabs.length !== 3 || panels.length !== 3 || buttons.length !== 3 || !status || !count) return null;
  const approved = new Set();
  let opened = false;

  const select = (n) => {
    tabs.forEach((t) => {
      const here = t.dataset.replyTab === n;
      t.classList.toggle("is-on", here);
      if (here) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current");
    });
    panels.forEach((p) => { p.hidden = p.dataset.replyPanel !== n; });
  };
  // The opening: the facts the drafted reply used light up, one after another.
  const light = () => {
    root.classList.add("is-lit");
    const panel = panels.find((p) => !p.hidden);
    // The office information the reply used flies up into the sentence, and each fact lights as it lands.
    const src = $(".draft__src b", panel);
    $$(".draft mark", panel).forEach((m, k) => {
      if (src) fly(src, m, { delay: 200 + k * 420, text: src.textContent });
      anim(m, [{ backgroundColor: "rgb(46 230 207 / 0)" }, { backgroundColor: "rgb(46 230 207 / 1)" }], { duration: 220, delay: 200 + k * 420 + 640, easing: "linear" });
    });
  };
  const open = () => {
    if (opened) return;
    opened = true;
    if (motionOK()) light(); else root.classList.add("is-lit");
  };

  tabs.forEach((t) => t.addEventListener("click", (e) => {
    e.preventDefault();
    settle();
    root.classList.add("is-lit");
    opened = true;
    select(t.dataset.replyTab);
  }));

  buttons.forEach((b) => b.addEventListener("click", () => {
    if (isOff(b)) return;
    settle();
    const panel = b.closest("[data-reply-panel]");
    const n = panel.dataset.replyPanel;
    const tab = tabs.find((t) => t.dataset.replyTab === n);
    const draft = $(".draft", panel);
    approved.add(n);
    // The approved draft becomes the reply in the thread, under the customer's question.
    draft.classList.add("is-approved");
    $("[data-draft-label]", panel).textContent = "Approved by you";
    const also = $("[data-reply-also]", panel);
    if (also) also.textContent = "Chris Ellis is on your call-back list: a cleaning, mornings.";
    $("[data-reply-state]", tab).textContent = "Approved";
    tab.classList.add("is-done");
    const left = 3 - approved.size;
    count.textContent = left ? `${left} waiting` : "All approved";
    off(b, "is-done", `Sent to ${$(".ib-row__name", tab).textContent.split(" ")[0]} in this example`);
    anim(draft, [{ transform: "translateX(-14px) scale(0.97)", opacity: 0.4 }, { transform: "none", opacity: 1 }], { duration: 420 });
    pulse($("[data-reply-state]", tab));
    const who = $(".ib-row__name", tab).textContent;
    status.textContent = also ? `Example reply to ${who} approved and sent, and ${who} is on your call-back list.` : `Example reply to ${who} approved and sent.`;
  }));

  select("1");
  buttons.forEach((b) => { b.hidden = false; });
  return { watch: () => $(".draft", panels.find((p) => !p.hidden)), open, settled: () => root.classList.add("is-lit") };
}

/* ---------- 2. quote drafted ---------- */
const ORDERS = [
  {
    from: "Priya Shah",
    subject: "Order for Saturday",
    body: ["Hi! Could we get ", [1, "3 dozen cupcakes"], ", half chocolate and half vanilla, and ", [2, "one 8‑inch birthday cake"], " with ", [3, "“Happy 40th, Mark” written on it"], ", for ", [4, "pickup this Saturday"], "? Thanks!"],
    when: [4, "Pickup Saturday"],
    lines: [[1, "Cupcakes, by the dozen", 3, 36, "Half chocolate, half vanilla"], [2, "8‑inch birthday cake", 1, 48], [3, "Writing on a cake", 1, 5, "“Happy 40th, Mark”"]],
  },
  {
    from: "Kevin Ortiz",
    subject: "Muffins for a meeting",
    body: ["Hello, our office has a meeting on Tuesday morning. Could you do ", [1, "2 dozen muffins"], " and ", [2, "a coffee cake"], ", ", [3, "delivered Tuesday at 8:30 a.m."], "? Thanks, Kevin"],
    when: [null, "Delivery Tuesday, 8:30 a.m."],
    lines: [[1, "Muffins, by the dozen", 2, 30], [2, "Coffee cake", 1, 28], [3, "Delivery", 1, 15, "Tuesday, 8:30 a.m."]],
  },
];
const money = (n) => `$${n.toFixed(2)}`;
const span = (cls, text) => { const s = document.createElement("span"); s.className = cls; s.textContent = text; return s; };
const short = (t) => (t.length > 24 ? `${t.slice(0, 22).trimEnd()}…` : t);

function initQuote() {
  const root = $("[data-quote]");
  if (!root) return null;
  const q = (k) => $(`[data-q="${k}"]`, root);
  const mail = $(".mail", root);
  const sheet = $(".sheet", root);
  const stamp = $("[data-quote-stamp]", root);
  const check = $("[data-quote-check]", root);
  const when = $(".sheet__when", root);
  const approve = $("[data-quote-approve]", root);
  const next = $("[data-quote-next]", root);
  const status = $("[data-quote-status]", root);
  if (!mail || !sheet || !stamp || !check || !when || !approve || !next || !status || !q("lines") || !q("body")) return null;
  let i = 0;
  let opened = false;

  const render = () => {
    const o = ORDERS[i];
    q("from").textContent = o.from;
    q("subject").textContent = o.subject;
    q("body").replaceChildren(...o.body.map((part) => {
      if (typeof part === "string") return document.createTextNode(part);
      const m = document.createElement("mark");
      m.dataset.n = String(part[0]);
      m.textContent = part[1];
      return m;
    }));
    q("for").textContent = o.from;
    q("when").textContent = o.when[1];
    const badge = $(".num", when);
    if (o.when[0]) { when.dataset.t = String(o.when[0]); badge.textContent = String(o.when[0]); badge.hidden = false; } else { delete when.dataset.t; badge.hidden = true; }
    let total = 0;
    q("lines").replaceChildren(...o.lines.map(([n, name, qty, price, note]) => {
      const li = document.createElement("li");
      li.className = "line";
      li.dataset.t = String(n);
      const num = span("num", String(n));
      num.setAttribute("aria-hidden", "true");
      const nm = span("line__name", name);
      if (note) nm.append(span("line__sub", note));
      nm.append(span("line__qty", `${qty} × ${money(price)}`));
      total += qty * price;
      li.append(num, nm, span("line__amt", money(qty * price)));
      return li;
    }));
    q("total").textContent = money(total);
    sheet.classList.remove("is-approved");
    stamp.textContent = "Draft";
    check.textContent = "You check it, then send.";
    on(approve, "Approve and send");
    return total;
  };
  // The opening: the quote's lines start empty; each marked detail lifts out of the email and, as it lands, fills
  // its numbered line. The total arrives last.
  const carry = () => {
    const total = $(".sheet__total", sheet);
    const marks = $$("mark[data-n]", q("body"));
    const targets = marks.map((m) => $(`[data-t="${m.dataset.n}"]`, sheet)).filter(Boolean);
    targets.forEach(veil);
    veil(total);
    marks.forEach((m, k) => {
      const target = $(`[data-t="${m.dataset.n}"]`, sheet);
      if (!target) return;
      fly(m, target, { delay: k * 420, text: `${m.dataset.n}  ${short(m.textContent)}`, onLand: () => { unveil(target); arrive(target); flash(target); } });
    });
    later(() => { unveil(total); pop(total); }, marks.length * 420 + 820);
  };
  const open = () => {
    if (opened) return;
    opened = true;
    if (motionOK()) carry();
  };

  approve.addEventListener("click", () => {
    if (isOff(approve)) return;
    settle();
    sheet.classList.add("is-approved");
    stamp.textContent = "Sent";
    check.textContent = `Approved by you, sent to ${ORDERS[i].from.split(" ")[0]} in this example.`;
    off(approve, "is-done", "Sent in this example");
    anim(stamp, [{ transform: "scale(1.9) rotate(-8deg)", opacity: 0 }, { transform: "scale(0.94) rotate(0)", opacity: 1, offset: 0.75 }, { transform: "none", opacity: 1 }], { duration: 420 });
    status.textContent = `Example quote approved and sent to ${ORDERS[i].from}.`;
  });

  next.addEventListener("click", () => {
    settle();
    i = (i + 1) % ORDERS.length;
    const total = render();
    status.textContent = `Order ${i + 1} of ${ORDERS.length}, from ${ORDERS[i].from}: quote drafted, ${money(total)}.`;
    // Bring the new email into view first, so the details are seen leaving it.
    const needs = !inView(mail);
    if (needs) mail.scrollIntoView({ block: "start", behavior: motionOK() ? "smooth" : "auto" });
    if (motionOK()) {
      if (needs) { $$(".line, .sheet__total", sheet).forEach(veil); later(carry, 480); } else carry();
    }
  });

  render();
  approve.hidden = false;
  next.hidden = false;
  return { watch: () => $(".lines", sheet), open, settled: () => { opened = true; } };
}

/* ---------- 3. reminders ready ---------- */
function initReminders() {
  const root = $("[data-reminders]");
  if (!root) return null;
  const day = $(".day", root);
  const send = $("[data-rem-send]", root);
  const status = $("[data-rem-status]", root);
  const state = $("[data-appt-state]", root);
  const label = $("[data-appt-label]", root);
  const text = $(".appt__text", root);
  const thread = $("[data-rem-thread]", root);
  const replies = $("[data-rem-replies]", root);
  const stampEl = $("[data-rem-stamp]", root);
  const out = $("[data-rem-out]", root);
  const reply = $("[data-rem-reply]", root);
  const answers = $$("[data-rem-answer]", root);
  const outcome = $("[data-rem-outcome]", root);
  if (!outcome || !day || !send || !status || !state || !label || !text || !thread || !replies || !stampEl || !out || !reply || answers.length !== 2) return null;
  let step = "drafted";

  const setState = (words, cls) => {
    state.textContent = words;
    state.className = `appt__state${cls ? ` ${cls}` : ""}`;
  };
  const arm = () => {
    step = "drafted";
    day.classList.remove("is-sent");
    setState("Reminder drafted", "is-drafted");
    label.textContent = "Reminder drafted for you";
    [stampEl, out, reply].forEach((el) => el.remove());
    replies.hidden = true;
    outcome.hidden = true;
    answers.forEach((b) => on(b));
    on(send, "Approve and send");
    send.classList.remove("ex-btn--quiet");
  };

  send.addEventListener("click", () => {
    if (isOff(send)) return;
    settle();
    if (step === "answered") {
      arm();
      status.textContent = "Example started again: tomorrow’s reminder is drafted.";
      return;
    }
    step = "sent";
    const from = text.getBoundingClientRect();
    thread.append(stampEl, out);
    // The owner's card folds to a single line, so Jordan's phone and the reply buttons come up the screen.
    day.classList.add("is-sent");
    setState("Sent", "is-sent");
    label.textContent = "Sent to Jordan in this example";
    off(send, "is-done", "Sent");
    replies.hidden = false;
    status.textContent = "Example reminder shown on Jordan’s phone. Now reply as Jordan.";
    if (motionOK() && from.width) {
      // The reminder itself travels from the bookings card into Jordan's phone.
      const ghost = document.createElement("div");
      Object.assign(ghost.style, { position: "absolute", left: `${from.left + scrollX}px`, top: `${from.top + scrollY}px`, width: `${from.width}px`, height: `${from.height}px`, pointerEvents: "none" });
      ghost.setAttribute("aria-hidden", "true");
      document.body.append(ghost);
      copies.add(ghost);
      veil(out);
      veil(replies);
      fly(ghost, out, { kind: "bubble", text: text.textContent, onLand: () => { unveil(out); pop(out); later(() => { unveil(replies); arrive(replies); }, 160); } });
      ghost.remove();
      copies.delete(ghost);
    }
  });

  answers.forEach((b) => b.addEventListener("click", () => {
    if (isOff(b) || step !== "sent") return;
    settle();
    step = "answered";
    const yes = b.dataset.remAnswer === "yes";
    reply.textContent = yes ? "YES" : "NEW";
    thread.append(reply);
    answers.forEach((a) => off(a, a === b ? "is-chosen" : "is-off"));
    if (yes) {
      setState("Confirmed");
      status.textContent = "Jordan replied YES. Biscuit’s 9:00 a.m. groom is confirmed on your list.";
    } else {
      setState("Call back to rebook", "is-callback");
      status.textContent = "Jordan asked for another time. Jordan is on your list to call back and rebook.";
    }
    // The business result, on the owner's side, right under Jordan's phone.
    $("b", outcome).textContent = yes ? "Biscuit, confirmed" : "Biscuit, call back to rebook";
    outcome.classList.toggle("is-callback", !yes);
    outcome.hidden = false;
    if (outcome.getBoundingClientRect().bottom > innerHeight) outcome.scrollIntoView({ block: "nearest", behavior: motionOK() ? "smooth" : "auto" });
    pop(outcome, 120);
    on(send, "Start again");
    send.classList.add("ex-btn--quiet");
    pop(reply);
    anim(state, [{ transform: "scale(1.25)", backgroundColor: "#ffffff" }, { transform: "none" }], { duration: 460 });
  }));

  arm();
  send.hidden = false;
  return { watch: () => $(".appt", root), open: () => pulse(state), settled: () => {} };
}

/* ---------- the player: choose an example, Next, the address bar, Back and Forward ---------- */
function initPlayer(parts) {
  const player = $("[data-player]");
  const picks = $$("[data-pick]", player);
  const demos = $$("[data-demo]", player);
  const next = $("[data-next]", player);
  if (!player || picks.length !== 3 || demos.length !== 3 || !next) return;
  const ORDER = demos.map((d) => d.dataset.demo);
  const NAME = Object.fromEntries(picks.map((p) => [p.dataset.pick, $(".pick__name", p).textContent]));
  // Every Let's talk on the page carries the example being shown to the form (the front page reads ?topic=).
  const talks = $$("[data-talk]");
  let current = null;
  let stopWatching = () => {};

  const show = (name, { animate = true } = {}) => {
    if (!ORDER.includes(name) || name === current) return;
    settle();
    stopWatching();
    // Back or Forward while focus is inside the example being hidden: focus moves to the new example's chooser link.
    const outgoing = demos.find((d) => d.dataset.demo === current);
    if (outgoing?.contains(document.activeElement)) picks.find((p) => p.dataset.pick === name)?.focus({ preventScroll: true });
    current = name;
    picks.forEach((p) => {
      const here = p.dataset.pick === name;
      p.classList.toggle("is-on", here);
      if (here) p.setAttribute("aria-current", "true"); else p.removeAttribute("aria-current");
    });
    demos.forEach((d) => d.classList.toggle("is-on", d.dataset.demo === name));
    talks.forEach((a) => a.setAttribute("href", `/?topic=${name}#contact`));
    const after = ORDER[(ORDER.indexOf(name) + 1) % ORDER.length];
    next.textContent = `Next: ${NAME[after]}`;
    next.dataset.go = after;
    const demo = demos.find((d) => d.dataset.demo === name);
    // A short slide, never a fade: a fade shows the white interface through the black as a grey wash.
    if (animate) anim(demo, [{ transform: "translateX(18px)" }, { transform: "none" }], { duration: 260 });
    const part = parts[name];
    if (part) stopWatching = whenSeen(part.watch(), (seen) => { if (seen) part.open(); else part.settled(); });
  };
  const fromHash = () => { const h = location.hash.slice(1); return ORDER.includes(h) ? h : null; };

  picks.forEach((p) => p.addEventListener("click", (e) => {
    e.preventDefault();
    if (p.dataset.pick !== current) history.pushState(null, "", `#${p.dataset.pick}`);
    show(p.dataset.pick);
  }));
  next.addEventListener("click", () => {
    const go = next.dataset.go;
    history.pushState(null, "", `#${go}`);
    show(go);
    if (!inView(player.querySelector(".stage"), 0.9)) player.scrollIntoView({ block: "start", behavior: motionOK() ? "smooth" : "auto" });
  });
  addEventListener("popstate", () => show(fromHash() || ORDER[0]));
  addEventListener("hashchange", () => { const h = fromHash(); if (h) show(h); });

  // Settle whatever is moving when the width changes or motion is turned off. (Flying copies sit in page
  // coordinates, so scrolling never strands one.)
  let width = innerWidth;
  addEventListener("resize", () => { if (innerWidth !== width) { width = innerWidth; settle(); } }, { passive: true });
  reduce.addEventListener?.("change", () => { if (reduce.matches) settle(); });

  const first = fromHash();
  show(first || ORDER[0], { animate: false });
  next.hidden = false;
  player.classList.add("is-ready");
  // Arriving on #quote or #reminders: land on the player, so the chooser is in view above the example.
  if (first) requestAnimationFrame(() => player.scrollIntoView({ block: "start" }));
  return true;
}

const safely = (name, fn) => {
  try { return fn(); } catch (error) { console.error(`LETS examples: ${name} did not start`, error); return null; }
};
function start() {
  // Untouched copies of the three examples as written (their finished states), put back if anything fails to start.
  const roots = $$("[data-replies], [data-quote], [data-reminders]");
  const originals = roots.map((r) => r.cloneNode(true));
  const parts = {
    replies: safely("replies", initReplies),
    quote: safely("quote", initQuote),
    reminders: safely("reminders", initReminders),
  };
  // Only if all three and the player start does the player take over; otherwise the three examples go back to
  // exactly what the page says without script, one after another, finished.
  const started = parts.replies && parts.quote && parts.reminders && safely("player", () => initPlayer(parts));
  if (!started) {
    settle();
    const player = $("[data-player]");
    player?.classList.remove("is-ready");
    // All three show, so no tab is chosen, and every Let's talk goes back to the plain form link.
    player?.classList.add("is-fallback");
    delete document.documentElement.dataset.exPick;
    $$("[data-talk]").forEach((a) => a.setAttribute("href", "/#contact"));
    roots.forEach((r, k) => r.replaceWith(originals[k]));
    $("[data-replies]")?.classList.add("is-lit");
  }
}

// First paint: this file runs in the head, before the page body exists, and names the example the player will open
// (the address's #replies, #quote or #reminders, otherwise Replies, as show() decides), so the stylesheet can show
// that tab chosen from the very first frame, never grey and then filling in. The player itself starts once the page
// is read.
const firstPick = location.hash.slice(1);
document.documentElement.dataset.exPick = ["replies", "quote", "reminders"].includes(firstPick) ? firstPick : "replies";
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
else start();
})();
