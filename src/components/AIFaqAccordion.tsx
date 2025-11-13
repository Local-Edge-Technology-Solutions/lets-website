import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How much can AI improve business efficiency?',
    answer: 'Studies show businesses implementing AI solutions see 40-60% productivity gains on average. Tasks that previously took hours can be completed in minutes, freeing your team to focus on strategic work. Our clients typically report significant time savings within the first month of implementation.',
  },
  {
    question: "What's the ROI timeline for AI adoption?",
    answer: 'Most small businesses see positive ROI within 6-12 months. Initial costs are offset by reduced labor costs, fewer errors, and faster processes. Our à la carte approach means you can start small with high-impact projects and scale as you see results, minimizing upfront investment.',
  },
  {
    question: 'Do small businesses really need AI?',
    answer: 'Absolutely. AI levels the playing field, giving small businesses access to capabilities once reserved for large enterprises. With AI, you can provide 24/7 customer service, make data-driven decisions, and automate repetitive tasks—all without hiring additional staff. The businesses competing with you are likely already using AI.',
  },
  {
    question: 'What AI solutions work best for small businesses?',
    answer: 'The most impactful solutions focus on automation (chatbots, email responses), analytics (sales forecasting, customer insights), and process optimization (inventory management, scheduling). We assess your unique needs and recommend solutions with the highest ROI potential for your specific industry and size.',
  },
  {
    question: 'Is AI implementation risky for my business?',
    answer: "Not when done right. We start with low-risk pilot projects that deliver quick wins. Over 85% of businesses report successful AI implementation when working with experienced partners. Our 100% satisfaction guarantee and no long-term contracts mean you're never locked into something that doesn't work.",
  },
  {
    question: 'How long does implementation take?',
    answer: 'Timeline varies by project complexity, but most small business AI solutions can be deployed in 4-8 weeks. We prioritize quick wins—simple automations can be live in days. Our phased approach means you start seeing benefits before the full solution is complete.',
  },
];

export default function AIFaqAccordion() {
  return (
    <section id="faq" className="py-20">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            AI for <span className="text-gradient">Your Business</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Real data about AI adoption and what it means for small businesses
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-card px-6 border-l-4 border-l-primary hover-elevate"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger className="text-left font-bold hover:no-underline" data-testid={`faq-question-${index}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed" data-testid={`faq-answer-${index}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
