/* LETS prototype, dense-tiles. Vanilla JS, no libraries.
   Example data below is made up: every name, business and figure is a sample for the design. */

const EXAMPLES = {
  plumbing: {
    label: 'Plumbing',
    business: 'Ridgeway Plumbing',
    calls: {
      title: 'Call-backs for Tue, Nov 3',
      sub: 'From last night’s voicemails, texts and web forms',
      rows: [
        ['Dana Whitfield', 'Water heater leaking in the garage', 'Voicemail, 7:42 pm', 'Urgent'],
        ['Marcus Bell', 'Quote for a bathroom remodel', 'Web form, 9:15 pm', 'Quote'],
        ['Priya Raman', 'Kitchen sink draining slowly', 'Voicemail, 10:03 pm', 'Book'],
        ['Tom Avery', 'Wants to move Thursday’s visit', 'Text, 6:51 am', 'Move'],
        ['Lena Ortiz', 'How to keep the outdoor tap from freezing', 'Voicemail, 7:20 am', 'Question'],
      ],
    },
    report: {
      title: 'Friday report, Oct 26–30',
      kpis: [['Jobs done', '23'], ['Invoiced', '$14,860'], ['Paid', '$11,240'], ['Still owed', '$3,620']],
      chart: 'Jobs per day',
      bars: [['Mon', 5], ['Tue', 4], ['Wed', 6], ['Thu', 3], ['Fri', 5]],
      finding: 'Water heaters were 9 of the 23 jobs.',
    },
    invoices: {
      title: 'Invoices ready to send',
      action: 'Approve and send 4',
      rows: [
        ['Whitfield, D.', 'Water heater replacement', 1480],
        ['Greer, S.', 'Drain clearing', 185],
        ['Kaplan, J.', 'Toilet rebuild', 240],
        ['Mendez, R.', 'Shut-off valve', 410],
      ],
    },
    text: {
      to: 'Carol Jensen',
      out: 'Hi Carol, it’s Ridgeway Plumbing. Your visit is tomorrow, Tue Nov 3, between 10 and 12. Reply 1 to confirm or 2 to pick another time.',
      reply: '1',
      back: 'Thanks, you’re confirmed. Mike will text when he’s on the way.',
    },
  },
  dental: {
    label: 'Dental office',
    business: 'Maple Street Dental',
    calls: {
      title: 'Call-backs for Tue, Nov 3',
      sub: 'From last night’s voicemails and web forms',
      rows: [
        ['Erin Holt', 'Chipped tooth, hoping for today', 'Voicemail, 6:12 pm', 'Urgent'],
        ['James Ochoa', 'New patient, asks about insurance', 'Web form, 8:40 pm', 'New patient'],
        ['Ruth Pham', 'Needs to move her cleaning', 'Voicemail, 9:05 pm', 'Move'],
        ['Alan Carver', 'Question about his last bill', 'Voicemail, 7:58 am', 'Billing'],
      ],
    },
    report: {
      title: 'Friday report, Oct 26–30',
      kpis: [['Visits kept', '112'], ['No-shows', '6'], ['New patients', '9'], ['Recalls booked', '31']],
      chart: 'Visits per day',
      bars: [['Mon', 24], ['Tue', 22], ['Wed', 25], ['Thu', 21], ['Fri', 20]],
      finding: '4 of the 6 no-shows were Monday mornings.',
    },
    invoices: {
      title: 'Insurance claims ready to submit',
      action: 'Approve and submit 4',
      rows: [
        ['Holt, E.', 'Exam and X-rays', 214],
        ['Ng, K.', 'Crown, first visit', 1120],
        ['Ford, L.', 'Cleaning', 135],
        ['Abbott, M.', 'Filling, two surfaces', 246],
      ],
    },
    text: {
      to: 'Marcus Lee',
      out: 'Hi Marcus, this is Maple Street Dental. You’re booked for a cleaning tomorrow, Tue Nov 3 at 2:30 pm. Reply 1 to confirm or 2 to reschedule.',
      reply: '1',
      back: 'Great, see you tomorrow. Please come 10 minutes early.',
    },
  },
  books: {
    label: 'Bookkeeping',
    business: 'Harper & Cole Bookkeeping',
    calls: {
      title: 'Call-backs for Tue, Nov 3',
      sub: 'From last night’s emails, voicemails and web forms',
      rows: [
        ['Sam Whitley', 'Missing two receipts for October', 'Email, 5:48 pm', 'Documents'],
        ['Grace Lin', 'When will the quarter report be ready?', 'Voicemail, 8:10 pm', 'Question'],
        ['Owen Patel', 'New client, payroll for six people', 'Web form, 9:32 pm', 'New client'],
        ['Nora Dale', 'Bank feed stopped syncing', 'Voicemail, 7:05 am', 'Urgent'],
      ],
    },
    report: {
      title: 'Friday report, Oct 26–30',
      kpis: [['Clients reconciled', '14 of 18'], ['Transactions sorted', '1,240'], ['Receipts matched', '386'], ['Receipts missing', '22']],
      chart: 'Transactions sorted per day',
      bars: [['Mon', 280], ['Tue', 260], ['Wed', 250], ['Thu', 230], ['Fri', 220]],
      finding: '18 of the 22 missing receipts belong to three clients.',
    },
    invoices: {
      title: 'Monthly invoices to approve',
      action: 'Approve and send 4',
      rows: [
        ['Whitley Roofing', 'October books', 450],
        ['Lin Design', 'October books', 325],
        ['Dale Florals', 'Books and payroll', 610],
        ['Patel & Sons', 'Setup and payroll', 875],
      ],
    },
    text: {
      to: 'Grace Lin',
      out: 'Hi Grace, it’s Harper & Cole. We still need three October receipts from the card ending 2041. Snap a photo and reply here.',
      reply: 'Sent 3 photos',
      back: 'Got them, thanks. That’s everything for October.',
    },
  },
  lawn: {
    label: 'Landscaping',
    business: 'Greenline Lawn & Landscape',
    calls: {
      title: 'Call-backs for Tue, Nov 3',
      sub: 'From last night’s voicemails, texts and web forms',
      rows: [
        ['Hal Brewer', 'Tree limb down on the fence', 'Voicemail, 5:30 pm', 'Urgent'],
        ['Mia Torres', 'Quote for a fall cleanup', 'Web form, 7:45 pm', 'Quote'],
        ['Dev Shah', 'Weekly mowing from next spring', 'Voicemail, 8:20 pm', 'Book'],
        ['Kay Morton', 'Her gate code has changed', 'Text, 6:40 am', 'Note'],
      ],
    },
    report: {
      title: 'Friday report, Oct 26–30',
      kpis: [['Yards done', '64'], ['Crew hours', '182'], ['Rain days', '1'], ['Leaf pickups booked', '17']],
      chart: 'Yards per day',
      bars: [['Mon', 15], ['Tue', 14], ['Wed', 0], ['Thu', 18], ['Fri', 17]],
      finding: 'Wednesday’s rain pushed its yards to Thursday and Friday.',
    },
    invoices: {
      title: 'Invoices ready to send',
      action: 'Approve and send 4',
      rows: [
        ['Torres, M.', 'Fall cleanup', 640],
        ['Brewer, H.', 'Hedge trimming', 180],
        ['Okafor, P.', 'Monthly mowing', 260],
        ['Lindqvist, A.', 'Mulch, 6 yards', 495],
      ],
    },
    text: {
      to: 'Dev Shah',
      out: 'Hi Dev, Greenline here. The crew is at your place tomorrow, Tue Nov 3, around 9 am for leaf pickup. Please leave the side gate unlocked. Reply 1 to confirm.',
      reply: '1',
      back: 'Thanks! We’ll text a photo when we’re done.',
    },
  },
  salon: {
    label: 'Hair salon',
    business: 'Studio Nine Salon',
    calls: {
      title: 'Call-backs for Tue, Nov 3',
      sub: 'From last night’s messages, voicemails and web forms',
      rows: [
        ['Jade Moreno', 'Colour before a Saturday wedding', 'Message, 7:15 pm', 'Book'],
        ['Lucy Hart', 'Running 15 minutes late tomorrow', 'Voicemail, 8:02 pm', 'Note'],
        ['Rosa Kim', 'Asks about gift cards', 'Web form, 9:41 pm', 'Question'],
        ['Ava Dunn', 'Cancel Thursday at 3 pm', 'Text, 7:12 am', 'Move'],
      ],
    },
    report: {
      title: 'Friday report, Oct 26–30',
      kpis: [['Appointments', '96'], ['No-shows', '3'], ['Rebooked at the chair', '58'], ['Product sales', '$1,284']],
      chart: 'Appointments per day (closed Mondays)',
      bars: [['Mon', 0], ['Tue', 18], ['Wed', 20], ['Thu', 22], ['Fri', 36]],
      finding: 'Friday was fully booked by Wednesday noon.',
    },
    invoices: {
      title: 'Stylist payouts to approve',
      action: 'Approve 4 payouts',
      rows: [
        ['Kara', '31 appointments', 1860],
        ['Leo', '24 appointments', 1440],
        ['Simone', '22 appointments', 1320],
        ['Jo', '19 appointments', 1140],
      ],
    },
    text: {
      to: 'Lucy Hart',
      out: 'Hi Lucy, Studio Nine here. See you tomorrow, Tue Nov 3 at 11:00 am with Kara. Reply 1 to confirm or 2 to change.',
      reply: '1',
      back: 'Confirmed. Kara knows you may be a few minutes late.',
    },
  },
  law: {
    label: 'Law office',
    business: 'Bell & Avery Law',
    calls: {
      title: 'Call-backs for Tue, Nov 3',
      sub: 'From last night’s voicemails, emails and web forms',
      rows: [
        ['Martin Cole', 'Question about his will draft', 'Voicemail, 5:55 pm', 'Question'],
        ['Tanya Ruiz', 'New matter, a landlord dispute', 'Web form, 8:30 pm', 'New client'],
        ['Phil Grant', 'Needs a signed copy of the deed', 'Email, 9:12 pm', 'Documents'],
        ['June Akers', 'Court date moved, wants to talk', 'Voicemail, 7:25 am', 'Urgent'],
      ],
    },
    report: {
      title: 'Friday report, Oct 26–30',
      kpis: [['New inquiries', '11'], ['Consults booked', '6'], ['Billable hours', '86.5'], ['Not yet billed', '9.0 h']],
      chart: 'Billable hours per day',
      bars: [['Mon', 18.5], ['Tue', 17], ['Wed', 19], ['Thu', 16.5], ['Fri', 15.5]],
      finding: '9 hours from last week still aren’t on an invoice.',
    },
    invoices: {
      title: 'Invoices ready to send',
      action: 'Approve and send 4',
      rows: [
        ['Cole, M.', 'Estate plan, flat fee', 1250],
        ['Grant, P.', 'Deed transfer', 450],
        ['Akers, J.', 'Hearing prep, 3.5 hours', 875],
        ['Ruiz, T.', 'First consult', 150],
      ],
    },
    text: {
      to: 'June Akers',
      out: 'Hi June, this is Bell & Avery Law. Your call with Sarah is tomorrow, Tue Nov 3 at 4:00 pm. Reply 1 to confirm or 2 to move it.',
      reply: '1',
      back: 'Confirmed. Sarah will call the number ending 4410.',
    },
  },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const tagKind = (t) => (t === 'Urgent' ? ' is-urgent' : '');

function renderCalls(d) {
  const c = d.calls;
  const urgent = c.rows.filter((r) => r[3] === 'Urgent').length;
  return `<div class="ui-head"><span class="ui-ex">Example</span><span class="ui-biz">${esc(d.business)}</span></div>
<p class="ui-title">${esc(c.title)}</p>
<p class="ui-sub">${esc(c.sub)}. ${c.rows.length} to call, ${urgent} urgent.</p>
<ul class="ui-calls">${c.rows.map((r) => `
  <li><span class="ui-who">${esc(r[0])}</span><span class="ui-what">${esc(r[1])}</span><span class="ui-when">${esc(r[2])}</span><span class="ui-tag${tagKind(r[3])}">${esc(r[3])}</span></li>`).join('')}
</ul>`;
}

function renderReport(d) {
  const r = d.report;
  const max = Math.max(...r.bars.map((b) => b[1]));
  return `<div class="ui-head"><span class="ui-ex">Example</span><span class="ui-biz">${esc(d.business)}</span></div>
<p class="ui-title">${esc(r.title)}</p>
<dl class="ui-kpis">${r.kpis.map((k) => `<div><dt>${esc(k[0])}</dt><dd>${esc(k[1])}</dd></div>`).join('')}</dl>
<p class="ui-chart-title">${esc(r.chart)}</p>
<div class="ui-bars" role="img" aria-label="${esc(r.chart)}: ${r.bars.map((b) => `${b[0]} ${b[1]}`).join(', ')}">${r.bars.map((b) => `
  <div class="ui-bar"><span class="ui-bar-v">${b[1]}</span><span class="ui-bar-f" style="--h:${max ? (b[1] / max).toFixed(3) : 0}"></span><span class="ui-bar-d">${b[0]}</span></div>`).join('')}
</div>
<p class="ui-finding">${esc(r.finding)}</p>`;
}

function renderInvoices(d) {
  const v = d.invoices;
  const total = v.rows.reduce((s, r) => s + r[2], 0);
  return `<div class="ui-head"><span class="ui-ex">Example</span><span class="ui-biz">${esc(d.business)}</span></div>
<p class="ui-title">${esc(v.title)}</p>
<table class="ui-table">
  <thead><tr><th scope="col">For</th><th scope="col">Work</th><th scope="col" class="num">Amount</th></tr></thead>
  <tbody>${v.rows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="num">${money(r[2])}</td></tr>`).join('')}</tbody>
  <tfoot><tr><td colspan="2">Total</td><td class="num">${money(total)}</td></tr></tfoot>
