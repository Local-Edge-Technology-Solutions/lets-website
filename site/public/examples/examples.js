(() => {
// /examples/: three scripted examples. Nothing here makes a request or sends anything; every button changes this
// page only. Without script the finished examples are in the HTML and the buttons stay hidden. This file keeps to
// itself: a plain deferred script served as it is (no GSAP, no module chunk shared with the front page), so the
// front page's files are unchanged by it.

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
// A button is either ready (no aria-disabled) or done/stepped back (aria-disabled, still focusable, so focus
// never jumps). `look` names how a stepped-back button reads: done (with a tick), chosen, or off.
const LOOKS = ["is-done", "is-chosen", "is-off"];
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

/* ---------- 1. replies drafted ---------- */
function initReplies() {
  const root = $("[data-replies]");
  if (!root) return;
  const tabs = $$("[data-reply-tab]", root);
  const panels = $$("[data-reply-panel]", root);
  const approve = $("[data-reply-approve]", root);
  const status = $("[data-reply-status]", root);
  const count = $("[data-reply-count]", root);
  if (!tabs.length || tabs.length !== panels.length || !approve || !status || !count) return;
  const approved = new Set();
  let current = "1";

  const select = (n) => {
    current = n;
    tabs.forEach((t) => {
      const here = t.dataset.replyTab === n;
      t.classList.toggle("is-on", here);
      if (here) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current");
    });
    panels.forEach((p) => { p.hidden = p.dataset.replyPanel !== n; });
    if (approved.has(n)) off(approve, "is-done", "Reply approved"); else on(approve, "Approve the example reply");
    status.textContent = "";
  };

  tabs.forEach((t) => t.addEventListener("click", (e) => {
    e.preventDefault();
    select(t.dataset.replyTab);
  }));

  approve.addEventListener("click", () => {
    if (isOff(approve)) return;
    const n = current;
    approved.add(n);
    const panel = panels.find((p) => p.dataset.replyPanel === n);
    const tab = tabs.find((t) => t.dataset.replyTab === n);
    $(".draft", panel).classList.add("is-approved");
    $(".draft__label", panel).textContent = "Reply approved";
    const also = $("[data-reply-also]", panel);
    if (also) also.textContent = "Added to your call-back list: Jordan Ellis, a cleaning, mornings.";
    $("[data-reply-state]", tab).textContent = "Approved";
    tab.classList.add("is-done");
    const left = tabs.length - approved.size;
    count.textContent = left ? `${left} waiting` : "All approved";
    off(approve, "is-done", "Reply approved");
    const who = $(".ib__name", tab).textContent;
    status.textContent = also
      ? `Example reply to ${who} approved, and ${who} is on your call-back list. Nothing was sent.`
      : `Example reply to ${who} approved. Nothing was sent.`;
  });

  select("1");
  approve.hidden = false;
}

/* ---------- 2. quote drafted ---------- */
const ORDERS = [
  {
    from: "Priya Shah",
    subject: "Order for Saturday",
    body: ["Hi! Could we get ", ["3 dozen cupcakes"], ", half chocolate and half vanilla, and ", ["one 8‑inch birthday cake"], " with ", ["“Happy 40th, Mark” written on it"], ", for ", ["pickup this Saturday"], "? Thanks!"],
    when: "Pickup Saturday",
    lines: [["Cupcakes, by the dozen", 3, 36, "Half chocolate, half vanilla"], ["8‑inch celebration cake", 1, 48], ["Writing on a cake", 1, 5, "“Happy 40th, Mark”"]],
  },
  {
    from: "Kevin Ortiz",
    subject: "Muffins for a meeting",
    body: ["Hello, our office has a meeting on Tuesday morning. Could you do ", ["2 dozen muffins"], " and ", ["a coffee cake"], ", ", ["delivered Tuesday at 8:30 a.m."], "? Thanks, Kevin"],
    when: "Delivery Tuesday, 8:30 a.m.",
    lines: [["Muffins, by the dozen", 2, 30], ["Coffee cake", 1, 28], ["Delivery", 1, 15, "Tuesday, 8:30 a.m."]],
  },
];
const money = (n) => `$${n.toFixed(2)}`;
const DRAFT_CHECK = "Draft. You check it, then send.";

function initQuote() {
  const root = $("[data-quote]");
  if (!root) return;
  const q = (k) => $(`[data-q="${k}"]`, root);
  const sheet = $(".sheet", root);
  const stamp = $(".sheet__stamp", root);
  const check = $("[data-quote-check]", root);
  const approve = $("[data-quote-approve]", root);
  const next = $("[data-quote-next]", root);
  const status = $("[data-quote-status]", root);
  if (!sheet || !stamp || !check || !approve || !next || !status || !q("lines")) return;
  let i = 0;

  const render = () => {
    const o = ORDERS[i];
    q("from").textContent = o.from;
    q("subject").textContent = o.subject;
    q("body").replaceChildren(...o.body.map((part) => {
      if (typeof part === "string") return document.createTextNode(part);
      const m = document.createElement("mark");
      m.textContent = part[0];
      return m;
    }));
    q("for").textContent = o.from;
    q("when").textContent = o.when;
    let total = 0;
    q("lines").replaceChildren(...o.lines.map(([name, qty, price, note]) => {
      const tr = document.createElement("tr");
      const amount = qty * price;
      total += amount;
      const first = document.createElement("td");
      first.append(name);
      if (note) {
        const sub = document.createElement("span");
        sub.className = "sheet__sub";
        sub.textContent = note;
        first.append(sub);
      }
      tr.append(first);
      [String(qty), money(price), money(amount)].forEach((v) => {
        const td = document.createElement("td");
        td.className = "r";
        td.textContent = v;
        tr.append(td);
      });
      return tr;
    }));
    q("total").textContent = money(total);
    sheet.classList.remove("is-approved");
    stamp.textContent = "Draft";
    check.textContent = DRAFT_CHECK;
    on(approve, "Approve the example quote");
    return total;
  };

  approve.addEventListener("click", () => {
    if (isOff(approve)) return;
    sheet.classList.add("is-approved");
    stamp.textContent = "Approved";
    check.textContent = "Ready to send.";
    off(approve, "is-done", "Quote approved");
    status.textContent = "Example quote approved. Nothing is sent.";
  });

  next.addEventListener("click", () => {
    i = (i + 1) % ORDERS.length;
    const total = render();
    if (motionOK()) playQuote(root);
    status.textContent = `Order ${i + 1} of ${ORDERS.length}, from ${ORDERS[i].from}: quote drafted, ${money(total)}.`;
  });

  render();
  approve.hidden = false;
  next.hidden = false;
}

/* ---------- 3. reminders ready ---------- */
function initReminders() {
  const root = $("[data-reminders]");
  if (!root) return;
  const send = $("[data-rem-send]", root);
  const status = $("[data-rem-status]", root);
  const state = $("[data-appt-state]", root);
  const label = $("[data-appt-label]", root);
  const thread = $("[data-rem-thread]", root);
  const replies = $("[data-rem-replies]", root);
  const result = $("[data-rem-result]", root);
  const out = $("[data-rem-out]", root);
  const reply = $("[data-rem-reply]", root);
  const stampEl = $(".sms__stamp", thread || root);
  const answers = $$("[data-rem-answer]", root);
  if (!send || !status || !state || !label || !thread || !replies || !result || !out || !reply || !stampEl || answers.length !== 2) return;
  const wait = document.createElement("p");
  wait.className = "sms__wait";
  wait.textContent = "The reminder shows here once you send it.";
  let step = "drafted";

  const setState = (words, cls) => {
    state.textContent = words;
    state.className = `appt__state${cls ? ` ${cls}` : ""}`;
  };

  const arm = () => {
    step = "drafted";
    setState("Reminder drafted", "is-drafted");
    label.textContent = "Reminder drafted for you";
    thread.replaceChildren(wait);
    replies.hidden = true;
    result.hidden = true;
    answers.forEach((b) => on(b));
    on(send, "Approve and send the example");
  };

  send.addEventListener("click", () => {
    if (isOff(send)) return;
    if (step === "answered") {
      arm();
      status.textContent = "Example started again: tomorrow’s reminder is drafted.";
      return;
    }
    step = "sent";
    thread.replaceChildren(stampEl, out);
    setState("Sent", "is-sent");
    label.textContent = "Reminder sent";
    off(send, "is-done", "Reminder sent");
    replies.hidden = false;
    status.textContent = "Example reminder shown on Jordan’s phone. Nothing was sent. Now reply as the customer.";
  });

  answers.forEach((b) => b.addEventListener("click", () => {
    if (isOff(b) || step !== "sent") return;
    step = "answered";
    const yes = b.dataset.remAnswer === "yes";
    reply.textContent = yes ? "YES" : "NEW";
    thread.append(reply);
    answers.forEach((a) => off(a, a === b ? "is-chosen" : "is-off"));
    if (yes) {
      setState("Confirmed");
      result.textContent = "On your list: Confirmed";
      status.textContent = "Jordan replied YES. Biscuit’s 9:00 a.m. groom is confirmed on your list.";
    } else {
      setState("Call back to rebook", "is-callback");
      result.textContent = "On your list: Call back to rebook";
      status.textContent = "Jordan asked for another time. Jordan is on your list to call back and rebook.";
    }
    result.hidden = false;
    on(send, "Start the example again");
  }));

  arm();
  send.hidden = false;
}

/* ---------- the one opening per example ----------
   Each example plays its opening once, when it scrolls into view, then waits for the visitor. Only an example that
   starts below the screen is armed (hidden parts), so nothing on screen at load ever blinks out; an example already
   in view at load simply shows finished. Reduced motion, or no Web Animations: the finished example, no motion. The
   parts animate in from hidden with fill "backwards" in the same task the armed class comes off, so there is no
   frame between the two. */
const motionOK = () => matchMedia("(prefers-reduced-motion: no-preference)").matches && "animate" in Element.prototype;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const rise = (el, delay) => el && el.animate(
  [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }],
  { duration: 420, delay, easing: EASE, fill: "backwards" },
);
// A highlight switches on: the marked words go from the text's own colour on no ground to black on teal.
const light = (mark, delay) => {
  const teal = getComputedStyle(document.documentElement).getPropertyValue("--teal").trim() || "#2ee6cf";
  const ink = getComputedStyle(mark.parentElement).color;
  return mark.animate(
    [{ backgroundColor: "transparent", color: ink }, { backgroundColor: teal, color: "#0a0a0a" }],
    { duration: 180, delay, easing: "linear", fill: "backwards" },
  );
};

// `watch` is the first part that moves: the example arms only if that part starts below the screen (so nothing in
// view blinks out), and plays once that part is half on screen (so the opening is seen, not run off screen).
function onceInView(target, watch, play) {
  if (!target || !watch || !motionOK() || !("IntersectionObserver" in window)) return;
  const r = watch.getBoundingClientRect();
  if (r.top < innerHeight && r.bottom > 0) return;
  target.classList.add("is-armed");
  // Any press inside the example before its opening plays (choosing another message, say) cancels the opening and
  // shows everything at once, so nothing the visitor chose can stay hidden.
  const cancel = () => {
    io.disconnect();
    target.removeEventListener("click", cancel, true);
    target.classList.remove("is-armed");
  };
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    cancel();
    if (motionOK()) play();
  }, { threshold: 0.5 });
  target.addEventListener("click", cancel, true);
  io.observe(watch);
}

