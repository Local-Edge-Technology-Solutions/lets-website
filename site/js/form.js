// The lead form. Without script it posts to Netlify Forms and lands on /thanks/. With script it sends in the
// background, one send at a time, and says plainly what happened. A failed or unconfirmed send never clears what
// was typed, and a success clears only what was actually sent.
import { $ } from "./env.js";

const FALLBACK = "ben@localedgesolutions.ai";

export function initForm() {
  const form = $("[data-lead]");
  if (!form) return;
  const say = $("[data-form-status]", form);
  const submit = $('button[type="submit"]', form);
  const label = submit.textContent;
  let sending = false;

  const tell = (text, { ok = false, mail = false } = {}) => {
    say.classList.toggle("is-ok", ok);
    say.replaceChildren(text);
    if (mail) {
      const a = document.createElement("a");
      a.href = `mailto:${FALLBACK}`;
      a.textContent = FALLBACK;
      say.append(" ", "You can also email ", a, ".");
    }
  };

  form.addEventListener("submit", async (e) => {
    // Native validation has already run: the browser only fires submit when the email is filled in and valid.
    e.preventDefault();
    if (sending) return;
    if (navigator.onLine === false) {
      tell("You seem to be offline, so nothing was sent. Your message is still here; try again once you’re connected.", { mail: true });
      return;
    }
    sending = true;
    submit.setAttribute("aria-disabled", "true");
    submit.textContent = "Sending…";
    tell("Sending your message…");
    try {
      const sent = new URLSearchParams(new FormData(form)).toString();
      const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: sent });
      if (!res.ok) throw Object.assign(new Error(`Form send failed: ${res.status}`), { status: res.status });
      // Only clear the form if nothing was typed while it was sending; newer edits are never thrown away.
      if (new URLSearchParams(new FormData(form)).toString() === sent) {
        form.reset();
        tell("Thanks. Your message is on its way to Ben and Zeke.", { ok: true });
      } else {
        tell(`Thanks. Your message is on its way to Ben and Zeke. The changes you made while it was sending haven’t been sent; press “${label}” again to send them.`, { ok: true });
      }
    } catch (err) {
      const status = err && err.status;
      const code = status ? ` (error ${status})` : "";
      tell(`We couldn’t confirm receipt. Your message is still here.${code ? ` The form service answered${code}.` : ""}`, { mail: true });
    } finally {
      sending = false;
      submit.removeAttribute("aria-disabled");
      submit.textContent = label;
    }
  });
}
