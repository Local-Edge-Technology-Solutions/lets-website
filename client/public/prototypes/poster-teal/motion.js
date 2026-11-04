// LETS prototype, motion layer. GSAP 3.15.0 (ScrollTrigger, SplitText) from jsDelivr; recipes adapted from
// Animaxxing (registrationSlip, paintReveal, pressFeedback) with the taste skill's rules winning: no overshoot,
// nothing hidden without script, reduced motion gets the finished page. The hero's load sequence is CSS (styles.css).
(() => {
  const g = window.gsap;
  if (!g || !window.ScrollTrigger) return; // the page is complete without this file
  const { ScrollTrigger } = window;
  const SplitText = window.SplitText;
  g.registerPlugin(ScrollTrigger, ...(SplitText ? [SplitText] : []));
  g.defaults({ overwrite: 'auto' });

  const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---- Animaxxing registrationSlip, adapted: a second impression in another ink lands out of register behind a
  // heading, then slips true under it and is removed. The heading never moves. Eases without overshoot.
  function registrationSlip(heading, ink, { x = 14, y = 6, duration = 0.7 } = {}) {
    const tl = g.timeline();
    if (calm()) return tl;
    // A div, not a second heading: same classes, same markup, so the lines break exactly as the heading's do.
    // Its letters live in a pseudo-element: the impression is ink, not text, for readers and for measuring.
    const copy = document.createElement('div');
    copy.className = heading.className;
    const lines = heading.querySelectorAll(':scope > .line, :scope > div > div');
    (lines.length ? [...lines] : [heading]).forEach((ln) => {
      const row = document.createElement('div');
      row.className = 'impression-line';
      row.dataset.t = ln.textContent.replace(/\s+/g, ' ').trim();
      copy.append(row);
    });
    copy.setAttribute('aria-hidden', 'true');
    const hs = getComputedStyle(heading);
    copy.style.fontWeight = hs.fontWeight;
    copy.style.textWrap = hs.textWrap || 'wrap';
    // Anchored to the heading's own parent, so it shares the heading's stacking context and stays beneath it.
    const parent = heading.parentElement;
    const parentPos = parent.style.position;
    if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    const box = heading.getBoundingClientRect();
    const origin = parent.getBoundingClientRect();
    Object.assign(copy.style, {
      position: 'absolute', left: `${box.left - origin.left}px`, top: `${box.top - origin.top}px`, width: `${box.width}px`,
      margin: '0', color: ink, pointerEvents: 'none', zIndex: '0', animation: 'none',
    });
    const saved = [heading.style.position, heading.style.zIndex];
    const cs = getComputedStyle(heading);
    if (cs.position === 'static') heading.style.position = 'relative';
    if (cs.zIndex === 'auto') heading.style.zIndex = '1';
    parent.append(copy);
    const restore = () => { copy.remove(); [heading.style.position, heading.style.zIndex] = saved; parent.style.position = parentPos; };
    tl.fromTo(copy, { x, y }, { x: x * 0.35, y: -y * 0.3, duration: duration * 0.55, ease: 'power2.out' })
      .to(copy, { x: 0, y: 0, duration: duration * 0.45, ease: 'expo.out' })
      .call(restore);
    return tl;
  }

  // ---- Animaxxing paintReveal, adapted: a cover in the ground colour wears away with a dry-brush edge.
  function brushThresholds(w, h) {
    const hash = (x, y) => { let n = Math.imul(x + 19, 374761393) + Math.imul(y + 37, 668265263); n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967296; };
    const noise = (x, y) => { const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy; return (hash(ix, iy) * (1 - fx) + hash(ix + 1, iy) * fx) * (1 - fy) + (hash(ix, iy + 1) * (1 - fx) + hash(ix + 1, iy + 1) * fx) * fy; };
    const out = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const nx = x / w, ny = y / h;
      const v = nx * 0.5 + ny * 0.18 + noise(nx * 7, ny * 9) * 0.19 + noise(nx * 43, ny * 51) * 0.12 + hash(x, y) * 0.13;
      out[y * w + x] = Math.max(0, Math.min(255, Math.round(v * 225)));
    }
    return out;
  }
  function paintReveal(target, paper, duration = 1.3) {
    const tl = g.timeline({ paused: true });
    if (calm()) return tl;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '1' });
    const ctx = canvas.getContext('2d');
    if (!ctx) return tl;
    const box = target.getBoundingClientRect();
    const ratio = Math.min(1, 500 / Math.max(1, box.width), 600 / Math.max(1, box.height));
    const w = (canvas.width = Math.max(1, Math.round(box.width * ratio)));
    const h = (canvas.height = Math.max(1, Math.round(box.height * ratio)));
    ctx.fillStyle = paper; ctx.fillRect(0, 0, w, h);
    const px = ctx.getImageData(0, 0, w, h);
    const th = brushThresholds(w, h);
    let prev = -1;
    const paint = (p) => {
      const step = Math.round(p * 180);
      if (step === prev) return; prev = step;
      for (let i = 0; i < th.length; i++) {
        const ink = p <= 0 ? 0 : p >= 1 ? 255 : Math.max(0, Math.min(255, (p * 280 - th[i]) * 18));
        px.data[i * 4 + 3] = 255 - ink;
      }
      ctx.putImageData(px, 0, 0);
    };
    paint(0);
    target.append(canvas);
    let cur = 0;
    const state = { get progress() { return cur; }, set progress(v) { cur = v; paint(v); } };
    tl.to(state, { progress: 1, duration, ease: 'none' }).call(() => canvas.remove());
    return tl;
  }

  // ---- Animaxxing pressFeedback, adapted: squash on press and an ink ripple from the press point. Release eases
  // out without the recipe's elastic spring (the taste skill bans overshoot on controls).
  function pressFeedback(control, { squash = 0.95, ink = 0.28 } = {}) {
    if (calm()) return;
    control.style.setProperty('-webkit-tap-highlight-color', 'transparent');
    const cs = getComputedStyle(control);
    if (cs.position === 'static') control.style.position = 'relative';
    if (cs.overflow === 'visible') control.style.overflow = 'clip';
    let pressed = false;
    const spread = (x, y) => {
      const b = control.getBoundingClientRect();
      const reach = Math.hypot(Math.max(x, b.width - x), Math.max(y, b.height - y));
      const drop = document.createElement('span');
      drop.dataset.ripple = '';
      drop.setAttribute('aria-hidden', 'true');
      Object.assign(drop.style, { position: 'absolute', left: `${x - reach}px`, top: `${y - reach}px`, width: `${reach * 2}px`, height: `${reach * 2}px`, borderRadius: '50%', pointerEvents: 'none' });
      control.append(drop);
      g.fromTo(drop, { scale: 0, opacity: ink }, { scale: 1, opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => drop.remove() });
    };
    const press = (x, y) => { if (pressed) return; pressed = true; g.to(control, { scale: squash, duration: 0.12, ease: 'power2.out' }); spread(x, y); };
    const release = () => { if (!pressed) return; pressed = false; g.to(control, { scale: 1, duration: 0.4, ease: 'expo.out' }); };
    control.addEventListener('pointerdown', (e) => { if (e.button !== 0) return; const b = control.getBoundingClientRect(); press(e.clientX - b.left, e.clientY - b.top); });
    ['pointerup', 'pointercancel', 'pointerleave', 'keyup', 'blur'].forEach((t) => control.addEventListener(t, release));
    control.addEventListener('keydown', (e) => { if (e.repeat || (e.key !== 'Enter' && e.key !== ' ')) return; const b = control.getBoundingClientRect(); press(b.width / 2, b.height / 2); });
  }

  // ---- The live thing's re-deal: each slip's lines lift off, the new ones print in, row by row.
  const rows = (slip) => $$('.slip__top, .slip__rule, dl > div, .slip__msg, .slip__foot', slip);
  window.LETSmotion = {
    redeal(slips, swap) {
      if (calm()) { swap(); return; }
      const out = g.timeline();
      slips.forEach((s, i) => out.to(rows(s), { y: -10, autoAlpha: 0, duration: 0.18, ease: 'power2.in', stagger: 0.012 }, i * 0.03));
      out.call(() => {
        swap();
        const inn = g.timeline();
        slips.forEach((s, i) => inn.fromTo(rows(s), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42, ease: 'expo.out', stagger: 0.035, clearProps: 'transform,opacity,visibility' }, i * 0.06));
        slips.forEach((s, i) => inn.fromTo(s, { scaleY: 0.97, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.5, ease: 'expo.out' }, i * 0.06));
      });
    },
  };

  const build = () => {
    const mm = g.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 1001px)' }, (ctx) => {
      if (!ctx.conditions.motion) return;
      document.documentElement.classList.add('gsap-press');
      const wide = ctx.conditions.wide;

      // Hero: the masked lines rise in CSS; then a blue second impression slips into register under the black.
      const h1 = $('.hero__title');
      g.delayedCall(1.05, () => registrationSlip(h1, '#2436ff', { x: 18, y: 8, duration: 0.8 }));
      // Kinetic type as the hero leaves: the two lines are pushed apart, the till tilts and lifts.
      const lines = $$('.hero__title .line');
      g.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
        .to(lines[0], { xPercent: -9, ease: 'none' }, 0)
        .to(lines[1], { xPercent: 7, ease: 'none' }, 0)
        .fromTo('.hero__picture', { rotation: 4, y: 0 }, { rotation: 10, y: () => -innerHeight * 0.12, ease: 'none' }, 0)
        .to('.hero__copy, .hero__fact', { y: () => -innerHeight * 0.08, ease: 'none' }, 0);

      // Headings: lines rise out of their masks once, then a second impression slips into register where marked.
      // Called section by section so every ScrollTrigger is created in page order (the showcase pin adds height).
      const splits = [];
      const splitIn = (el) => {
        if (!SplitText || !el) return;
        let slipped = false;
        splits.push(SplitText.create(el, {
          type: 'lines', mask: 'lines', autoSplit: true,
          onSplit(self) {
            return g.from(self.lines, {
              yPercent: 110, duration: 0.75, ease: 'expo.out', stagger: 0.09,
              scrollTrigger: { trigger: el, start: 'top bottom', once: true },
              onComplete: () => { if (el.dataset.slip && !slipped) { slipped = true; registrationSlip(el, el.dataset.slip); } },
            });
          },
        }));
      };
      splitIn($('.intro__title'));

      // Intro: the statement rises; the two pictures are slapped on like stickers and settle at their tilt.
      g.from('.intro__statement', { y: 28, autoAlpha: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '.intro__statement', start: 'top 90%', once: true } });
      g.from('.chip', { rotation: (i) => (i ? 14 : -16), scale: 1.25, autoAlpha: 0, duration: 0.75, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.intro__body', start: 'top 85%', once: true } });

      // Showcase: on wide screens the section holds while the six slips print up out of the desk, one by one.
      splitIn($('#examples-title'));
      const show = $('.showcase');
      const slips = $$('.slip', show);
      g.from('.showcase__copy .statement, .picker', { y: 24, autoAlpha: 0, duration: 0.7, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.showcase__copy', start: 'top 85%', once: true } });
      g.from('.picker__options label', { y: 14, autoAlpha: 0, duration: 0.5, ease: 'expo.out', stagger: 0.04, scrollTrigger: { trigger: '.picker', start: 'top 92%', once: true } });
      if (wide && show.offsetHeight <= innerHeight + 4) {
        g.timeline({ scrollTrigger: { trigger: show, start: 'top top', end: '+=85%', pin: true, scrub: true, anticipatePin: 1 } })
          .from(slips, { yPercent: 108, ease: 'none', stagger: 0.14, duration: 0.5 }, 0)
          .fromTo('.showcase__photo', { scale: 1.12 }, { scale: 1, ease: 'none', duration: 1.2 }, 0);
      } else {
        ScrollTrigger.batch(slips, { start: 'top 92%', once: true, onEnter: (b) => g.from(b, { y: 40, autoAlpha: 0, duration: 0.7, ease: 'expo.out', stagger: 0.08 }) });
        g.fromTo('.showcase__photo', { scale: 1.1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: show, start: 'top bottom', end: 'bottom top', scrub: true } });
      }

      // How it works: each line steps in along the stair as it climbs the screen.
      $$('.stair').forEach((st) => {
        const line = $('.stair__line', st);
        splitIn(line);
        // Only the display line travels (it may bleed past the margin); the sentence under it stays inside the frame.
        if (wide) g.fromTo(line, { x: () => -innerWidth * 0.1 }, { x: 0, ease: 'none', scrollTrigger: { trigger: st, start: 'top bottom', end: 'top 55%', scrub: true } });
        g.from($('p', st), { y: 18, autoAlpha: 0, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: st, start: 'top 82%', once: true } });
      });

      splitIn($('#about-title'));
      // About: the two blocks are rolled on with a dry brayer edge; names and lines follow.
      $$('.person').forEach((p) => {
        const card = $('.person__card', p);
        const paint = paintReveal(card, '#0a0a0a', 1.3);
        const tl = g.timeline({ paused: true }).add(paint.play ? paint : g.timeline(), 0)
          .from($('.person__mark', p), { yPercent: 12, duration: 1.2, ease: 'expo.out' }, 0.1)
          .from($$('.person__name, .person__role, .person__text', p), { y: 18, autoAlpha: 0, duration: 0.6, ease: 'expo.out', stagger: 0.08 }, 0.35);
        paint.paused(false);
        ScrollTrigger.create({ trigger: card, start: 'top bottom', once: true, onEnter: () => tl.play() });
      });
      g.from('.about__line', { y: 18, autoAlpha: 0, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: '.about__line', start: 'top 90%', once: true } });

      splitIn($('#faq-title'));
      // Questions: each band's question slides in from the left, its answer rises; the storefronts are pinned up.
      $$('.band').forEach((b) => {
        g.timeline({ scrollTrigger: { trigger: b, start: 'top 86%', once: true } })
          .from($('.band__q', b), { x: -36, autoAlpha: 0, duration: 0.7, ease: 'expo.out' })
          .from($('.band__a', b), { y: 18, autoAlpha: 0, duration: 0.7, ease: 'expo.out' }, 0.09);
      });
      ScrollTrigger.batch('.storefronts li', { start: 'top 92%', once: true, onEnter: (b) => g.from(b, { y: 50, rotation: (i) => (i % 2 ? 4 : -4), autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07 }) });

      splitIn($('#contact-title'));
      // Contact: the coupon is handed over, then its cells fill in.
      g.timeline({ scrollTrigger: { trigger: '.coupon', start: 'top 85%', once: true } })
        .from('.coupon', { y: 70, rotation: -2.5, duration: 0.9, ease: 'expo.out' })
        .from('.coupon__right > *', { y: 14, autoAlpha: 0, duration: 0.5, ease: 'expo.out', stagger: 0.06 }, 0.2)
        .from('.coupon__text', { y: 14, autoAlpha: 0, duration: 0.6, ease: 'expo.out' }, 0.3);

      // Footer: the four blocks are set like wood type, rising from the baseline as the close arrives.
      g.from('.mark__block', { yPercent: 102, duration: 0.9, ease: 'expo.out', stagger: 0.11, scrollTrigger: { trigger: '.mark', start: 'top 92%', once: true } });
      g.from('.footer__grid > *, .credits, .footer__last', { y: 16, autoAlpha: 0, duration: 0.6, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.footer__grid', start: 'top 92%', once: true } });

      // Feedback under the hand.
      $$('.button, .picker label').forEach((c) => pressFeedback(c));

      return () => { splits.forEach((s) => s.revert()); document.documentElement.classList.remove('gsap-press'); };
    });
    addEventListener('load', () => ScrollTrigger.refresh());
  };

  (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve()).then(build);
})();