// Replies: the drafted reply rises in under the question, then the facts it used light up.
function playReplies(root) {
  const panel = $$("[data-reply-panel]", root).find((p) => !p.hidden);
  const draft = panel && $(".draft", panel);
  if (!draft) return;
  rise(draft, 250);
  $$("mark", draft).forEach((m, k) => light(m, 800 + k * 220));
}
// Quote: the details light up in the email, one after another, then the quote's lines arrive, then the total.
function playQuote(root) {
  const marks = $$(".mail__body mark", root);
  marks.forEach((m, k) => light(m, 150 + k * 260));
  const start = 150 + marks.length * 260;
  const rows = $$(".sheet__lines tbody tr", root);
  rows.forEach((tr, k) => rise(tr, start + k * 170));
  rise($(".sheet__total", root), start + rows.length * 170 + 80);
  rise($("[data-quote-check]", root), start + rows.length * 170 + 260);
}
// Reminders: tomorrow's reminder appears under Biscuit's booking, then its status.
function playReminders(root) {
  rise($(".appt__draft", root), 300);
  const state = $("[data-appt-state]", root);
  if (state) state.animate([{ opacity: 0, transform: "scale(0.7)" }, { opacity: 1, transform: "none" }], { duration: 320, delay: 850, easing: EASE, fill: "backwards" });
}

function initMotion() {
  const replies = $("[data-replies]");
  const quote = $("[data-quote]");
  const reminders = $("[data-reminders]");
  const draft = replies && $$("[data-reply-panel]", replies).find((p) => !p.hidden);
  onceInView(replies, draft && $(".draft", draft), () => playReplies(replies));
  onceInView(quote, quote && $(".mail__body", quote), () => playQuote(quote));
  onceInView(reminders, reminders && $(".appt__draft", reminders), () => playReminders(reminders));
}

const safely = (name, fn) => {
  try { fn(); } catch (error) { console.error(`LETS examples: ${name} did not start`, error); }
};
safely("replies", initReplies);
safely("quote", initQuote);
safely("reminders", initReminders);
safely("motion", initMotion);
})();
