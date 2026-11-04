// Sample requests and results for the opening "handoff". Illustrative only: no real clients.
export type Handoff = {
  id: string;
  tab: string;
  ask: string;
  resultTitle: string;
  rows: { label: string; value: string }[];
};

export const handoffs: Handoff[] = [
  {
    id: 'report',
    tab: 'Weekly report',
    ask: "Every Friday I turn everyone's notes into a report.",
    resultTitle: 'Friday report, written for you',
    rows: [
      { label: 'Finished', value: 'Kitchen install at 14 Elm Street' },
      { label: 'Next', value: 'Final inspection, Tuesday at 9' },
      { label: 'Needs you', value: 'Tile delivery is two days late' },
    ],
  },
  {
    id: 'enquiries',
    tab: 'Lost inquiries',
    ask: 'Inquiries get lost between my inbox and my phone.',
    resultTitle: 'One call-back list, every morning',
    rows: [
      { label: 'Dana R.', value: 'Wants a quote for a deck. Call back today.' },
      { label: 'Marcus T.', value: 'Asked about Saturday times. Reply sent, waiting.' },
      { label: 'Hill Bakery', value: 'Question about an invoice. Passed to Sam.' },
    ],
  },
  {
    id: 'answers',
    tab: 'Same questions',
    ask: 'My team keeps asking me the same questions.',
    resultTitle: 'Answers they can look up themselves',
    rows: [
      { label: 'Question', value: 'Can a customer move their deposit to a new date?' },
      { label: 'Answer', value: 'Yes, once, if they ask at least 7 days before.' },
      { label: 'Where from', value: 'Your staff handbook, page 4' },
    ],
  },
];
