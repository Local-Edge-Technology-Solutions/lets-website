// The lead form. Without script it posts to Netlify Forms and lands on /thanks/. With script it sends in the
// background, one send at a time, says plainly what happened, and on a confirmed send goes to /thanks/ too. A failed or unconfirmed send never clears what
// was typed, and a success clears only what was actually sent.
import { $ } from "./env.js";

const FALLBACK = "hello@localedgesolutions.ai";

// What the status line can say. (The words are the form's own; they live here so their room can be measured.)
const SAY = {
  offline: "You seem to be offline, so nothing was sent. Your message is still here; try again once you’re connected.",
  sending: "Sending your message…",
  sent: "Thanks. Your message is on its way to us.",
  newer: (label) => `Thanks. Your message is on its way to us. The changes you made while it was sending haven’t been sent; press “${label}” again to send them.`,
  failed: (code) => `We couldn’t confirm receipt. Your message is still here.${code ? ` The form service answered${code}.` : ""}`,
};

export function initForm() {
  const form = $("[data-lead]");
  if (!form) return;
  const say = $("[data-form-status]", form);
  const submit = $('button[type="submit"]', form);
  const label = submit.textContent;
  let sending = false;

  const write = (el, text, mail) => {
    el.replaceChildren(text);
    if (mail) {
      const a = document.createElement("a");
      a.href = `mailto:${FALLBACK}`;
      a.textContent = FALLBACK;
      el.append(" ", "You can also email ", a, ".");
    }
  };
  // The status line holds room for its longest message at this width from the start (measured on an unannounced,
  // invisible copy, again once the fonts arrive and whenever the width or the text size changes). It sits last in the card, so the
  // room reads as the card's foot, and no message, first or later, ever moves the form or what follows it.
  const hold = () => {
    const probe = say.cloneNode(false);
    probe.removeAttribute("role");
    probe.removeAttribute("data-form-status");
    probe.setAttribute("aria-hidden", "true");
    Object.assign(probe.style, { position: "absolute", visibility: "hidden", pointerEvents: "none", minBlockSize: "0", width: `${say.getBoundingClientRect().width}px` });
    say.after(probe);
    let most = 0;
    for (const [text, mail] of [[SAY.offline, true], [SAY.failed(" (error 500)"), true], [SAY.newer(label), false]]) {
      write(probe, text, mail);
      most = Math.max(most, probe.getBoundingClientRect().height);
    }
    probe.remove();
    say.style.minBlockSize = `${Math.ceil(most)}px`;
  };
  hold();
  document.fonts?.ready.then(hold);
  // the privacy line beside it changes size whenever the column's width or the text size does: measure again then
  const privacy = $(".coupon__privacy", form);
  if (privacy && "ResizeObserver" in window) new ResizeObserver(hold).observe(privacy);
  else addEventListener("resize", hold, { passive: true });
  const tell = (text, { ok = false, mail = false } = {}) => {
    say.classList.toggle("is-ok", ok);
    write(say, text, mail);
  };

  form.addEventListener("submit", async (e) => {
    // Native validation has already run: the browser only fires submit when the email is filled in and valid.
    e.preventDefault();
    if (sending) return;
    if (navigator.onLine === false) {
      tell(SAY.offline, { mail: true });
      return;
    }
    sending = true;
    submit.setAttribute("aria-disabled", "true");
    submit.setAttribute("aria-busy", "true");
    // the button keeps its height while its label is the shorter "Sending…" (enlarged text wraps "Get in touch")
    submit.style.minBlockSize = getComputedStyle(submit).blockSize; // its exact layout height, never the pressed (squashed) one
    submit.textContent = "Sending…";
    tell(SAY.sending);
    try {
      const sent = new URLSearchParams(new FormData(form)).toString();
      const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: sent });
      if (!res.ok) throw Object.assign(new Error(`Form send failed: ${res.status}`), { status: res.status });
      // Only clear the form if nothing was typed while it was sending; newer edits are never thrown away.
      if (new URLSearchParams(new FormData(form)).toString() === sent) {
        form.reset();
        tell(SAY.sent, { ok: true });
        // The thank-you page confirms it in full, and gives an ad platform one address to count a lead by.
        location.assign("/thanks/");
      } else {
        tell(SAY.newer(label), { ok: true });
      }
    } catch (err) {
      const status = err && err.status;
      const code = status ? ` (error ${status})` : "";
      tell(SAY.failed(code), { mail: true });
    } finally {
      sending = false;
      submit.removeAttribute("aria-disabled");
      submit.removeAttribute("aria-busy");
      submit.textContent = label;
      submit.style.removeProperty("min-block-size");
    }
  });
}
