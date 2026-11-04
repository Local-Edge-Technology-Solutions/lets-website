/* LETS prototype: the motion layer, on GSAP 3.15.0 (ScrollTrigger, SplitText) from jsDelivr.
   Rules kept from the taste skill: the page is complete without this file; nothing above the fold waits
   for it (the hero's load sequence is CSS); reveals fire once; reduced motion gets the finished page.
   Recipes adapted from Animaxxing (revealOnScroll, linesMaskIn, charsRiseIn, charsImplodeIn, marquee,
   parallax, pinnedScene) and the official GSAP skills. */
(() => {
  const gsap = window.gsap;
  if (!gsap || !window.ScrollTrigger || !window.SplitText) return; // CDN missing: the static page stands.
  const { ScrollTrigger, SplitText } = window;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ overwrite: 'auto' });

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rand = gsap.utils.random;

  /* ---------- small helpers ---------- */

  // Count a figure up from zero, keeping its prefix, separators, decimals and suffix.
  const countUp = (els, duration = 1.1) => els.forEach((el) => {
    const text = el.textContent;
    const m = text.match(/-?\d[\d,]*(\.\d+)?/);
    if (!m) return;
    const decimals = m[1] ? m[1].length - 1 : 0;
    const target = parseFloat(m[0].replace(/,/g, ''));
    const fmt = (v) => v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const o = { v: 0 };
    gsap.to(o, {
      v: target, duration, ease: 'power3.out',
      onUpdate: () => { el.textContent = text.replace(m[0], fmt(o.v)); },
      onComplete: () => { el.textContent = text; },
    });
  });

  // Whole lines wipe up behind masks once, then the text is given back (Animaxxing linesMaskIn).
  const linesMaskOnEnter = (el, start = 'top 88%') => {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', aria: 'auto' });
    gsap.from(split.lines, {
      yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.09,
      scrollTrigger: { trigger: el, start, once: true },
      onComplete: () => split.revert(),
    });
  };

  /* ---------- the motion, only when motion is welcome ---------- */
  const build = () => {
    const mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 900px)' }, (ctx) => {
      const { motion, wide } = ctx.conditions;
      if (!motion) return;
      const live = [];

      /* 1. Hero: as it leaves, the switchboard sinks a little and the name lifts away faster. */
      gsap.to('.hero__ph img', {
        yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero__h1', {
        y: -60, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      });

      /* 2. Intro: "We find the busywork" rises letter by letter; "Gone." slams together from all sides. */
      const slogan = $('.intro__a h2');
      const gone = $('.intro__b p');
      if (slogan && gone) {
        const sSplit = SplitText.create(slogan, { type: 'words,chars', mask: 'chars', aria: 'auto' });
        const gSplit = SplitText.create(gone, { type: 'chars', aria: 'auto' });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '.intro__board', start: 'top bottom', once: true },
          onComplete: () => { sSplit.revert(); gSplit.revert(); },
        });
        tl.from('.intro__a', { scale: 0.96, autoAlpha: 0, duration: 0.5, ease: 'power3.out' })
          .from(sSplit.chars, { yPercent: 115, duration: 0.55, ease: 'expo.out', stagger: 0.015 }, 0.05)
          .from('.intro__b', { clipPath: 'inset(0 0 100% 0)', duration: 0.5, ease: 'power4.inOut' }, 0.05)
          .from(gSplit.chars, {
            x: () => rand(-260, 260), y: () => rand(-180, 180), rotation: () => rand(-90, 90),
            scale: () => rand(1.6, 2.4), autoAlpha: 0, duration: 0.6, ease: 'power4.out',
            stagger: { each: 0.03, from: 'edges' },
          }, 0.15)
          .from('.intro__c', { clipPath: 'inset(100% 0 0 0)', duration: 0.7, ease: 'power4.inOut' }, 0.1)
          .from('.intro__c video', { scale: 1.25, duration: 0.8, ease: 'expo.out' }, 0.1);
      }

      /* 3. Every tile and part enters as its row reaches the screen, staggered (Animaxxing revealOnScroll). */
      const headings = $$('main h2.head, main h2.display').filter((h) => !h.closest('.intro__a'));
      const parts = $$('[data-reveal]').filter((el) => !el.closest('.intro__board') && !el.matches('.intro__board > *')
        && !el.classList.contains('cut') && !el.closest('.cut') && !headings.includes(el) && !el.matches('.mark'));
      const plain = parts.filter((el) => el.dataset.reveal !== 'open');
      const opening = parts.filter((el) => el.dataset.reveal === 'open');
      gsap.set(plain, { autoAlpha: 0, y: 34 });
      ScrollTrigger.batch(plain, {
        start: 'top 90%', once: true,
        onEnter: (batch) => gsap.to(batch, {
          autoAlpha: 1, y: 0, duration: 0.85, ease: 'expo.out', stagger: 0.08,
          onComplete: () => gsap.set(batch, { clearProps: 'transform,opacity,visibility' }),
        }),
      });
      opening.forEach((el) => {
        const img = $('img, video', el);
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
        tl.from(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power4.inOut' });
        if (img) tl.from(img, { scale: 1.18, duration: 1.5, ease: 'expo.out' }, 0);
      });
      headings.forEach((h) => linesMaskOnEnter(h));

      /* 4. Examples: the report's bars grow and its figures count up the first time it is seen. */
      ScrollTrigger.create({
        trigger: '.m-report', start: 'top 80%', once: true,
        onEnter: () => {
          gsap.from('.m-report .ui-bar-f', { scaleY: 0, transformOrigin: '50% 100%', duration: 1, ease: 'expo.out', stagger: 0.07 });
        },
      });
      // Choosing another business deals the four tiles again: each flips away and the new one flips in.
      window.LETSdeal = (slots, swapOne) => {
        const tl = gsap.timeline();
        slots.forEach((slot, i) => {
          const at = i * 0.07;
          tl.to(slot, { rotationX: -88, autoAlpha: 0, transformPerspective: 900, transformOrigin: '50% 0%', duration: 0.22, ease: 'power2.in' }, at)
            .add(() => {
              swapOne(slot);
              countUp($$('.ui-kpis dd, .ui-bar-v, tfoot .num', slot), 0.6);
              gsap.from($$('.ui-bar-f', slot), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.8, ease: 'expo.out', stagger: 0.05 });
              gsap.from($$('.ui-calls li, .ui-table tbody tr, .ui-msg', slot), { autoAlpha: 0, x: -14, duration: 0.5, ease: 'power3.out', stagger: 0.05 });
            }, at + 0.22)
            .fromTo(slot, { rotationX: 88, autoAlpha: 0, transformOrigin: '50% 100%' }, { rotationX: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', clearProps: 'transform,opacity,visibility' }, at + 0.22);
        });
        return tl;
      };
      live.push(() => { delete window.LETSdeal; });

      /* 5. Showcase, the scrubbed moment: a messy desk of picture scraps sorts itself into the board. */
      const pieces = $$('.cut .piece');
      gsap.fromTo(pieces, {
        x: () => rand(-220, 220), y: () => rand(-160, 160), rotation: () => rand(-18, 18), scale: () => rand(0.7, 0.92),
      }, {
        x: 0, y: 0, rotation: 0, scale: 1, ease: 'power2.out', stagger: { each: 0.02, from: 'random' },
        scrollTrigger: { trigger: '.cut', start: 'top 95%', end: 'center 55%', scrub: 0.6 },
      });
      gsap.from('.cut .t', {
        autoAlpha: 0, scale: 0.8, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.09,
        scrollTrigger: { trigger: '.cut', start: 'top 70%', once: true },
      });

      /* 6. How it works, the pinned moment (wide screens): the scroll walks through the four stages. */
      if (wide && window.LETSstage) {
        ScrollTrigger.create({
          trigger: '.how', start: 'center center', end: () => '+=' + Math.round(innerHeight * 1.3),
          pin: true, anticipatePin: 1,
          onUpdate: (self) => window.LETSstage(Math.min(3, Math.floor(self.progress * 4))),
        });
      }

      /* 7. About: the skyline drifts inside its frame. */
      gsap.fromTo('.about__photo img', { yPercent: -6, scale: 1.14 }, {
        yPercent: 6, scale: 1.14, ease: 'none',
        scrollTrigger: { trigger: '.about__photo', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      /* 8. Contact: the strip of pictures runs as a slow marquee, pausable (Animaxxing marquee). */
      const strip = $('[data-marquee]');
      const row = strip && $('.strip__track', strip);
      const toggle = $('[data-marquee-toggle]');
      if (strip && row) {
        const inner = document.createElement('div');
        inner.className = 'strip__inner';
        row.before(inner); inner.append(row);
        const clone = row.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true'); clone.inert = true;
        inner.append(clone);
        const width = row.offsetWidth + parseFloat(getComputedStyle(row).columnGap || 0);
        const loop = gsap.fromTo(inner, { x: 0 }, { x: -width, duration: width / 28, ease: 'none', repeat: -1 });
        let paused = false;
        const sync = (visible = true) => { if (paused || !visible) loop.pause(); else loop.play(); };
        const seen = ScrollTrigger.create({ trigger: strip, start: 'top bottom', end: 'bottom top', onToggle: (s) => sync(s.isActive) });
        const slow = (v) => gsap.to(loop, { timeScale: v, duration: 0.4, ease: 'power2.out' });
        strip.addEventListener('pointerenter', () => slow(0.2));
        strip.addEventListener('pointerleave', () => slow(1));
        if (toggle) {
          toggle.hidden = false;
          const onToggle = () => { paused = !paused; toggle.textContent = paused ? 'Play the pictures' : 'Pause the pictures'; toggle.setAttribute('aria-pressed', String(paused)); sync(seen.isActive); };
          toggle.addEventListener('click', onToggle);
          live.push(() => { toggle.removeEventListener('click', onToggle); toggle.hidden = true; });
        }
        live.push(() => { loop.kill(); inner.before(row); inner.remove(); });
      }

      /* 9. Footer: the block letters of the mark rise from the baseline at different speeds as the page ends. */
      $$('.mark g').forEach((g, i) => {
        gsap.from(g, {
          yPercent: 55 + i * 12, ease: 'none',
          scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'top 35%', scrub: 0.4 },
        });
      });

      /* 10. The primary actions lean toward a fine pointer, and spring back (Animaxxing magnetic). */
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        $$('.btn, .bar__action, .form__send').forEach((el) => {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
          const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
          const move = (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.22); yTo((e.clientY - r.top - r.height / 2) * 0.3); };
          const leave = () => { xTo(0); yTo(0); gsap.to(el, { scale: 1, duration: 0.3, ease: 'power3.out' }); };
          const press = () => gsap.to(el, { scale: 0.96, duration: 0.12, ease: 'power2.out' });
          const release = () => gsap.to(el, { scale: 1, duration: 0.3, ease: 'power3.out' });
          el.addEventListener('pointerdown', press); el.addEventListener('pointerup', release);
          el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
          live.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); el.removeEventListener('pointerdown', press); el.removeEventListener('pointerup', release); gsap.set(el, { clearProps: 'transform' }); });
        });
      }

      return () => live.forEach((fn) => fn());
    });
  };

  const fontsReady = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]);
  const start = () => fontsReady.then(build).then(() => {
    addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
