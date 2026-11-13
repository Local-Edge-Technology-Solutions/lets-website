// "Let's talk" links that carry a topic: the topic goes into the form's message, after anything already written
// there (never replacing it), the message's fold opens, and the link's own jump lands on the form. Nothing is sent.
// Without script the link still jumps to the form.
// A visit from /examples/ arrives as /?topic=<key>#contact: only the three known keys are read, and the note is
// filled only when the visitor has not written anything there.
import { $, $$ } from "./env.js";

const TOPICS = {
  replies: "Replies to customer questions",
  quote: "Quotes from order emails",
  reminders: "Reminders for bookings",
};

export function initAsk() {
  const box = $('[data-lead] textarea[name="challenge"]');
  if (!box) return;
  const open = () => {
    // The note sits in a fold; open it, so nothing is sent that the visitor has not seen.
    const fold = box.closest("details");
    if (fold) fold.open = true;
  };
  $$("[data-ask]").forEach((link) =>
    link.addEventListener("click", () => {
      open();
      const line = `I’d like to talk about: ${link.dataset.ask}.`;
      if (box.value.includes(line)) return;
      box.value = box.value.trim() ? `${box.value.replace(/\s+$/, "")}\n\n${line}` : line;
    }),
  );

  const key = new URLSearchParams(location.search).get("topic");
  if (key && Object.prototype.hasOwnProperty.call(TOPICS, key)) {
    open();
    if (!box.value.trim()) box.value = `I’d like to talk about: ${TOPICS[key]}.`;
  }
}
