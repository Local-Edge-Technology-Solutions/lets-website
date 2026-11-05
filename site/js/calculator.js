// Showpiece 3: the time-spent calculator. Plain sum: minutes a week for each ticked chore, × 52 ÷ 60.
// Without script the page shows a worked example; the inputs appear once this code runs.
// The total rolls on an odometer (Animaxxing's odometer, adapted and simplified for whole numbers).
import { gsap, calm, $, $$ } from "./env.js";

const fmt = new Intl.NumberFormat("en-US");

// At rest the figure is plain text; columns exist only while it rolls, then the text comes back.
function odometer(el) {
  let text = el.textContent.trim();
  let roll = null;
  const digits = (v) => [...v].filter((c) => /\d/.test(c)).map(Number);
  return {
    /** Puts the current figure back after something else was shown in its place. */
    show() { roll?.kill(); el.textContent = text; },
    /** Shows a dash instead of a figure while the inputs are wrong. */
    blank() { roll?.kill(); roll = null; el.textContent = "–"; },
    set(n) {
      const next = fmt.format(n);
      if (next === text) return;
      const before = digits(text);
      text = next;
      roll?.kill();
      if (calm()) { el.textContent = text; return; }
      const target = digits(next);
      const pad = target.length - before.length;
      const shown = document.createElement("span");
      shown.className = "odo";
      shown.setAttribute("aria-hidden", "true");
      const strips = [];
      [...next].forEach((ch) => {
        if (!/\d/.test(ch)) { shown.append(ch); return; }
        const k = strips.length;
        const col = document.createElement("span");
        col.className = "odo__col";
        const size = document.createElement("span");
        size.className = "odo__size";
        size.textContent = ch;
        const strip = document.createElement("span");
        strip.className = "odo__strip";
        for (let d = 0; d < 10; d++) { const s = document.createElement("span"); s.textContent = d; strip.append(s); }
        col.append(size, strip);
        shown.append(col);
        strips.push(strip);
        gsap.set(strip, { yPercent: -10 * (k - pad >= 0 ? before[k - pad] ?? 0 : 0) });
      });
      const spoken = document.createElement("span");
      spoken.className = "sr-only";
      spoken.textContent = next;
      el.replaceChildren(shown, spoken);
      roll = gsap.timeline({ onComplete: () => { el.textContent = text; roll = null; } });
      strips.forEach((s, k) => roll.to(s, { yPercent: -10 * target[k], duration: 0.9, ease: "power3.out" }, (strips.length - 1 - k) * 0.05));
    },
  };
}

export function initCalculator() {
  const root = $("[data-calc]");
  if (!root) return;
  const live = $("[data-calc-live]", root);
  const statik = $("[data-calc-static]", root);
  const hours = $("[data-calc-hours]", root);
  const sum = $("[data-calc-sum]", root);
  const send = $("[data-calc-send]", root);
  const status = $("[data-calc-status]", root);
  const chores = $$(".chore", root).map((li) => ({
    box: $(".chore__pick input", li),
    mins: $(".chore__mins input", li),
    name: $(".chore__pick span", li).textContent.trim(),
  }));
  const odo = odometer(hours);

  const error = $("[data-calc-error]", root);
  const result = $(".calc__result", root);
  // Minutes must be a number from 0 to 2400 a week. Anything else is shown as wrong, not quietly clamped,
  // and the total and the copy into the form wait until it is fixed.
  const MAX = 2400;
  const valid = (c) => {
    const raw = c.mins.value.trim();
    if (raw === "") return false; // also what a number field reports for letters
    const v = Number(raw);
    return Number.isFinite(v) && v >= 0 && v <= MAX;
  };
  const minutes = (c) => Math.round(Number(c.mins.value));
  const ticked = () => chores.filter((c) => c.box.checked);
  const total = () => ticked().reduce((t, c) => t + minutes(c), 0);
  let blocked = false;
  const update = () => {
    // Only ticked chores count, so only ticked chores can block the total.
    const bad = chores.filter((c) => c.box.checked && !valid(c));
    chores.forEach((c) => {
      if (!c.box.checked || valid(c)) { c.mins.removeAttribute("aria-invalid"); c.mins.removeAttribute("aria-describedby"); }
      else { c.mins.setAttribute("aria-invalid", "true"); c.mins.setAttribute("aria-describedby", error.id); }
    });
    blocked = bad.length > 0;
    result.classList.toggle("is-blocked", blocked);
    if (blocked) {
      error.textContent = `Minutes must be from 0 to ${fmt.format(MAX)} a week. Fix ${bad.map((c) => c.name.toLowerCase()).join(", ")} to see the total.`;
      sum.textContent = "Waiting for the minutes to be fixed";
      odo.blank();
      send.setAttribute("aria-disabled", "true");
      return;
    }
    error.textContent = "";
    send.removeAttribute("aria-disabled");
    if (hours.textContent === "–") odo.show();
    const m = total();
    const h = Math.round((m * 52) / 60);
    odo.set(h);
    // The sum is a live region: screen readers hear the year's total with it, not only the arithmetic.
    const said = document.createElement("span");
    said.className = "sr-only";
    said.textContent = `, about ${fmt.format(h)} hours a year`;
    sum.replaceChildren(`${fmt.format(m)} minutes a week × 52 ÷ 60`, said);
  };
  root.addEventListener("input", update);
  root.addEventListener("change", update);

  // Carry the ticked chores into the form's message, after anything already written there. Never replace it.
  send.addEventListener("click", () => {
    const picked = ticked();
    if (blocked) { status.textContent = `Fix the minutes first: each one must be from 0 to ${fmt.format(MAX)} a week.`; return; }
    if (!picked.length) { status.textContent = "Tick at least one task first."; return; }
    const box = document.querySelector('[data-lead] textarea[name="challenge"]');
    if (!box) return;
    const h = Math.round((total() * 52) / 60);
    const block = `Tasks I ticked on your calculator: ${picked.map((c) => `${c.name.toLowerCase()} (${minutes(c)} min a week)`).join("; ")}. About ${fmt.format(h)} hours a year.`;
    const now = box.value;
    if (!now.includes(block)) box.value = now.trim() ? `${now.replace(/\s+$/, "")}\n\n${block}` : block;
    status.textContent = "Added your ticked tasks to the message in the form below.";
    box.focus();
    box.setSelectionRange(box.value.length, box.value.length);
  });

  live.hidden = false;
  statik.hidden = true;
  send.hidden = false;
  update();
}
