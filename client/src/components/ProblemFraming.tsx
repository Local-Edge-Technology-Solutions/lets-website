import { Card } from '@/components/ui/card';
import { TrendingDown, Clock, DollarSign, Users } from 'lucide-react';

const problems = [
  {
    icon: TrendingDown,
    stat: '73%',
    problem: 'of small businesses are falling behind competitors who adopted AI first',
  },
  {
    icon: Clock,
    stat: '40hrs/week',
    problem: 'wasted on repetitive tasks that AI could handle automatically',
  },
  {
    icon: DollarSign,
    stat: '$150K+',
    problem: 'average cost of enterprise AI consultants - pricing out small businesses',
  },
  {
    icon: Users,
    stat: '2.5x',
    problem: 'faster growth for businesses using AI vs those relying on manual processes',
  },
];

export default function ProblemFraming() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-card/30">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Your Competitors Are <span className="text-gradient">Already Using AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            While you're stuck in manual processes, AI-powered businesses are scaling faster, cutting costs, and delivering better customer experiences. The gap is widening every day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, index) => (
            <Card
              key={index}
              className="glass-card p-6 hover-elevate active-elevate-2 bg-destructive/5 border-destructive/20"
              data-testid={`problem-card-${index}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-destructive" />
                </div>
                <div className="text-4xl font-black text-destructive mb-2">{item.stat}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.problem}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-semibold text-foreground">
            But here's the good news: You don't need a six-figure budget or a technical team to catch up.
          </p>
        </div>
      </div>
    </section>
  );
}