</table>
<div class="ui-approve"><span class="ui-btn">${esc(v.action)}</span><span class="ui-note">Checked against last week’s jobs</span></div>`;
}

function renderText(d) {
  const t = d.text;
  return `<div class="ui-head"><span class="ui-ex">Example</span><span class="ui-biz">Reminder text</span></div>
<p class="ui-to">To ${esc(t.to)}, sent Mon 6:00 pm</p>
<div class="ui-thread">
  <p class="ui-msg is-out">${esc(t.out)}</p>
  <p class="ui-msg is-in">${esc(t.reply)}</p>
  <p class="ui-msg is-out">${esc(t.back)}</p>
</div>`;
}

const RENDER = { calls: renderCalls, report: renderReport, invoices: renderInvoices, text: renderText };

if (typeof module !== 'undefined') module.exports = { EXAMPLES, RENDER };

if (typeof document !== 'undefined') {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- the live board: pick a kind of business ---- */
  (() => {
    const picker = document.querySelector('[data-picker]');
    if (!picker) return;
    const slots = [...document.querySelectorAll('[data-slot]')];
    const status = document.querySelector('[data-picker-status]');
    let current = 'plumbing';
    const show = (key, announce) => {
      if (!EXAMPLES[key] || key === current) return;
      current = key;
      const d = EXAMPLES[key];
      const swapOne = (slot) => { slot.innerHTML = RENDER[slot.dataset.slot](d); };
      if (!reduce.matches && typeof window.LETSdeal === 'function') window.LETSdeal(slots, swapOne);
      else slots.forEach(swapOne);
      if (status && announce) status.textContent = `Showing examples for ${d.label.toLowerCase()}.`;
    };
    picker.addEventListener('change', (e) => { if (e.target.name === 'trade') show(e.target.value, true); });
    document.querySelectorAll('[data-trade-link]').forEach((a) => a.addEventListener('click', () => {
      const key = a.dataset.tradeLink;
      const input = picker.querySelector(`input[value="${key}"]`);
      if (input) { input.checked = true; show(key, true); }
    }));
  })();

  /* ---- how it works: one stage open at a time ---- */
  (() => {
    const root = document.querySelector('[data-stages]');
    if (!root) return;
    const stages = [...root.querySelectorAll('.stage')];
    const open = (stage) => stages.forEach((s) => {
      const on = s === stage;
      s.classList.toggle('is-open', on);
      s.querySelector('.stage__tab').setAttribute('aria-expanded', String(on));
    });
    stages.forEach((s) => s.querySelector('.stage__tab').addEventListener('click', () => open(s)));
    root.classList.add('is-live');
    open(stages[0]);
    window.LETSstage = (i) => { if (stages[i] && !stages[i].classList.contains('is-open')) open(stages[i]); };
  })();

  /* ---- phone menu ---- */
  (() => {
    const btn = document.querySelector('[data-menu-button]');
    const sheet = document.getElementById('menu');
    if (!btn || !sheet) return;
    const set = (on) => {
      btn.setAttribute('aria-expanded', String(on));
      sheet.classList.toggle('is-open', on);
      btn.textContent = on ? 'Close' : 'Menu';
      if (on) sheet.querySelector('a')?.focus();
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    sheet.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet.classList.contains('is-open')) { set(false); btn.focus(); } });
  })();

  /* ---- clips and the marquee run only while in view ---- */
  (() => {
    const clips = [...document.querySelectorAll('video[data-loop]')];
    const settle = () => {
      clips.forEach((v) => { if (reduce.matches) { v.pause(); v.removeAttribute('autoplay'); } });
    };
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target;
        if (el.tagName === 'VIDEO') {
          if (reduce.matches) continue;
          if (e.isIntersecting) el.play().catch(() => {}); else el.pause();
        }
      }
    }, { threshold: 0.15 });
    clips.forEach((v) => io.observe(v));
    settle();
    reduce.addEventListener('change', settle);
  })();

  /* ---- the form: a prototype, it does not send ---- */
  (() => {
    const form = document.querySelector('[data-contact]');
    if (!form) return;
    const out = form.querySelector('[data-form-status]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      out.textContent = 'Thanks. This prototype doesn’t send messages yet, so nothing has left your browser.';
    });
  })();
}
