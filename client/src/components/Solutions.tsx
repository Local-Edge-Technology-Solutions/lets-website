import { Card } from '@/components/ui/card';
import { Bot, Workflow, LineChart, ArrowRight } from 'lucide-react';

const solutions = [
  {
    icon: Bot,
    title: 'AI Automation',
    description: 'We set up tools that handle repetitive tasks, like answering common questions or moving information between the apps you already use.',
  },
  {
    icon: Workflow,
    title: 'Process Improvement',
    description: 'We look at how a task gets done today and work out which steps a computer can take over.',
  },
  {
    icon: LineChart,
    title: 'Reporting',
    description: 'We turn the information you already have into simple reports that help you plan.',
  },
];

export default function Solutions() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="solutions" className="py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Custom <span className="text-gradient">AI Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            À la carte services tailored to your unique business needs. No rigid packages, just solutions that work for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <Card
              key={index}
              className="glass-card p-8 hover-elevate transition-all duration-300 hover:-translate-y-1 glow-primary group cursor-pointer"
              onClick={scrollToContact}
              data-testid={`card-solution-${index}`}
            >
              <div className="mb-6">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <solution.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{solution.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{solution.description}</p>
              </div>
              <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
