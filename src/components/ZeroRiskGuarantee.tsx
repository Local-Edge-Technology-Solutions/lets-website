import { Card } from '@/components/ui/card';
import { Shield, CheckCircle2, Award, Users } from 'lucide-react';

const guarantees = [
  {
    icon: Shield,
    title: 'No Long-Term Contracts',
    description: 'Month-to-month engagement. Leave anytime if you\'re not satisfied.',
  },
  {
    icon: Award,
    title: 'Results-Driven or Money Back',
    description: 'We only succeed when you do. If we don\'t deliver measurable results, we\'ll make it right.',
  },
  {
    icon: Users,
    title: 'Free Consultation',
    description: 'Not sure where to start? We\'ll assess your needs and recommend the best path forward—no cost, no obligation.',
  },
];

export default function ZeroRiskGuarantee() {
  return (
    <section className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            100% <span className="text-gradient">Satisfaction Guaranteed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your success is our success. We stand behind our work with a zero-risk guarantee.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {guarantees.map((item, index) => (
            <Card
              key={index}
              className="glass-card p-8 text-center hover-elevate transition-all duration-300 hover:-translate-y-1"
              data-testid={`guarantee-card-${index}`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
