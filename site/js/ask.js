// "Talk to us about this": carries the problem the visitor was reading into the form's message, after anything
// already written there (never replacing it), and the link's own jump then lands on the form. Nothing is sent.
// Without script the link still jumps to the form.
import { $, $$ } from "./env.js";

export function initAsk() {
  const box = $('[data-lead] textarea[name="challenge"]');
  if (!box) return;
  $$("[data-ask]").forEach((link) =>
    link.addEventListener("click", () => {
      const line = `I’d like to talk about: ${link.dataset.ask}.`;
      if (box.value.includes(line)) return;
      box.value = box.value.trim() ? `${box.value.replace(/\s+$/, "")}\n\n${line}` : line;
    }),
  );
}
