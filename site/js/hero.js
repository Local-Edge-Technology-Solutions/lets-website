// The hero's example lights its four results once, when it is on screen, then rests on the finished picture.
// The unlit start is CSS (.js, motion allowed), so it is there from the first paint; with reduced motion or
// no script the finished picture is all there is. Every word is in the HTML either way.
export function initHero() {
  const fig = document.querySelector("[data-jobs]");
  if (!fig || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rest = () => { fig.classList.remove("is-play"); fig.classList.add("is-rest"); };
  if (!("IntersectionObserver" in window)) { rest(); return; }
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    fig.classList.add("is-play");
    setTimeout(rest, 2400);
  }, { threshold: 0.4 });
  io.observe(fig);
}
