// Local Edge prototype: fitted type, reveals, the business picker (the live thing), the clip, the form.
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- fitted type: measured, never guessed ---------- */
  const fitters = [...document.querySelectorAll('[data-fit]')];
  const fit = () => {
    for (const el of fitters) {
      const word = el.querySelector('span span') || el.querySelector('span');
      const box = el.closest('.hero__band, .foot__mark');
      if (!word || !box) continue;
      const probe = 100;
      el.style.fontSize = probe + 'px';
      const w = word.getBoundingClientRect().width;
      if (!w) continue;
      const cs = getComputedStyle(box);
      const inner = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const margin = parseFloat(getComputedStyle(document.querySelector('.hero')).paddingLeft) || 20;
      // the hero name starts on the margin and runs off the right edge: the screen's edge crops "Edge"
      const target = el.dataset.fit === 'band' ? (box.clientWidth - margin) * 1.05 : inner;
      el.style.fontSize = (probe * target / w).toFixed(2) + 'px';
    }
  };
  fit();
  window.LETS_fit = fit;
  if (document.fonts) document.fonts.ready.then(fit);
  let lastW = innerWidth;
  addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; fit(); } });

  /* ---------- the clip plays only in view, never under reduced motion ---------- */
  const clips = [...document.querySelectorAll('video[autoplay]')];
  const inView = new Set();
  const settle = () => clips.forEach((v) => {
    if (calm.matches) { v.removeAttribute('autoplay'); v.pause(); v.load(); }
    else if (inView.has(v)) v.play().catch(() => {});
  });
  if ('IntersectionObserver' in window) {
    const watch = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inView.add(e.target); else inView.delete(e.target);
        if (!calm.matches) { if (inView.has(e.target)) e.target.play().catch(() => {}); else e.target.pause(); }
      }
    }, { threshold: 0.2 });
    clips.forEach((v) => watch.observe(v));
  }
  settle();
  calm.addEventListener('change', settle);

  /* ---------- the live thing: businesses like yours ---------- */
  // Every name, number and amount below is made up. Totals are added up here, so they always agree.
  const B = {
    plumbing: {
      name: 'Brightwater Plumbing', calls: [
        ['Dana Whitfield', 'Water heater leaking in the garage', '7:42 am', 'Urgent'],
        ['Luis Ortega', 'Quote for a kitchen sink swap', '9:15 am'],
        ['Pam Reddick', 'Move Thursday’s visit', '11:03 am'],
        ['Gary Hensley', 'Asked about a second bathroom', '12:30 pm']],
      smsTo: 'Marcus', sms: 'Hi Marcus, it’s Brightwater Plumbing. Your water heater install is Thursday, 8–10 am. Reply 1 to confirm or 2 to pick another time.', back: 'Confirmed. See you Thursday.',
      billTitle: 'Invoices waiting for your OK', bills: [['Whitfield, water heater', 1840], ['Ortega, sink swap', 415], ['Reddick, drain clearing', 185], ['Hensley, estimate visit', 95]],
      figs: [['Jobs finished', '23'], ['Invoiced', '$18,420'], ['Unpaid 30+ days', '$2,310']], finding: 'Water heaters were 6 of the 23 jobs.'
    },
    dental: {
      name: 'Maple Street Dental', calls: [
        ['Teresa Lam', 'Toothache, hoping for today', '7:58 am', 'Urgent'],
        ['Ray Dillard', 'New patients, family of four', '8:40 am'],
        ['Owen Bratcher', 'Question about his insurance', '10:12 am'],
        ['Keisha Moore', 'Can Friday move to 2:15?', '1:05 pm']],
      smsTo: 'Keisha', sms: 'Hi Keisha, this is Maple Street Dental. Your cleaning is Tuesday at 2:15 pm. Reply 1 to confirm or 2 to reschedule.', back: 'Thanks, Keisha. You’re confirmed for Tuesday.',
      billTitle: 'Claims ready to send', bills: [['Lam, emergency exam', 142], ['Moore, cleaning', 118], ['Dillard family, new patient visits', 472], ['Pike, crown', 1150]],
      figs: [['Appointments kept', '96'], ['No-shows', '4'], ['New patients', '9']], finding: 'Three of the four no-shows were Tuesday afternoons.'
    },
    restaurant: {
      name: 'The Copper Kettle', calls: [
        ['Alyssa Grant', 'Party of 14 this Saturday', '10:20 am', 'Today'],
        ['Mike Tran', 'Catering for 60 on Nov 15', '11:02 am'],
        ['Joan Fields', 'Left a card here on Friday', '2:47 pm'],
        ['Devon Hale', 'Nut allergy, asking about the menu', '4:15 pm']],
      smsTo: 'Alyssa', sms: 'Hi Alyssa, it’s The Copper Kettle. We have your party of 14 on Saturday at 7 pm. Reply 1 to confirm or 2 to change the count.', back: 'Perfect, see you Saturday at 7.',
      billTitle: 'Vendor bills waiting for your OK', bills: [['Produce, week of Oct 27', 684.20], ['Meat and poultry', 1212.75], ['Linen service', 148], ['Ice delivery', 62]],
      figs: [['Covers', '1,148'], ['Food cost', '31%'], ['Busiest hour', 'Fri 7–8 pm']], finding: 'Brunch covers were up 12% on last week.'
    },
    books: {
      name: 'Ledgerline Bookkeeping', calls: [
        ['Carla Voss', 'Can’t find her October receipts', '8:05 am'],
        ['Hank Peeler', 'Payroll question before Friday', '9:30 am', 'Today'],
        ['Sun Ji', 'New client, just formed an LLC', '11:48 am'],
        ['Rob Fenn', 'Wants a call before the 15th', '3:10 pm']],
      smsTo: 'Hank', sms: 'Hi Hank, it’s Ledgerline. We still need your October bank statement to close the month. Reply with a photo, or reply 2 and we’ll call you.', back: 'Got it, thanks Hank. October is closing today.',
      billTitle: 'Client invoices waiting for your OK', bills: [['Voss Landscaping, October', 450], ['Peeler Auto, October', 600], ['Sun Ji LLC, setup', 350], ['Fenn Rentals, October', 450]],
      figs: [['Books closed', '31 of 38'], ['Waiting on clients', '7'], ['Payroll runs', '12']], finding: 'Five of the seven are waiting on bank statements.'
    },
    rentals: {
      name: 'Oakmont Rentals', calls: [
        ['Unit 4B', 'No hot water since last night', '6:55 am', 'Urgent'],
        ['Tina Rowe', 'Wants to tour 12A', '9:40 am'],
        ['Unit 7C', 'Question about renewing the lease', '12:15 pm'],
        ['Phil Dorsey', 'Rent will be late, wants to talk', '5:20 pm']],
      smsTo: 'Tina', sms: 'Hi Tina, it’s Oakmont Rentals. Your tour of 12A is Wednesday at 5:30 pm. Reply 1 to confirm or 2 for another time.', back: 'You’re booked. Park in any visitor space.',
      billTitle: 'Repair bills waiting for your OK', bills: [['Plumber, unit 4B', 310], ['Lawn care, November', 520], ['HVAC filters, building A', 240], ['Locksmith, unit 7C', 95]],
      figs: [['Rent collected', '46 of 50'], ['Open work orders', '6'], ['Leases up in 60 days', '5']], finding: 'Two of the six open work orders are the same water heater.'
    },
    lawn: {
      name: 'Greenbrier Lawn & Land', calls: [
        ['Patty Walsh', 'Tree down after the storm', '7:10 am', 'Urgent'],
        ['Sandra Kim', 'Quote for a leaf clean-up', '8:25 am'],
        ['Jeff Ruiz', 'Was Tuesday’s mow missed?', '10:50 am'],
        ['Elm Court HOA', 'Spring contract renewal', '2:30 pm']],
      smsTo: 'Sandra', sms: 'Hi Sandra, it’s Greenbrier. Your leaf clean-up is Friday morning. Please leave the side gate unlocked. Reply 1 to confirm.', back: 'Thanks! The crew will be there by 9.',
      billTitle: 'Invoices waiting for your OK', bills: [['Kim, leaf clean-up', 380], ['Ruiz, October mowing', 240], ['Walsh, tree removal', 1150], ['Elm Court HOA, October', 2400]],
      figs: [['Yards done', '112'], ['Rain days', '1'], ['Crew hours', '286']], finding: 'Route B ran 40 minutes long four days out of five.'
    },
    law: {
      name: 'Pruitt & Lane', calls: [
        ['New caller', 'Car accident on Monday', '8:12 am', 'Today'],
        ['Mae Holt', 'Date for signing her will', '9:55 am'],
        ['Darren Cole', 'Status of his lease review', '1:20 pm'],
        ['Amy Ward', 'Returning your call', '4:40 pm']],
      smsTo: 'Mae', sms: 'Hi Mae, this is Pruitt & Lane. Your will signing is Thursday at 10 am. Please bring a photo ID. Reply 1 to confirm.', back: 'Thank you, Mae. See you Thursday.',
      billTitle: 'Invoices waiting for your OK', bills: [['Holt, estate planning', 1200], ['Cole, lease review', 450], ['Ward, October hours', 3375], ['Notary fees', 60]],
      figs: [['Billable hours', '142.5'], ['New enquiries', '11'], ['Court dates next week', '3']], finding: 'Four of the 11 new enquiries came in after 6 pm.'
    },
    salon: {
      name: 'Velvet Chair Salon', calls: [
        ['Nina Patel', 'Bridal party of five, in June', '9:05 am'],
        ['Brooke Ellis', 'Needs a colour correction', '10:30 am', 'Today'],
        ['Lena Moss', 'Can she move to 3 pm?', '12:45 pm'],
        ['Chris Webb', 'Gift card balance', '5:10 pm']],
      smsTo: 'Lena', sms: 'Hi Lena, it’s Velvet Chair. Your cut and colour is Saturday at 3 pm with Ashley. Reply 1 to confirm or 2 to reschedule.', back: 'See you Saturday, Lena!',
      billTitle: 'Orders waiting for your OK', bills: [['Colour supply order', 612.40], ['Towel service', 96], ['Retail restock', 338.15], ['Card reader fees', 41.99]],
      figs: [['Appointments', '164'], ['Rebooked before leaving', '61%'], ['Open chairs Saturday', '0']], finding: 'Saturdays are booked solid through December 6.'
    }
  };
  const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const f = (key) => document.querySelector(`[data-f="${key}"]`);
  const frags = [...document.querySelectorAll('.band [data-ui]')];

  const render = (b) => {
    f('bizName').textContent = b.name;
    f('callCount').textContent = `${b.calls.length} waiting`;
    f('calls').replaceChildren(...b.calls.map(([who, why, when, tag]) => {
      const li = el('li');
      li.append(el('span', 'calls__who', who), el('span', 'calls__why', why), el('span', 'calls__when', when));
      if (tag) li.append(el('span', 'calls__tag', tag));
      return li;
    }));
    f('smsTo').textContent = b.smsTo;
    f('smsOut').textContent = b.sms;
    f('smsBack').textContent = b.back;
    f('billTitle').textContent = b.billTitle;
    f('bills').replaceChildren(...b.bills.map(([what, amt]) => {
      const tr = el('tr');
      tr.append(el('td', null, what), el('td', 'num', money(amt)));
      return tr;
    }));
    f('billTotal').textContent = money(b.bills.reduce((s, [, a]) => s + a, 0));
    f('billButton').textContent = `Approve all ${b.bills.length}`;
    f('figs').replaceChildren(...b.figs.map(([k, v]) => { const d = el('div'); d.append(el('dt', null, k), el('dd', null, v)); return d; }));
    f('finding').textContent = b.finding;
  };

  const buttons = [...document.querySelectorAll('.picker button')];
  // motion.js may register an animated swap; without it (or under reduced motion) the change is instant.
  window.LETS = { render, B, frags, animateSwap: null };
  const choose = (btn) => {
    const b = B[btn.dataset.biz];
    if (!b || btn.getAttribute('aria-pressed') === 'true') return;
    buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === btn)));
    if (window.LETS.animateSwap && !calm.matches) window.LETS.animateSwap(() => render(b));
    else render(b);
  };
  buttons.forEach((btn) => btn.addEventListener('click', () => choose(btn)));

  /* ---------- the form: a prototype, so nothing is sent ---------- */
  const form = document.querySelector('.form');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = form.querySelector('.go__status');
    const bad = [...form.querySelectorAll('[required]')].find((x) => !x.value.trim() || !x.checkValidity());
    if (bad) { bad.focus(); if (window.LETS.shake) window.LETS.shake(bad); status.textContent = bad.name === 'email' ? 'Add an email address so we can write back.' : 'Add a sentence about your week first.'; return; }
    status.textContent = 'Thanks. This is a prototype, so nothing was sent.';
  });
})();
