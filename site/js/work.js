// Billing Day, the interactive preview: the one control is "Approve 6 invoices". Pressing it approves the
// sample month on this page only (nothing is sent anywhere, no request is made) and plays the app's own
// approval moment, ported from Billing Day's ApprovedStreet: the buildings slide together within their
// rows, the ground line draws under them, and their windows warm one by one. The words change first and
// never move; the preview keeps its size, so nothing below it jumps. Reduced motion gets the end state.
// Without script the review state stays readable and the button stays hidden.
import { gsap, calm, $, $$ } from "./env.js";

const REVIEW = {
  label: "Invoices to review",
  step: "Approve October",
  button: "Approve 6 invoices · $2,341.25",
  status: "Approving doesn’t send anything. Send to QuickBooks: coming next.",
};
const APPROVED = {
  label: "Approved",
  step: "October approved",
  button: "Replay approval",
  status: "Sample invoices approved. Nothing sent to QuickBooks or clients.",
};

export function initWork() {
  const root = $("[data-bd]");
  if (!root) return;
  const button = $("[data-bd-approve]", root);
  const status = $("[data-bd-status]", root);
  const label = $("[data-bd-label]", root);
  const step = $("[data-bd-step]", root);
  const street = $(".bd-street", root);
  if (!button || !status || !label || !step || !street) return;
  const lots = $$(".st-lot", street);
  const drawings = lots.map((l) => $(".st-lot-bldg", l)).filter(Boolean);

  let tl = null;
  const say = (words) => {
    label.textContent = words.label;
    step.textContent = words.step;
    button.textContent = words.button;
  };
  const tidy = () => {
    street.classList.remove("is-arriving");
    lots.forEach((l) => l.classList.remove("is-warm"));
    gsap.set(drawings, { clearProps: "transform,opacity,visibility" });
    gsap.set(lots, { clearProps: "--ground" });
  };
  // Any run in progress jumps to its end state (a replay, a resize, motion turned off mid-run).
  const settle = () => {
    if (!tl) return;
    const t = tl;
    tl = null;
    t.progress(1).kill();
    tidy();
  };

  // Each building starts pushed out from the middle of its own row, so a wrapped street (three rows of
  // two on a phone) gathers row by row instead of flying across rows.
  const offsets = () => {
    const rows = new Map();
    lots.forEach((l, i) => {
      const key = Math.round(l.offsetTop);
      if (!rows.has(key)) rows.set(key, []);
      rows.get(key).push(i);
    });
    const off = [];
    rows.forEach((members) => {
      const middle = (members.length - 1) / 2;
      members.forEach((i, k) => { off[i] = (k - middle) * 22; });
    });
    return off;
  };

  const play = () => {
    const off = offsets();
    street.classList.add("is-arriving");
    tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: () => { tl = null; tidy(); } });
    tl.fromTo(drawings, { xPercent: (i) => off[i], autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.62, ease: "power3.inOut" }, 0);
    tl.fromTo(lots, { "--ground": 0 }, { "--ground": 1, duration: 0.3, ease: "none", stagger: 0.06 }, 0.22);
    lots.forEach((l, i) => tl.call(() => l.classList.add("is-warm"), undefined, 0.62 + i * 0.08));
    tl.to({}, { duration: 0.5 });
  };

  button.addEventListener("click", () => {
    settle();
    const first = !root.classList.contains("is-approved");
    root.classList.add("is-approved");
    say(APPROVED);
    // One announcement: the status line is the live region, and it changes only on the first approval.
    if (first) status.textContent = APPROVED.status;
    if (!calm()) play();
  });

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  reduce.addEventListener?.("change", settle);
  // Only a change of width moves the rows (a phone's address bar changes the height while scrolling).
  let width = innerWidth;
  addEventListener("resize", () => { if (innerWidth !== width) { width = innerWidth; settle(); } }, { passive: true });

  say(REVIEW);
  status.textContent = REVIEW.status;
  button.hidden = false;
}
