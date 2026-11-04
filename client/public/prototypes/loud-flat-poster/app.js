// LETS prototype. Every slip is a made-up example; names, towns and amounts are invented.
(() => {
  // [title, rows, foot, kind]. rows: [label, value] pairs, or a string for a message.
  const T = {
    plumbing: [
      ['Call-backs for Tuesday', [['9:00 Dana R., Smyrna', 'no heat'], ['9:20 M. Ortiz, La Vergne', 'quote'], ['10:05 Pat W., Antioch', 'leak'], ['10:40 J. Bell, Smyrna', 'filters'], ['11:15 T. Nguyen, Murfreesboro', 'move']], '5 calls, sorted by drive time'],
      ['Quotes waiting on a yes', [['Hughes, 3-ton unit', '$6,480'], ['Carter, repipe', '$3,150'], ['Lee, tankless heater', '$2,900']], 'Follow-up texts go out Friday at 9'],
      ['Text to a customer', '“Hi Pat, it’s the furnace check you booked. Mike will be there Thursday between 8 and 10. Reply 1 to confirm or 2 to move it.”', 'Sent 9:00. Confirmed 9:14'],
      ['Wednesday route, van 2', [['8:00 Franklin', 'tune-up'], ['9:30 Brentwood', 'thermostat'], ['11:00 Nolensville', 'no cool'], ['1:30 Spring Hill', 'install']], 'Drive time 1 h 52 m'],
      ['Parts to reorder', [['1/2 in. PEX elbows', '12 left'], ['Push-fit couplings', '6 left'], ['16x25 filters', '9 left']], 'Purchase order drafted for Linda'],
      ['The week, on one page', [['Jobs closed', '31'], ['Invoiced', '$18,240'], ['Unpaid over 30 days', '4'], ['Review requests sent', '12']], 'Lands in your inbox Friday at 4'],
    ],
    salon: [
      ['Text to a client', '“Hi Dana! You’re with Marisol on Thursday at 2:30 for color and a cut. Reply C to confirm or R to reschedule.”', 'Sent 9:00. Confirmed 9:41'],
      ['Saturday gaps', [['10:00 Keisha', '45 min'], ['1:30 Marisol', '90 min'], ['Waitlist texted', '14']], 'First reply gets the chair'],
      ['Due back this month', [['Amy L.', '9 weeks'], ['Rosa P.', '7 weeks'], ['Kim T.', '8 weeks']], 'Three rebook texts drafted'],
      ['Color to reorder', [['Level 7 neutral', '2 tubes'], ['20 vol developer', '1 bottle'], ['Pearl toner', '3 tubes']], 'Order ready to send, $212.40'],
      ['New client form, sorted', [['Jess M., Hendersonville', 'new'], ['Wants', 'balayage'], ['Booked with', 'Keisha'], ['When', 'Tue 11:00']], 'Patch-test reminder set'],
      ['The week, on one page', [['Appointments', '86'], ['No-shows', '2'], ['Rebooked at checkout', '61'], ['Gift cards sold', '7']], 'Lands in your inbox Friday at 4'],
    ],
    bookkeeping: [
      ['Invoices ready to approve', [['Hale Contracting', '$1,850.00'], ['Rivera Dental', '$640.00'], ['Cumberland Feed', '$2,215.50'], ['Oak St. Bakery', '$395.00']], '$5,100.50', 'approve'],
      ['Receipts matched this week', [['Matched to the bank', '42 of 45'], ['Hardware store', '$86.12'], ['Fuel', '$61.40'], ['Online order', '$23.99']], 'Three need a look from you'],
      ['Still waiting on documents', [['Hale Contracting', '2 statements'], ['J. Parks', '1099'], ['Rivera Dental', 'payroll']], 'Reminder emails sent Monday at 8'],
      ['Month end, October', [['Bank reconciled', 'done'], ['Payroll posted', 'done'], ['Sales tax report', 'drafted'], ['Owner review', 'waiting']], 'One step left, and it’s yours'],
      ['Client email, reply drafted', '“Where do I send September’s receipts?” Draft: “Hi Carla, just forward them or snap a photo of each. They file themselves now.”', 'Waiting for your OK'],
      ['Over 30 days', [['Rivera Dental', '$640'], ['Lane Roofing', '$1,920'], ['M. Shaw', '$275']], 'Three friendly nudges drafted'],
    ],
    bakery: [
      ['Bake list, 4:30 a.m.', [['Sourdough', '48'], ['Biscuits', '120'], ['Cinnamon rolls', '60'], ['Pecan pies', '14']], 'Built from orders and last Saturday'],
      ['Wholesale, Saturday', [['Main St. Coffee', '6 dz biscuits'], ['Corner Café', '4 loaves'], ['Riverside Market', '30 cookies']], 'Invoices go out with the van'],
      ['Thanksgiving pre-orders', [['Pecan', '38 of 60'], ['Pumpkin', '41 of 60'], ['Chess pie', '22 of 30']], 'Nine Wednesday pickup slots left'],
      ['Text to a customer', '“Your 2 pecan pies are ready Wednesday after 2. Pick up at the side door on 5th. Reply HELP for directions.”', 'Sent 3:00'],
      ['Flour and butter', [['Bread flour', '3 bags'], ['Butter', '18 lb'], ['Pecans', '6 lb']], 'Supplier email drafted'],
      ['The week, on one page', [['Best seller', 'biscuits'], ['Busiest hour', 'Sat 8–9'], ['Sold out by noon', '3 days'], ['Wholesale', '$1,480']], 'Lands in your inbox Friday at 4'],
    ],
    law: [
      ['New enquiries, sorted', [['Lease dispute, Gallatin', 'today'], ['Will update, Franklin', 'this week'], ['Small claims, Lebanon', 'this week'], ['Patent question', 'polite no']], 'Sorted and drafted by an AI tool, checked by you'],
      ['Call summary, drafted', [['Caller', 'R. Cole'], ['Matter', 'deposit kept'], ['Amount', '$1,800'], ['Deadline', 'Nov 21']], 'Consult booked Tuesday at 10'],
      ['Court dates, this week', [['Mon 9:00', 'hearing'], ['Wed 1:30', 'mediation'], ['Fri 10:00', 'motion']], 'Files pulled the day before'],
      ['Still needed from clients', [['Cole', 'signed lease'], ['Tran', 'photos'], ['Whitfield', 'statements']], 'Reminders sent, two opened'],
      ['Text to a client', '“Hi Ms. Cole, a reminder of your 10:00 appointment Tuesday. Please bring your lease and any texts from the landlord.”', 'Sent Monday at 4'],
      ['Time not yet billed', [['Cole', '2.4 h'], ['Tran', '1.1 h'], ['Whitfield', '5.6 h']], 'Pulled from calendar and email'],
    ],
    lawn: [
      ['Rain day texts', [['Rain tomorrow from', '7 a.m.'], ['Thursday mows move to', 'Friday'], ['Customers texted', '23']], 'Two asked for Saturday'],
      ['Crew sheet, Monday', [['Crew A, Brentwood', '6 yards'], ['Crew B, Franklin', '5 yards'], ['Crew C, Nolensville', '2 installs']], 'Gas and gear checklist attached'],
      ['Estimates out', [['Mulch, 14 yards', '$1,260'], ['Leaf cleanup', '$480'], ['Retaining wall', '$5,900']], 'Follow-ups go out Thursday'],
      ['Leaf season sign-ups', [['Weekly', '31'], ['Every two weeks', '18'], ['One time', '12']], 'Route drafted for November 10'],
      ['Invoices from job notes', '“Did front and back, edged, blew the drive.” Became: Mow and edge, $55. “Trimmed 4 hollies.” Became: Shrub trim, $120.', 'Twelve invoices drafted'],
      ['The week, on one page', [['Yards mowed', '147'], ['Rain days', '1'], ['New customers', '6'], ['Invoiced', '$9,870'], ['Still unpaid', '$1,140']], 'Lands in your inbox Friday at 4'],
    ],
  };
  T.any = [T.plumbing[0], T.bookkeeping[0], T.salon[0], T.bakery[0], T.law[0], T.lawn[5]];
  const NAMES = { any: 'any business', plumbing: 'plumbing and HVAC', salon: 'a salon', bookkeeping: 'bookkeeping', bakery: 'a bakery', law: 'a law office', lawn: 'landscaping' };
  const HEIGHTS = [40, 34, 44, 30, 38, 28];

  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const slipHTML = ([title, rows, foot, kind]) => {
    const body = typeof rows === 'string'
      ? `<p class="slip__msg">${esc(rows)}</p>`
      : `<dl>${rows.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>`;
    const end = kind === 'approve' ? `<span class="ui-btn">Approve all ${rows.length}</span> ${esc(foot)}` : esc(foot);
    return `<p class="slip__top"><b>${esc(title)}</b><span>Example</span></p><p class="slip__rule" aria-hidden="true">- - - - - - - - - - - - - - - -</p>${body}<p class="slip__foot">${end}</p>`;
  };

  const list = document.querySelector('[data-slips]');
  const status = document.querySelector('[data-picker-status]');
  const picker = document.querySelector('.picker');
  if (list && picker) {
    const slips = [...list.children];
    const calm = matchMedia('(prefers-reduced-motion: reduce)');
    let current = 'any';
    const fill = (trade) => {
      T[trade].forEach((s, i) => { slips[i].innerHTML = slipHTML(s); slips[i].style.setProperty('--h', HEIGHTS[i]); });
      status.textContent = `Showing examples for ${NAMES[trade]}.`;
    };
    picker.addEventListener('change', (e) => {
      const trade = e.target.value;
      if (!T[trade] || trade === current) return;
      current = trade;
      if (calm.matches || !window.LETSmotion) { fill(trade); return; }
      window.LETSmotion.redeal(slips, () => fill(trade));
    });
  }

  // The prototype form: check it, say plainly that nothing is sent.
  const form = document.getElementById('contact-form');
  if (form) {
    const say = form.querySelector('[data-form-status]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const missing = [...form.querySelectorAll('[required]')].find((f) => !f.checkValidity());
      if (missing) { missing.focus(); say.textContent = missing.name === 'email' ? 'Add an email address so we can write back.' : 'Add a line about your business first.'; say.classList.add('is-said'); return; }
      say.textContent = 'Thanks. This is a prototype, so nothing was sent.';
      say.classList.add('is-said');
    });
  }

  // Clips play only in view, never under reduced motion.
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const clips = [...document.querySelectorAll('video[autoplay]')];
  const inView = new Set();
  const settle = () => clips.forEach((v) => {
    if (calm.matches) { v.removeAttribute('autoplay'); v.pause(); }
    else if (inView.has(v)) v.play().catch(() => {});
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inView.add(e.target); else inView.delete(e.target);
        if (!calm.matches) { if (inView.has(e.target)) e.target.play().catch(() => {}); else e.target.pause(); }
      }
    }, { threshold: 0.2 });
    clips.forEach((v) => io.observe(v));
  }
  settle();
  calm.addEventListener('change', settle);
})();
