import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

// TODO: Remove mock functionality - Replace with real case studies
const caseStudies = [
  {
    quote: "We automated 70% of customer inquiries with their AI chatbot. Response time dropped from 4 hours to instant, and our support team now focuses on complex issues that actually need a human touch.",
    author: 'Sarah Martinez',
    company: 'Martinez Retail',
    role: 'Owner',
    results: {
      metric: '$47,000',
      label: 'Annual Savings',
      detail: 'ROI achieved in 4 months',
    },
  },
  {
    quote: 'Their predictive analytics transformed our inventory management. We cut overstock by 45% and stockouts by 62%. The system paid for itself in the first quarter.',
    author: 'David Chen',
    company: 'Chen Logistics',
    role: 'Operations Director',
    results: {
      metric: '45%',
      label: 'Inventory Reduction',
      detail: 'Eliminated $80K in waste',
    },
  },
  {
    quote: "The automation they built saves us 20 hours per week on data entry alone. We reinvested that time into client relationships and grew revenue 35% without adding headcount.",
    author: 'Jessica Williams',
    company: 'Williams Consulting',
    role: 'Founder',
    results: {
      metric: '20hrs/week',
      label: 'Time Recovered',
      detail: 'Equivalent to half an FTE',
    },
  },
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % caseStudies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % caseStudies.length);
  };

  return (
    <section className="py-20 bg-card/20">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Real Results, <span className="text-gradient">Real Businesses</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Measurable impact for companies just like yours
          </p>
        </div>

        <div className="relative">
          <div className="glass-card p-8 md:p-12 relative overflow-hidden" data-testid="testimonial-card">
            <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/20" />

            <div className="relative z-10">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-2">
                  <p className="text-lg md:text-xl mb-6 leading-relaxed italic" data-testid="testimonial-quote">
                    "{caseStudies[currentIndex].quote}"
                  </p>

                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14 ring-2 ring-primary/30">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {caseStudies[currentIndex].author
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold" data-testid="testimonial-author">{caseStudies[currentIndex].author}</div>
                      <div className="text-sm text-muted-foreground" data-testid="testimonial-company">
                        {caseStudies[currentIndex].role}, {caseStudies[currentIndex].company}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Card */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 flex flex-col justify-center items-center text-center">
                  <div className="text-4xl font-black text-primary mb-2" data-testid="testimonial-metric">
                    {caseStudies[currentIndex].results.metric}
                  </div>
                  <div className="text-sm font-semibold text-foreground mb-1" data-testid="testimonial-label">
                    {caseStudies[currentIndex].results.label}
                  </div>
                  <div className="text-xs text-muted-foreground" data-testid="testimonial-detail">
                    {caseStudies[currentIndex].results.detail}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="rounded-full"
              data-testid="button-prev-testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex gap-2">
              {caseStudies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                  }`}
                  data-testid={`dot-testimonial-${index}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="rounded-full"
              data-testid="button-next-testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
