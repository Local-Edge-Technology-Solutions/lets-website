// "Show it for": re-deals the six example slips for one kind of business. Every slip is a made-up example;
// names, towns and amounts are invented. Without script the mixed set in the HTML stays.
import { calm, $ } from "./env.js";
import { redeal } from "./motion.js";

// [title, rows, foot, kind]. rows: [label, value] pairs, or a string for a message.
const T = {
  shop: [
    ["New enquiries answered", [["Mina", "blue dress, size M"], ["Theo", "gift wrapping"], ["Ana", "open Sunday?"]], "Three replies drafted"],
    ["Quotes to follow up", [["Team gifts, 12", "$180"], ["Party favors", "$96"]], "Two follow-ups drafted"],
    ["Back in stock", [["Linen tote", "3 waiting"], ["Blue scarf", "2 waiting"]], "Five messages ready to check"],
    ["Review requests", [["Orders picked up", "5"], ["Thank-you notes", "5"]], "Ready for your OK"],
    ["Orders to pack", [["Online", "4"], ["Pickup", "2"]], "Six orders on one list"],
    ["The week, on one page", [["Orders", "18"], ["Sales", "$720"], ["Repeat customers", "4"]], "Lands in your inbox Friday at 4"],
  ],
  salon: [
    ["New client enquiries", [["Cut and color", "2"], ["Massage", "1"]], "Three replies drafted"],
    ["Openings to offer", [["Thursday", "2:00 p.m."], ["Waitlist", "3 people"]], "Invitation drafted"],
    ["Time to book again", [["Amy L.", "cut, 7 weeks"], ["Rosa P.", "massage, 5 weeks"], ["Kim T.", "color, 9 weeks"]], "Three rebooking texts drafted"],
    ["Text to a client", "“Hi Amy! You’re with Marisol on Thursday at 2:30 for color and a cut. Reply C to confirm or R to reschedule.”", "Sent 9:00. Confirmed 9:41"],
    ["Forms still needed", [["Jess M.", "first-visit form"], ["Amy L.", "contact details"]], "Two reminders drafted"],
    ["The week, on one page", [["Bookings", "24"], ["Return visits", "9"], ["New clients", "3"]], "Lands in your inbox Friday at 4"],
  ],
  agency: [
    ["New enquiries answered", [["Website project", "call times sent"], ["Brochure", "details asked for"], ["Referral from Jo", "call booked"]], "Answered within the hour"],
    ["Quotes to follow up", [["Flyer design", "$240"], ["Email template", "$180"], ["Logo refresh", "$650"]], "Three follow-ups drafted"],
    ["Calls to arrange", [["New enquiries", "2"], ["Referrals", "1"]], "Times offered from your calendar"],
    ["Client files missing", [["Logo files", "1"], ["Product photos", "2"]], "Three reminders drafted"],
    ["Invoices to review", [["Flyer design", "$240"], ["Email template", "$180"]], "$420.00", "approve"],
    ["The week, on one page", [["New enquiries", "6"], ["Quotes sent", "4"], ["Projects booked", "2"]], "Lands in your inbox Friday at 4"],
  ],
  bookkeeping: [
    ["Invoices to review", [["Oak St. Bakery", "$220.00"], ["Elm Studio", "$180.00"], ["Rivera Dental", "$640.00"]], "$1,040.00", "approve"],
    ["New client enquiries", [["Monthly books", "2"], ["Payroll help", "1"]], "Three replies drafted"],
    ["Proposals to follow up", [["Oak St. Bakery", "sent Monday"], ["Elm Studio", "sent Tuesday"]], "Two follow-ups drafted"],
    ["New client checklist", [["Bank statements", "received"], ["Software access", "waiting"]], "Reminder drafted for the client"],
    ["Receipts matched this week", [["Matched to the bank", "42 of 45"], ["Need a look", "3"]], "Three flagged for you"],
    ["The week, on one page", [["New enquiries", "3"], ["Calls booked", "2"], ["New clients", "1"]], "Lands in your inbox Friday at 4"],
  ],
  bakery: [
    ["Catering enquiries", [["Office lunch", "12 people"], ["Birthday", "18 people"]], "Two replies drafted"],
    ["Quotes to follow up", [["Lunch trays", "$180"], ["Birthday cake", "$75"]], "Two follow-ups drafted"],
    ["Repeat orders due", [["Office breakfast", "Friday"], ["Café delivery", "Monday"]], "Two order reminders drafted"],
    ["Orders to confirm", [["Cupcakes", "3 dozen"], ["Sandwich trays", "2"], ["Pecan pies", "4"]], "Three confirmations drafted"],
    ["Tomorrow’s prep", [["Lunch boxes", "12"], ["Cupcakes", "36"], ["Biscuits", "120"]], "Built from confirmed orders"],
    ["The week, on one page", [["Orders", "64"], ["Repeat orders", "21"], ["Catering enquiries", "5"]], "Lands in your inbox Friday at 4"],
  ],
};
T.any = [T.agency[0], T.agency[1], T.shop[3], T.salon[2], T.bakery[3], T.shop[5]];
const NAMES = { any: "any business", shop: "a shop or boutique", salon: "a salon, spa or studio", agency: "an agency or office", bookkeeping: "bookkeeping", bakery: "a restaurant, bakery or café" };
const HEIGHTS = [40, 34, 44, 30, 38, 28];

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const slipHTML = ([title, rows, foot, kind]) => {
  const body = typeof rows === "string"
    ? `<p class="slip__msg">${esc(rows)}</p>`
    : `<dl>${rows.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl>`;
  const end = kind === "approve" ? `<span class="ui-btn">Approve all ${rows.length}</span> ${esc(foot)}` : esc(foot);
  return `<p class="slip__top"><b>${esc(title)}</b><span>Made-up example</span></p><p class="slip__rule" aria-hidden="true">- - - - - - - - - - - - - - - -</p>${body}<p class="slip__foot">${end}</p>`;
};

export function initExamples() {
  const list = $("[data-slips]");
  const picker = $("[data-picker]");
  const status = $("[data-picker-status]");
  if (!list || !picker) return;
  const slips = [...list.children];
  let current = "any";
  const fill = (trade) => {
    T[trade].forEach((s, i) => { slips[i].innerHTML = slipHTML(s); slips[i].style.setProperty("--h", HEIGHTS[i]); });
    status.textContent = `Showing examples for ${NAMES[trade]}.`;
  };
  picker.addEventListener("change", (e) => {
    const trade = e.target.value;
    if (!T[trade] || trade === current) return;
    current = trade;
    if (calm()) fill(trade);
    else redeal(slips, () => fill(trade));
    list.scrollTo?.({ left: 0 });
  });
  picker.hidden = false;
}
