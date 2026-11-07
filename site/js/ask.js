// "Let's talk" links that carry a topic: the topic goes into the form's message, after anything already written
// there (never replacing it), the message's fold opens, and the link's own jump lands on the form. Nothing is sent.
// Without script the link still jumps to the form.
import { $, $$ } from "./env.js";

export function initAsk() {
  const box = $('[data-lead] textarea[name="challenge"]');
  if (!box) return;
  $$("[data-ask]").forEach((link) =>
    link.addEventListener("click", () => {
      // The note sits in a fold; open it, so nothing is sent that the visitor has not seen.
      const fold = box.closest("details");
      if (fold) fold.open = true;
      const line = `I’d like to talk about: ${link.dataset.ask}.`;
      if (box.value.includes(line)) return;
      box.value = box.value.trim() ? `${box.value.replace(/\s+$/, "")}\n\n${line}` : line;
    }),
  );
}
