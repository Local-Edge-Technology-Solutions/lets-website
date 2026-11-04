// The lead form. Without script it posts to Netlify Forms and lands on /thanks/. With script it sends in the
// background, one send at a time, and says plainly what happened. A failed send never clears what was typed.
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
      const body = new URLSearchParams(new FormData(form)).toString();
      const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      if (!res.ok) throw Object.assign(new Error(`Form send failed: ${res.status}`), { status: res.status });
      form.reset();
      tell("Thanks. Your message is on its way to Ben and Zeke.", { ok: true });
    } catch (err) {
      const status = err && err.status;
      if (status >= 400 && status < 500) tell(`The form service turned that message down (error ${status}), so nothing was sent. Your message is still here.`, { mail: true });
      else if (status >= 500) tell(`The form service had a problem on its side (error ${status}), so nothing was sent. Your message is still here; try again in a minute.`, { mail: true });
      else tell("The message couldn’t reach the form service, so nothing was sent. Your message is still here; check your connection and try again.", { mail: true });
    } finally {
      sending = false;
      submit.removeAttribute("aria-disabled");
      submit.textContent = label;
    }
  });
}
