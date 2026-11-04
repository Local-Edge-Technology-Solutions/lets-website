// Local Edge prototype: the motion layer (GSAP 3.15.0 + ScrollTrigger + SplitText, from jsDelivr).
// Built with the official GSAP skills and Animaxxing recipes (charsRiseIn, linesMaskIn, revealOnScroll,
// pinnedScene, parallax, marquee, countUp, pressFeedback, shake), adapted to plain JS.
// Rules held: content is readable without this file; nothing waits hidden except the hero intro (released by
// the head timer); reduced motion gets the settled page with no splits, pins or loops.
(() => {
  const root = document.documentElement;
  const release = () => { if (root.getAttribute('data-boot') === 'pending') root.setAttribute('data-boot', 'running'); };
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText || reduced()) { root.setAttribute('data-boot', 'recovered'); return; }
  const { gsap, ScrollTrigger, SplitText } = window;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ overwrite: 'auto' });
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mm = gsap.matchMedia();

  // Fonts bounded, so a stalled face never holds the intro (gsap-vanilla initialization contract).
  const fontsReady = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 700))]);

  // The hero intro starts at once (character masks reflow with the face if it swaps); triggers re-measure after fonts.
  fontsReady.then(() => { if (window.LETS_fit) window.LETS_fit(); ScrollTrigger.refresh(); });
  {

    mm.add({ any: 'all', wide: '(min-width: 1000px)', calm: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      if (ctx.conditions.calm) { root.setAttribute('data-boot', 'recovered'); return; }
      const wide = ctx.conditions.wide;

      /* ---------- 1. Hero intro: the name rises letter by letter out of its own band (charsRiseIn) ---------- */
      const late = root.getAttribute('data-boot') === 'recovered';
      const name = $('.monument__word');
      const split = SplitText.create(name, { type: 'chars', mask: 'chars', aria: 'hidden' });
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => split.revert() });
      intro
        .from(split.chars, { yPercent: 118, duration: late ? 0.5 : 0.95, stagger: 0.032 }, 0)
        .fromTo('.tile--photo', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.0, ease: 'power3.inOut', clearProps: 'clipPath' }, 0.1)
        .from('.tile--photo img', { scale: 1.14, duration: 1.3, clearProps: 'scale' }, 0.1)
        .from('.tile--statement, .hero__rail > li', { autoAlpha: 0, y: 18, duration: 0.6, ease: 'power3.out', stagger: 0.06, clearProps: 'transform,opacity,visibility' }, 0.35)
        .from('.hero__left > *, .hero__links', { autoAlpha: 0, y: 14, duration: 0.5, ease: 'power3.out', stagger: 0.06, clearProps: 'transform,opacity,visibility' }, 0.5);
      release();

      /* ---------- 2. Hero exit: the name is pushed further over the screen's edge, the photo sinks ---------- */
      gsap.to('.monument__line', { xPercent: -7, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.tile--photo img', { yPercent: 8, scale: 1.06, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

      /* ---------- 3. Headings: lines wiped up behind masks as they arrive (linesMaskIn) ---------- */
      $$('.intro__title, .show__title, .about__title, .q, h2.row__text').forEach((el) => {
        const s = SplitText.create(el, { type: 'lines', mask: 'lines', aria: 'auto' });
        gsap.from(s.lines, {
          yPercent: 112, duration: 0.9, ease: 'expo.out', stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onComplete: () => s.revert(),
        });
      });

      /* ---------- 4. Parts of each section rise in turn (revealOnScroll: opacity only, so tab order stays) ---------- */
      const rise = (targets, opts = {}) => {
        const items = gsap.utils.toArray(targets);
        if (!items.length) return;
        gsap.set(items, { opacity: 0, y: opts.y ?? 22 });
        ScrollTrigger.batch(items, {
          start: 'top 90%', once: true,
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: opts.duration ?? 0.7, ease: 'power3.out', stagger: opts.stagger ?? 0.08, clearProps: 'transform,opacity' }),
        });
        items.forEach((item) => item.addEventListener('focusin', () => gsap.set(item, { clearProps: 'transform,opacity' })));
      };
      rise('.intro__note');
      rise('.intro__facts > div', { stagger: 0.09 });
      rise('.intro__lead');
      rise('.picker legend, .picker button', { y: 14, stagger: 0.04, duration: 0.5 });
      rise('.show__caption');
      rise('.about__facts li', { stagger: 0.07 });
      rise('.bio', { stagger: 0.12, y: 28 });
      rise('.a', { y: 16 });
      rise('.row__hint, .form input, .form textarea', { y: 12, stagger: 0.05 });
      rise('.foot__cols > *', { stagger: 0.07 });

      /* ---------- 5. Pictures open from a clip, the image settling inside (imageReveal) ---------- */
      gsap.fromTo('.intro__clip video', { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.12 }, {
        clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.2, ease: 'power3.inOut', clearProps: 'clipPath,scale',
        scrollTrigger: { trigger: '.intro__clip', start: 'top 88%', once: true },
      });
      gsap.from('.initial', { scale: 0.4, rotation: -12, autoAlpha: 0, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.15, clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: '.about__text', start: 'top 85%', once: true } });

      // The band of panels opens like shutters, left to right, then the example outputs slide up into them.
      const band = $('.band');
      if (wide) {
        const bandTl = gsap.timeline({ scrollTrigger: { trigger: band, start: 'top 85%', once: true } });
        bandTl
          .from('.panel', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.0, ease: 'power3.inOut', stagger: 0.12, clearProps: 'clipPath' })
          .from('.panel__title', { xPercent: -100, duration: 0.7, ease: 'expo.out', clearProps: 'transform' }, 0.5)
          .from('.band [data-ui]', { y: 60, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, clearProps: 'transform,opacity,visibility' }, 0.55);
      } else {
        // Stacked on narrow screens: each panel opens as it arrives, so none is caught half-open.
        $$('.panel').forEach((panel) => {
          gsap.timeline({ scrollTrigger: { trigger: panel, start: 'top 88%', once: true } })
            .from(panel, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.8, ease: 'power3.inOut', clearProps: 'clipPath' })
            .from($('[data-ui]', panel), { y: 40, autoAlpha: 0, duration: 0.6, ease: 'expo.out', clearProps: 'transform,opacity,visibility' }, 0.25);
        });
      }
      // Inside each panel the archive photograph drifts against the scroll (parallax, held at 108% in its frame).
      $$('.panel > img').forEach((img) => {
        gsap.fromTo(img, { yPercent: -3, scale: 1.12 }, { yPercent: 3, scale: 1.12, ease: 'none', scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      /* ---------- 6. The live thing: example outputs swap row by row; the invoice total counts up ---------- */
      const L = window.LETS;
      if (L) {
        let swapTl;
        L.animateSwap = (render) => {
          if (swapTl) swapTl.progress(1);
          const parts = () => $$('.band .calls li, .band .sms__out, .band .sms__in, .band .bills tr, .band .bills__button, .band .report__figs > div, .band .report__note, .band [data-f="bizName"]');
          swapTl = gsap.timeline();
          swapTl.to(parts(), { autoAlpha: 0, y: -10, duration: 0.18, ease: 'power2.in', stagger: 0.015 });
          swapTl.add(() => {
            render();
            const total = $('[data-f="billTotal"]');
            const final = total.textContent;
            const value = Number(final.replace(/[^0-9.]/g, ''));
            const counter = { n: value * 0.35 };
            gsap.to(counter, { n: value, duration: 1.1, ease: 'power3.out', onUpdate: () => { total.textContent = '$' + counter.n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }, onComplete: () => { total.textContent = final; } });
            gsap.fromTo(parts(), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.03, clearProps: 'transform,opacity,visibility' });
          });
        };
      }

      /* ---------- 7. The signature move: the edge-to-edge marquee, driven by the scroll's speed ---------- */
      const mq = $('.marquee');
      const track = $('.marquee__track');
      const toggle = $('.marquee__toggle');
      const half = track.scrollWidth / 2;
      const loop = gsap.fromTo(track, { x: 0 }, { x: -half, duration: half / 70, ease: 'none', repeat: -1 });
      let userPaused = false;
      let boost;
      ScrollTrigger.create({
        trigger: mq, start: 'top bottom', end: 'bottom top',
        onToggle: (self) => { if (userPaused) return; self.isActive ? loop.play() : loop.pause(); },
        onUpdate: (self) => {
          if (userPaused) return;
          const v = self.getVelocity();
          // Faster with the scroll; it runs backwards for a moment when the visitor scrolls up.
          const speed = gsap.utils.clamp(-5, 6, 1 + v / 450);
          boost && boost.kill();
          loop.timeScale(speed);
          boost = gsap.to(loop, { timeScale: 1, duration: 1.2, ease: 'power2.out' });
        },
      });
      mq.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && !userPaused) gsap.to(loop, { timeScale: 0.25, duration: 0.4 }); });
      mq.addEventListener('pointerleave', () => { if (!userPaused) gsap.to(loop, { timeScale: 1, duration: 0.4 }); });
      toggle.hidden = false;
      toggle.addEventListener('click', () => {
        userPaused = !userPaused;
        toggle.setAttribute('aria-pressed', String(userPaused));
        toggle.textContent = userPaused ? 'Play' : 'Pause';
        userPaused ? loop.pause() : loop.play();
      });

      /* ---------- 8. How it works: one held screen, "Let's" stays, the verb rolls over (pinnedScene) ---------- */
      const how = $('.how');
      const steps = $$('.step', how);
      const count = $('[data-count-now]', how);
      how.classList.add('is-scene');
      const words = steps.map((s) => $('.verb__word', s));
      const heads = steps.map((s) => $('.step__word', s));
      const says = steps.map((s) => $('.step__say', s));
      const pics = steps.map((s) => $('img', s));
      gsap.set(heads.slice(1), { autoAlpha: 0 });
      gsap.set(words.slice(1), { yPercent: 110 });
      gsap.set(says.slice(1), { autoAlpha: 0, y: 24 });
      gsap.set(pics.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
      // Four rests at 0, 1, 2 and 3; each change takes 0.6 of the unit between them. When the visitor stops
      // scrolling, the scene settles on the nearest rest, so no verb is ever left half rolled.
      const scene = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: how, start: 'top top', end: () => '+=' + innerHeight * 3, pin: true, scrub: true, anticipatePin: 1,
          snap: { snapTo: [0, 1 / 3, 2 / 3, 1], directional: false, inertia: false, duration: { min: 0.15, max: 0.35 }, delay: 0.05, ease: 'power2.inOut' },
          onUpdate: (self) => { if (count) count.textContent = String(Math.round(self.progress * 3) + 1); },
        },
      });
      scene.fromTo(pics[0], { scale: 1.12 }, { scale: 1, duration: 1 }, 0);
      for (let i = 1; i < steps.length; i++) {
        const at = i - 0.8;
        scene
          .to(words[i - 1], { yPercent: -110, duration: 0.22, ease: 'power2.in' }, at)
          .to(says[i - 1], { autoAlpha: 0, y: -16, duration: 0.2 }, at)
          .to(pics[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: 'power2.inOut' }, at)
          .fromTo(pics[i], { scale: 1.18 }, { scale: 1, duration: 1 }, at)
          .set(heads[i - 1], { autoAlpha: 0 }, at + 0.22)
          .set(heads[i], { autoAlpha: 1 }, at + 0.22)
          .to(words[i], { yPercent: 0, duration: 0.3, ease: 'expo.out' }, at + 0.22)
          .to(says[i], { autoAlpha: 1, y: 0, duration: 0.25 }, at + 0.3);
      }
      scene.set({}, {}, 3);

      /* ---------- 9. The footer: the name returns, letter by letter, at full width ---------- */
      const mark = $('.wordmark span');
      const ms = SplitText.create(mark, { type: 'chars', mask: 'chars', aria: 'none' });
      gsap.from(ms.chars, { yPercent: 115, duration: 1, ease: 'expo.out', stagger: 0.045, scrollTrigger: { trigger: '.foot__mark', start: 'top 92%', once: true }, onComplete: () => ms.revert() });

      /* ---------- 10. Feedback under the hand: squash and an ink ripple on every press (pressFeedback) ---------- */
      $$('.action-tile, .picker button, .go, .hero__links a, .marquee__toggle').forEach((control) => {
        control.style.webkitTapHighlightColor = 'transparent';
        if (getComputedStyle(control).position === 'static') control.style.position = 'relative';
        control.style.overflow = 'clip';
        let pressed = false;
        const big = control.matches('.go, .action-tile');
        const press = (x, y) => {
          if (pressed) return; pressed = true;
          gsap.to(control, { scale: big ? 0.985 : 0.94, duration: 0.12, ease: 'power2.out' });
          const box = control.getBoundingClientRect();
          const reach = Math.hypot(Math.max(x, box.width - x), Math.max(y, box.height - y));
          const drop = document.createElement('span');
          drop.setAttribute('aria-hidden', 'true');
          Object.assign(drop.style, { position: 'absolute', left: x - reach + 'px', top: y - reach + 'px', width: reach * 2 + 'px', height: reach * 2 + 'px', borderRadius: '50%', background: 'currentColor', pointerEvents: 'none' });
          control.append(drop);
          gsap.fromTo(drop, { scale: 0, opacity: 0.28 }, { scale: 1, opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => drop.remove() });
        };
        const up = () => { if (!pressed) return; pressed = false; gsap.to(control, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' }); };
        control.addEventListener('pointerdown', (e) => { if (e.button !== 0) return; const b = control.getBoundingClientRect(); press(e.clientX - b.left, e.clientY - b.top); });
        ['pointerup', 'pointercancel', 'pointerleave', 'keyup', 'blur'].forEach((t) => control.addEventListener(t, up));
        control.addEventListener('keydown', (e) => { if (e.repeat || (e.key !== 'Enter' && e.key !== ' ')) return; const b = control.getBoundingClientRect(); press(b.width / 2, b.height / 2); });
      });

      // A refused submit shakes the field once; the error text and aria-invalid say the same thing.
      if (L) L.shake = (el) => {
        const tl = gsap.timeline();
        [1, -0.8, 0.55, -0.3, 0.12, 0].forEach((s) => tl.to(el, { x: s * 10, duration: 0.066, ease: 'sine.inOut' }));
        tl.set(el, { clearProps: 'transform' });
      };

      // Layout settles after fonts and images; measure again then.
      addEventListener('load', () => ScrollTrigger.refresh());

      return () => {
        how.classList.remove('is-scene');
        toggle.hidden = true;
        if (L) { L.animateSwap = null; L.shake = null; }
      };
    });
  }
})();
