// The Example under the poster: the owner's note gets its ring, the arrow draws, the built card fills teal and
// lands, once (about 2.5 s), when the panel is well in view. The finished picture is the base CSS; this only holds
// it at its first frame (.jx-armed, motion allowed) and starts it (.jx-play). When the card's landing ends, both come
// off and the panel is marked .jx-done. Reduced motion (also switched on mid-run), no IntersectionObserver, a
// missing part, the panel already on screen in a page that opens scrolled, or any failure: the finished picture at once.
// Never replays.
import { calm, $ } from "./env.js";

export function initInvoice() {
  const ex = $("[data-jx]");
  if (!ex) return;
  const card = $(".jx-built", ex);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let io = null;
  let timer = 0;
  let over = false;

  // Only the card's own landing ends the run; the fill's and the drawings' animationend bubble up to it and are
  // ignored, so the landing is never cut short.
  const onEnd = (e) => { if (e.target === card && e.animationName === "jx-land") finish(); };
  const onReduce = (e) => { if (e.matches) finish(); };
  function finish() {
    if (over) return;
    over = true;
    io?.disconnect();
    clearTimeout(timer);
    card?.removeEventListener("animationend", onEnd);
    card?.removeEventListener("animationcancel", onEnd);
    reduce.removeEventListener?.("change", onReduce);
    ex.classList.remove("jx-armed", "jx-play");
    ex.classList.add("jx-done");
  }

  const parts = [card, $(".jx-built__fill", ex), $(".jx-ring path", ex), $(".jx-arrow__shaft", ex), $(".jx-arrow__head", ex)];
  if (parts.some((p) => !p) || calm() || !("IntersectionObserver" in window)) { finish(); return; }

  // Play once 40% of the panel is showing, or once it fills half the screen (screens shorter than the panel).
  const inView = (rect, seen) => seen > 0 && (seen / rect.height >= 0.4 || seen >= innerHeight * 0.5);
  const r = ex.getBoundingClientRect();
  // A page that opens already scrolled (a restored position or a link to a section) with the panel well on screen:
  // never blank it, it simply stays finished. At the top of the page a panel showing under the poster plays as usual.
  if (scrollY > 0 && inView(r, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0))) { finish(); return; }

  try {
    io = new IntersectionObserver((entries) => {
      if (over || !entries.some((e) => inView(e.boundingClientRect, e.intersectionRect.height))) return;
      io.disconnect();
      ex.classList.add("jx-play");
      // Backstop (the run is 2.45 s): if the landing's end never arrives, rest finished anyway.
      timer = setTimeout(finish, 4000);
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5] });
    io.observe(ex);
    card.addEventListener("animationend", onEnd);
    card.addEventListener("animationcancel", onEnd);
    reduce.addEventListener("change", onReduce);
    // Armed last, once every part of the setup has worked.
    ex.classList.add("jx-armed");
  } catch (error) {
    finish();
    console.error("LETS: the Example did not start", error);
  }
}
